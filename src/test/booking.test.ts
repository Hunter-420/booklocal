import { describe, it, expect, beforeEach } from 'vitest';
import { generateAvailableSlots, canCancelBooking, generateICalendarString } from '../lib/slots';
import { BookLocalStore } from '../lib/store';
import { Service, OpeningHour, BlockedDate, Booking } from '../lib/types';

describe('BookLocal Business Logic & Acceptance Tests', () => {
  const sampleService: Service = {
    id: 'test-cut',
    name: 'Precision Cut',
    description: 'Scissor cut',
    durationMinutes: 60,
    priceCents: 8500,
    active: true,
    sortOrder: 1,
  };

  const sampleLongService: Service = {
    id: 'test-colour',
    name: 'Full Bleach & Tone',
    description: 'Long treatment',
    durationMinutes: 120, // 2 hours
    priceCents: 22000,
    active: true,
    sortOrder: 2,
  };

  const openingHours: OpeningHour[] = [
    { weekday: 1, weekdayName: 'Monday', openTime: '09:00', closeTime: '17:00', isClosed: false },
    { weekday: 2, weekdayName: 'Tuesday', openTime: '09:00', closeTime: '17:00', isClosed: false },
    { weekday: 0, weekdayName: 'Sunday', openTime: '09:00', closeTime: '17:00', isClosed: true },
  ];

  const blockedDates: BlockedDate[] = [
    { id: 'blk-xmas', date: '2026-12-25', reason: 'Christmas Day' },
  ];

  beforeEach(() => {
    BookLocalStore.resetToDefaults();
  });

  it('acceptance test: blocked date shows no slots and indicates day blocked', () => {
    const res = generateAvailableSlots('2026-12-25', sampleService, openingHours, blockedDates, []);
    expect(res.isDayBlocked).toBe(true);
    expect(res.slots.length).toBe(0);
    expect(res.blockedReason).toBe('Christmas Day');
  });

  it('acceptance test: service is never offered at a start time that runs past closing', () => {
    // On Monday closing is 17:00.
    // For a 120 min (2 hr) service, latest start time must be 15:00.
    // 15:30 + 2h = 17:30 (exceeds close), so 15:30 must NOT be generated.
    const res = generateAvailableSlots('2026-11-16', sampleLongService, openingHours, blockedDates, []);
    expect(res.slots.length).toBeGreaterThan(0);
    const lastSlot = res.slots[res.slots.length - 1];
    expect(lastSlot.timeStr).toBe('15:00');
  });

  it('acceptance test: double booking prevention marks slot unavailable', () => {
    const existingBookings: Booking[] = [
      {
        id: 'bkg-existing',
        userId: 'u1',
        customerName: 'Existing Client',
        customerEmail: 'exist@example.com',
        customerPhone: '021 111 222',
        serviceId: 'test-cut',
        serviceName: 'Precision Cut',
        durationMinutes: 60,
        priceCents: 8500,
        startsAt: '2026-11-16T10:00:00+12:00',
        endsAt: '2026-11-16T11:00:00+12:00',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      },
    ];

    const res = generateAvailableSlots('2026-11-16', sampleService, openingHours, blockedDates, existingBookings);
    const slot1000 = res.slots.find((s) => s.timeStr === '10:00');
    expect(slot1000?.available).toBe(false);

    // Also overlapping slot at 10:30 should be unavailable because 60 min service runs until 11:30
    const slot1030 = res.slots.find((s) => s.timeStr === '10:30');
    expect(slot1030?.available).toBe(false);

    // Slot at 11:00 should be available
    const slot1100 = res.slots.find((s) => s.timeStr === '11:00');
    expect(slot1100?.available).toBe(true);
  });

  it('acceptance test: store rejects double booking collision when saving', () => {
    const startIso = '2026-11-16T14:00:00+12:00';
    const srv = BookLocalStore.getServices()[0];

    // First booking succeeds
    const first = BookLocalStore.createBooking({
      serviceId: srv.id,
      startsAt: startIso,
      customerName: 'Client One',
      customerEmail: 'c1@example.com',
      customerPhone: '021 111 111',
    });
    expect(first.success).toBe(true);

    // Second booking for identical slot must fail
    const second = BookLocalStore.createBooking({
      serviceId: srv.id,
      startsAt: startIso,
      customerName: 'Client Two',
      customerEmail: 'c2@example.com',
      customerPhone: '021 222 222',
    });
    expect(second.success).toBe(false);
    expect(second.error).toContain('taken');
  });

  it('acceptance test: 24-hour cancellation rule refuses cancellation less than 24 hours away', () => {
    // Appointment in 2 hours
    const nearDate = new Date(Date.now() + 2 * 3600 * 1000).toISOString();
    const checkNear = canCancelBooking(nearDate);
    expect(checkNear.allowed).toBe(false);
    expect(checkNear.reason).toContain('24 hours');

    // Appointment in 48 hours
    const farDate = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
    const checkFar = canCancelBooking(farDate);
    expect(checkFar.allowed).toBe(true);
  });

  it('acceptance test: generates valid .ics iCalendar file format', () => {
    const booking: Booking = {
      id: 'bkg-ical-test',
      userId: 'u1',
      customerName: 'Samantha Reed',
      customerEmail: 'sam@example.com',
      customerPhone: '021 555 789',
      serviceId: 'srv-cut-style',
      serviceName: 'Cut & Style',
      durationMinutes: 60,
      priceCents: 8500,
      startsAt: '2026-11-20T10:00:00Z',
      endsAt: '2026-11-20T11:00:00Z',
      status: 'confirmed',
      createdAt: '2026-11-12T10:00:00Z',
    };

    const ics = generateICalendarString(booking);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('SUMMARY:Willow & Stone Hair - Cut & Style');
    expect(ics).toContain('LOCATION:142 Ponsonby Road');
    expect(ics).toContain('END:VCALENDAR');
  });
});

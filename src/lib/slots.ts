import { OpeningHour, BlockedDate, Booking, Service } from './types';

export interface TimeSlot {
  timeStr: string; // e.g. "09:30"
  startsAt: string; // ISO 8601
  endsAt: string; // ISO 8601
  available: boolean;
  conflictReason?: string;
}

/**
 * Generates available 30-minute incremental booking slots for a selected date and service.
 * Enforces:
 * 1. Opening hours for that weekday
 * 2. Closed dates (blocked_dates)
 * 3. slotStart + service.duration <= closeTime (service must finish before closing)
 * 4. Exclusion constraint: no overlap with confirmed existing bookings
 */
export function generateAvailableSlots(
  dateStr: string, // "YYYY-MM-DD"
  service: Service,
  openingHours: OpeningHour[],
  blockedDates: BlockedDate[],
  existingBookings: Booking[]
): { slots: TimeSlot[]; isDayBlocked: boolean; blockedReason?: string; isDayClosed: boolean } {
  // Check if date is blocked
  const blocked = blockedDates.find((b) => b.date === dateStr);
  if (blocked) {
    return {
      slots: [],
      isDayBlocked: true,
      blockedReason: blocked.reason,
      isDayClosed: false,
    };
  }

  // Determine day of week
  const [year, month, day] = dateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const weekday = targetDate.getDay(); // 0 is Sunday, 1 is Monday...

  const daySchedule = openingHours.find((oh) => oh.weekday === weekday);
  if (!daySchedule || daySchedule.isClosed) {
    return {
      slots: [],
      isDayBlocked: false,
      isDayClosed: true,
    };
  }

  const [openHour, openMin] = daySchedule.openTime.split(':').map(Number);
  const [closeHour, closeMin] = daySchedule.closeTime.split(':').map(Number);

  const openMinutesTotal = openHour * 60 + openMin;
  const closeMinutesTotal = closeHour * 60 + closeMin;

  const confirmedBookingsForDay = existingBookings.filter((b) => {
    if (b.status !== 'confirmed') return false;
    const bDate = b.startsAt.slice(0, 10);
    return bDate === dateStr;
  });

  const slots: TimeSlot[] = [];

  // Step in 30 minute increments
  for (let m = openMinutesTotal; m < closeMinutesTotal; m += 30) {
    const slotEndMin = m + service.durationMinutes;

    // Must not exceed closing time
    if (slotEndMin > closeMinutesTotal) {
      continue;
    }

    const startH = Math.floor(m / 60);
    const startM = m % 60;
    const endH = Math.floor(slotEndMin / 60);
    const endM = slotEndMin % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    const timeStr = `${pad(startH)}:${pad(startM)}`;

    // Build ISO timestamps in local Pacific/Auckland reference
    const slotStartISO = `${dateStr}T${pad(startH)}:${pad(startM)}:00+12:00`;
    const slotEndISO = `${dateStr}T${pad(endH)}:${pad(endM)}:00+12:00`;

    const slotStartMs = new Date(slotStartISO).getTime();
    const slotEndMs = new Date(slotEndISO).getTime();

    // Check overlap with any confirmed booking: (StartA < EndB) and (EndA > StartB)
    const hasOverlap = confirmedBookingsForDay.some((b) => {
      const bStartMs = new Date(b.startsAt).getTime();
      const bEndMs = new Date(b.endsAt).getTime();
      return slotStartMs < bEndMs && slotEndMs > bStartMs;
    });

    slots.push({
      timeStr,
      startsAt: slotStartISO,
      endsAt: slotEndISO,
      available: !hasOverlap,
      conflictReason: hasOverlap ? 'Time slot is already reserved' : undefined,
    });
  }

  return {
    slots,
    isDayBlocked: false,
    isDayClosed: false,
  };
}

/**
 * Checks if a booking can be cancelled under the 24-hour cancellation rule.
 * Customers may only cancel up to 24 hours prior to startsAt.
 */
export function canCancelBooking(startsAtISO: string): { allowed: boolean; hoursRemaining: number; reason?: string } {
  const startTime = new Date(startsAtISO).getTime();
  const nowTime = Date.now();
  const diffHours = (startTime - nowTime) / (1000 * 60 * 60);

  if (diffHours < 24) {
    return {
      allowed: false,
      hoursRemaining: Math.max(0, Math.round(diffHours * 10) / 10),
      reason: 'Bookings cannot be cancelled within 24 hours of appointment start time.',
    };
  }

  return {
    allowed: true,
    hoursRemaining: Math.round(diffHours * 10) / 10,
  };
}

/**
 * Generates an .ics iCalendar file content string for direct appointment download
 */
export function generateICalendarString(booking: Booking): string {
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startUtc = formatDate(booking.startsAt);
  const endUtc = formatDate(booking.endsAt);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Willow and Stone//BookLocal Appointment//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:booking-${booking.id}@willowandstone.co.nz`,
    `DTSTAMP:${formatDate(new Date().toISOString())}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:Willow & Stone Hair - ${booking.serviceName}`,
    `DESCRIPTION:Hair appointment for ${booking.customerName} (${booking.serviceName}). Please arrive 5 minutes early at 142 Ponsonby Road, Auckland.`,
    'LOCATION:142 Ponsonby Road, Ponsonby, Auckland 1011, New Zealand',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

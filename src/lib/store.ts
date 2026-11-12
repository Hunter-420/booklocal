import { Service, OpeningHour, BlockedDate, Booking, Profile } from './types';
import { generateAvailableSlots, canCancelBooking } from './slots';

const STORAGE_KEYS = {
  SERVICES: 'bl_services_v1',
  HOURS: 'bl_hours_v1',
  BLOCKED: 'bl_blocked_v1',
  BOOKINGS: 'bl_bookings_v1',
  CURRENT_USER: 'bl_current_user_v1',
};

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'srv-cut-style',
    name: 'Cut & Style',
    description: 'Precision scissor haircut, wash with organic botanical wash, scalp massage and signature blowdry style.',
    durationMinutes: 60,
    priceCents: 8500,
    active: true,
    sortOrder: 1,
  },
  {
    id: 'srv-colour-gloss',
    name: 'Colour & Gloss Treatment',
    description: 'Full root-to-end low-tox ammonia-free colour tint, high-shine acidic glaze, bond builder and finished blowout.',
    durationMinutes: 150,
    priceCents: 21000,
    active: true,
    sortOrder: 2,
  },
  {
    id: 'srv-beard-barber',
    name: 'Beard & Barber Grooming',
    description: 'Traditional hot towel straight razor edge work, precision beard shaping, treatment oils and styling tonic.',
    durationMinutes: 30,
    priceCents: 4500,
    active: true,
    sortOrder: 3,
  },
  {
    id: 'srv-blow-wave',
    name: 'Botanical Moisture Mask & Blowout',
    description: 'Deep revitalising rosemary and argan steam infusion, pressure point massage and volume blowout.',
    durationMinutes: 45,
    priceCents: 7500,
    active: true,
    sortOrder: 4,
  },
  {
    id: 'srv-foil-highlights',
    name: 'Full Foil Highlights & Custom Toner',
    description: 'Micro-weave blonde highlights, bespoke root melt, cool toner finish and thermal heat styling.',
    durationMinutes: 180,
    priceCents: 26000,
    active: true,
    sortOrder: 5,
  },
];

const DEFAULT_HOURS: OpeningHour[] = [
  { weekday: 0, weekdayName: 'Sunday', openTime: '09:00', closeTime: '17:00', isClosed: true },
  { weekday: 1, weekdayName: 'Monday', openTime: '09:00', closeTime: '17:00', isClosed: false },
  { weekday: 2, weekdayName: 'Tuesday', openTime: '09:00', closeTime: '17:00', isClosed: false },
  { weekday: 3, weekdayName: 'Wednesday', openTime: '09:00', closeTime: '17:00', isClosed: false },
  { weekday: 4, weekdayName: 'Thursday', openTime: '09:00', closeTime: '17:00', isClosed: false },
  { weekday: 5, weekdayName: 'Friday', openTime: '09:00', closeTime: '17:00', isClosed: false },
  { weekday: 6, weekdayName: 'Saturday', openTime: '09:00', closeTime: '15:00', isClosed: false },
];

const DEFAULT_BLOCKED_DATES: BlockedDate[] = [
  { id: 'blk-1', date: '2026-12-25', reason: 'Christmas Day' },
  { id: 'blk-2', date: '2026-12-26', reason: 'Boxing Day' },
  { id: 'blk-3', date: '2026-01-01', reason: 'New Year\'s Day' },
  { id: 'blk-4', date: '2026-04-25', reason: 'Anzac Day' },
];

// Helper to construct dynamic near dates for seed bookings
const getNearDateStr = (daysOffset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'bkg-101',
    userId: 'user-cust-1',
    customerName: 'Samantha Reed',
    customerEmail: 'sam.reed@example.com',
    customerPhone: '021 555 7890',
    serviceId: 'srv-cut-style',
    serviceName: 'Cut & Style',
    durationMinutes: 60,
    priceCents: 8500,
    startsAt: `${getNearDateStr(1)}T10:30:00+12:00`,
    endsAt: `${getNearDateStr(1)}T11:30:00+12:00`,
    status: 'confirmed',
    notes: 'Prefers quiet appointment.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bkg-102',
    userId: 'user-cust-1',
    customerName: 'Samantha Reed',
    customerEmail: 'sam.reed@example.com',
    customerPhone: '021 555 7890',
    serviceId: 'srv-colour-gloss',
    serviceName: 'Colour & Gloss Treatment',
    durationMinutes: 150,
    priceCents: 21000,
    startsAt: `${getNearDateStr(4)}T09:00:00+12:00`,
    endsAt: `${getNearDateStr(4)}T11:30:00+12:00`,
    status: 'confirmed',
    notes: 'Warm honey tone refresher.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bkg-103',
    userId: 'user-cust-2',
    customerName: 'Liam Henderson',
    customerEmail: 'liam.h@example.com',
    customerPhone: '027 444 3210',
    serviceId: 'srv-beard-barber',
    serviceName: 'Beard & Barber Grooming',
    durationMinutes: 30,
    priceCents: 4500,
    startsAt: `${getNearDateStr(0)}T14:00:00+12:00`,
    endsAt: `${getNearDateStr(0)}T14:30:00+12:00`,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bkg-104',
    userId: 'user-cust-1',
    customerName: 'Samantha Reed',
    customerEmail: 'sam.reed@example.com',
    customerPhone: '021 555 7890',
    serviceId: 'srv-blow-wave',
    serviceName: 'Botanical Moisture Mask & Blowout',
    durationMinutes: 45,
    priceCents: 7500,
    startsAt: `${getNearDateStr(-10)}T11:00:00+12:00`,
    endsAt: `${getNearDateStr(-10)}T11:45:00+12:00`,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

export const DEMO_USERS: Record<string, Profile> = {
  customer: {
    id: 'user-cust-1',
    fullName: 'Samantha Reed',
    email: 'sam.reed@example.com',
    phone: '021 555 7890',
    role: 'customer',
  },
  owner: {
    id: 'user-owner-1',
    fullName: 'Maya Ellison',
    email: 'owner@willowandstone.co.nz',
    phone: '09 376 4920',
    role: 'owner',
  },
};

export class BookLocalStore {
  private static memoryStore: Record<string, string> = {};

  private static load<T>(key: string, fallback: T): T {
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
        const data = window.localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
      }
      const mem = this.memoryStore[key];
      return mem ? JSON.parse(mem) : fallback;
    } catch {
      return fallback;
    }
  }

  private static save<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      this.memoryStore[key] = serialized;
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
        window.localStorage.setItem(key, serialized);
      }
    } catch (e) {
      // In-memory fallback is already set
    }
  }

  static getServices(): Service[] {
    return this.load(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
  }

  static saveServices(services: Service[]): void {
    this.save(STORAGE_KEYS.SERVICES, services);
  }

  static getOpeningHours(): OpeningHour[] {
    return this.load(STORAGE_KEYS.HOURS, DEFAULT_HOURS);
  }

  static saveOpeningHours(hours: OpeningHour[]): void {
    this.save(STORAGE_KEYS.HOURS, hours);
  }

  static getBlockedDates(): BlockedDate[] {
    return this.load(STORAGE_KEYS.BLOCKED, DEFAULT_BLOCKED_DATES);
  }

  static saveBlockedDates(dates: BlockedDate[]): void {
    this.save(STORAGE_KEYS.BLOCKED, dates);
  }

  static getBookings(): Booking[] {
    return this.load(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
  }

  static saveBookings(bookings: Booking[]): void {
    this.save(STORAGE_KEYS.BOOKINGS, bookings);
  }

  static getCurrentUser(): Profile {
    return this.load(STORAGE_KEYS.CURRENT_USER, DEMO_USERS.customer);
  }

  static setCurrentUser(user: Profile): void {
    this.save(STORAGE_KEYS.CURRENT_USER, user);
  }

  /**
   * Attempts to book a slot. Enforces the database exclusion constraint:
   * Two customers cannot hold the same slot.
   */
  static createBooking(params: {
    serviceId: string;
    startsAt: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes?: string;
  }): { success: boolean; booking?: Booking; error?: string } {
    const services = this.getServices();
    const service = services.find((s) => s.id === params.serviceId);
    if (!service) {
      return { success: false, error: 'Selected service does not exist.' };
    }

    const bookings = this.getBookings();
    const slotStartMs = new Date(params.startsAt).getTime();
    const slotEndMs = slotStartMs + service.durationMinutes * 60 * 1000;
    const endsAt = new Date(slotEndMs).toISOString();

    // Check for double booking collision with any confirmed booking
    const hasCollision = bookings.some((b) => {
      if (b.status !== 'confirmed') return false;
      const bStartMs = new Date(b.startsAt).getTime();
      const bEndMs = new Date(b.endsAt).getTime();
      return slotStartMs < bEndMs && slotEndMs > bStartMs;
    });

    if (hasCollision) {
      return {
        success: false,
        error: 'That time slot was just taken by another client. Please select an alternate slot.',
      };
    }

    const currentUser = this.getCurrentUser();
    const newBooking: Booking = {
      id: `bkg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      userId: currentUser.id,
      customerName: params.customerName || currentUser.fullName,
      customerEmail: params.customerEmail || currentUser.email,
      customerPhone: params.customerPhone || currentUser.phone,
      serviceId: service.id,
      serviceName: service.name,
      durationMinutes: service.durationMinutes,
      priceCents: service.priceCents,
      startsAt: params.startsAt,
      endsAt,
      status: 'confirmed',
      notes: params.notes,
      createdAt: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    this.saveBookings(bookings);
    return { success: true, booking: newBooking };
  }

  /**
   * Cancels a booking with role checks and 24-hour rule enforcement.
   * Owners can cancel any time. Customers must be > 24 hours away.
   */
  static cancelBooking(bookingId: string): { success: boolean; error?: string } {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) {
      return { success: false, error: 'Booking not found.' };
    }

    const booking = bookings[index];
    const currentUser = this.getCurrentUser();

    // If customer, check ownership and 24h rule
    if (currentUser.role === 'customer') {
      if (booking.userId !== currentUser.id) {
        return { success: false, error: 'You do not have permission to cancel this booking.' };
      }
      const check = canCancelBooking(booking.startsAt);
      if (!check.allowed) {
        return { success: false, error: check.reason };
      }
    }

    bookings[index] = { ...booking, status: 'cancelled' };
    this.saveBookings(bookings);
    return { success: true };
  }

  static resetToDefaults(): void {
    this.save(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
    this.save(STORAGE_KEYS.HOURS, DEFAULT_HOURS);
    this.save(STORAGE_KEYS.BLOCKED, DEFAULT_BLOCKED_DATES);
    this.save(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
    this.save(STORAGE_KEYS.CURRENT_USER, DEMO_USERS.customer);
  }
}

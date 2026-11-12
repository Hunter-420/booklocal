export type UserRole = 'customer' | 'owner';

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
  active: boolean;
  sortOrder: number;
}

export interface OpeningHour {
  weekday: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  weekdayName: string;
  openTime: string; // "09:00"
  closeTime: string; // "17:00"
  isClosed: boolean;
}

export interface BlockedDate {
  id: string;
  date: string; // "YYYY-MM-DD"
  reason: string;
}

export type BookingStatus = 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  priceCents: number;
  startsAt: string; // ISO 8601 string
  endsAt: string; // ISO 8601 string
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

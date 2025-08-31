import type { Venue } from './venue';
import type { Customer } from './profile';

type BookingVenue = Omit<Venue, 'bookings'>;

export type Booking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue: BookingVenue;
  customer: Customer;
};

// Payloads
export type BookingCreatePayload = {
  dateFrom: string; // ISO 8601
  dateTo: string; // ISO 8601
  guests: number;
  venueId: string; // target venue id
};

export type BookingUpdatePayload = Partial<BookingCreatePayload>;

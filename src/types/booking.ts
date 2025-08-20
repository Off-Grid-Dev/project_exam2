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

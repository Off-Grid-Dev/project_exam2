import type { Media } from './media';
import type { Venue } from './venue';
import type { Booking } from './booking';

export type Customer = Pick<
  Profile,
  'name' | 'email' | 'bio' | 'avatar' | 'banner'
>;

export type Profile = {
  name: string;
  email: string;
  bio: string;
  avatar: Media;
  banner: Media;
  venueManager: boolean;
  venues: Venue[];
  bookings: Booking[];
  _count: {
    venues: number;
    bookings: number;
  };
};

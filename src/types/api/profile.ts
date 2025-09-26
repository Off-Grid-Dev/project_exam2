// Types: imports from sibling type definitions
import type { Media } from './media';
import type { Venue } from './venue';
import type { Booking } from './booking';

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

export type RegisterProfilePayload = {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager: boolean;
};

export type LoginProfilePayload = {
  email: string;
  password: string;
};

export type ProfilePayload = Pick<
  Profile,
  'bio' | 'avatar' | 'banner' | 'venueManager'
>;

export type Customer = Pick<
  Profile,
  'name' | 'email' | 'bio' | 'avatar' | 'banner'
>;

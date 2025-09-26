// Types: imports from sibling type definitions
import type { Profile } from './profile';
import type { Media } from './media';
import type { Booking } from './booking';

type VenueMeta = {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
};

type VenueLocation = {
  address: string;
  city: string;
  zip: string;
  country: string;
  continent: string;
  lat: number;
  lng: number;
};

type VenueOwner = Pick<Profile, 'name' | 'email' | 'bio' | 'avatar' | 'banner'>;

export type Venue = {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: VenueMeta;
  location: VenueLocation;
  owner: VenueOwner;
  bookings: Booking[];
  _count: {
    bookings: number;
  };
};

export type VenuePayload = Pick<
  Venue,
  | 'name'
  | 'description'
  | 'media'
  | 'price'
  | 'maxGuests'
  | 'rating'
  | 'meta'
  | 'location'
>;

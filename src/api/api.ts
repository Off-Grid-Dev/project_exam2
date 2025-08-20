// const API_BASE = import.meta.env.VITE_API_BASE;
// const API_PROFILES = `${API_BASE}/profiles/`;
// const API_VENUES = `${API_BASE}/venues/`;
// const API_BOOKINGS = `${API_BASE}/bookings/`;

export type ApiError = {
  errors: { message: string }[];
  status: string;
  statusCode: number;
};

type Media = {
  url: string;
  alt: string;
};

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

type Venue = {
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

type Customer = Pick<Profile, 'name' | 'email' | 'bio' | 'avatar' | 'banner'>;

type BookingVenue = Omit<Venue, 'bookings'>;

type Booking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue: BookingVenue;
  customer: Customer;
};

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

export type ProfileResponse = {
  data: Profile[];
  meta: Record<string, unknown>;
};

export type VenuesResponse = {
  data: Venue[];
  meta: Record<string, unknown>;
};

export type BookingsResponse = {
  data: Booking[];
  meta: Record<string, unknown>;
};

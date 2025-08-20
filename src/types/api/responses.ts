import type { Profile } from './profile';

import type { Venue } from './venue';

import type { Booking } from './booking';

export type ApiError = {
  errors: { message: string }[];
  status: string;
  statusCode: number;
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

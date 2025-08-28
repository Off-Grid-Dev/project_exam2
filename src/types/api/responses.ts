import type { Profile } from './profile';
import type { Venue } from './venue';
import type { Booking } from './booking';
import type { Media } from './media';

export type ApiError = {
  errors: { message: string }[];
  status: string;
  statusCode: number;
};

export type ApiResponseWrapper<T> = {
  data: T;
  meta?: unknown;
};

export type RegisterProfileResponse = {
  data: {
    name: string;
    email: string;
    bio: string;
    avatar: Media;
    banner: Media;
    venueManager: boolean;
  };
  meta: Record<string, unknown>;
};

export type LoginProfileResponse = {
  data: {
    name: string;
    email: string;
    avatar: Media;
    banner: Media;
    accessToken: string;
    venueManager: boolean;
  };
  meta: Record<string, unknown>;
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

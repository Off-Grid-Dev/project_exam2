import { getVenues } from './venues/getVenues';
import { getVenueByID } from './venues/getVenueByID';
import { getVenueBySearch } from './venues/getVenueBySearch';
import { updateVenue } from './venues/updateVenue';
import type { VenuePayload } from '../types/api/venue';
import { createVenue } from './venues/createVenue';
import { deleteVenue } from './venues/deleteVenue';
import { registerUser } from './profiles/registerUser';
import type { ProfilePayload } from '../types/api/profile';
const API_BASE = import.meta.env.VITE_API_BASE;
export const API_VENUES = `${API_BASE}venues`;
export const API_PROFILES = `${API_BASE}profiles`;
// const API_BOOKINGS = `${API_BASE}bookings`;

type FetchParams = {
  options?: RequestInit;
  sort?: string;
  sortOrder?: string;
  limit?: number;
  page?: number;
  _owner?: boolean;
  _bookings?: boolean;
  name?: string;
  id?: string;
  q?: string;
  venuePayload?: VenuePayload;
  profilePayload?: ProfilePayload;
  token?: string;
};

const getData = (fn: string, params?: FetchParams) => {
  console.log(`Function called: ${fn}`);
  switch (fn) {
    // Venues
    case 'get venues': {
      const { sort, sortOrder, limit, page } = params || {};
      return getVenues(sort, sortOrder, limit, page).then((res) =>
        console.log(res),
      );
    }
    case 'venue by id': {
      const { id } = params || {};
      return getVenueByID(id).then((res) => console.log(res));
    }
    case 'venue by search': {
      const { q, sort, sortOrder, limit, page } = params || {};
      return getVenueBySearch(q, sort, sortOrder, limit, page).then((res) =>
        console.log(res),
      );
    }
    case 'create venue': {
      const { venuePayload, token, _owner, _bookings } = params || {};
      return createVenue(venuePayload, token, _owner, _bookings);
    }
    case 'update venue': {
      const { id, venuePayload, token, _owner, _bookings } = params || {};
      return updateVenue(id, venuePayload, token, _owner, _bookings);
    }
    case 'delete venue': {
      const { id, token } = params || {};
      return deleteVenue(id, token);
    }
    // Profiles
    case 'register user': {
      const { name, profilePayload } = params || {};
      return registerUser(name, profilePayload);
    }
  }
};

export { getData };

import { getVenues } from './venues/getVenues';
import { getVenueByID } from './venues/getVenueByID';
import { getVenueBySearch } from './venues/getVenueBySearch';
import { updateVenue } from './venues/updateVenue';
import type { VenuePayload } from '../types/api/venue';
import { createVenue } from './venues/createVenue';
import { deleteVenue } from './venues/deleteVenue';
import { registerUser } from './profiles/registerUser';
import type {
  LoginProfilePayload,
  ProfilePayload,
  RegisterProfilePayload,
} from '../types/api/profile';
import { loginUser } from './profiles/LoginUser';
import type { LoginProfileResponse } from '../types/api/responses';
const API_BASE = import.meta.env.VITE_API_BASE;
const API_HOLIDAZE = import.meta.env.VITE_API_HOLIDAZE;
export const API_VENUES = `${API_HOLIDAZE}venues`;
export const API_REGISTER = `${API_BASE}auth/register`;
export const API_LOGIN = `${API_BASE}auth/login`;
export const API_PROFILES = `${API_HOLIDAZE}profiles`;
// const API_BOOKINGS = `${API_HOLIDAZE}bookings`;

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
  registerProfilePayload?: RegisterProfilePayload;
  loginProfilePayload?: LoginProfilePayload;
  token?: string;
};

function storeToken(response: LoginProfileResponse) {
  console.log('setting accessToken to localStorage');
  localStorage.setItem('accessToken', response.data.accessToken);
}

function clearToken() {
  console.log('removing accessToken from localStaorage');
  localStorage.removeItem('accessToken');
}

const getData = (fn: string, params?: FetchParams) => {
  console.log(`Function called: ${fn}`);
  switch (fn) {
    // Venues
    case 'get venues': {
      const { sort, sortOrder, limit, page } = params || {};
      return getVenues(sort, sortOrder, limit, page);
    }
    case 'venue by id': {
      const { id } = params || {};
      return getVenueByID(id);
    }
    case 'venue by search': {
      const { q, sort, sortOrder, limit, page } = params || {};
      return getVenueBySearch(q, sort, sortOrder, limit, page);
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
      const { registerProfilePayload } = params || {};
      return registerUser(registerProfilePayload);
    }
    case 'login user': {
      const { loginProfilePayload } = params || {};
      return loginUser(loginProfilePayload).then((res) => storeToken(res));
    }
    case 'logout user': {
      return clearToken();
    }
  }
};

export { getData };

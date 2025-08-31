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

export enum ApiFunctions {
  GetVenues = 'get venues',
  GetVenuesById = 'venue by id',
  GetVenuesBySearch = 'venue by search',
  CreateVenue = 'create venue',
  UpdateVenue = 'update venue',
  DeleteVenue = 'delete venue',
  RegisterUser = 'register user',
  LoginUser = 'login user',
  LogoutUser = 'logout user',
}

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
    case ApiFunctions.GetVenues: {
      const { sort, sortOrder, limit, page } = params || {};
      return getVenues(sort, sortOrder, limit, page);
    }
    case ApiFunctions.GetVenuesById: {
      const { id } = params || {};
      return getVenueByID(id);
    }
    case ApiFunctions.GetVenuesBySearch: {
      const { q, sort, sortOrder, limit, page } = params || {};
      return getVenueBySearch(q, sort, sortOrder, limit, page);
    }
    case ApiFunctions.CreateVenue: {
      const { venuePayload, token, _owner, _bookings } = params || {};
      return createVenue(venuePayload, token, _owner, _bookings);
    }
    case ApiFunctions.UpdateVenue: {
      const { id, venuePayload, token, _owner, _bookings } = params || {};
      return updateVenue(id, venuePayload, token, _owner, _bookings);
    }
    case ApiFunctions.DeleteVenue: {
      const { id, token } = params || {};
      return deleteVenue(id, token);
    }
    // Profiles
    case ApiFunctions.RegisterUser: {
      const { registerProfilePayload } = params || {};
      return registerUser(registerProfilePayload);
    }
    case ApiFunctions.LoginUser: {
      const { loginProfilePayload } = params || {};
      return loginUser(loginProfilePayload).then((res) => storeToken(res));
    }
    case ApiFunctions.LogoutUser: {
      return clearToken();
    }
  }
};

export { getData };

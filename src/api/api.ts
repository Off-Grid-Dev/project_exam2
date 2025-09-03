import type {
  BookingCreatePayload,
  BookingUpdatePayload,
} from '../types/api/booking';
import type { VenuePayload } from '../types/api/venue';
import type {
  LoginProfilePayload,
  ProfilePayload,
  RegisterProfilePayload,
} from '../types/api/profile';
import type { LoginProfileResponse } from '../types/api/responses';
import {
  getVenues,
  getVenueByID,
  getVenueBySearch,
  updateVenue,
  createVenue,
  deleteVenue,
} from './venues';
import {
  registerUser,
  loginUser,
  getAllProfiles,
  getProfileByName,
  updateProfile,
} from './profiles';
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingByID,
  getBookingsByProfile,
  updateBooking,
} from './bookings';
import { ApiFunctions } from '../types/api/apiFunctionsEnum';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_HOLIDAZE = import.meta.env.VITE_API_HOLIDAZE;
export const API_VENUES = `${API_HOLIDAZE}venues`;
export const API_REGISTER = `${API_BASE}auth/register`;
export const API_LOGIN = `${API_BASE}auth/login`;
export const API_PROFILES = `${API_HOLIDAZE}profiles`;
export const API_BOOKINGS = `${API_HOLIDAZE}bookings`;
// TO DO implement github action injection of this key
export const API_KEY = import.meta.env.VITE_API_KEY;

type FetchParams = {
  options?: RequestInit;
  sort?: string;
  sortOrder?: string;
  limit?: number;
  page?: number;
  _owner?: boolean;
  _bookings?: boolean;
  _customer?: boolean;
  _venue?: boolean;
  name?: string;
  id?: string;
  q?: string;
  venuePayload?: VenuePayload;
  profilePayload?: ProfilePayload;
  bookingCreatePayload?: BookingCreatePayload;
  bookingUpdatePayload?: BookingUpdatePayload;
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

const isTokenValid = (token: any): boolean => {
  return typeof token === 'string' && token.trim() !== '';
};

async function storeAndReturn(payload: LoginProfilePayload) {
  const res = await loginUser(payload);
  storeToken(res);
  return res;
}

const getData = async (fn: string, params?: FetchParams) => {
  console.log(`Function called: ${fn}`);
  try {
    switch (fn) {
      // Venues
      case ApiFunctions.GetVenues: {
        const { sort, sortOrder, limit, page, _owner, _bookings } =
          params || {};
        return getVenues(sort, sortOrder, limit, page, _owner, _bookings);
      }
      case ApiFunctions.GetVenueById: {
        const { id, _owner, _bookings } = params || {};
        if (typeof id !== 'string') {
          throw new Error('Id must be a string value');
        }
        return getVenueByID(id, _owner, _bookings);
      }
      case ApiFunctions.GetVenueBySearch: {
        const { q, sort, sortOrder, limit, page, _owner, _bookings } =
          params || {};
        if (!q || q === '') {
          return getVenues(sort, sortOrder, limit, page, _owner, _bookings);
        }
        if (typeof q !== 'string') {
          throw new Error('You must enter a valid search query');
        }
        return getVenueBySearch(q, sort, sortOrder, limit, page);
      }
      case ApiFunctions.CreateVenue: {
        const { venuePayload, token } = params || {};
        if (!venuePayload) {
          throw new Error('No payload submitted');
        }
        if (!token || isTokenValid(token)) {
          throw new Error('Creating a new venue requires authorization token');
        }
        return createVenue(venuePayload, token);
      }
      case ApiFunctions.UpdateVenue: {
        const { id, venuePayload, token } = params || {};
        if (!id || typeof id !== 'string') {
          throw new Error('Modifiying a venue requires a valid {id}');
        }
        if (!venuePayload) {
          throw new Error('There is no modification payload');
        }
        if (!token || isTokenValid(token)) {
          throw new Error('Modification requires authorization token');
        }
        return updateVenue(id, venuePayload, token);
      }
      case ApiFunctions.DeleteVenue: {
        const { id, token } = params || {};
        if (!id || typeof id !== 'string') {
          throw new Error('Deleting a venue requires a valid {id}');
        }
        if (!token || isTokenValid(token)) {
          throw new Error('Modification requires authorization token');
        }
        return deleteVenue(id, token);
      }
      // Profiles
      case ApiFunctions.RegisterUser: {
        const { registerProfilePayload } = params || {};
        if (
          !registerProfilePayload ||
          typeof registerProfilePayload !== 'object'
        ) {
          throw new Error(
            'Submitted payload information is incorrect or missing.',
          );
        }
        return registerUser(registerProfilePayload);
      }
      case ApiFunctions.LoginUser: {
        const { loginProfilePayload } = params || {};
        if (!loginProfilePayload || typeof loginProfilePayload !== 'object') {
          throw new Error(
            'Submitted payload information is incorrect or missing.',
          );
        }

        return storeAndReturn(loginProfilePayload);
      }
      case ApiFunctions.LogoutUser: {
        return clearToken();
      }
      case ApiFunctions.GetAllProfiles: {
        const { token } = params || {};
        if (!token || isTokenValid(token)) {
          throw new Error('Request is missing token!');
        }
        return getAllProfiles(token);
      }
      case ApiFunctions.GetProfileByName: {
        const { token, name } = params || {};
        if (!token || isTokenValid(token)) {
          throw new Error('Request is missing token!');
        }
        if (!name || name.trim() === '') {
          throw new Error('Name is required');
        }
        return getProfileByName(token, name);
      }
      case ApiFunctions.UpdateProfile: {
        const { token, name, profilePayload } = params || {};
        if (!token || isTokenValid(token)) {
          throw new Error('Request is missing token!');
        }
        if (!name) {
          throw new Error('Cannot update user without name');
        }
        if (!profilePayload) {
          throw new Error('Must update at least one property');
        }
        return updateProfile(token, name, profilePayload);
      }
      // Bookings
      case ApiFunctions.GetAllBookings: {
        const { sort, sortOrder, limit, page, _customer, _venue, token } =
          params || {};
        if (!token || isTokenValid(token)) {
          throw new Error('Fetching bookings requires authorization token');
        }
        return getAllBookings(
          sort,
          sortOrder,
          limit,
          page,
          _customer,
          _venue,
          token,
        );
      }
      case ApiFunctions.GetBookingById: {
        const { id, _customer, _venue, token } = params || {};
        if (!id || typeof id !== 'string') {
          throw new Error('Retrieving a booking requires a valid {id}');
        }
        if (!token || isTokenValid(token)) {
          throw new Error('Fetching a booking requires authorization token');
        }
        return getBookingByID(id, _customer, _venue, token);
      }
      case ApiFunctions.GetBookingsByProfile: {
        const { name, sort, sortOrder, limit, page, _customer, _venue, token } =
          params || {};
        if (!name || typeof name !== 'string') {
          throw new Error(
            'Retrieving bookings by profile requires a valid {name}',
          );
        }
        if (!token || isTokenValid(token)) {
          throw new Error(
            'Fetching bookings by profile requires authorization token',
          );
        }
        return getBookingsByProfile(
          name,
          sort,
          sortOrder,
          limit,
          page,
          _customer,
          _venue,
          token,
        );
      }
      case ApiFunctions.CreateBooking: {
        const { bookingCreatePayload, token } = params || {};
        if (!bookingCreatePayload) {
          throw new Error('No booking payload submitted');
        }
        if (!token || isTokenValid(token)) {
          throw new Error('Creating a booking requires authorization token');
        }
        return createBooking(bookingCreatePayload, token);
      }
      case ApiFunctions.UpdateBooking: {
        const { id, bookingUpdatePayload, token } = params || {};
        if (!id || typeof id !== 'string') {
          throw new Error('Updating a booking requires a valid {id}');
        }
        if (!bookingUpdatePayload) {
          throw new Error('There is no booking modification payload');
        }
        if (!token || isTokenValid(token)) {
          throw new Error('Updating a booking requires authorization token');
        }
        return updateBooking(id, bookingUpdatePayload, token);
      }
      case ApiFunctions.DeleteBooking: {
        const { id, token } = params || {};
        if (!id || typeof id !== 'string') {
          throw new Error('Deleting a booking requires a valid {id}');
        }
        if (!token || isTokenValid(token)) {
          throw new Error('Deleting a booking requires authorization token');
        }
        return deleteBooking(id, token);
      }
      default:
        throw new Error(`Unknown function: ${fn}`);
    }
  } catch (err) {
    console.error(`Error in ${fn}: `, err);
    throw err;
  }
};

export { getData };

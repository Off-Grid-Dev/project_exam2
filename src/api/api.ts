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
import { ApiFunctions } from './apiFunctionsEnum';

import { storeToken, clearToken, isTokenValid } from './authToken';

type VenueParams = {
  sort?: string;
  sortOrder?: string;
  limit?: number;
  page?: number;
  _owner?: boolean;
  _bookings?: boolean;
  id?: string;
  q?: string;
  venuePayload?: VenuePayload;
  token?: string;
};

type ProfileParams = {
  profilePayload?: ProfilePayload;
  registerProfilePayload?: RegisterProfilePayload;
  loginProfilePayload?: LoginProfilePayload;
  token?: string;
  name?: string;
  sort?: string;
  sortOrder?: string;
  limit?: number;
  page?: number;
  _bookings?: boolean;
  _venues?: boolean;
};

type BookingParams = {
  sort?: string;
  sortOrder?: string;
  limit?: number;
  page?: number;
  _customer?: boolean;
  _venue?: boolean;
  token?: string;
  id?: string;
  name?: string;
  bookingCreatePayload: BookingCreatePayload;
  bookingUpdatePayload: BookingUpdatePayload;
};

async function storeTokenAndReturnResponse(payload: LoginProfilePayload) {
  const res = await loginUser(payload);
  storeToken(res);
  return res;
}

const fetchVenues = async (fn: string, params?: VenueParams) => {
  try {
    switch (fn) {
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
        // getVenueBySearch signature: (q, sort?, sortOrder?, page = 1, limit = 20, _owner?, _bookings?)
        return getVenueBySearch(
          q,
          sort,
          sortOrder,
          page,
          limit,
          _owner,
          _bookings,
        );
      }
      case ApiFunctions.CreateVenue: {
        const { venuePayload, token } = params || {};
        if (!venuePayload) {
          throw new Error('No payload submitted');
        }
        if (!token || !isTokenValid(token)) {
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
        if (!token || !isTokenValid(token)) {
          throw new Error('Modification requires authorization token');
        }
        return updateVenue(id, venuePayload, token);
      }
      case ApiFunctions.DeleteVenue: {
        const { id, token } = params || {};
        if (!id || typeof id !== 'string') {
          throw new Error('Deleting a venue requires a valid {id}');
        }
        if (!token || !isTokenValid(token)) {
          throw new Error('Modification requires authorization token');
        }
        return deleteVenue(id, token);
      }
      default: {
        throw new Error(`Unknown function: ${fn}`);
      }
    }
  } catch (err) {
    console.error(`Error in ${fn}: `, err);
    throw err;
  }
};

const fetchProfiles = async (fn: string, params?: ProfileParams) => {
  try {
    switch (fn) {
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

        return storeTokenAndReturnResponse(loginProfilePayload);
      }
      case ApiFunctions.LogoutUser: {
        return clearToken();
      }
      case ApiFunctions.GetAllProfiles: {
        const { token, sort, sortOrder, limit, page, _bookings, _venues } =
          params || {};
        if (!token || !isTokenValid(token)) {
          throw new Error('Request is missing token!');
        }
        return getAllProfiles(
          token,
          sort,
          sortOrder,
          limit,
          page,
          _bookings,
          _venues,
        );
      }
      case ApiFunctions.GetProfileByName: {
        const { token, name } = params || {};
        if (!token || !isTokenValid(token)) {
          throw new Error('Request is missing token!');
        }
        if (!name || name.trim() === '') {
          throw new Error('Name is required');
        }
        return getProfileByName(token, name);
      }
      case ApiFunctions.UpdateProfile: {
        const { token, name, profilePayload } = params || {};
        if (!token || !isTokenValid(token)) {
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
    }
  } catch (err) {
    console.error(`Error in ${fn}: `, err);
    throw err;
  }
};

const fetchBookings = async (fn: string, params?: BookingParams) => {
  try {
    switch (fn) {
      case ApiFunctions.GetAllBookings: {
        const { sort, sortOrder, limit, page, _customer, _venue, token } =
          params || {};
        if (!token || !isTokenValid(token)) {
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
        if (!token || !isTokenValid(token)) {
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
        if (!token || !isTokenValid(token)) {
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
        if (!token || !isTokenValid(token)) {
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
        if (!token || !isTokenValid(token)) {
          throw new Error('Updating a booking requires authorization token');
        }
        return updateBooking(id, bookingUpdatePayload, token);
      }
      case ApiFunctions.DeleteBooking: {
        const { id, token } = params || {};
        if (!id || typeof id !== 'string') {
          throw new Error('Deleting a booking requires a valid {id}');
        }
        if (!token || !isTokenValid(token)) {
          throw new Error('Deleting a booking requires authorization token');
        }
        return deleteBooking(id, token);
      }
      default: {
        throw new Error(`Unknown function: ${fn}`);
      }
    }
  } catch (err) {
    console.error(`Error in ${fn}: `, err);
    throw err;
  }
};

export { fetchVenues, fetchProfiles, fetchBookings };

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
import { loginUser } from './profiles/loginUser';
import type { LoginProfileResponse } from '../types/api/responses';
const API_BASE = import.meta.env.VITE_API_BASE;
const API_HOLIDAZE = import.meta.env.VITE_API_HOLIDAZE;
export const API_VENUES = `${API_HOLIDAZE}venues`;
export const API_REGISTER = `${API_BASE}auth/register`;
export const API_LOGIN = `${API_BASE}auth/login`;
export const API_PROFILES = `${API_HOLIDAZE}profiles`;
// const API_BOOKINGS = `${API_HOLIDAZE}bookings`;
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
  /**
   * Fetches all venues.
   *
   * @endpoint GET /holidaze/venues
   * @description Returns a list of all venues. Supports sorting, pagination, and filtering by owner/bookings.
   * @param {string} [sort] - Field to sort by (e.g., 'created', 'name', 'price').
   * @param {string} [sortOrder] - Sorting order, either 'asc' or 'desc'.
   * @param {number} [limit=20] - Number of venues per page (default: 20).
   * @param {number} [page=1] - Page number to retrieve (default: 1).
   * @param {boolean} [_owner] - (Optional) If true, includes owner details in the response.
   * @param {boolean} [_bookings] - (Optional) If true, includes bookings for each venue in the response.
   * @returns {Promise<VenuesResponse>} A promise that resolves to a list of venues.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.GetVenues, { sort: 'name', sortOrder: 'asc', limit: 10, page: 2, _owner: true, _bookings: false });
   * @see https://docs.noroff.dev/docs/v2/holidaze/venues
   */
  GetVenues = 'get venues',
  /**
   * Fetches venue by id
   *
   * @endpoint GET /holidaze/venues/{id}
   * @description Retrieve a single venue based on its id.
   * @param {boolean} [_owner] - (Optional) If true, includes owner details in the response.
   * @param {boolean} [_bookings] - (Optional) If true, includes bookings for each venue in the response.
   * @returns {Promise<VenuesResponse>} A promise that resolves to a single venue.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.GetVenueById, { id: <id>, _owner: true, _bookings: false });
   * @see https://docs.noroff.dev/docs/v2/holidaze/venues
   */
  GetVenuesById = 'venue by id',
  /**
   * Fetches venues that match search query
   *
   * @endpoint GET /holidaze/venues/search?q={query}
   * @description Retrieve a list of venues by search query
   * @param {string} [q] - Search query
   * @param {string} [sort] - Field to sort by (e.g., 'created', 'name', 'price').
   * @param {string} [sortOrder] - Sorting order, either 'asc' or 'desc'.
   * @param {number} [limit=20] - Number of venues per page (default: 20).
   * @param {number} [page=1] - Page number to retrieve (default: 1).
   * @param {boolean} [_owner] - (Optional) If true, includes owner details in the response.
   * @param {boolean} [_bookings] - (Optional) If true, includes bookings for each venue in the response.
   * @returns {Promise<VenuesResponse>} A promise that resolves to a list of venues.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.GetVenueBySearch, { q: 'paris', sort: 'name', sortOrder: 'asc', limit: 10, page: 2, _owner: true, _bookings: false  });
   * @see https://docs.noroff.dev/docs/v2/holidaze/venues
   */
  GetVenuesBySearch = 'venue by search',
  /**
   * Creates a venue
   * @endpoint POST /holidaze/venues/
   * @description Creates a venue based on delivered payload
   * @param {Object} [payload] - Payload object that contains all information about the venue
   * @param {string} [payload.name] - Name of venue
   * @param {string} [payload.description] - Short description of venue
   * @param {string[]} [payload.media] - (Optional) An array that includes url and alt text of image
   * @param {string} [payload.media.url] - (Optional) Url of venue image
   * @param {string} [payload.media.alt] - (Optional) Alt text for venue image
   * @param {number} [payload.price] - Price of stay at venue
   * @param {number} [payload.maxGuests] - Maximum guests allowed at venue
   * @param {number} [payload.rating = 0] - (Optional) Rating of venue
   * @param {Object} [payload.meta] - (Optional) A collection of specific information about the venue
   * @param {boolean} [payload.meta.wifi = false] - (Optional) Does the location have wifi
   * @param {boolean} [payload.meta.parking = false] - (Optional) Does the location have parking
   * @param {boolean} [payload.meta.breakfast = false] - (Optional) Does the location serve breakfast
   * @param {boolean} [payload.meta.pets = false] - (Optional) Does the location allow pets
   * @param {Object} [payload.location] - (Optional) Information regarding the location of the venue
   * @param {string} [payload.location.address] - (Optional)
   * @param {string} [payload.location.city] - (Optional)
   * @param {string} [payload.location.zip] - (Optional)
   * @param {string} [payload.location.country] - (Optional)
   * @param {string} [payload.location.continent] - (Optional)
   * @param {number} [payload.location.lat] - (Optional)
   * @param {number} [payload.location.lng] - (Optional)
   * @param {string} [token] - Authorization token required for venue creation
   * @returns {Promise<VenuesResponse>} A promise that resolves to a list of venues.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.CreateVenue, { payload, token });
   * @see https://docs.noroff.dev/docs/v2/holidaze/venues
   */
  CreateVenue = 'create venue',
  /**
   * Updates a specific venue
   * @endpoint PUT /holidaze/venues/{id}
   * @description Updates or modifies a venue based on delivered payload
   * @param {string} [id] - Id of venue to be modified
   * @param {Object} [payload] - Payload object that contains all information about the venue
   * @param {string} [payload.name] - Name of venue
   * @param {string} [payload.description] - Short description of venue
   * @param {string[]} [payload.media] - (Optional) An array that includes url and alt text of image
   * @param {string} [payload.media.url] - (Optional) Url of venue image
   * @param {string} [payload.media.alt] - (Optional) Alt text for venue image
   * @param {number} [payload.price] - Price of stay at venue
   * @param {number} [payload.maxGuests] - Maximum guests allowed at venue
   * @param {number} [payload.rating = 0] - (Optional) Rating of venue
   * @param {Object} [payload.meta] - (Optional) A collection of specific information about the venue
   * @param {boolean} [payload.meta.wifi = false] - (Optional) Does the location have wifi
   * @param {boolean} [payload.meta.parking = false] - (Optional) Does the location have parking
   * @param {boolean} [payload.meta.breakfast = false] - (Optional) Does the location serve breakfast
   * @param {boolean} [payload.meta.pets = false] - (Optional) Does the location allow pets
   * @param {Object} [payload.location] - (Optional) Information regarding the location of the venue
   * @param {string} [payload.location.address] - (Optional)
   * @param {string} [payload.location.city] - (Optional)
   * @param {string} [payload.location.zip] - (Optional)
   * @param {string} [payload.location.country] - (Optional)
   * @param {string} [payload.location.continent] - (Optional)
   * @param {number} [payload.location.lat] - (Optional)
   * @param {number} [payload.location.lng] - (Optional)
   * @param {string} [token] - Authorization token required for venue modification
   * @returns {Promise<VenuesResponse>} A promise that resolves to a list of venues.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.UpdateVenue, { id, payload, token });
   * @see https://docs.noroff.dev/docs/v2/holidaze/venues
   */
  UpdateVenue = 'update venue',
  /**
   * Deletes a venue based on id
   *
   * @endpoint DELETE /holidaze/venues/{id}
   * @description Deletes a specific venue by id
   * @param {string} [id] - Id of venue to be modified
   * @param {string} [token] - Authorization token required for venue modification
   * @returns {Promise<VenuesResponse>} A promise that resolves to a list of venues.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.DeleteVenue, { id, token });
   * @see https://docs.noroff.dev/docs/v2/holidaze/venues
   */
  DeleteVenue = 'delete venue',
  /**
   * Registers a user
   *
   * @endpoint POST /auth/register
   * @description Creates a new user
   * @param {Object} [payload] - Object containing user information
   * @param {string} [payload.name] - Name of new user
   * @param {string} [payload.email] - New user's email address
   * @param {string} [payload.password] - New user's desired password
   * @param {string} [payload.bio] - (Optional) Descriptive biography of new user
   * @param {string[]} [payload.avatar] - (Optional) Array containing {url} and {alt} for user avatar
   * @param {string} [payload.avatar.url] - (Optional) {url} for user avatar
   * @param {string} [payload.avatar.alt] - (Optional) {alt} for user avatar
   * @param {string[]} [payload.banner] - (Optional) Array containing {url} and {alt} for user banner
   * @param {string} [payload.banner.url] - (Optional) {url} for user banner
   * @param {string} [payload.banner.alt] - (Optional) {alt} for user banner
   * @param {boolean} [venueManager = true] - (Optional) Boolean to denote if user can create new venues or modify/delete their own venues
   * @returns {Promise<LoginProfileResponse>} A promise that resolves to a list of venues.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.RegisterUser, { payload });
   * @see https://docs.noroff.dev/docs/v2/
   */
  RegisterUser = 'register user',
  /**
   * @description Login as existing user
   * @endpoint POST /auth/login
   * @param {Object} [payload] - Object containing login information
   * @param {String} [payload.email]
   * @param {String} [payload.pasword]
   * @returns {Promise<LoginProfileResponse>} A promise that resolves to a list of venues.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.LoginUser, { payload });
   * @see https://docs.noroff.dev/docs/v2/
   */
  LoginUser = 'login user',
  /**
   * @description Function that logs out user
   *
   */
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
  try {
    switch (fn) {
      // Venues
      case ApiFunctions.GetVenues: {
        const { sort, sortOrder, limit, page } = params || {};
        return getVenues(sort, sortOrder, limit, page);
      }
      case ApiFunctions.GetVenuesById: {
        const { id } = params || {};
        if (typeof id !== 'string') {
          throw new Error('Id must be a string value');
        }
        return getVenueByID(id);
      }
      case ApiFunctions.GetVenuesBySearch: {
        const { q, sort, sortOrder, limit, page } = params || {};
        if (!q || q === '') {
          return getVenues(sort, sortOrder, limit, page);
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
        if (!token || token !== '') {
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
        if (!token || typeof token !== 'string') {
          throw new Error('Modification requires authorization token');
        }
        return updateVenue(id, venuePayload, token);
      }
      case ApiFunctions.DeleteVenue: {
        const { id, token } = params || {};
        if (!id || typeof id !== 'string') {
          throw new Error('Deleting a venue requires a valid {id}');
        }
        if (!token || typeof token !== 'string') {
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
        return loginUser(loginProfilePayload).then((res) => storeToken(res));
      }
      case ApiFunctions.LogoutUser: {
        return clearToken();
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

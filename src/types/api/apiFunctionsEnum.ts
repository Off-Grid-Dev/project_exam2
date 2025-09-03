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
  GetVenueById = 'venue by id',
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
  GetVenueBySearch = 'venue by search',
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
   * getData(ApiFunctions.CreateVenue, { payload: {payload}, token: {token} });
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
   * getData(ApiFunctions.UpdateVenue, { id: {id}, payload: {payload}, token: {token} });
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
   * getData(ApiFunctions.DeleteVenue, { id: {id}, token: {token} });
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
   * getData(ApiFunctions.RegisterUser, { payload: {payload} });
   * @see https://docs.noroff.dev/docs/v2/
   */
  RegisterUser = 'register user',
  /**
   * @description Login as existing user
   * @endpoint POST /auth/login
   * @param {Object} [payload] - Object containing login information
   * @param {string} [payload.email]
   * @param {string} [payload.pasword]
   * @returns {Promise<LoginProfileResponse>} A promise that resolves to a list of venues.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.LoginUser, { payload: {payload} });
   * @see https://docs.noroff.dev/docs/v2/
   */
  LoginUser = 'login user',
  /**
   * @description Function that logs out user
   *
   */
  LogoutUser = 'logout user',
  /**
   * @description retrieve all profiles - requires API KEY
   * @endpoint GET /profiles
   * @param {string} [token] - Auth token required
   * @param {string} [sort] - Sort results based on any of the properties of the response
   * @param {string} [sortOrder] - Sort results in ascending or descending order
   * @param {string} [limit] - Limit number of users in response
   * @param {string} [page] - Pagination of the response
   * @param {boolean} [_bookings] - Return list of users' bookings
   * @param {boolean} [_venues] - Return list of users' venues
   * @returns {Promise<ProfileResponse>} A promise that resolves to a list of venues.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.GetAllProfiles, { token: {token}, sort: 'name', sortOrder: 'desc', limit: 20, page: 3, _bookings: true, _venues: false });
   * @see https://docs.noroff.dev/docs/v2/
   */
  GetAllProfiles = 'get all profiles',
  /**
   * @description search for specific user profile by name - API KEY required
   * @endpoint GET /profiles/{name}
   * @param {string} [token] - Auth token required
   * @param {string} [name] - Name of user
   * @param {boolean} [_bookings] -Return a list of user's bookings
   * @param {boolean} [_venues] - Return a list of user's venues
   * @returns {Promise<ProfileResponse>} A promise that resolves to a list of venues.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.GetProfileByName, { token: {token}, name: 'Jerry', _bookings: false, _venues: false });
   * @see https://docs.noroff.dev/docs/v2/
   */
  GetProfileByName = 'get profile by name',
  /**
   * @description Update your user profile
   * @endpoint PUT /profiles/{name}
   * @param {Object} [payload] - Object containing modified elements
   * @param {string} [bio]
   * @param {string[]} [avatar] - User avatar image
   * @param {string} [avatar.url] - {url} of avatar image
   * @param {string} [avatar.alt] - {alt} text of avatar image
   * @param {string} [banner.url] - {url} of banner image
   * @param {string} [banner.alt] - {alt} text of banner image
   * @param {boolean} [venueManager]
   * @returns {Promise<ProfileResponse>} A promise that resolves to a list of venues.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.GetProfileByName, { token: {token}, name: 'Jerry', payload: {payload} });
   * @see https://docs.noroff.dev/docs/v2/
   */
  UpdateProfile = 'update profile',
  /**
   * Fetches all bookings.
   *
   * @endpoint GET /holidaze/bookings
   * @description Returns a list of bookings. Supports sorting, pagination, and including related customer/venue details.
   * @param {string} [sort] - Field to sort by (e.g., 'created', 'dateFrom').
   * @param {string} [sortOrder] - Sorting order, either 'asc' or 'desc'.
   * @param {number} [limit=20] - Number of bookings per page (default: 20).
   * @param {number} [page=1] - Page number to retrieve (default: 1).
   * @param {boolean} [_customer] - (Optional) If true, includes customer details in the response.
   * @param {boolean} [_venue] - (Optional) If true, includes venue details in the response.
   * @param {string} token - Authorization token (required).
   * @returns {Promise<BookingsResponse>} A promise that resolves to a list of bookings.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.GetAllBookings, { token, sort: 'dateFrom', sortOrder: 'desc', limit: 10, page: 1, _customer: true, _venue: false });
   * @see https://docs.noroff.dev/docs/v2/holidaze/bookings
   */
  GetAllBookings = 'get all bookings',
  /**
   * Fetches booking by id.
   *
   * @endpoint GET /holidaze/bookings/{id}
   * @description Retrieve a single booking based on its id.
   * @param {string} id - Booking id to retrieve.
   * @param {boolean} [_customer] - (Optional) If true, includes customer details in the response.
   * @param {boolean} [_venue] - (Optional) If true, includes venue details in the response.
   * @param {string} token - Authorization token (required).
   * @returns {Promise<BookingsResponse>} A promise that resolves to a single booking.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.GetBookingById, { id: 'booking-id', token, _customer: true, _venue: true });
   * @see https://docs.noroff.dev/docs/v2/holidaze/bookings
   */
  GetBookingById = 'get booking by id',
  /**
   * Fetches bookings by profile.
   *
   * @endpoint GET /holidaze/profiles/{name}/bookings
   * @description Retrieve all bookings made by a profile. Supports sorting, pagination, and related flags.
   * @param {string} name - Profile name.
   * @param {string} [sort] - Field to sort by (e.g., 'created', 'dateFrom').
   * @param {string} [sortOrder] - Sorting order, either 'asc' or 'desc'.
   * @param {number} [limit=20] - Number of bookings per page (default: 20).
   * @param {number} [page=1] - Page number to retrieve (default: 1).
   * @param {boolean} [_customer] - (Optional) If true, includes customer details in the response.
   * @param {boolean} [_venue] - (Optional) If true, includes venue details in the response.
   * @param {string} token - Authorization token (required).
   * @returns {Promise<BookingsResponse>} A promise that resolves to a list of bookings for the profile.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.GetBookingsByProfile, { name: 'jane_doe', token, sort: 'created', sortOrder: 'asc', limit: 20, page: 1, _customer: false, _venue: true });
   * @see https://docs.noroff.dev/docs/v2/holidaze/profiles#all-bookings-by-profile
   */
  GetBookingsByProfile = 'get bookings by profile',
  /**
   * Creates a booking.
   *
   * @endpoint POST /holidaze/bookings
   * @description Create a new booking with required details.
   * @param {Object} bookingCreatePayload - Payload with booking details.
   * @param {string} bookingCreatePayload.dateFrom - ISO date string for start date.
   * @param {string} bookingCreatePayload.dateTo - ISO date string for end date.
   * @param {number} bookingCreatePayload.guests - Number of guests.
   * @param {string} bookingCreatePayload.venueId - The id of the venue to book.
   * @param {string} token - Authorization token (required).
   * @returns {Promise<BookingsResponse>} A promise that resolves to the created booking.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.CreateBooking, { bookingCreatePayload: { dateFrom, dateTo, guests, venueId }, token });
   * @see https://docs.noroff.dev/docs/v2/holidaze/bookings#create-booking
   */
  CreateBooking = 'create booking',
  /**
   * Updates a booking.
   *
   * @endpoint PUT /holidaze/bookings/{id}
   * @description Update an existing booking's details.
   * @param {string} id - Booking id to update.
   * @param {Object} bookingUpdatePayload - Partial update payload.
   * @param {string} [bookingUpdatePayload.dateFrom] - ISO date string for start date.
   * @param {string} [bookingUpdatePayload.dateTo] - ISO date string for end date.
   * @param {number} [bookingUpdatePayload.guests] - Number of guests.
   * @param {string} token - Authorization token (required).
   * @returns {Promise<BookingsResponse>} A promise that resolves to the updated booking.
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.UpdateBooking, { id: 'booking-id', bookingUpdatePayload: { guests: 3 }, token });
   * @see https://docs.noroff.dev/docs/v2/holidaze/bookings#update-booking
   */
  UpdateBooking = 'update booking',
  /**
   * Deletes a booking.
   *
   * @endpoint DELETE /holidaze/bookings/{id}
   * @description Delete a booking based on its id.
   * @param {string} id - Booking id to delete.
   * @param {string} token - Authorization token (required).
   * @returns {Promise<boolean>} A promise that resolves to true if the booking was deleted (204).
   * @throws {Error} Throws an error if the API request fails.
   * @example
   * // Example usage:
   * getData(ApiFunctions.DeleteBooking, { id: 'booking-id', token });
   * @see https://docs.noroff.dev/docs/v2/holidaze/bookings#delete-booking
   */
  DeleteBooking = 'delete booking',
}

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchVenues, fetchProfiles, fetchBookings } from '../api';
import { ApiFunctions } from '../apiFunctionsEnum';
import * as authToken from '../authToken';

// Mock all the individual API functions
vi.mock('../venues', () => ({
  getVenues: vi.fn(),
  getVenueByID: vi.fn(),
  getVenueBySearch: vi.fn(),
  createVenue: vi.fn(),
  updateVenue: vi.fn(),
  deleteVenue: vi.fn(),
}));

vi.mock('../profiles', () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  getAllProfiles: vi.fn(),
  getProfileByName: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock('../bookings', () => ({
  createBooking: vi.fn(),
  deleteBooking: vi.fn(),
  getAllBookings: vi.fn(),
  getBookingByID: vi.fn(),
  getBookingsByProfile: vi.fn(),
  updateBooking: vi.fn(),
}));

describe('API Dispatcher Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock isTokenValid to return true for valid tokens
    vi.spyOn(authToken, 'isTokenValid').mockImplementation(
      (token) => typeof token === 'string' && token.trim() !== '',
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchVenues', () => {
    it('should validate required ID parameter for GetVenueById', async () => {
      await expect(
        fetchVenues(ApiFunctions.GetVenueById, { id: undefined }),
      ).rejects.toThrow('Id must be a string value');
    });

    it('should validate token for CreateVenue', async () => {
      const venuePayload = {
        name: 'Test Venue',
        description: 'Test description',
        media: [],
        price: 100,
        maxGuests: 4,
        rating: 0,
        meta: { wifi: false, parking: false, breakfast: false, pets: false },
        location: {
          address: '',
          city: '',
          zip: '',
          country: '',
          continent: '',
          lat: 0,
          lng: 0,
        },
      };

      await expect(
        fetchVenues(ApiFunctions.CreateVenue, { venuePayload, token: '' }),
      ).rejects.toThrow('Creating a new venue requires authorization token');
    });

    it('should handle unknown function gracefully', async () => {
      await expect(
        fetchVenues('UnknownFunction' as unknown as never),
      ).rejects.toThrow('Unknown function: UnknownFunction');
    });
  });

  describe('fetchProfiles', () => {
    it('should validate login payload', async () => {
      await expect(
        // pass undefined explicitly to test validation branch
        fetchProfiles(ApiFunctions.LoginUser, {
          // loginProfilePayload intentionally undefined for test
          loginProfilePayload: undefined as unknown as never,
        }),
      ).rejects.toThrow(
        'Submitted payload information is incorrect or missing.',
      );
    });

    it('should validate token for protected endpoints', async () => {
      await expect(
        fetchProfiles(ApiFunctions.GetAllProfiles, { token: '' }),
      ).rejects.toThrow('Request is missing token!');
    });

    it('should validate name parameter for GetProfileByName', async () => {
      await expect(
        fetchProfiles(ApiFunctions.GetProfileByName, {
          token: 'valid-token',
          name: '',
        }),
      ).rejects.toThrow('Name is required');
    });
  });

  describe('fetchBookings', () => {
    const mockBookingCreatePayload = {
      dateFrom: '2025-09-10T00:00:00.000Z',
      dateTo: '2025-09-15T00:00:00.000Z',
      guests: 2,
      venueId: 'venue-123',
    };

    const mockBookingUpdatePayload = {
      dateFrom: '2025-09-10T00:00:00.000Z',
      dateTo: '2025-09-15T00:00:00.000Z',
      guests: 2,
    };

    it('should validate token for GetAllBookings', async () => {
      await expect(
        fetchBookings(ApiFunctions.GetAllBookings, {
          token: '',
          bookingCreatePayload: mockBookingCreatePayload,
          bookingUpdatePayload: mockBookingUpdatePayload,
        }),
      ).rejects.toThrow('Fetching bookings requires authorization token');
    });

    it('should validate ID parameter for GetBookingById', async () => {
      await expect(
        fetchBookings(ApiFunctions.GetBookingById, {
          id: undefined,
          token: 'valid-token',
          bookingCreatePayload: mockBookingCreatePayload,
          bookingUpdatePayload: mockBookingUpdatePayload,
        }),
      ).rejects.toThrow('Retrieving a booking requires a valid {id}');
    });

    it('should validate booking payload for CreateBooking', async () => {
      await expect(
        // explicitly signal missing payload using unknown->never cast for type safety
        fetchBookings(ApiFunctions.CreateBooking, {
          bookingCreatePayload: undefined as unknown as never,
          bookingUpdatePayload: mockBookingUpdatePayload,
          token: 'valid-token',
        }),
      ).rejects.toThrow('No booking payload submitted');
    });

    it('should handle unknown function gracefully', async () => {
      await expect(
        fetchBookings('UnknownFunction' as unknown as never, {
          bookingCreatePayload: mockBookingCreatePayload,
          bookingUpdatePayload: mockBookingUpdatePayload,
        }),
      ).rejects.toThrow('Unknown function: UnknownFunction');
    });
  });
});

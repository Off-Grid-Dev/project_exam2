// Test framework
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Module under test
import { createVenue } from '../../venues/createVenue';

// Test helpers / mocks
import {
  createMockResponse,
  createMockErrorResponse,
  mockVenueResponse,
  mockAccessToken,
  mockApiError,
} from '../testUtils';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('createVenue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should create a venue successfully', async () => {
    const payload = {
      name: 'Test Venue',
      description: 'A beautiful test venue',
      media: [
        {
          url: 'https://example.com/image.jpg',
          alt: 'Venue image',
        },
      ],
      price: 100,
      maxGuests: 4,
      rating: 4.5,
      meta: {
        wifi: true,
        parking: true,
        breakfast: false,
        pets: false,
      },
      location: {
        address: '123 Test Street',
        city: 'Test City',
        zip: '12345',
        country: 'Test Country',
        continent: 'Test Continent',
        lat: 40.7128,
        lng: -74.006,
      },
    };

    mockFetch.mockReturnValueOnce(createMockResponse(mockVenueResponse));

    const result = await createVenue(payload, mockAccessToken);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/holidaze/venues'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockAccessToken}`,
        },
        body: JSON.stringify(payload),
      },
    );

    expect(result).toEqual(mockVenueResponse);
  });

  it('should handle API errors correctly', async () => {
    const payload = {
      name: 'Test Venue',
      description: 'A beautiful test venue',
      media: [],
      price: 100,
      maxGuests: 4,
      rating: 0,
      meta: {
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false,
      },
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

    mockFetch.mockReturnValueOnce(createMockErrorResponse(400, mockApiError));

    await expect(createVenue(payload, mockAccessToken)).rejects.toThrow(
      'Could not create venue: 400 - Test error message',
    );
  });

  it('should handle missing token', async () => {
    const payload = {
      name: 'Test Venue',
      description: 'A beautiful test venue',
      media: [],
      price: 100,
      maxGuests: 4,
      rating: 0,
      meta: {
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false,
      },
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

    mockFetch.mockReturnValueOnce(createMockResponse(mockVenueResponse));

    await createVenue(payload, '');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/holidaze/venues'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ',
        },
        body: JSON.stringify(payload),
      },
    );
  });
});

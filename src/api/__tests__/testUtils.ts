import { vi } from 'vitest';

// Mock data for testing
export const mockAccessToken = 'mock-access-token-123';

export const mockBookingResponse = {
  data: {
    id: 'booking-123',
    dateFrom: '2025-09-10T00:00:00.000Z',
    dateTo: '2025-09-15T00:00:00.000Z',
    guests: 2,
    created: '2025-09-01T00:00:00.000Z',
    updated: '2025-09-01T00:00:00.000Z',
  },
  meta: {},
};

export const mockBookingsResponse = {
  data: [mockBookingResponse.data],
  meta: {
    isFirstPage: true,
    isLastPage: true,
    currentPage: 1,
    previousPage: null,
    nextPage: null,
    pageCount: 1,
    totalCount: 1,
  },
};

export const mockVenueResponse = {
  data: {
    id: 'venue-123',
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
    created: '2025-09-01T00:00:00.000Z',
    updated: '2025-09-01T00:00:00.000Z',
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
  },
  meta: {},
};

export const mockVenuesResponse = {
  data: [mockVenueResponse.data],
  meta: {
    isFirstPage: true,
    isLastPage: true,
    currentPage: 1,
    previousPage: null,
    nextPage: null,
    pageCount: 1,
    totalCount: 1,
  },
};

export const mockProfileResponse = {
  data: {
    name: 'testuser',
    email: 'test@example.com',
    bio: 'Test user bio',
    avatar: {
      url: 'https://example.com/avatar.jpg',
      alt: 'Avatar',
    },
    banner: {
      url: 'https://example.com/banner.jpg',
      alt: 'Banner',
    },
    venueManager: false,
    _count: {
      venues: 0,
      bookings: 1,
    },
  },
  meta: {},
};

export const mockProfilesResponse = {
  data: [mockProfileResponse.data],
  meta: {
    isFirstPage: true,
    isLastPage: true,
    currentPage: 1,
    previousPage: null,
    nextPage: null,
    pageCount: 1,
    totalCount: 1,
  },
};

export const mockLoginResponse = {
  data: {
    name: 'testuser',
    email: 'test@example.com',
    bio: 'Test user bio',
    avatar: {
      url: 'https://example.com/avatar.jpg',
      alt: 'Avatar',
    },
    banner: {
      url: 'https://example.com/banner.jpg',
      alt: 'Banner',
    },
    venueManager: false,
    accessToken: mockAccessToken,
  },
  meta: {},
};

export const mockApiError = {
  errors: [
    {
      message: 'Test error message',
      code: 'TEST_ERROR',
    },
  ],
  status: 'error',
  statusCode: 400,
};

// Helper to create a successful fetch response
export const createMockResponse = (data: any, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
  } as Response);
};

// Helper to create an error fetch response
export const createMockErrorResponse = (status = 400, error = mockApiError) => {
  return Promise.resolve({
    ok: false,
    status,
    statusText: 'Error',
    json: () => Promise.resolve(error),
  } as Response);
};

// Mock fetch function setup
export const setupFetchMock = () => {
  return vi.fn();
};

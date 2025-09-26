// Test framework
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Module under test
import { createBooking } from '../../bookings/createBooking';

// Test helpers / mocks
import {
  createMockResponse,
  createMockErrorResponse,
  mockBookingResponse,
  mockAccessToken,
  mockApiError,
} from '../testUtils';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('createBooking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should create a booking successfully', async () => {
    const payload = {
      dateFrom: '2025-09-10T00:00:00.000Z',
      dateTo: '2025-09-15T00:00:00.000Z',
      guests: 2,
      venueId: 'venue-123',
    };

    mockFetch.mockReturnValueOnce(createMockResponse(mockBookingResponse));

    const result = await createBooking(payload, mockAccessToken);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/holidaze/bookings'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockAccessToken}`,
        },
        body: JSON.stringify(payload),
      },
    );

    expect(result).toEqual(mockBookingResponse);
  });

  it('should handle API errors correctly', async () => {
    const payload = {
      dateFrom: '2025-09-10T00:00:00.000Z',
      dateTo: '2025-09-15T00:00:00.000Z',
      guests: 2,
      venueId: 'venue-123',
    };

    mockFetch.mockReturnValueOnce(createMockErrorResponse(400, mockApiError));

    await expect(createBooking(payload, mockAccessToken)).rejects.toThrow(
      'Could not create booking: 400 - Test error message',
    );
  });

  it('should handle network errors', async () => {
    const payload = {
      dateFrom: '2025-09-10T00:00:00.000Z',
      dateTo: '2025-09-15T00:00:00.000Z',
      guests: 2,
      venueId: 'venue-123',
    };

    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(createBooking(payload, mockAccessToken)).rejects.toThrow(
      'Network error',
    );
  });

  it('should work without token in headers when token is empty', async () => {
    const payload = {
      dateFrom: '2025-09-10T00:00:00.000Z',
      dateTo: '2025-09-15T00:00:00.000Z',
      guests: 2,
      venueId: 'venue-123',
    };

    mockFetch.mockReturnValueOnce(createMockResponse(mockBookingResponse));

    await createBooking(payload, '');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/holidaze/bookings'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getBookingByID } from '../../bookings/getBookingByID';
import {
  createMockResponse,
  createMockErrorResponse,
  mockBookingResponse,
  mockAccessToken,
  mockApiError,
} from '../testUtils';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('getBookingByID', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch booking by ID successfully', async () => {
    const bookingId = 'booking-123';
    mockFetch.mockReturnValueOnce(createMockResponse(mockBookingResponse));

    const result = await getBookingByID(
      bookingId,
      false,
      false,
      mockAccessToken,
    );

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/holidaze/bookings/${bookingId}`),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockAccessToken}`,
        },
      },
    );

    expect(result).toEqual(mockBookingResponse);
  });

  it('should handle API errors correctly', async () => {
    const bookingId = 'booking-123';
    mockFetch.mockReturnValueOnce(createMockErrorResponse(404, mockApiError));

    await expect(
      getBookingByID(bookingId, false, false, mockAccessToken),
    ).rejects.toThrow('Could not get booking by ID: 404 - Test error message');
  });

  it('should handle missing token', async () => {
    const bookingId = 'booking-123';
    mockFetch.mockReturnValueOnce(createMockResponse(mockBookingResponse));

    await getBookingByID(bookingId, false, false);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/holidaze/bookings/${bookingId}`),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });
});

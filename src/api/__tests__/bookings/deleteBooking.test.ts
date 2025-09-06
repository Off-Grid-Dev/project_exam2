import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { deleteBooking } from '../../bookings/deleteBooking';
import {
  createMockErrorResponse,
  mockAccessToken,
  mockApiError,
} from '../testUtils';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('deleteBooking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should delete booking successfully', async () => {
    const bookingId = 'booking-123';

    // Mock successful deletion (204 No Content)
    mockFetch.mockReturnValueOnce(
      Promise.resolve({
        ok: true,
        status: 204,
        statusText: 'No Content',
      } as Response),
    );

    await deleteBooking(bookingId, mockAccessToken);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/holidaze/bookings/${bookingId}`),
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockAccessToken}`,
        },
      },
    );
  });

  it('should handle API errors correctly', async () => {
    const bookingId = 'booking-123';
    mockFetch.mockReturnValueOnce(createMockErrorResponse(404, mockApiError));

    await expect(deleteBooking(bookingId, mockAccessToken)).rejects.toThrow(
      'Could not delete booking: 404 - Test error message',
    );
  });

  it('should handle missing token', async () => {
    const bookingId = 'booking-123';

    mockFetch.mockReturnValueOnce(
      Promise.resolve({
        ok: true,
        status: 204,
        statusText: 'No Content',
      } as Response),
    );

    await deleteBooking(bookingId, '');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/holidaze/bookings/${bookingId}`),
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ',
        },
      },
    );
  });
});

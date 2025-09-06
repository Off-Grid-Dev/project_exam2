import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAllBookings } from '../../bookings/getAllBookings';
import {
  createMockResponse,
  createMockErrorResponse,
  mockBookingsResponse,
  mockAccessToken,
  mockApiError,
} from '../testUtils';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('getAllBookings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch all bookings successfully', async () => {
    mockFetch.mockReturnValueOnce(createMockResponse(mockBookingsResponse));

    const result = await getAllBookings(
      undefined,
      undefined,
      20,
      1,
      undefined,
      undefined,
      mockAccessToken,
    );

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/holidaze/bookings'),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockAccessToken}`,
        },
      },
    );

    expect(result).toEqual(mockBookingsResponse);
  });

  it('should handle query parameters correctly', async () => {
    mockFetch.mockReturnValueOnce(createMockResponse(mockBookingsResponse));

    await getAllBookings('created', 'desc', 10, 2, true, true, mockAccessToken);

    const expectedUrl = expect.stringMatching(
      /\/holidaze\/bookings\?.*sort=created.*sortOrder=desc.*limit=10.*page=2.*_customer=true.*_venue=true/,
    );

    expect(mockFetch).toHaveBeenCalledWith(expectedUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mockAccessToken}`,
      },
    });
  });

  it('should handle API errors correctly', async () => {
    mockFetch.mockReturnValueOnce(createMockErrorResponse(400, mockApiError));

    await expect(
      getAllBookings(
        undefined,
        undefined,
        20,
        1,
        undefined,
        undefined,
        mockAccessToken,
      ),
    ).rejects.toThrow('Could not get bookings: 400 - Test error message');
  });

  it('should handle missing token', async () => {
    mockFetch.mockReturnValueOnce(createMockResponse(mockBookingsResponse));

    await getAllBookings();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/holidaze/bookings'),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });
});

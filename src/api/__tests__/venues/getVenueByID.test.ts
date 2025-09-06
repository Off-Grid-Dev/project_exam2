import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getVenueByID } from '../../venues/getVenueByID';
import {
  createMockResponse,
  createMockErrorResponse,
  mockVenueResponse,
  mockApiError,
} from '../testUtils';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('getVenueByID', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch venue by ID successfully', async () => {
    const venueId = 'venue-123';
    mockFetch.mockReturnValueOnce(createMockResponse(mockVenueResponse));

    const result = await getVenueByID(venueId);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/holidaze/venues/${venueId}`),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    expect(result).toEqual(mockVenueResponse);
  });

  it('should handle query parameters correctly', async () => {
    const venueId = 'venue-123';
    mockFetch.mockReturnValueOnce(createMockResponse(mockVenueResponse));

    await getVenueByID(venueId, true, true);

    const expectedUrl = expect.stringMatching(
      new RegExp(`/holidaze/venues/${venueId}\\?.*_owner=true.*_bookings=true`),
    );

    expect(mockFetch).toHaveBeenCalledWith(expectedUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should handle API errors correctly', async () => {
    const venueId = 'venue-123';
    mockFetch.mockReturnValueOnce(createMockErrorResponse(404, mockApiError));

    await expect(getVenueByID(venueId)).rejects.toThrow(
      'Could not get venue by ID: 404 - Test error message',
    );
  });

  it('should handle network errors', async () => {
    const venueId = 'venue-123';
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(getVenueByID(venueId)).rejects.toThrow('Network error');
  });
});

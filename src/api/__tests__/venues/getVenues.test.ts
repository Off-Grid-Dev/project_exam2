// Test framework
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Module under test
import { getVenues } from '../../venues/getVenues';

// Test helpers / mocks
import {
  createMockResponse,
  createMockErrorResponse,
  mockVenuesResponse,
  mockApiError,
} from '../testUtils';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('getVenues', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch all venues successfully with default parameters', async () => {
    mockFetch.mockReturnValueOnce(createMockResponse(mockVenuesResponse));

    const result = await getVenues(undefined, undefined);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/holidaze\/venues\?.*limit=20.*page=1/),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    expect(result).toEqual(mockVenuesResponse);
  });

  it('should handle query parameters correctly', async () => {
    mockFetch.mockReturnValueOnce(createMockResponse(mockVenuesResponse));

    await getVenues('name', 'asc', 10, 2, true, true);

    const expectedUrl = expect.stringMatching(
      /\/holidaze\/venues\?.*sort=name.*sortOrder=asc.*limit=10.*page=2.*_owner=true.*_bookings=true/,
    );

    expect(mockFetch).toHaveBeenCalledWith(expectedUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('should handle API errors correctly', async () => {
    mockFetch.mockReturnValueOnce(createMockErrorResponse(400, mockApiError));

    await expect(getVenues(undefined, undefined)).rejects.toThrow(
      'Could not get venues: 400 - Test error message',
    );
  });

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(getVenues(undefined, undefined)).rejects.toThrow(
      'Network error',
    );
  });

  it('should build URL without query parameters when none provided', async () => {
    mockFetch.mockReturnValueOnce(createMockResponse(mockVenuesResponse));

    await getVenues(undefined, undefined, 20, 1, false, false);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/holidaze\/venues\?.*limit=20.*page=1/),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  });
});

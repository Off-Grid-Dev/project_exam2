import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllProfiles } from '../../profiles/getAllProfiles';
import {
  createMockResponse,
  createMockErrorResponse,
  mockProfilesResponse,
  mockApiError,
} from '../testUtils';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('getAllProfiles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches profiles successfully', async () => {
    mockFetch.mockReturnValueOnce(createMockResponse(mockProfilesResponse));

    const res = await getAllProfiles('token-123');

    expect(mockFetch).toHaveBeenCalled();
    expect(res).toEqual(mockProfilesResponse);
  });

  it('throws on API error', async () => {
    mockFetch.mockReturnValueOnce(createMockErrorResponse(400, mockApiError));
    await expect(getAllProfiles('token-123')).rejects.toThrow(
      /Could not fetch profiles/,
    );
  });

  it('throws on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    await expect(getAllProfiles('token-123')).rejects.toThrow(/Network error/);
  });
});

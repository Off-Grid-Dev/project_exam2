import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProfileByName } from '../../profiles/getProfileByName';
import {
  createMockResponse,
  createMockErrorResponse,
  mockProfileResponse,
  mockApiError,
} from '../testUtils';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('getProfileByName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches a profile by name successfully', async () => {
    mockFetch.mockReturnValueOnce(createMockResponse(mockProfileResponse));

    const res = await getProfileByName('testuser', 'token-abc');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/holidaze/profiles/testuser'),
      expect.any(Object),
    );
    expect(res).toEqual(mockProfileResponse);
  });

  it('throws on API error', async () => {
    mockFetch.mockReturnValueOnce(createMockErrorResponse(404, mockApiError));
    await expect(getProfileByName('missing', 'token-abc')).rejects.toThrow(
      /Could not find profile by name/,
    );
  });

  it('throws on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    await expect(getProfileByName('testuser', 'token-abc')).rejects.toThrow(
      /Network error/,
    );
  });
});

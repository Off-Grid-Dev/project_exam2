import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { updateProfile } from '../../../api/profiles/updateProfile';
import type { ProfilePayload } from '../../../types/api/profile';

type FetchMock = typeof globalThis.fetch;

describe('updateProfile', () => {
  const original = globalThis.fetch;

  beforeEach(() => vi.resetAllMocks());
  afterEach(() => (globalThis.fetch = original));

  test('returns profile when OK', async () => {
    const payload: ProfilePayload = {
      bio: 'x',
      avatar: { url: '', alt: '' },
      banner: { url: '', alt: '' },
      venueManager: false,
    };
    const mockResp = { profile: { name: 'u' } };
    const fetchMock: FetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResp,
    } as unknown as Response);
    globalThis.fetch = fetchMock;

    const res = await updateProfile('tok', 'user', payload);
    expect(res).toEqual(mockResp);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/user'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  test('throws when API returns error', async () => {
    const payload: ProfilePayload = {
      bio: 'x',
      avatar: { url: '', alt: '' },
      banner: { url: '', alt: '' },
      venueManager: false,
    };
    const errorBody = { errors: [{ message: 'Invalid' }] };
    const fetchMock: FetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      statusText: 'Unprocessable',
      json: async () => errorBody,
    } as unknown as Response);
    globalThis.fetch = fetchMock;

    await expect(updateProfile('tok', 'user', payload)).rejects.toThrow(
      /Could not update profile: 422 - Invalid/,
    );
  });

  test('propagates network errors', async () => {
    const fetchMock: FetchMock = vi
      .fn()
      .mockRejectedValue(new Error('netfail'));
    globalThis.fetch = fetchMock;

    const payload: ProfilePayload = {
      bio: '',
      avatar: { url: '', alt: '' },
      banner: { url: '', alt: '' },
      venueManager: false,
    };

    await expect(updateProfile('tok', 'user', payload)).rejects.toThrow(
      /netfail/,
    );
  });
});

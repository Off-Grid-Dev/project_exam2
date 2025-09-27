import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteVenue } from '../../../../src/api/venues/deleteVenue';
import type { ApiError } from '../../../../src/types/api/responses';

describe('deleteVenue', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns true when server responds 204', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 204 } as unknown as Response);
    // assign at runtime for test
    (globalThis as unknown as { fetch: unknown }).fetch = fetchMock;

    const result = await deleteVenue('venue-1', 'tok-1');
    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalled();
  });

  it('throws a helpful error when API returns non-ok', async () => {
    const errorBody: ApiError = {
      errors: [{ message: 'Not allowed' }],
      status: 'error',
      statusCode: 400,
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => errorBody,
    } as unknown as Response);
    (globalThis as unknown as { fetch: unknown }).fetch = fetchMock;

    await expect(deleteVenue('venue-2', 'tok-2')).rejects.toThrow(
      /Could not delete venue: 400 - Not allowed/,
    );
  });

  it('propagates network errors', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('netfail'));
    (globalThis as unknown as { fetch: unknown }).fetch = fetchMock;

    await expect(deleteVenue('venue-3', 'tok-3')).rejects.toThrow(/netfail/);
  });
});

/* eslint-env vitest */
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { getBookingsByProfile } from '../../api/bookings/getBookingsByProfile';

const originalFetch = globalThis.fetch;

describe('getBookingsByProfile', () => {
  beforeEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('returns json on success', async () => {
    const mockResponse = { data: [{ id: 'b1' }], meta: {} };
    const mockFetch = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => mockResponse });
    globalThis.fetch = mockFetch as unknown as typeof globalThis.fetch;

    const res = await getBookingsByProfile(
      'alice',
      undefined,
      undefined,
      10,
      1,
      false,
      false,
      'tok',
    );
    expect(res).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalled();
  });

  test('throws on non-ok response with error body', async () => {
    const errorBody = { errors: [{ message: 'No access' }] };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: () => errorBody,
    }) as unknown as typeof globalThis.fetch;

    await expect(getBookingsByProfile('bob')).rejects.toThrow(
      /Could not get bookings by profile/,
    );
  });

  test('throws on network error', async () => {
    globalThis.fetch = vi
      .fn()
      .mockRejectedValue(
        new Error('network down'),
      ) as unknown as typeof globalThis.fetch;
    await expect(getBookingsByProfile('eve')).rejects.toThrow(/network down/);
  });
});

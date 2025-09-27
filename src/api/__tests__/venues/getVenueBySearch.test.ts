import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

import { getVenueBySearch } from '../../../api/venues/getVenueBySearch';

type FetchMock = typeof globalThis.fetch;

describe('getVenueBySearch', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('returns venues when response is ok', async () => {
    const mockResp = {
      total: 1,
      perPage: 20,
      page: 1,
      venues: [{ id: 'v1', name: 'Venue 1' }],
    };

    const fetchMock: FetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResp,
    } as unknown as Response);

    globalThis.fetch = fetchMock;

    const res = await getVenueBySearch('test');

    expect(res).toEqual(mockResp);
    expect(fetchMock).toHaveBeenCalled();
  });

  test('throws with API error when response not ok', async () => {
    const errorBody = { errors: [{ message: 'Bad query' }] };

    const fetchMock: FetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => errorBody,
    } as unknown as Response);

    globalThis.fetch = fetchMock;

    await expect(getVenueBySearch('test')).rejects.toThrow(
      /Could not get venue by search: 400 - Bad query/,
    );
  });

  test('propagates network errors', async () => {
    const fetchMock: FetchMock = vi
      .fn()
      .mockRejectedValue(new Error('network down'));
    globalThis.fetch = fetchMock;

    await expect(getVenueBySearch('test')).rejects.toThrow(/network down/);
  });
});

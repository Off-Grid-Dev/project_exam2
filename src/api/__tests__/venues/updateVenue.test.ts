import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

import { updateVenue } from '../../../api/venues/updateVenue';
import type { VenuePayload } from '../../../types/api/venue';

type FetchMock = typeof globalThis.fetch;

describe('updateVenue', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('updates and returns venue when response ok', async () => {
    const payload: VenuePayload = {
      name: 'Updated',
      description: 'desc',
      media: [],
      price: 100,
      maxGuests: 4,
      rating: 4.5,
      meta: { wifi: true, parking: false, breakfast: false, pets: false },
      location: {
        address: 'addr',
        city: 'city',
        zip: '0000',
        country: 'country',
        continent: 'europe',
        lat: 0,
        lng: 0,
      },
    };
    const mockResp = {
      total: 1,
      perPage: 20,
      page: 1,
      venues: [{ id: 'v1', name: 'Updated' }],
    };

    const fetchMock: FetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResp,
    } as unknown as Response);

    globalThis.fetch = fetchMock;

    const res = await updateVenue('v1', payload, 'token-123');

    expect(res).toEqual(mockResp);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/v1'),
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('Bearer'),
        }),
      }),
    );
  });

  test('throws with API error when response not ok', async () => {
    const payload: VenuePayload = {
      name: 'Updated',
      description: 'desc',
      media: [],
      price: 100,
      maxGuests: 4,
      rating: 4.5,
      meta: { wifi: true, parking: false, breakfast: false, pets: false },
      location: {
        address: 'addr',
        city: 'city',
        zip: '0000',
        country: 'country',
        continent: 'europe',
        lat: 0,
        lng: 0,
      },
    };
    const errorBody = { errors: [{ message: 'Invalid' }] };

    const fetchMock: FetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      statusText: 'Unprocessable Entity',
      json: async () => errorBody,
    } as unknown as Response);

    globalThis.fetch = fetchMock;

    await expect(updateVenue('v1', payload, 'token-123')).rejects.toThrow(
      /Could not update venue: 422 - Invalid/,
    );
  });

  test('propagates network errors', async () => {
    const fetchMock: FetchMock = vi
      .fn()
      .mockRejectedValue(new Error('network fail'));
    globalThis.fetch = fetchMock;

    const smallPayload: VenuePayload = {
      name: 'x',
      description: 'x',
      media: [],
      price: 1,
      maxGuests: 1,
      rating: 1,
      meta: { wifi: false, parking: false, breakfast: false, pets: false },
      location: {
        address: '',
        city: '',
        zip: '',
        country: '',
        continent: '',
        lat: 0,
        lng: 0,
      },
    };

    await expect(updateVenue('v1', smallPayload, 'token-123')).rejects.toThrow(
      /network fail/,
    );
  });
});

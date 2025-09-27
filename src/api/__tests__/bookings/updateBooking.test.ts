import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { updateBooking } from '../../../api/bookings/updateBooking';
import type { BookingUpdatePayload } from '../../../types/api/booking';

type FetchMock = typeof globalThis.fetch;

describe('updateBooking', () => {
  const original = globalThis.fetch;

  beforeEach(() => vi.resetAllMocks());
  afterEach(() => (globalThis.fetch = original));

  test('returns updated booking response when OK', async () => {
    const payload: BookingUpdatePayload = { guests: 2 };
    const mockResp = {
      total: 1,
      perPage: 10,
      page: 1,
      bookings: [{ id: 'b1' }],
    };

    const fetchMock: FetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResp,
    } as unknown as Response);
    globalThis.fetch = fetchMock;

    const res = await updateBooking('b1', payload, 'tok');
    expect(res).toEqual(mockResp);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/b1'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  test('throws when API responds not ok', async () => {
    const payload: BookingUpdatePayload = { guests: 2 };
    const errorBody = { errors: [{ message: 'Bad' }] };
    const fetchMock: FetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => errorBody,
    } as unknown as Response);
    globalThis.fetch = fetchMock;

    await expect(updateBooking('b1', payload, 'tok')).rejects.toThrow(
      /Could not update booking: 400 - Bad/,
    );
  });

  test('propagates network errors', async () => {
    const fetchMock: FetchMock = vi.fn().mockRejectedValue(new Error('neterr'));
    globalThis.fetch = fetchMock;

    await expect(updateBooking('b1', {}, 'tok')).rejects.toThrow(/neterr/);
  });
});

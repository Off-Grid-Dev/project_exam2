// Types
import type { BookingsResponse, ApiError } from '../../types/api/responses';
import type { BookingCreatePayload } from '../../types/api/booking';

// Constants
import { API_BOOKINGS, API_KEY } from '../constants';

export const createBooking = async (
  payload: BookingCreatePayload,
  token: string,
): Promise<BookingsResponse> => {
  const response = await fetch(API_BOOKINGS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': `${API_KEY}`,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody: ApiError = await response.json();
    const message =
      errorBody.errors?.map((e) => e.message).join(', ') || response.statusText;
    throw new Error(
      `Could not create booking: ${response.status} - ${message}`,
    );
  }

  return response.json();
};

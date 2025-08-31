import type { BookingsResponse, ApiError } from '../../types/api/responses';
import type { BookingCreatePayload } from '../../types/api/booking';

// Local endpoint to avoid coupling to api.ts while stubbing
const API_HOLIDAZE = import.meta.env.VITE_API_HOLIDAZE;
const API_BOOKINGS = `${API_HOLIDAZE}bookings`;

export const createBooking = async (
  payload: BookingCreatePayload,
  token: string,
): Promise<BookingsResponse> => {
  const response = await fetch(API_BOOKINGS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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

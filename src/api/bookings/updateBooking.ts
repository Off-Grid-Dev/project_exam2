import type { BookingsResponse, ApiError } from '../../types/api/responses';
import type { BookingUpdatePayload } from '../../types/api/booking';
import { API_BOOKINGS } from '../constants';

export const updateBooking = async (
  id: string,
  payload: BookingUpdatePayload,
  token: string,
): Promise<BookingsResponse> => {
  const response = await fetch(`${API_BOOKINGS}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody: ApiError = await response.json();
    const message =
      errorBody.errors?.map((e) => e.message).join(', ') || response.statusText;
    throw new Error(
      `Could not update booking: ${response.status} - ${message}`,
    );
  }

  return response.json();
};

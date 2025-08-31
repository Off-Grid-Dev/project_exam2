import type { ApiError } from '../../types/api/responses';

const API_HOLIDAZE = import.meta.env.VITE_API_HOLIDAZE;
const API_BOOKINGS = `${API_HOLIDAZE}bookings`;

export const deleteBooking = async (id: string, token: string) => {
  const response = await fetch(`${API_BOOKINGS}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 204) {
    console.log(`Deleted booking ${id} successfully.`);
  } else if (!response.ok) {
    const errorBody: ApiError = await response.json();
    const message =
      errorBody.errors?.map((e) => e.message).join(', ') || response.statusText;
    throw new Error(
      `Could not delete booking: ${response.status} - ${message}`,
    );
  }

  return response.status === 204;
};

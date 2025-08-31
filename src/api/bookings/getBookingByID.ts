import type { BookingsResponse, ApiError } from '../../types/api/responses';

const API_HOLIDAZE = import.meta.env.VITE_API_HOLIDAZE;
const API_BOOKINGS = `${API_HOLIDAZE}bookings`;

export const getBookingByID = async (
  id: string,
  _customer?: boolean,
  _venue?: boolean,
  token?: string,
): Promise<BookingsResponse> => {
  const query = new URLSearchParams();
  if (_customer) query.append('_customer', String(_customer));
  if (_venue) query.append('_venue', String(_venue));

  const url = query.toString()
    ? `${API_BOOKINGS}/${id}?${query.toString()}`
    : `${API_BOOKINGS}/${id}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorBody: ApiError = await response.json();
    const message =
      errorBody.errors?.map((e) => e.message).join(', ') || response.statusText;
    throw new Error(
      `Could not get booking by ID: ${response.status} - ${message}`,
    );
  }

  return response.json();
};

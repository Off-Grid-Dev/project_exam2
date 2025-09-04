import type { BookingsResponse, ApiError } from '../../types/api/responses';
import { API_PROFILES } from '../constants';

export const getBookingsByProfile = async (
  name: string,
  sort?: string,
  sortOrder?: string,
  limit = 20,
  page = 1,
  _customer?: boolean,
  _venue?: boolean,
  token?: string,
): Promise<BookingsResponse> => {
  const query = new URLSearchParams();
  if (sort) query.append('sort', sort);
  if (sortOrder) query.append('sortOrder', sortOrder);
  if (limit) query.append('limit', String(limit));
  if (page) query.append('page', String(page));
  if (_customer) query.append('_customer', String(_customer));
  if (_venue) query.append('_venue', String(_venue));

  const url = `${API_PROFILES}/${encodeURIComponent(name)}/bookings?${query.toString()}`;

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
      `Could not get bookings by profile: ${response.status} - ${message}`,
    );
  }

  return response.json();
};

import type { ApiError, ProfileResponse } from '../../types/api/responses';
import { API_KEY, API_PROFILES } from '../constants';

export const getAllProfiles = async (
  token: string,
  sort?: string,
  sortOrder?: string,
  limit?: number,
  page?: number,
  _bookings?: boolean,
  _venues?: boolean,
): Promise<ProfileResponse> => {
  const query = new URLSearchParams();
  if (sort) query.append('sort', String(sort));
  if (sortOrder) query.append('sortOrder', String(sortOrder));
  if (limit) query.append('limit', limit.toString());
  if (page) query.append('page', page.toString());
  if (_bookings) query.append('_bookings', _bookings.toString());
  if (_venues) query.append('_venues', _venues.toString());

  const url = query.toString()
    ? `${API_PROFILES}?${query.toString()}`
    : `${API_PROFILES}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Noroff-API-Key': `${API_KEY}`,
    },
  });

  if (!response.ok) {
    const errorBody: ApiError = await response.json();
    const message =
      errorBody.errors.map((e) => e.message).join(', ') || response.statusText;
    throw new Error(
      `Could not fetch profiles: ${response.status} - ${message}`,
    );
  }

  return response.json();
};

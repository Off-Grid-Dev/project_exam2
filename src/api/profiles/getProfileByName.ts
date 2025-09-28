// Types
import type { ApiError, ProfileResponse } from '../../types/api/responses';

// Constants
import { API_KEY, API_PROFILES } from '../constants';

export const getProfileByName = async (
  name: string,
  token: string,
  _venues?: boolean,
  _bookings?: boolean,
): Promise<ProfileResponse> => {
  const query = new URLSearchParams();
  if (_venues) query.append('_venues', String(_venues));
  if (_bookings) query.append('_bookings', String(_bookings));

  const url = query.toString()
    ? `${API_PROFILES}/${name}?${query.toString()}`
    : `${API_PROFILES}/${name}`;

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
      `Could not find profile by name: ${response.status} - ${message}`,
    );
  }

  return response.json();
};

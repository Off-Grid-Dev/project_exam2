// Types
import type { VenuesResponse } from '../../types/api/responses';
import type { ApiError } from '../../types/api/responses';

// Constants
import { API_VENUES, API_KEY } from '../constants';

export const getVenues = async (
  sort: string | undefined,
  sortOrder: string | undefined,
  limit: number = 20,
  page: number = 1,
  _owner?: boolean,
  _bookings?: boolean,
  token?: string,
): Promise<VenuesResponse> => {
  const query = new URLSearchParams();
  if (sort) query.append('sort', sort);
  if (sortOrder) query.append('sortOrder', sortOrder);
  if (limit) query.append('limit', limit.toString());
  if (page) query.append('page', page.toString());
  if (_owner) query.append('_owner', _owner.toString());
  if (_bookings) query.append('_bookings', _bookings.toString());

  const url = query.toString()
    ? `${API_VENUES}?${query.toString()}`
    : API_VENUES;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-Noroff-API-Key': `${API_KEY}`,
    },
  });

  if (!response.ok) {
    const errorBody: ApiError = await response.json();
    const message =
      errorBody.errors.map((e) => e.message).join(', ') || response.statusText;
    throw new Error(`Could not get venues: ${response.status} - ${message}`);
  }

  return response.json();
};

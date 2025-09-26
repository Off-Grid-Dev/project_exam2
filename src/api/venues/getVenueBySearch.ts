// Types
import type { VenuesResponse } from '../../types/api/responses';
import type { ApiError } from '../../types/api/responses';

// Constants
import { API_VENUES } from '../constants';

export const getVenueBySearch = async (
  q: string,
  sort?: string,
  sortOrder?: string,
  page: number = 1,
  limit: number = 20,
  _owner?: boolean,
  _bookings?: boolean,
): Promise<VenuesResponse> => {
  const query = new URLSearchParams();
  if (sort) query.append('sort', sort);
  if (sortOrder) query.append('sortOrder', sortOrder);
  if (limit) query.append('limit', limit.toString());
  if (page) query.append('page', page.toString());
  if (q) query.append('q', q);
  if (_owner) query.append('_owner', _owner.toString());
  if (_bookings) query.append('_bookings', _bookings.toString());

  const url = `${API_VENUES}/search?${query.toString()}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody: ApiError = await response.json();
    const message =
      errorBody.errors.map((e) => e.message).join(', ') || response.statusText;
    throw new Error(
      `Could not get venue by search: ${response.status} - ${message}`,
    );
  }

  return response.json();
};

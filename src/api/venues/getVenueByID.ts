import type { VenuesResponse } from '../../types/api/responses';
import { API_VENUES } from '../api';
import type { ApiError } from '../../types/api/responses';

export const getVenueByID = async (
  id: string,
  _owner?: boolean,
  _bookings?: boolean,
): Promise<VenuesResponse> => {
  const query = new URLSearchParams();
  if (_owner) query.append('_owner', _owner.toString());
  if (_bookings) query.append('_bookings', _bookings.toString());

  const url = query.toString()
    ? `${API_VENUES}/${id}?${query.toString()}`
    : `${API_VENUES}/${id}`;

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
      `Could not get venue by ID: ${response.status} - ${message}`,
    );
  }

  return response.json();
};

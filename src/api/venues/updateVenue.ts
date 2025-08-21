import type { VenuesResponse } from '../../types/api/responses';
import { API_VENUES } from '../api';
import type { ApiError } from '../../types/api/responses';
import type { VenuePayload } from '../../types/api/venue';

export const updateVenue = async (
  id?: string,
  payload?: VenuePayload,
  token?: string,
  _owner: boolean = false,
  _bookings: boolean = false,
): Promise<VenuesResponse> => {
  const query = new URLSearchParams();
  if (_owner) query.append('_owner', 'true');
  if (_bookings) query.append('_bookings', 'true');

  const url = query.toString()
    ? `${API_VENUES}/${id}?${query.toString()}`
    : `${API_VENUES}/${id}`;

  const response = await fetch(url, {
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
      errorBody.errors.map((e) => e.message).join(', ') || response.statusText;
    throw new Error(`Could not update venue: ${response.status} - ${message}`);
  }

  return response.json();
};

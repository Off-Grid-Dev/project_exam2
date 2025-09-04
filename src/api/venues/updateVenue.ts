import type { VenuesResponse } from '../../types/api/responses';
import { API_VENUES } from '../constants';
import type { ApiError } from '../../types/api/responses';
import type { VenuePayload } from '../../types/api/venue';

export const updateVenue = async (
  id: string,
  payload: VenuePayload,
  token: string,
): Promise<VenuesResponse> => {
  const response = await fetch(`${API_VENUES}/${id}`, {
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

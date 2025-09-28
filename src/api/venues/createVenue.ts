// Types
import type { VenuesResponse } from '../../types/api/responses';
import type { ApiError } from '../../types/api/responses';
import type { VenuePayload } from '../../types/api/venue';

// Constants
import { API_VENUES, API_KEY } from '../constants';

export const createVenue = async (
  payload: VenuePayload,
  token: string,
): Promise<VenuesResponse> => {
  const response = await fetch(`${API_VENUES}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Noroff-API-Key': `${API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody: ApiError = await response.json();
    const message =
      errorBody.errors.map((e) => e.message).join(', ') || response.statusText;
    throw new Error(`Could not create venue: ${response.status} - ${message}`);
  }

  return response.json();
};

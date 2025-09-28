// Types
import type { ApiError } from '../../types/api/responses';

// Constants
import { API_VENUES } from '../constants';

export const deleteVenue = async (id: string, token: string) => {
  const response = await fetch(`${API_VENUES}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody: ApiError = await response.json();
    const message =
      errorBody.errors.map((e) => e.message).join(', ') || response.statusText;
    throw new Error(`Could not delete venue: ${response.status} - ${message}`);
  }

  return response.status === 204;
};

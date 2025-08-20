import type { VenuesResponse } from '../../types/api/responses';
import { API_VENUES } from '../api';
import type { ApiError } from '../../types/api/responses';

export const getVenues = async (
  sort = 'created',
  sortOrder = 'desc',
  limit = 20,
  page = 1,
): Promise<VenuesResponse> => {
  const response = await fetch(
    `${API_VENUES}?${sort !== '' ? 'sort=' + sort + '&' : ''}sortOrder=${sortOrder}&limit=${limit}&offset=${page}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    const errorBody: ApiError = await response.json();
    const message =
      errorBody.errors.map((e) => e.message).join(', ') || response.statusText;
    throw new Error(`Could not get venues: ${response.status} - ${message}`);
  }

  return response.json();
};

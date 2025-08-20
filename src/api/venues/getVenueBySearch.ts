import type { VenuesResponse } from '../../types/api/responses';
import { API_VENUES } from '../api';
import type { ApiError } from '../../types/api/responses';

export const getVenueBySearch = async (
  sort = '',
  sortOrder = 'desc',
  limit = 20,
  page = 0,
  query?: string,
): Promise<VenuesResponse> => {
  const response = await fetch(
    `${API_VENUES}/search?${sort === '' ? 'sort=' + sort : ''}&sortOrder=${sortOrder}&limit=${limit}&page=${page}&q=${query}`,
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
    throw new Error(
      `Could not get venue by ID: ${response.status} - ${message}`,
    );
  }

  return response.json();
};

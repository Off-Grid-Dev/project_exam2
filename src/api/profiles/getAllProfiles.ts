import type { ApiError, ProfileResponse } from '../../types/api/responses';
import { API_KEY, API_PROFILES } from '../api';

export const getAllProfiles = async (
  token: string,
): Promise<ProfileResponse> => {
  const response = await fetch(`${API_PROFILES}`, {
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
      `Could not fetch profiles: ${response.status} - ${message}`,
    );
  }

  return response.json();
};

import type { ApiError, ProfileResponse } from '../../types/api/responses';
import { API_KEY, API_PROFILES } from '../api';

export const getProfileByName = async (
  name: string,
  token: string,
): Promise<ProfileResponse> => {
  const response = await fetch(`${API_PROFILES}/${name}`, {
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
      `Could not find profile by name: ${response.status} - ${message}`,
    );
  }

  return response.json();
};

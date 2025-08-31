import type { ProfilePayload } from '../../types/api/profile';
import type { ApiError, ProfileResponse } from '../../types/api/responses';
import { API_PROFILES, API_KEY } from '../api';

export const updateProfile = async (
  token: string,
  name: string,
  payload: ProfilePayload,
): Promise<ProfileResponse> => {
  const response = await fetch(`${API_PROFILES}/${name}`, {
    method: 'PUT',
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
    throw new Error(
      `Could not update profile: ${response.status} - ${message}`,
    );
  }

  return response.json();
};

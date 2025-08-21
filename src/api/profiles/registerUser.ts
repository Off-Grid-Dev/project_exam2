import { type ApiError, type ProfileResponse } from '../../types/api/responses';
import { API_PROFILES } from '../api';
import { type ProfilePayload } from '../../types/api/profile';

export const registerUser = async (
  name?: string,
  payload?: ProfilePayload,
): Promise<ProfileResponse> => {
  const url = `${API_PROFILES}/${name}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody: ApiError = await response.json();
    const message =
      errorBody.errors.map((e) => e.message).join(', ') || response.statusText;
    throw new Error(
      `Could not create newUser: ${response.status} - ${message}`,
    );
  }

  return response.json();
};

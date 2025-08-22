import {
  type ApiError,
  type RegisterProfileResponse,
} from '../../types/api/responses';
import { API_PROFILES } from '../api';
import { type RegisterProfilePayload } from '../../types/api/profile';

export const registerUser = async (
  payload?: RegisterProfilePayload,
): Promise<RegisterProfileResponse> => {
  const url = `${API_PROFILES}/register`;

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

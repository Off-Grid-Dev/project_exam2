// Types
import {
  type ApiError,
  type RegisterProfileResponse,
} from '../../types/api/responses';

// Constants
import { API_REGISTER } from '../constants';

// Types (payload)
import { type RegisterProfilePayload } from '../../types/api/profile';

export const registerUser = async (
  payload: RegisterProfilePayload,
): Promise<RegisterProfileResponse> => {
  const url = `${API_REGISTER}`;

  const response = await fetch(url, {
    method: 'POST',
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

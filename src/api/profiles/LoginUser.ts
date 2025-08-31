import { type ApiError } from '../../types/api/responses';
import { API_LOGIN } from '../api';
import type { LoginProfileResponse } from '../../types/api/responses';
import type { LoginProfilePayload } from '../../types/api/profile';

export const loginUser = async (
  payload: LoginProfilePayload,
): Promise<LoginProfileResponse> => {
  const url = `${API_LOGIN}?_holidaze=true`;

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
    throw new Error(`Could not log you in: ${response.status} - ${message}`);
  }

  console.log('Sending login payload to API:', payload);

  return response.json();
};

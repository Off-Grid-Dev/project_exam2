// Types
import type { LoginProfileResponse } from '../types/api/responses';

// Token helpers
export function storeToken(response: LoginProfileResponse) {
  console.log('setting accessToken to localStorage');
  localStorage.setItem('accessToken', response.data.accessToken);
}

export function clearToken() {
  console.log('removing accessToken from localStaorage');
  localStorage.removeItem('accessToken');
}

export function getToken() {
  const token = localStorage.getItem('accessToken');
  return token;
}

export const isTokenValid = (token: unknown): boolean => {
  return typeof token === 'string' && token.trim() !== '';
};

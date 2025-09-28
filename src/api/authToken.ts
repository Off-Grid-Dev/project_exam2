// Types
import type { LoginProfileResponse } from '../types/api/responses';

// Token helpers
export function storeToken(response: LoginProfileResponse) {
  console.log('setting accessToken to localStorage');
  localStorage.setItem('accessToken', response.data.accessToken);
  if (response.data.name) {
    localStorage.setItem('accessName', response.data.name);
  }
  if (response.data.venueManager) {
    localStorage.setItem('venueManager', String(response.data.venueManager));
  }
}

export function clearToken() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('accessName');
  localStorage.removeItem('venueManager');
}

export function getToken() {
  const token = localStorage.getItem('accessToken');
  return token;
}

export function getStoredName() {
  const name = localStorage.getItem('accessName');
  return name ?? undefined;
}

export function getStoredVenueManager() {
  const isVenueManager = localStorage.getItem('venueManager');
  return isVenueManager === 'true' ? true : false;
}

export const isTokenValid = (token: unknown): boolean => {
  return typeof token === 'string' && token.trim() !== '';
};

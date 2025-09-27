import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  storeToken,
  clearToken,
  getToken,
  getStoredName,
  getStoredVenueManager,
  isTokenValid,
} from '../authToken';
import type { LoginProfileResponse } from '../../types/api/responses';

// Minimal LoginProfileResponse generator used by storeToken
const makeLoginResponse = (
  overrides: Partial<LoginProfileResponse['data']> = {},
): LoginProfileResponse => ({
  data: {
    accessToken: 'token-123',
    name: 'tester',
    email: 'tester@example.com',
    avatar: { url: 'https://example.com/avatar.jpg', alt: 'avatar' },
    banner: { url: 'https://example.com/banner.jpg', alt: 'banner' },
    venueManager: false,
    ...overrides,
  },
  meta: {},
});

describe('authToken helpers', () => {
  const originalLocalStorage = Object.fromEntries(
    Object.keys(window.localStorage).map((k) => [
      k,
      window.localStorage.getItem(k),
    ]),
  );

  beforeEach(() => {
    // clear before each test
    localStorage.clear();
  });

  afterEach(() => {
    // restore original storage
    Object.keys(originalLocalStorage).forEach((k) => {
      const val = (originalLocalStorage as Record<string, string | null>)[k];
      if (val === null || val === undefined) {
        localStorage.removeItem(k);
      } else {
        localStorage.setItem(k, val);
      }
    });
  });

  it('storeToken stores accessToken, name and venueManager correctly', () => {
    const resp = makeLoginResponse();
    storeToken(resp);

    expect(localStorage.getItem('accessToken')).toBe('token-123');
    expect(localStorage.getItem('accessName')).toBe('tester');
    // implementation only writes venueManager when truthy
    expect(localStorage.getItem('venueManager')).toBeNull();

    // when venueManager is true it should be stored as 'true'
    const resp2 = makeLoginResponse({ venueManager: true });
    storeToken(resp2);
    expect(localStorage.getItem('venueManager')).toBe('true');
  });

  it('storeToken does not crash when optional fields are missing', () => {
    const resp = makeLoginResponse({ accessToken: 't2', name: '' });
    storeToken(resp);
    expect(localStorage.getItem('accessToken')).toBe('t2');
    // name and venueManager absent
    expect(localStorage.getItem('accessName')).toBeNull();
    expect(localStorage.getItem('venueManager')).toBeNull();
  });

  it('clearToken removes accessToken from localStorage', () => {
    localStorage.setItem('accessToken', 'will-be-removed');
    clearToken();
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('getToken returns stored token or undefined', () => {
    expect(getToken()).toBeNull();
    localStorage.setItem('accessToken', 'tok-99');
    expect(getToken()).toBe('tok-99');
  });

  it('getStoredName returns name or undefined', () => {
    expect(getStoredName()).toBeUndefined();
    localStorage.setItem('accessName', 'alice');
    expect(getStoredName()).toBe('alice');
  });

  it('getStoredVenueManager interprets stored value correctly', () => {
    expect(getStoredVenueManager()).toBe(false);
    localStorage.setItem('venueManager', 'true');
    expect(getStoredVenueManager()).toBe(true);
    localStorage.setItem('venueManager', 'false');
    expect(getStoredVenueManager()).toBe(false);
    localStorage.removeItem('venueManager');
    expect(getStoredVenueManager()).toBe(false);
  });

  it('isTokenValid returns correct boolean for various inputs', () => {
    expect(isTokenValid(undefined)).toBe(false);
    expect(isTokenValid(null)).toBe(false);
    expect(isTokenValid('')).toBe(false);
    expect(isTokenValid('   ')).toBe(false);
    expect(isTokenValid('valid-token')).toBe(true);
    // non-string
    expect(isTokenValid(123 as unknown)).toBe(false);
  });
});

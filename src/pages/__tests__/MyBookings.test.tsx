import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import MyBookings from '../MyBookings';
import ContextProvider from '../../context/ContextProvider';
import * as api from '../../api/api';
import type { BookingsResponse } from '../../types/api/responses';
import {
  mockBookingsResponse,
  mockAccessToken,
} from '../../api/__tests__/testUtils';

describe('MyBookings page', () => {
  const originalLocalStorage = Object.fromEntries(
    Object.keys(window.localStorage).map((k) => [
      k,
      window.localStorage.getItem(k),
    ]),
  );

  beforeEach(() => {
    vi.restoreAllMocks();
    // ensure a clean DOM
    localStorage.clear();
  });

  afterEach(() => {
    // restore localStorage content
    Object.keys(originalLocalStorage).forEach((k) => {
      const val = (originalLocalStorage as Record<string, string | null>)[k];
      if (val === null || val === undefined) {
        localStorage.removeItem(k);
      } else {
        localStorage.setItem(k, val);
      }
    });
  });

  it('renders bookings when API returns data', async () => {
    // mock stored name and token
    localStorage.setItem('accessName', 'testuser');
    localStorage.setItem('accessToken', mockAccessToken);

    // mock fetchBookings
    const spy = vi
      .spyOn(api, 'fetchBookings')
      .mockResolvedValueOnce(
        mockBookingsResponse as unknown as BookingsResponse,
      );

    render(
      <ContextProvider>
        <MyBookings />
      </ContextProvider>,
    );

    expect(screen.getByText(/My bookings/i)).toBeTruthy();

    await waitFor(() => expect(spy).toHaveBeenCalled());
    // booking item should be rendered
    expect(screen.getByText(/From:/i)).toBeTruthy();
  });

  it('shows error when not logged in', async () => {
    // ensure no token/name in localStorage
    localStorage.removeItem('accessName');
    localStorage.removeItem('accessToken');

    render(
      <ContextProvider>
        <MyBookings />
      </ContextProvider>,
    );

    await waitFor(() =>
      expect(
        screen.getByText(/You must be logged in to view your bookings/i),
      ).toBeTruthy(),
    );
  });

  it('shows error when API throws', async () => {
    localStorage.setItem('accessName', 'testuser');
    localStorage.setItem('accessToken', mockAccessToken);

    const spy = vi
      .spyOn(api, 'fetchBookings')
      .mockRejectedValueOnce(new Error('API failed'));

    render(
      <ContextProvider>
        <MyBookings />
      </ContextProvider>,
    );

    await waitFor(() => expect(spy).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText(/API failed/i)).toBeTruthy());
  });
});

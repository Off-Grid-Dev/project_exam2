/* eslint-env vitest */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import ContextProvider from '../../../context/ContextProvider';

// Ensure the component imports the real module but we'll mock the fetch call
vi.mock('../../../api/api', async () => {
  const actual = await vi.importActual('../../../api/api');
  return {
    ...actual,
    fetchVenues: vi.fn().mockResolvedValue({}),
  };
});

import CreateVenueForm from '../CreateVenue';

describe('CreateVenue form', () => {
  beforeEach(() => {
    // Ensure manager flag is present so the form renders inside ManagerProvider
    localStorage.setItem('venueManager', 'true');
    localStorage.setItem('accessToken', 'test-token');
    vi.clearAllMocks();
  });

  test('submits required fields and calls fetchVenues with token and payload', async () => {
    render(
      <ContextProvider>
        <CreateVenueForm />
      </ContextProvider>,
    );

    // Fill required name field
    const nameInput = screen.getByLabelText(/Name/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'My Venue' } });

    // optional description
    const descInput = screen.getByLabelText(/Description/i) as HTMLInputElement;
    fireEvent.change(descInput, { target: { value: 'Nice place' } });

    // Submit the form and wait for API + toast
    const submitBtn = screen.getByRole('button', { name: /Create venue/i });

    fireEvent.click(submitBtn);

    // assert fetchVenues was called with ApiFunctions.CreateVenue and token
    const api = await import('../../../api/api');
    await waitFor(() =>
      expect(api.fetchVenues).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          token: 'test-token',
          venuePayload: expect.objectContaining({
            name: 'My Venue',
            description: 'Nice place',
          }),
        }),
      ),
    );

    // wait for toast update caused by ToastProvider to avoid act() warnings
    await waitFor(() =>
      expect(screen.getByText(/Venue created/i)).toBeInTheDocument(),
    );
  });
});

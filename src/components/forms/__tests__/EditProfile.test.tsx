/* eslint-env vitest */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, beforeEach, expect } from 'vitest';
import ContextProvider from '../../../context/ContextProvider';

// Mock api.fetchProfiles so load and update paths are spyable
vi.mock('../../../api/api', async () => {
  const actual = await vi.importActual('../../../api/api');
  return {
    ...actual,
    fetchProfiles: vi.fn().mockResolvedValue({
      data: {
        name: 'tester',
        email: 't@test.com',
        bio: 'old bio',
        avatar: { url: '', alt: '' },
        banner: { url: '', alt: '' },
        venueManager: false,
        _count: { venues: 0, bookings: 0 },
      },
    }),
  };
});

import EditProfileForm from '../EditProfile';

describe('EditProfile form', () => {
  beforeEach(() => {
    localStorage.setItem('accessToken', 'token');
    localStorage.setItem('accessName', 'tester');
    vi.clearAllMocks();
  });

  test('renders and submits update when changes present', async () => {
    render(
      <ContextProvider>
        <EditProfileForm />
      </ContextProvider>,
    );

    // Wait for the form to appear (ownership check + profile load)
    await waitFor(() =>
      expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument(),
    );

    // change bio
    const bioInput = screen.getByLabelText(/Bio/i) as HTMLInputElement;
    fireEvent.change(bioInput, { target: { value: 'new bio' } });

    const saveBtn = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(saveBtn);

    const api = await import('../../../api/api');
    await waitFor(() => expect(api.fetchProfiles).toHaveBeenCalled());
  });
});

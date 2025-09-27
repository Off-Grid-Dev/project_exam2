/* eslint-env vitest */
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, beforeEach, expect } from 'vitest';
import ContextProvider from '../../context/ContextProvider';

vi.mock('../../api/api', async () => {
  const actual = await vi.importActual('../../api/api');
  return {
    ...actual,
    fetchProfiles: vi.fn().mockResolvedValue({
      data: [
        {
          name: 'a',
          email: 'a@a.com',
          bio: '',
          venueManager: false,
          _count: {},
        },
        {
          name: 'b',
          email: 'b@b.com',
          bio: '',
          venueManager: false,
          _count: {},
        },
      ],
      meta: { isFirstPage: true, isLastPage: true },
    }),
  };
});

import ProfilesPage from '../Profiles';

describe('Profiles page', () => {
  beforeEach(() => {
    localStorage.setItem('accessToken', 't');
    vi.clearAllMocks();
  });

  test('renders list of profiles', async () => {
    render(
      <ContextProvider>
        <ProfilesPage />
      </ContextProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText(/Profiles/i)).toBeInTheDocument(),
    );
    expect(await screen.findByText('a')).toBeInTheDocument();
    expect(await screen.findByText('b')).toBeInTheDocument();
  });
});

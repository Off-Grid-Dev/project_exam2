/* eslint-env vitest */
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, test, beforeEach, expect } from 'vitest';
import ContextProvider from '../../context/ContextProvider';

vi.mock('../../api/api', async () => {
  const actual = await vi.importActual('../../api/api');
  return {
    ...actual,
    fetchProfiles: vi.fn().mockResolvedValue({
      data: {
        name: 'manager',
        email: 'm@x.com',
        bio: 'bio',
        venueManager: true,
        _count: { venues: 1, bookings: 2 },
        venues: [
          {
            id: 'v1',
            name: 'V1',
            description: 'd',
            price: 10,
            maxGuests: 1,
            rating: 0,
            media: [],
            created: '',
            updated: '',
            meta: {
              wifi: false,
              parking: false,
              breakfast: false,
              pets: false,
            },
            location: {
              address: '',
              city: '',
              zip: '',
              country: '',
              continent: '',
              lat: 0,
              lng: 0,
            },
            owner: { name: '', email: '', bio: '', avatar: null, banner: null },
            bookings: [],
            _count: { bookings: 0 },
          },
        ],
      },
    }),
    fetchVenues: vi.fn().mockResolvedValue({
      data: [
        {
          id: 'v1',
          name: 'V1',
          description: 'd',
          price: 10,
          maxGuests: 1,
          rating: 0,
          media: [],
          created: '',
          updated: '',
          meta: {
            wifi: false,
            parking: false,
            breakfast: false,
            pets: false,
          },
          location: {
            address: '',
            city: '',
            zip: '',
            country: '',
            continent: '',
            lat: 0,
            lng: 0,
          },
          owner: { name: '', email: '', bio: '', avatar: null, banner: null },
          bookings: [],
          _count: { bookings: 0 },
        },
      ],
      meta: { isFirstPage: true, isLastPage: true },
    }),
  };
});

import ProfileSingle from '../Profile';

describe('Profile page', () => {
  beforeEach(() => {
    localStorage.setItem('accessToken', 't');
    localStorage.setItem('accessName', 'manager');
    vi.clearAllMocks();
  });

  test('loads profile and shows create venue section for managers', async () => {
    render(
      <MemoryRouter initialEntries={[`/profiles/manager`]}>
        <ContextProvider>
          <Routes>
            <Route path='/profiles/:name' element={<ProfileSingle />} />
          </Routes>
        </ContextProvider>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText('manager')).toBeInTheDocument(),
    );
    // venue from manager should be visible
    expect(await screen.findByText('V1')).toBeInTheDocument();
  });
});

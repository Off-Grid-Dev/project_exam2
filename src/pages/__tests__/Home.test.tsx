/* eslint-env vitest */

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, test, expect } from 'vitest';
import ContextProvider from '../../context/ContextProvider';
import { Home } from '../Home';

// mock fetchVenues from api
vi.mock('../../api/api', async () => {
  const actual = await vi.importActual('../../api/api');
  return {
    ...actual,
    fetchVenues: vi.fn().mockResolvedValue({
      data: [
        {
          id: 'v1',
          name: 'Test Venue 1',
          description: 'Desc 1',
          media: [],
          price: 50,
          maxGuests: 4,
          rating: 0,
          created: '',
          updated: '',
          meta: { wifi: false, parking: false, breakfast: false, pets: false },
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

describe('Home page', () => {
  test('renders heading and fetched venues', async () => {
    render(
      <MemoryRouter>
        <ContextProvider>
          <Home />
        </ContextProvider>
      </MemoryRouter>,
    );

    // check heading specifically (avoid matching 'Loading venues...')
    expect(
      screen.getByRole('heading', { name: /Venues/i }),
    ).toBeInTheDocument();

    // wait for async fetch and list rendering
    await screen.findByText('Test Venue 1');
  });
});

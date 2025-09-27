/* eslint-env vitest */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, test, expect } from 'vitest';
import ContextProvider from '../../context/ContextProvider';

// Mock the api module used by Venue
vi.mock('../../api/api', async () => {
  const actual = await vi.importActual('../../api/api');
  return {
    ...actual,
    fetchVenues: vi.fn().mockResolvedValue({
      data: {
        id: 'v1',
        name: 'My Test Venue',
        description: 'A lovely place',
        media: [{ url: '', alt: 'img' }],
        price: 120,
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
      meta: { isFirstPage: true, isLastPage: true },
    }),
    fetchBookings: vi.fn().mockResolvedValue({}),
  };
});

// Stub Calendar to provide a simple button that triggers the range select handler
vi.mock('../../components/Calendar', async () => {
  const ReactModule = await vi.importActual('react');
  const rm = ReactModule as unknown as Record<string, unknown>;
  const React =
    'default' in rm
      ? (rm['default'] as typeof import('react'))
      : (rm as unknown as typeof import('react'));
  return {
    default: (props: {
      onRangeSelect: (start: string, end: string, conflicts: unknown[]) => void;
    }) =>
      React.createElement(
        'button',
        {
          onClick: () =>
            props.onRangeSelect(
              '2025-10-01T00:00:00.000Z',
              '2025-10-05T00:00:00.000Z',
              [],
            ),
        },
        'Select range',
      ),
  };
});

describe('Venue page', () => {
  test('loads venue, selects dates and submits a booking', async () => {
    const { default: Venue } = await import('../Venue');
    render(
      <MemoryRouter initialEntries={['/venues/v1']}>
        <ContextProvider>
          <Routes>
            <Route path='/venues/:id' element={<Venue />} />
          </Routes>
        </ContextProvider>
      </MemoryRouter>,
    );

    // wait for venue name to appear
    expect(await screen.findByText('My Test Venue')).toBeInTheDocument();

    // initial message asks to select a start and end date
    expect(
      screen.getByText(
        /Please select a start and end date from the calendar above/i,
      ),
    ).toBeInTheDocument();

    // click the stubbed calendar button to select dates
    const selectBtn = screen.getByText('Select range');
    fireEvent.click(selectBtn);

    // After selecting a range the selected dates text should be present
    expect(screen.getByText(/2025/)).toBeInTheDocument();

    // Book button should now be enabled
    const bookBtn = screen.getByRole('button', { name: /book/i });
    expect(bookBtn).toBeEnabled();

    // Click book and assert fetchBookings was called (wait for ToastProvider updates)
    fireEvent.click(bookBtn);
    const api = await import('../../api/api');
    await waitFor(() => expect(api.fetchBookings).toHaveBeenCalled());
  });
});

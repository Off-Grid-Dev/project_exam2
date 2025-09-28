/* eslint-env vitest */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import EditVenueForm from '../EditVenue';
import ContextProvider from '../../../../src/context/ContextProvider';
import { storeToken } from '../../../../src/api/authToken';
import type { Venue as VenueType } from '../../../../src/types/api/venue';
import type { LoginProfileResponse } from '../../../../src/types/api/responses';
import { fetchVenues } from '../../../../src/api/api';

// Mock fetchVenues
vi.mock('../../../../src/api/api', async () => {
  const actual = await vi.importActual('../../../../src/api/api');
  return {
    ...actual,
    fetchVenues: vi.fn().mockResolvedValue({ data: { id: 'v1' } }),
  };
});

// Minimal venue object for tests
const venue = {
  id: 'v1',
  name: 'Test Venue',
  description: 'desc',
  media: [],
  price: 10,
  maxGuests: 2,
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
  owner: {
    name: '',
    email: '',
    bio: '',
    avatar: { url: '', alt: '' },
    banner: { url: '', alt: '' },
  },
  bookings: [],
  _count: { bookings: 0 },
};

describe('EditVenueForm', () => {
  beforeEach(() => {
    // clear token
    localStorage.clear();
  });

  test('shows validation toast when name missing', async () => {
    // render with empty name via venue override
    const v: VenueType = { ...venue, name: '' } as VenueType;
    render(
      <ContextProvider>
        <EditVenueForm venue={v} />
      </ContextProvider>,
    );

    // submit the form directly to bypass browser HTML5 validation (click may be
    // blocked by the required attribute in the test DOM). Find the save button
    // then submit its closest form element.
    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    const form = saveBtn.closest('form') as HTMLFormElement | null;
    if (!form) throw new Error('Could not find form element to submit in test');
    fireEvent.submit(form);

    // findByText will wait for the toast to be scheduled and rendered
    const toasts = await screen.findAllByText(
      /Please provide at least a name/i,
    );
    expect(toasts.length).toBeGreaterThan(0);
  });

  test('submits payload when token present and calls API', async () => {
    // store a fake token so form will attempt to submit
    const loginResp: LoginProfileResponse = {
      data: {
        accessToken: 'tok',
        name: 'me',
        venueManager: false,
        email: '',
        avatar: { url: '', alt: '' },
        banner: { url: '', alt: '' },
      },
      meta: {},
    };
    storeToken(loginResp);

    const onSaved = vi.fn();

    render(
      <ContextProvider>
        <EditVenueForm venue={venue as VenueType} onSaved={onSaved} />
      </ContextProvider>,
    );

    // change name field
    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    const saveBtn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(saveBtn);

    await waitFor(() => expect(fetchVenues).toHaveBeenCalled());
    // ensure onSaved invoked after successful update
    await waitFor(() => expect(onSaved).toHaveBeenCalled());
  });
});

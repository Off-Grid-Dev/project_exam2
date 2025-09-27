import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

let navigate = vi.fn();

const baseVenue = {
  id: 'v1',
  name: 'Test Venue',
  description: 'desc',
  media: [{ url: 'https://example.com/img.jpg', alt: 'img' }],
  price: 100,
  maxGuests: 2,
  rating: 4.5,
  created: '',
  updated: '',
  meta: { wifi: true, parking: false, breakfast: true, pets: false },
  location: {
    address: 'addr',
    city: 'city',
    zip: 'zip',
    country: 'cty',
    continent: 'ct',
    lat: 0,
    lng: 0,
  },
  owner: {
    name: 'owner',
    email: 'o@e',
    bio: '',
    avatar: { url: '', alt: '' },
    banner: { url: '', alt: '' },
  },
  bookings: [],
  _count: { bookings: 0 },
};

describe('VenueCard', () => {
  it('renders venue info and image', async () => {
    const { VenuesCard } = await import('../venues/VenueCard');
    render(
      <BrowserRouter>
        <VenuesCard {...baseVenue} />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Test Venue/i)).toBeDefined();
    expect(screen.getByText(/Price:/i)).toBeDefined();
    expect(screen.getByAltText(/img/i)).toBeDefined();
  });

  it('shows invalid image placeholder when url is invalid', async () => {
    const badVenue = { ...baseVenue, media: [{ url: 'not-a-url', alt: '' }] };
    const { VenuesCard } = await import('../venues/VenueCard');
    render(
      <BrowserRouter>
        <VenuesCard {...badVenue} />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Invalid image/i)).toBeDefined();
  });

  it('navigates to venue page on book button click', async () => {
    navigate = vi.fn();
    // mock useNavigate (dynamic mock uses the top-level `navigate` variable)
    vi.mock('react-router-dom', async () => ({
      ...(await vi.importActual('react-router-dom')),
      useNavigate: () => navigate,
    }));

    // re-import component after mock
    const { VenuesCard } = await import('../venues/VenueCard');
    render(
      <BrowserRouter>
        <VenuesCard {...baseVenue} />
      </BrowserRouter>,
    );

    const btn = screen.getByRole('button', { name: /Book now/i });
    fireEvent.click(btn);
    expect(navigate).toHaveBeenCalledWith('/venues/v1');
  });
});

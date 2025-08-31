import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../api/AuthContext';
import { Home } from '../Home';

// Mock the API
vi.mock('../../api/api', () => ({
  getData: vi.fn().mockResolvedValue({ data: [] }),
  ApiFunctions: {
    GetVenues: 'get venues',
    GetVenuesById: 'get venues by id',
    GetVenuesBySearch: 'search venues',
  },
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>,
  );
};

describe('Home Component', () => {
  it('renders the home page with title', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('Project exam 2')).toBeInTheDocument();
  });

  it('renders venue search inputs', () => {
    renderWithProviders(<Home />);
    
    // Check for inputs by their names using container queries
    const container = document.body;
    expect(container.querySelector('input[name="venueID"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="venueQuery"]')).toBeInTheDocument();
  });

  it('renders search buttons', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('Fetch Venue By ID')).toBeInTheDocument();
    expect(screen.getByText('Search for Venues')).toBeInTheDocument();
  });
});
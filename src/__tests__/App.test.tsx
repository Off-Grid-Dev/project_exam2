/* eslint-env vitest */

import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';

// Ensure App uses our mocked api to avoid real network calls
vi.mock('../api/api', async () => {
  const actual = await vi.importActual('../api/api');
  return {
    ...actual,
    fetchVenues: vi.fn().mockResolvedValue({
      data: [],
      meta: { isFirstPage: true, isLastPage: true },
    }),
  };
});

import App from '../App';

describe('App top-level smoke', () => {
  test('renders header and Home route content', async () => {
    // App's BrowserRouter uses basename '/project_exam2' — ensure test location matches
    window.history.pushState({}, 'Test', '/project_exam2/');
    render(<App />);

    // Header brand should be present
    expect(screen.getByText(/HOLIDAZE/i)).toBeInTheDocument();

    // Home page has a Venues heading
    expect(
      await screen.findByRole('heading', { name: /Venues/i }),
    ).toBeInTheDocument();
  });
});

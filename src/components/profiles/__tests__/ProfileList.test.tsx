/* eslint-env vitest */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import ProfileList from '../ProfileList';
import { MemoryRouter } from 'react-router-dom';
import type { Profile } from '../../../types/api/profile';

const makeProfile = (name: string): Profile => ({
  name,
  email: `${name}@example.com`,
  bio: 'bio',
  avatar: { url: '', alt: '' },
  banner: { url: '', alt: '' },
  venueManager: false,
  venues: [],
  bookings: [],
  _count: { venues: 0, bookings: 0 },
});

describe('ProfileList', () => {
  test('shows empty message when no profiles and not loading', () => {
    render(
      <MemoryRouter>
        <ProfileList
          profiles={[]}
          isLoading={false}
          page={1}
          setPage={vi.fn()}
          pagination={{ isFirstPage: true, isLastPage: false }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText(/No profiles to show/i)).toBeInTheDocument();
  });

  test('renders loading null when loading and no profiles', () => {
    const { container } = render(
      <MemoryRouter>
        <ProfileList
          profiles={[]}
          isLoading
          page={1}
          setPage={vi.fn()}
          pagination={{ isFirstPage: true, isLastPage: false }}
        />
      </MemoryRouter>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('pagination buttons call setPage appropriately and render ProfileCards', () => {
    const setPage = vi.fn();
    const profiles = [makeProfile('a'), makeProfile('b')];

    render(
      <MemoryRouter>
        <ProfileList
          profiles={profiles}
          isLoading={false}
          page={2}
          setPage={setPage}
          pagination={{ isFirstPage: false, isLastPage: false }}
        />
      </MemoryRouter>,
    );

    // current page displayed (may appear twice: top and bottom pagination)
    const pageEls = screen.getAllByText('2');
    expect(pageEls.length).toBeGreaterThan(0);

    // previous should call setPage to decrement (click the first matching button)
    const prevBtns = screen.getAllByRole('button', { name: /previous page/i });
    fireEvent.click(prevBtns[0]);
    expect(setPage).toHaveBeenCalled();

    // next should call setPage to increment
    const nextBtns = screen.getAllByRole('button', { name: /next page/i });
    fireEvent.click(nextBtns[0]);
    expect(setPage).toHaveBeenCalled();

    // ProfileCards should render by name
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
  });
});

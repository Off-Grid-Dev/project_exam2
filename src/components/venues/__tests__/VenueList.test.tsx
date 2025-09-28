import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContextProvider from '../../../context/ContextProvider';
import { VenuesList } from '../VenueList';
import type { Venue } from '../../../types/api/venue';
import type { Dispatch, SetStateAction } from 'react';
import { describe, test, expect } from 'vitest';

const makeVenue = (id: number) => ({
  id: String(id),
  name: `Venue ${id}`,
  description: `desc ${id}`,
  media: [],
  price: 100,
  maxGuests: 10,
  meta: { wifi: false },
  location: { address: '', city: '', zip: '', country: '' },
});

describe('VenuesList', () => {
  test('shows no venues message when empty and not loading', () => {
    render(
      <ContextProvider>
        <VenuesList
          venues={[]}
          isLoading={false}
          page={1}
          setPage={() => {}}
          pagination={{ isFirstPage: true, isLastPage: true }}
        />
      </ContextProvider>,
    );

    expect(screen.getByText(/No venues to show/i)).toBeInTheDocument();
  });

  test('renders venues and pagination buttons work', () => {
    const venues: Venue[] = [
      makeVenue(1) as unknown as Venue,
      makeVenue(2) as unknown as Venue,
    ];
    let page = 1;
    const setPage: Dispatch<SetStateAction<number>> = (
      fn: ((prev: number) => number) | number,
    ) => {
      // mimic functional updater
      page = typeof fn === 'function' ? fn(page) : fn;
    };

    const { rerender } = render(
      <MemoryRouter>
        <ContextProvider>
          <VenuesList
            venues={venues}
            isLoading={false}
            page={page}
            setPage={setPage}
            pagination={{ isFirstPage: false, isLastPage: false }}
          />
        </ContextProvider>
      </MemoryRouter>,
    );

    // page number is shown (can appear in pagination twice: top and bottom)
    const pageEls = screen.getAllByText('1');
    expect(pageEls.length).toBeGreaterThan(0);

    const nextBtns = screen.getAllByRole('button', { name: /next page/i });
    const next = nextBtns[0];
    fireEvent.click(next);
    // clicking next should update page to 2 via setPage
    expect(page).toBe(2);
    // re-render component so its page prop updates and previous button logic runs correctly
    rerender(
      <MemoryRouter>
        <ContextProvider>
          <VenuesList
            venues={venues}
            isLoading={false}
            page={page}
            setPage={setPage}
            pagination={{ isFirstPage: false, isLastPage: false }}
          />
        </ContextProvider>
      </MemoryRouter>,
    );

    const previousBtns = screen.getAllByRole('button', {
      name: /previous page/i,
    });
    const previous = previousBtns[0];
    fireEvent.click(previous);
    // clicking previous should decrement back to 1
    expect(page).toBe(1);

    // venue names rendered
    expect(screen.getByText('Venue 1')).toBeInTheDocument();
    expect(screen.getByText('Venue 2')).toBeInTheDocument();
  });
});

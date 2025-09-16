import {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  type ChangeEvent,
} from 'react';
import { fetchVenues } from '../api/api.ts';
import { VenuesList } from '../components/venues/VenueList.tsx';
import { type Venue } from '../types/api/venue.ts';
import type { VenuesResponse } from '../types/api/responses.ts';
import { ApiFunctions } from '../api/apiFunctionsEnum.ts';
import { useBreakpoint } from '../context/ui/useBreakpoint';
import type { Breakpoint } from '../context/ui/BreakpointContext';
import {
  createClassOptions,
  composeClasses,
  type SlotMap,
  getClassForSlot,
} from '../context/ui/classOptionsTemplate';

export const Home = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venueQuery, setVenueQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [error, setError] = useState<string | null>(null);

  const { GetVenues, GetVenueBySearch } = ApiFunctions;

  function handleVenueQueryUpdate(e: ChangeEvent<HTMLInputElement>) {
    setVenueQuery(e.target.value);
  }

  async function handleVenueSearch() {
    setError(null);
    const query = venueQuery.trim();
    if (!query) {
      setError('Please enter a search term');
      return;
    }

    setIsLoading(true);
    try {
      const res = (await fetchVenues(GetVenueBySearch, {
        q: query,
      })) as VenuesResponse | undefined;
      if (!res) {
        setVenues([]);
        return;
      }

      const data = res.data;
      setVenues(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  }

  function handleSortUpdate(e: ChangeEvent<HTMLSelectElement>) {
    const sortValue = e.currentTarget.value;
    setSortValue(sortValue);
  }

  function handleSortOrderUpdate(e: ChangeEvent<HTMLSelectElement>) {
    const sortOrderValue = e.currentTarget.value;
    setSortOrder(sortOrderValue);
  }

  const normalizeVenueReturn = useCallback(async () => {
    setIsLoading(true);
    let res;
    if (sortValue === '') {
      res = (await fetchVenues(GetVenues)) as VenuesResponse;
    } else {
      res = (await fetchVenues(GetVenues, {
        sort: sortValue,
        sortOrder,
      })) as VenuesResponse;
    }
    if (!res) {
      setVenues([]);
      setIsLoading(false);
      return;
    }
    const data = res.data;
    setVenues(Array.isArray(data) ? data : [data]);
    setIsLoading(false);
  }, [GetVenues, sortValue, sortOrder]);

  useEffect(() => {
    void normalizeVenueReturn();
  }, [normalizeVenueReturn]);

  useLayoutEffect(() => {
    void normalizeVenueReturn();
  }, [normalizeVenueReturn]);

  // --- Example slot-based ClassOptions for the top-level page container
  type HomeSlots = 'root' | 'title' | 'form' | 'input' | 'button';

  const slotMap: SlotMap<HomeSlots> = {
    root: createClassOptions({
      desktopStyles: 'mt-12 mb-12 grid justify-center gap-6',
      tabletStyles: 'mt-10 mb-10 gap-4 px-6',
      mobileStyles: 'mt-6 mb-6 gap-3 px-4',
    }),
    title: createClassOptions({
      desktopStyles: 'text-heading mt-4 font-semibold text-text-dark',
      tabletStyles: 'text-xl font-semibold text-text-dark',
      mobileStyles: 'text-lg font-semibold text-text-dark',
    }),
    form: createClassOptions({
      desktopStyles: 'flex gap-4 items-center',
      tabletStyles: 'flex gap-3 flex-wrap justify-center items-center',
      mobileStyles: 'grid gap-3 w-full',
    }),
    input: createClassOptions({
      desktopStyles: 'border border-border-dark p-2 rounded-md w-96',
      tabletStyles: 'border border-border-dark p-2 rounded-md w-64',
      mobileStyles: 'border border-border-dark p-2 rounded-md w-full',
    }),
    button: createClassOptions({
      desktopStyles:
        'cursor-pointer rounded-2xl bg-[var(--color-bg-dark)] text-[var(--color-text-base)] px-4 py-2 hover:bg-[var(--color-bg-med)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
      tabletStyles:
        'cursor-pointer rounded-2xl bg-[var(--color-bg-dark)] text-[var(--color-text-base)] px-3 py-2 hover:bg-[var(--color-bg-med)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
      mobileStyles:
        'w-full cursor-pointer rounded-2xl bg-[var(--color-bg-dark)] text-[var(--color-text-base)] px-3 py-2 hover:bg-[var(--color-bg-med)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
    }),
  };

  const { breakpoint } = useBreakpoint();
  const bp = breakpoint as Breakpoint;

  const rootClass = composeClasses(
    getClassForSlot(bp, slotMap, 'root'),
    'bg-[var(--color-base-100)]',
  );
  const titleClass = composeClasses(getClassForSlot(bp, slotMap, 'title'));
  const formClass = composeClasses(getClassForSlot(bp, slotMap, 'form'));
  const inputClass = composeClasses(
    getClassForSlot(bp, slotMap, 'input'),
    'text-[var(--color-text-dark)] placeholder:text-[var(--color-text-deactivated)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
  );
  const buttonClass = composeClasses(getClassForSlot(bp, slotMap, 'button'));

  return (
    <>
      <div className={rootClass}>
        <h1 className={titleClass}>Venues</h1>
        <form
          className={formClass}
          onSubmit={(e) => {
            e.preventDefault();
            void handleVenueSearch();
          }}
        >
          <input
            aria-label='Enter a search query to refine the list of venues.'
            type='text'
            name='venueQuery'
            id='venueQuery'
            value={venueQuery}
            onChange={handleVenueQueryUpdate}
            className={inputClass}
          />
          <button type='submit' className={buttonClass}>
            Search for Venues
          </button>
          <select
            aria-label='Sort venues by attributes'
            value={sortValue}
            onChange={(e) => handleSortUpdate(e)}
            className={composeClasses(inputClass, 'bg-base-100')}
          >
            <option value=''>Sort by</option>
            <option value='name'>Venue name</option>
            <option value='price'>Venue price</option>
            <option value='maxGuests'>Maximum guests</option>
            <option value='rating'>Ratings</option>
          </select>
          <select
            aria-label='Define sort order'
            value={sortOrder}
            onChange={(e) => handleSortOrderUpdate(e)}
            className={composeClasses(inputClass, 'bg-base-100')}
          >
            <option value='asc'>Ascending</option>
            <option value='desc'>Descending</option>
          </select>
        </form>
      </div>
      <VenuesList venues={venues} isLoading={isLoading} />
      {isLoading && <p className='text-center'>Loading venues...</p>}
      {error && <p className='text-center text-red-600'>Error: {error}</p>}
    </>
  );
};

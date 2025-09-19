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
import { Wrapper } from '../components/layout/Wrapper.tsx';
import Button from '../components/Button.tsx';

export const Home = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venueQuery, setVenueQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('asc');

  const { GetVenues, GetVenueBySearch } = ApiFunctions;

  function handleVenueQueryUpdate(e: ChangeEvent<HTMLInputElement>) {
    setVenueQuery(e.target.value);
  }

  async function handleVenueSearch() {
    const query = venueQuery.trim();
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
      if (
        err &&
        typeof err === 'object' &&
        'message' in err &&
        typeof (err as { message: unknown }).message === 'string'
      ) {
        throw new Error((err as { message: string }).message);
      }
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

  return (
    <Wrapper>
      <h1 className='text-heading text-text-dark font-bold'>Venues</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleVenueSearch();
        }}
        className='mx-auto flex w-fit gap-3'
      >
        <input
          aria-label='Enter a search query to refine the list of venues.'
          type='text'
          name='venueQuery'
          id='venueQuery'
          value={venueQuery}
          onChange={handleVenueQueryUpdate}
          className='border-border-dark focus:outline-border-focus w-96 rounded-sm border-2 px-2 py-2'
          placeholder='Enter search...'
        />
        <Button label='Search for Venues' type='submit' additionalClasses='' />
        <select
          aria-label='Sort venues by attributes'
          value={sortValue}
          onChange={(e) => handleSortUpdate(e)}
          name='sortByVenues'
          className='cursor-pointer'
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
          name='sortOrderVenues'
          className='cursor-pointer'
        >
          <option value='asc'>Ascending</option>
          <option value='desc'>Descending</option>
        </select>
      </form>
      <VenuesList venues={venues} isLoading={isLoading} />
      {isLoading && <p className='text-center'>Loading venues...</p>}
    </Wrapper>
  );
};

import { useEffect, useLayoutEffect, useState, type ChangeEvent } from 'react';
import { fetchVenues } from '../api/api.ts';
import { VenuesList } from '../components/venues/VenueList.tsx';
import { type Venue } from '../types/api/venue.ts';
import type { VenuesResponse } from '../types/api/responses.ts';
import { ApiFunctions } from '../api/apiFunctionsEnum.ts';

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

  async function normalizeVenueReturn() {
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
  }

  useEffect(() => {
    void normalizeVenueReturn();
  }, [sortValue, sortOrder]);

  useLayoutEffect(() => {
    void normalizeVenueReturn();
  }, []);

  return (
    <>
      <div className='mt-8 mb-8 grid justify-center gap-2'>
        <h1 className='mt-1 text-center text-3xl font-semibold text-green-900'>
          Venues
        </h1>
        <form
          className='flex gap-4'
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
            className='border border-black p-2'
          />
          <button
            type='submit'
            className='cursor-pointer rounded-2xl bg-blue-800 px-3 py-2 hover:bg-blue-700'
          >
            Search for Venues
          </button>
          <select
            aria-label='Sort venues by attributes'
            value={sortValue}
            onChange={(e) => handleSortUpdate(e)}
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

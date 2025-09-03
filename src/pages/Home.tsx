import { useLayoutEffect, useState, type ChangeEvent } from 'react';
import { getData } from '../api/api.ts';
import { VenuesList } from '../components/venues/VenueList.tsx';
import { type Venue } from '../types/api/venue.ts';
import type { VenuesResponse } from '../types/api/responses.ts';
import { ApiFunctions } from '../types/api/apiFunctionsEnum.ts';

export const Home = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venueID, setVenueID] = useState<string | undefined>(undefined);
  const [venueQuery, setVenueQuery] = useState<string | undefined>(undefined);

  function handleIDUpdate(e: ChangeEvent<HTMLInputElement>) {
    setVenueID(e.target.value.trim());
  }

  function handleVenueSearch(e: ChangeEvent<HTMLInputElement>) {
    setVenueQuery(e.target.value.trim());
  }

  async function normalizeVenueReturn() {
    const res = (await getData(ApiFunctions.GetVenues)) as VenuesResponse;
    if (!res) {
      setVenues([]);
      return;
    }
    const data = res.data;
    setVenues(Array.isArray(data) ? data : [data]);
  }

  useLayoutEffect(() => {
    normalizeVenueReturn();
  }, []);

  return (
    <>
      <div className='grid min-h-screen place-content-center gap-4'>
        <h1 className='mt-8 text-center text-3xl font-semibold text-green-900'>
          Project exam 2
        </h1>
        <input
          type='text'
          name='venueID'
          id='venueID'
          value={venueID}
          onChange={handleIDUpdate}
          className='border border-black p-2'
        />
        <button
          className='cursor-pointer rounded-2xl bg-green-800 px-3 py-2 hover:bg-green-700'
          onClick={() => getData(ApiFunctions.GetVenueById, { id: venueID })}
        >
          Fetch Venue By ID
        </button>
        <input
          type='text'
          name='venueQuery'
          id='venueQuery'
          value={venueQuery}
          onChange={handleVenueSearch}
          className='border border-black p-2'
        />
        <button
          className='cursor-pointer rounded-2xl bg-blue-800 px-3 py-2 hover:bg-blue-700'
          onClick={() =>
            getData(ApiFunctions.GetVenueBySearch, { q: venueQuery })
          }
        >
          Search for Venues
        </button>
      </div>
      <VenuesList venues={venues} />
    </>
  );
};

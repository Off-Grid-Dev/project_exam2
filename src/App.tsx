import { useState, type ChangeEvent } from 'react';
import { getData } from './api/api.ts';

function App() {
  const [venueID, setVenueID] = useState<string | undefined>(undefined);
  const [venueQuery, setVenueQuery] = useState<string | undefined>(undefined);

  function handleIDUpdate(e: ChangeEvent<HTMLInputElement>) {
    setVenueID(e.target.value.trim());
  }

  function handleVenueSearch(e: ChangeEvent<HTMLInputElement>) {
    setVenueQuery(e.target.value.trim());
  }

  return (
    <div className='grid min-h-screen place-content-center gap-4'>
      <h1 className='mt-8 text-center text-3xl font-semibold text-green-900'>
        Project exam 2
      </h1>
      <button
        className='cursor-pointer rounded-2xl bg-amber-800 px-3 py-2 hover:bg-amber-700'
        onClick={() => getData('get venues')}
      >
        Fetch Venues
      </button>
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
        onClick={() => getData('venue by id', { id: venueID })}
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
    </div>
  );
}

export default App;

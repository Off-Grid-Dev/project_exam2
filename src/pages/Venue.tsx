// React imports
import { useCallback, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Components
import { Wrapper } from '../components/layout/Wrapper';

// Local functions / hooks / api
import { fetchVenues } from '../api/api.ts';
import { ApiFunctions } from '../api/apiFunctionsEnum.ts';

// Types
import type { VenuesResponse } from '../types/api/responses.ts';

const Venue = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const { GetVenueById } = ApiFunctions;

  const fetchVenue = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const res = (await fetchVenues(GetVenueById, { id })) as
          | VenuesResponse
          | undefined;
        return res;
      } catch (err) {
        throw new Error(`Could not fetch this venue: ${err}`);
      } finally {
        setIsLoading(false);
      }
    },
    [GetVenueById],
  );

  useLayoutEffect(() => {
    if (typeof id === 'string') fetchVenue(id);
  }, [fetchVenue, id]);

  return (
    <Wrapper>
      {!isLoading && <h1>Venue id: {id}</h1>}
      {isLoading && <p>Loading Venue...</p>}
    </Wrapper>
  );
};

export default Venue;

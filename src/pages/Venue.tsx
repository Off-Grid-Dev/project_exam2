import { useParams } from 'react-router-dom';
import { Wrapper } from '../components/layout/Wrapper';
import { fetchVenues } from '../api/api.ts';
import { type Venue } from '../types/api/venue.ts';
import type { VenuesResponse } from '../types/api/responses.ts';
import { ApiFunctions } from '../api/apiFunctionsEnum.ts';
import { useCallback, useLayoutEffect, useState } from 'react';

const Venue = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const { GetVenueById } = ApiFunctions;

  const fetchVenue = useCallback(async (id: string) => {
    setIsLoading(true);
    let res;
    try {
      res = (await fetchVenues(GetVenueById, { id })) as
        | VenuesResponse
        | undefined;
    } catch (err) {
      throw new Error('Could not fetch this venue');
    } finally {
      setIsLoading(false);
      return res;
    }
  }, []);

  useLayoutEffect(() => {
    if (typeof id === 'string') fetchVenue(id);
  }, []);

  return (
    <Wrapper>
      {!isLoading && <h1>Venue id: {id}</h1>}
      {isLoading && <p>Loading Venue...</p>}
    </Wrapper>
  );
};

export default Venue;

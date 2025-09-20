import { useParams } from 'react-router-dom';
import { Wrapper } from '../components/layout/Wrapper';
import { fetchVenues } from '../api/api.ts';
import type { Venue as VenueType } from '../types/api/venue.ts';
import type { VenuesResponse } from '../types/api/responses.ts';
import { ApiFunctions } from '../api/apiFunctionsEnum.ts';
import { useCallback, useLayoutEffect, useState, type FC } from 'react';

const Venue: FC<VenueType> = () => {
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
      } catch (error) {
        // preserve original error for debugging
        // eslint-disable-next-line no-console
        console.error(error);
        throw new Error('Could not fetch this venue');
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

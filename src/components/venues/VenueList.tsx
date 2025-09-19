import { VenuesCard } from './VenueCard';
import { type Venue } from '../../types/api/venue';
import type { FC } from 'react';
// import { useBreakpoint } from '../../context/ui/useBreakpoint';

type VenuesListType = {
  venues: Venue[];
  isLoading?: boolean;
};

export const VenuesList: FC<VenuesListType> = ({ venues, isLoading }) => {
  if ((!venues || venues.length === 0) && !isLoading) {
    return <p className='text-center'>No venues to show</p>;
  }

  if ((!venues || venues.length === 0) && isLoading) {
    return null;
  }

  return (
    <div>
      {venues.map((venue) => (
        <VenuesCard key={venue.id} {...venue} />
      ))}
    </div>
  );
};

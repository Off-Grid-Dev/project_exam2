import { VenuesCard } from './VenueCard';
import { type Venue } from '../../types/api/venue';
import type { FC } from 'react';

type VenuesListType = {
  venues: Venue[];
  isLoading?: boolean;
};

export const VenuesList: FC<VenuesListType> = ({ venues, isLoading }) => {
  if ((!venues || venues.length === 0) && !isLoading) {
    return <p className='text-center'>No venues to show</p>;
  }

  if ((!venues || venues.length === 0) && isLoading) {
    // while loading, render nothing (the parent can show a loading indicator)
    return null;
  }

  return (
    <div className='grid grid-cols-2 outline-2 outline-amber-800'>
      {venues.map((venue) => (
        <VenuesCard key={venue.id} {...venue} />
      ))}
    </div>
  );
};

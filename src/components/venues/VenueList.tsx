import { VenuesCard } from './VenueCard';
import { type Venue } from '../../types/api/venue';
import type { FC } from 'react';

type VenuesListType = {
  venues: Venue[];
};

export const VenuesList: FC<VenuesListType> = ({ venues }) => {
  if (!venues || venues.length === 0) {
    return <p className='text-center'>No venues to show</p>;
  }

  return (
    <div className='grid outline-2 outline-amber-800'>
      {venues.map((venue) => (
        <VenuesCard key={venue.id} {...venue} />
      ))}
    </div>
  );
};

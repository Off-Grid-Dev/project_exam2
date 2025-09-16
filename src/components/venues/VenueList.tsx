import { VenuesCard } from './VenueCard';
import { type Venue } from '../../types/api/venue';
import type { FC } from 'react';

type VenuesListType = {
  venues: Venue[];
  isLoading?: boolean;
};

const classOptions = {
  desktop: 'grid grid-cols-2 gap-2 ',
  tablet: '',
  mobile: '',
};

export const VenuesList: FC<VenuesListType> = ({ venues, isLoading }) => {
  if ((!venues || venues.length === 0) && !isLoading) {
    return <p className='text-center'>No venues to show</p>;
  }

  if ((!venues || venues.length === 0) && isLoading) {
    return null;
  }

  return (
    <div className={classOptions.desktop}>
      {venues.map((venue) => (
        <VenuesCard key={venue.id} {...venue} />
      ))}
    </div>
  );
};

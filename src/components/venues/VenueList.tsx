import { VenuesCard } from './VenueCard';
import { type Venue } from '../../types/api/venue';
import type { FC } from 'react';
import {
  createClassOptions,
  getClassFor,
  composeClasses,
} from '../../context/ui/classOptionsTemplate';
import { useBreakpoint } from '../../context/ui/useBreakpoint';

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

  const opts = createClassOptions({
    desktopStyles: 'grid grid-cols-2 gap-6',
    tabletStyles: 'grid grid-cols-2 gap-4',
    mobileStyles: 'grid grid-cols-1 gap-3',
  });

  const { breakpoint } = useBreakpoint();
  const containerClass = composeClasses(
    getClassFor(breakpoint, opts),
    'mx-auto px-4',
  );

  return (
    <div className={containerClass}>
      {venues.map((venue) => (
        <VenuesCard key={venue.id} {...venue} />
      ))}
    </div>
  );
};

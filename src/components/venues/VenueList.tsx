import { VenuesCard } from './VenueCard';
import { type Venue } from '../../types/api/venue';
import type { Dispatch, FC, SetStateAction } from 'react';
import Button from '../Button';
// import { useBreakpoint } from '../../context/ui/useBreakpoint';

type VenuesListType = {
  venues: Venue[];
  isLoading?: boolean;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pagination: {
    isFirstPage: boolean | undefined;
    isLastPage: boolean | undefined;
  };
};

export const VenuesList: FC<VenuesListType> = ({
  venues,
  isLoading,
  page,
  setPage,
  pagination,
}) => {
  if ((!venues || venues.length === 0) && !isLoading) {
    return <p className='text-center'>No venues to show</p>;
  }

  if ((!venues || venues.length === 0) && isLoading) {
    return null;
  }

  function handlePreviousPage() {
    if (page > 1) {
      setPage((prev) => prev - 1);
    } else {
      return;
    }
  }
  function handleNextPage() {
    setPage((prev) => prev + 1);
  }

  return (
    <>
      <div className='mx-auto mt-3 grid grid-cols-[1fr_auto_1fr] gap-3'>
        <Button
          label='previous page'
          type='button'
          onClick={handlePreviousPage}
          disabled={Boolean(pagination.isFirstPage)}
        />
        <span className='bg-bg-med grid aspect-square place-content-center rounded-full'>
          {page}
        </span>
        <Button
          label='next page'
          type='button'
          onClick={handleNextPage}
          disabled={Boolean(pagination.isLastPage)}
        />
      </div>
      <div className='my-4 grid grid-cols-2 gap-3'>
        {venues.map((venue) => (
          <VenuesCard key={venue.id} {...venue} />
        ))}
      </div>
    </>
  );
};

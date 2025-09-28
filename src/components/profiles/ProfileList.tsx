// React imports
import type { Dispatch, FC, SetStateAction } from 'react';
// Context
import { useBreakpoint } from '../../context/ui/useBreakpoint';

// Components
import ProfileCard from './ProfileCard';
import Button from '../Button';

// Types
import type { Profile } from '../../types/api/profile';

type ProfileListProps = {
  profiles: Profile[];
  isLoading?: boolean;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pagination: {
    isFirstPage: boolean | undefined;
    isLastPage: boolean | undefined;
  };
};

const ProfileList: FC<ProfileListProps> = ({
  profiles,
  isLoading,
  page,
  setPage,
  pagination,
}) => {
  const { breakpoint } = useBreakpoint();
  const isMobile = breakpoint === 'mobile';
  if ((!profiles || profiles.length === 0) && !isLoading) {
    return <p className='text-center'>No profiles to show</p>;
  }

  if ((!profiles || profiles.length === 0) && isLoading) {
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

  const paginationControls = (
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
  );

  return (
    <>
      {paginationControls}
      <div
        className={`my-4 grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}
      >
        {profiles.map((profile) => (
          <ProfileCard key={profile.name} profile={profile} />
        ))}
      </div>
      {paginationControls}
    </>
  );
};

export default ProfileList;

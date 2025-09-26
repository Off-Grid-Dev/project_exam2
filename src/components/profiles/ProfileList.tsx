import type { Dispatch, FC, SetStateAction } from 'react';
import type { Profile } from '../../types/api/profile';
import ProfileCard from './ProfileCard';
import Button from '../Button';

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
      <div>
        {profiles.map((profile) => (
          <ProfileCard key={profile.name} profile={profile} />
        ))}
      </div>
    </>
  );
};

export default ProfileList;

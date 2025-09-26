import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { Profile } from '../../types/api/profile';

type ProfileCardProps = {
  profile: Profile;
};

const ProfileCard: FC<ProfileCardProps> = ({ profile }) => {
  return (
    <Link
      to={`/profiles/${encodeURIComponent(profile.name)}`}
      className='block rounded-md border-2 p-3 hover:shadow-md focus:ring focus:outline-none'
      aria-label={`View profile for ${profile.name}`}
    >
      <h2 className='text-lg font-medium'>{profile.name}</h2>
      {/* Optional: show more brief info if available */}
      {profile.email && <p className='text-muted text-sm'>{profile.email}</p>}
    </Link>
  );
};

export default ProfileCard;

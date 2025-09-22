import type { FC } from 'react';
import type { Profile } from '../../types/api/profile';

type ProfileCardProps = {
  profile: Profile;
};

const ProfileCard: FC<ProfileCardProps> = ({ profile }) => {
  return (
    <div>
      <h2>{profile.name}</h2>
    </div>
  );
};

export default ProfileCard;

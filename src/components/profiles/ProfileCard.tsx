// React imports
import { useEffect, useState, type FC } from 'react';
import { Link } from 'react-router-dom';

// Components

// Local functions / hooks

// Types
import type { Profile } from '../../types/api/profile';

type ProfileCardProps = {
  profile: Profile;
};

const ProfileCard: FC<ProfileCardProps> = ({ profile }) => {
  const [bannerError, setBannerError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    // reset errors when URLs change
    setBannerError(false);
  }, [profile.banner?.url]);

  useEffect(() => {
    setAvatarError(false);
  }, [profile.avatar?.url]);

  const bannerUrl = profile.banner?.url ?? '';
  const avatarUrl = profile.avatar?.url ?? '';

  return (
    <Link
      to={`/profiles/${encodeURIComponent(profile.name)}`}
      className='block rounded-sm border-2 p-2'
      aria-label={`View profile for ${profile.name}`}
    >
      <div className='relative h-48 w-full overflow-clip rounded-sm'>
        {(() => {
          if (!bannerUrl || bannerError) {
            return (
              <div className='bg-bg-dark flex h-full w-full items-center justify-center'>
                <span className='text-text-base'>Invalid banner</span>
              </div>
            );
          }

          try {
            const parsed = new URL(bannerUrl);
            if (!['http:', 'https:'].includes(parsed.protocol)) {
              return (
                <div className='bg-bg-dark flex h-full w-full items-center justify-center'>
                  <span className='text-text-base'>Invalid banner</span>
                </div>
              );
            }
          } catch {
            return (
              <div className='bg-bg-dark flex h-full w-full items-center justify-center'>
                <span className='text-text-base'>Invalid banner</span>
              </div>
            );
          }

          return (
            <img
              src={bannerUrl}
              alt={profile.banner?.alt ?? `${profile.name} banner`}
              className='h-full w-full object-cover object-center'
              onError={() => setBannerError(true)}
            />
          );
        })()}

        {/* Avatar overlay: circle, right side, vertically centered */}
        <div className='absolute top-1/2 right-3 -translate-y-1/2'>
          {avatarUrl && !avatarError ? (
            <img
              src={avatarUrl}
              alt={profile.avatar?.alt ?? `${profile.name} avatar`}
              className='border-border-dark h-20 w-20 rounded-full border-2 object-cover'
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className='bg-bg-dark border-border-dark flex h-20 w-20 items-center justify-center rounded-full border-2'>
              <span className='text-text-base'>No avatar</span>
            </div>
          )}
        </div>
      </div>

      <div className='mt-3'>
        <h2 className='font-semibold text-[var(--color-text-dark)]'>
          {profile.name}
        </h2>
        {profile.email && <p className='text-muted text-sm'>{profile.email}</p>}
      </div>
    </Link>
  );
};

export default ProfileCard;

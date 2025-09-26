// React imports
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Components
import { Wrapper } from '../components/layout/Wrapper';

// Local functions / hooks / api
import { fetchProfiles } from '../api/api';
import { ApiFunctions } from '../api/apiFunctionsEnum';
import { getToken } from '../api/authToken';

// Types
import type { Profile } from '../types/api/profile';
import type { ProfileResponse } from '../types/api/responses';

const ProfileSingle = () => {
  const { name } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = getToken() || undefined;
        if (!token) {
          setError('You must be logged in to view profile details.');
          setProfile(null);
          return;
        }

        const res = (await fetchProfiles(ApiFunctions.GetProfileByName, {
          token,
          name: decodeURIComponent(name),
        })) as ProfileResponse;
        setProfile(res.data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [name]);

  if (isLoading)
    return (
      <Wrapper>
        <p>Loading profile...</p>
      </Wrapper>
    );

  if (error)
    return (
      <Wrapper>
        <p className='text-red-600'>Error: {error}</p>
      </Wrapper>
    );

  if (!profile)
    return (
      <Wrapper>
        <p>No profile found</p>
      </Wrapper>
    );

  return (
    <Wrapper>
      <div className='mx-auto max-w-3xl'>
        <h1 className='text-2xl font-bold'>{profile.name}</h1>
        {profile.avatar?.url && (
          <img
            src={profile.avatar.url}
            alt={profile.avatar.alt || `${profile.name} avatar`}
            className='my-4 h-32 w-32 rounded-full'
          />
        )}
        <p className='text-muted text-sm'>{profile.email}</p>
        <div className='mt-4'>
          <h2 className='font-semibold'>About</h2>
          <p>{profile.bio}</p>
        </div>
        <div className='mt-4'>
          <h3 className='font-semibold'>Stats</h3>
          <p>Venues: {profile._count?.venues ?? 0}</p>
          <p>Bookings: {profile._count?.bookings ?? 0}</p>
        </div>
      </div>
    </Wrapper>
  );
};

export default ProfileSingle;

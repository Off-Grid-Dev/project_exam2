// React imports
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

// Components
import { Wrapper } from '../components/layout/Wrapper';

// Local functions / hooks / api
import { fetchProfiles } from '../api/api';
import { ApiFunctions } from '../api/apiFunctionsEnum';
import { getToken, getStoredName } from '../api/authToken';

// Types
import type { Profile } from '../types/api/profile';
import type { ProfileResponse } from '../types/api/responses';
import type { Venue } from '../types/api/venue';
import EditProfileForm from '../components/forms/EditProfile';
import CreateVenueForm from '../components/forms/CreateVenue';
import { VenuesList } from '../components/venues/VenueList';
import MyBookings from './MyBookings';

const ProfileSingle = () => {
  const { name } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [venues, setVenues] = useState<Venue[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');

  useEffect(() => {
    if (!name) return;

    const fetchProfile = async () => {
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
          _venues: true,
          _bookings: false,
        })) as ProfileResponse;
        setProfile(res.data);
        setIsManager(res.data.venueManager);
        // Only populate 'Your venues' when viewing your own profile.
        const storedName = getStoredName();
        if (
          res.data.venueManager &&
          storedName &&
          res.data.name.toLowerCase() === storedName.toLowerCase()
        ) {
          const raw = res.data.venues ?? [];
          const items = Array.isArray(raw) ? raw : [raw];

          // Normalize the included venues (handle { data: ... } wrapping)
          const normalized = items
            .map((it) => {
              if (it && typeof it === 'object' && 'data' in it) {
                const maybe = it as { data?: Venue };
                return maybe.data;
              }
              return it as Venue | undefined;
            })
            .filter(Boolean) as Venue[];
          setVenues(normalized as Venue[]);
        } else {
          // Not viewing your own manager profile — don't show 'Your venues'.
          setVenues([]);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProfile();

    const onCreated = () => {
      void fetchProfile();
    };

    window.addEventListener('venue:created', onCreated as EventListener);
    return () =>
      window.removeEventListener('venue:created', onCreated as EventListener);
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

  // If a tab query param is present, render only that section. Otherwise render
  // the legacy combined view (account + create + venues) so existing behaviour
  // and tests remain intact.

  const renderVenuesSection = () => {
    if (!isManager) return <p>You are not a venue manager.</p>;
    if (venues === null) return <p>Loading venues...</p>;
    if (venues.length === 0) return <p>No venues yet</p>;
    return (
      <div className='mt-2'>
        <VenuesList
          venues={venues}
          isLoading={false}
          page={page}
          setPage={setPage}
          pagination={{ isFirstPage: true, isLastPage: true }}
        />
      </div>
    );
  };

  const isOwner =
    getStoredName() &&
    profile.name.toLowerCase() === getStoredName()!.toLowerCase();

  return (
    <Wrapper>
      <div className='mx-auto max-w-3xl'>
        <h1 className='text-2xl font-bold'>{profile.name}</h1>

        {/* If no tab param, keep legacy combined UI */}
        {!tab && (
          <>
            <EditProfileForm />
            <div className='mt-6'>
              <h2 className='font-semibold'>Create a venue</h2>
              <CreateVenueForm />
            </div>
            {profile.avatar?.url && (
              <img
                src={profile.avatar.url}
                alt={profile.avatar.alt || `${profile.name} avatar`}
                className='my-4 h-32 w-32 max-w-full rounded-full object-cover'
              />
            )}
            <p className='text-muted text-sm'>{profile.email}</p>
            {profile.bio !== '' && (
              <div className='mt-4'>
                <h2 className='font-semibold'>About</h2>
                <p>{profile.bio}</p>
              </div>
            )}
            <div className='mt-4'>
              <h3 className='font-semibold'>Stats</h3>
              {isManager && <p>Venues: {profile._count?.venues ?? 0}</p>}
              <p>Bookings: {profile._count?.bookings ?? 0}</p>
            </div>
            {isManager && (
              <div className='mt-6'>
                <h3 className='font-semibold'>Your venues</h3>
                {renderVenuesSection()}
              </div>
            )}
          </>
        )}

        {/* Tab-driven single-section views */}
        {tab === 'venues' && (
          <div className='mt-6'>
            <h2 className='font-semibold'>Your venues</h2>
            {isOwner ? (
              renderVenuesSection()
            ) : (
              <p>Not allowed to view venues.</p>
            )}
          </div>
        )}

        {tab === 'bookings' && (
          <div className='mt-6'>
            <h2 className='font-semibold'>My bookings</h2>
            {isOwner ? <MyBookings /> : <p>Not allowed to view bookings.</p>}
          </div>
        )}

        {tab === 'account' && (
          <div className='mt-6'>
            <h2 className='font-semibold'>Account</h2>
            {isOwner ? (
              <EditProfileForm />
            ) : (
              <p>Not allowed to edit account.</p>
            )}
          </div>
        )}

        {tab === 'create' && (
          <div className='mt-6'>
            <h2 className='font-semibold'>Create a venue</h2>
            {isOwner && isManager ? (
              <CreateVenueForm />
            ) : (
              <p>Not allowed to create a venue.</p>
            )}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default ProfileSingle;

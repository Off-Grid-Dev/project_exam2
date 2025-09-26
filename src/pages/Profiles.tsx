// React imports
import { useCallback, useEffect, useState } from 'react';

// Components
import { Wrapper } from '../components/layout/Wrapper';
import ProfileList from '../components/profiles/ProfileList';
import SearchForm from '../components/forms/SearchForm';

// Local functions / hooks / api
import { fetchProfiles } from '../api/api';
import { getToken } from '../api/authToken';
import { ApiFunctions } from '../api/apiFunctionsEnum';
import { useBreakpoint } from '../context/ui/useBreakpoint';
import { useToast } from '../context/toast/useToast';

// Types
import type { ProfilesResponse, ProfileResponse } from '../types/api/responses';
import type { Profile } from '../types/api/profile';
import type { ToastProps } from '../context/toast/ToastProvider.tsx';

const ProfilePage = () => {
  const token = getToken() || undefined;

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileQuery, setProfileQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [isFirstPage, setIsFirstPage] = useState<boolean | undefined>(
    undefined,
  );
  const [isLastPage, setIsLastPage] = useState<boolean | undefined>(undefined);
  const [toastValues, setToastValues] = useState<Omit<ToastProps, 'id'>>({
    text: '',
    type: '',
  });

  const { GetAllProfiles } = ApiFunctions;
  const { addToast } = useToast();

  function handleProfileSearch(query?: string) {
    const q = (typeof query === 'string' ? query : profileQuery).trim();
    setProfileQuery(q);
  }

  const { breakpoint } = useBreakpoint();
  const isAutoSearch = breakpoint !== 'mobile';
  const debounceMs = 400;

  const normalizeProfileReturn = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!profileQuery) {
        const res = (await fetchProfiles(GetAllProfiles, {
          token,
          limit: 20,
          page,
        })) as ProfilesResponse;
        setToastValues({ type: 'success', text: 'All profiles loaded' });
        if (!res) {
          setProfiles([]);
          setToastValues({ type: 'warning', text: 'No profiles to show.' });
          setIsLoading(false);
          return;
        }
        const data = res.data;
        const meta = res.meta;
        setIsFirstPage(Boolean(meta.isFirstPage));
        setIsLastPage(Boolean(meta.isLastPage));
        setProfiles(Array.isArray(data) ? data : [data]);
      } else {
        // search by name (single result)
        const res = (await fetchProfiles(ApiFunctions.GetProfileByName, {
          token,
          name: profileQuery,
        })) as ProfileResponse;
        const data = res?.data ?? res;
        setIsFirstPage(true);
        setIsLastPage(true);
        setProfiles(data ? (Array.isArray(data) ? data : [data]) : []);
        setToastValues({
          type: 'success',
          text: `Profiles that match ${profileQuery}`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [GetAllProfiles, token, profileQuery, page]);

  useEffect(() => {
    if (toastValues.type !== '') addToast(toastValues);
  }, [toastValues, addToast]);

  useEffect(() => {
    void normalizeProfileReturn();
  }, [normalizeProfileReturn]);

  // Search now updates the list directly. Navigation happens by clicking a ProfileCard.

  return (
    <Wrapper>
      <h1>Profiles</h1>
      <SearchForm
        query={profileQuery}
        handleSearch={handleProfileSearch}
        autoSearch={isAutoSearch}
        debounceDelay={debounceMs}
        showSort={false}
      />
      <ProfileList
        profiles={profiles}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        pagination={{ isFirstPage, isLastPage }}
      />
    </Wrapper>
  );
};

export default ProfilePage;

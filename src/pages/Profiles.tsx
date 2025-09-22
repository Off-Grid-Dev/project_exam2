import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { Wrapper } from '../components/layout/Wrapper';
import { fetchProfiles } from '../api/api';
import type { ProfilesResponse } from '../types/api/responses';
import { getToken } from '../api/authToken';
import type { Profile } from '../types/api/profile';
import ProfileList from '../components/profiles/ProfileList';
import { ApiFunctions } from '../api/apiFunctionsEnum';
import SearchForm from '../components/forms/SearchForm';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const token = getToken() || undefined;
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileQuery, setProfileQuery] = useState<string>('');
  const [sortValue, setSortValue] = useState<string>('created');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [page, setPage] = useState<number>(1);
  const [isFirstPage, setIsFirstPage] = useState<boolean | undefined>(
    undefined,
  );
  const [isLastPage, setIsLastPage] = useState<boolean | undefined>(undefined);

  const { GetAllProfiles } = ApiFunctions;

  function resetSearchParams() {
    setPage(1);
    setSortValue('');
    setSortOrder('asc');
  }

  function handleProfileSearch() {
    const query = profileQuery.trim();
    resetSearchParams();
    setProfileQuery(query);
  }

  function handleSortUpdate(e: ChangeEvent<HTMLSelectElement>) {
    const sortValue = e.currentTarget.value.trim();
    setSortValue(sortValue);
  }

  function handleSortOrderUpdate(e: ChangeEvent<HTMLSelectElement>) {
    const sortOrderValue = e.currentTarget.value;
    setSortOrder(sortOrderValue);
  }

  const normalizeProfileReturn = useCallback(async () => {
    setIsLoading(true);
    const res = (await fetchProfiles(GetAllProfiles, {
      token,
    })) as ProfilesResponse;

    if (!res) {
      setProfiles([]);
      setIsLoading(false);
      return;
    }
    const data = res.data;
    const meta = res.meta;
    setIsFirstPage(Boolean(meta.isFirstPage));
    setIsLastPage(Boolean(meta.isLastPage));
    setProfiles(Array.isArray(data) ? data : [data]);
    setIsLoading(false);
  }, [GetAllProfiles, sortValue, sortOrder, page]);

  useEffect(() => {
    void normalizeProfileReturn();
  }, [normalizeProfileReturn]);

  useEffect(() => {
    // TODO add toast to show that they must enter a name
    if (profileQuery === '') return;
    navigate(`/profile:${profileQuery}`);
  }, [profileQuery]);

  return (
    <Wrapper>
      <h1>Profiles</h1>
      <SearchForm
        query={profileQuery}
        setQuery={setProfileQuery}
        handleSearch={handleProfileSearch}
        handleSortUpdate={handleSortUpdate}
        handleSortOrderUpdate={handleSortOrderUpdate}
        sortValue={sortValue}
        sortOrder={sortOrder}
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

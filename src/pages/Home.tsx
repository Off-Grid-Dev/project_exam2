import { useEffect, useState, useCallback, type ChangeEvent } from 'react';
import { fetchVenues } from '../api/api.ts';
import { VenuesList } from '../components/venues/VenueList.tsx';
import { type Venue } from '../types/api/venue.ts';
import type { VenuesResponse } from '../types/api/responses.ts';
import { ApiFunctions } from '../api/apiFunctionsEnum.ts';
import { Wrapper } from '../components/layout/Wrapper.tsx';
import SearchForm from '../components/forms/SearchForm.tsx';
import { Toast, ToastWrapper } from '../components/toast/Toast.tsx';
import { useToast } from '../context/toast/useToast.ts';
import type { ToastProps } from '../context/toast/ToastProvider.tsx';

export const Home = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venueQuery, setVenueQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState<string>('created');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [page, setPage] = useState<number>(1);
  const [isFirstPage, setIsFirstPage] = useState<boolean | undefined>(
    undefined,
  );
  const [isLastPage, setIsLastPage] = useState<boolean | undefined>(undefined);
  const [toastValues, setToastValues] = useState<ToastProps>({
    id: '',
    text: '',
    type: '',
  });

  const { GetVenues, GetVenueBySearch } = ApiFunctions;
  const { toastArray, addToast } = useToast();

  function resetSearchParams() {
    setPage(1);
    setSortValue('');
    setSortOrder('asc');
  }

  function handleVenueSearch() {
    const query = venueQuery.trim();
    resetSearchParams();
    setVenueQuery(query);
  }

  function handleSortUpdate(e: ChangeEvent<HTMLSelectElement>) {
    const sortValue = e.currentTarget.value.trim();
    setSortValue(sortValue);
  }

  function handleSortOrderUpdate(e: ChangeEvent<HTMLSelectElement>) {
    const sortOrderValue = e.currentTarget.value;
    setSortOrder(sortOrderValue);
  }

  const normalizeVenueReturn = useCallback(async () => {
    setIsLoading(true);
    let res;
    if (venueQuery === '') {
      res = (await fetchVenues(GetVenues, {
        sort: sortValue,
        sortOrder,
        page,
      })) as VenuesResponse;
    } else {
      res = (await fetchVenues(GetVenueBySearch, {
        q: venueQuery,
        sort: sortValue,
        sortOrder,
        page,
      })) as VenuesResponse;
    }
    if (!res) {
      setVenues([]);
      setToastValues({
        id: Date.now().toString(),
        type: 'warning',
        text: 'No venues to show.',
      });
      setIsLoading(false);
      return;
    }
    const data = res.data;
    const meta = res.meta;
    setIsFirstPage(Boolean(meta.isFirstPage));
    setIsLastPage(Boolean(meta.isLastPage));
    setVenues(Array.isArray(data) ? data : [data]);
    setIsLoading(false);
  }, [GetVenues, sortValue, sortOrder, page, venueQuery, GetVenueBySearch]);

  useEffect(() => {
    void normalizeVenueReturn();
  }, [normalizeVenueReturn]);

  useEffect(() => {
    if (toastValues.id !== '') addToast(toastValues);
  }, [toastValues]);

  return (
    <Wrapper>
      <h1 className='text-heading text-text-dark font-bold'>Venues</h1>
      <ToastWrapper>
        {toastArray.length > 0 &&
          toastArray.map(({ id, text, type }) => (
            <Toast id={id} text={text} type={type} />
          ))}
      </ToastWrapper>
      <SearchForm
        query={venueQuery}
        setQuery={setVenueQuery}
        handleSearch={handleVenueSearch}
        handleSortUpdate={handleSortUpdate}
        handleSortOrderUpdate={handleSortOrderUpdate}
        sortValue={sortValue}
        sortOrder={sortOrder}
      />
      <VenuesList
        venues={venues}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        pagination={{ isFirstPage, isLastPage }}
      />
      {isLoading && <p className='text-center'>Loading venues...</p>}
    </Wrapper>
  );
};

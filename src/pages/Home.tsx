import { useEffect, useState, useCallback, type ChangeEvent } from 'react';
import { fetchVenues } from '../api/api.ts';
import { VenuesList } from '../components/venues/VenueList.tsx';
import { type Venue } from '../types/api/venue.ts';
import type { VenuesResponse } from '../types/api/responses.ts';
import { ApiFunctions } from '../api/apiFunctionsEnum.ts';
import { Wrapper } from '../components/layout/Wrapper.tsx';
import SearchForm from '../components/forms/SearchForm.tsx';
import { useBreakpoint } from '../context/ui/useBreakpoint';
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
  const [toastValues, setToastValues] = useState<Omit<ToastProps, 'id'>>({
    text: '',
    type: '',
  });

  const { GetVenues, GetVenueBySearch } = ApiFunctions;
  const { addToast } = useToast();

  function resetSearchParams() {
    setPage(1);
    setSortValue('');
    setSortOrder('asc');
  }

  // Accept optional query from SearchForm (debounced input) or use current state
  function handleVenueSearch(query?: string) {
    const q = (typeof query === 'string' ? query : venueQuery).trim();
    resetSearchParams();
    setVenueQuery(q);
  }

  const { breakpoint } = useBreakpoint();
  const isAutoSearch = breakpoint !== 'mobile' && breakpoint !== 'tablet';
  const debounceMs = 900;

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
      setToastValues({ type: 'success', text: 'All venues loaded' });
    } else {
      res = (await fetchVenues(GetVenueBySearch, {
        q: venueQuery,
        sort: sortValue,
        sortOrder,
        page,
      })) as VenuesResponse;
      setToastValues({
        type: 'success',
        text: `Venues that match ${venueQuery}`,
      });
    }
    if (!res) {
      setVenues([]);
      setToastValues({
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
  }, [sortValue, sortOrder, page, venueQuery, GetVenueBySearch, GetVenues]);

  useEffect(() => {
    void normalizeVenueReturn();
  }, [normalizeVenueReturn]);

  useEffect(() => {
    if (toastValues.type !== '') addToast(toastValues);
  }, [toastValues, addToast]);

  return (
    <Wrapper>
      <h1 className='text-heading text-text-dark font-bold'>Venues</h1>
      <SearchForm
        query={venueQuery}
        handleSearch={handleVenueSearch}
        handleSortUpdate={handleSortUpdate}
        handleSortOrderUpdate={handleSortOrderUpdate}
        sortValue={sortValue}
        sortOrder={sortOrder}
        autoSearch={isAutoSearch}
        debounceDelay={debounceMs}
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

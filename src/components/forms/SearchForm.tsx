// React imports
import {
  type ChangeEvent,
  type FC,
  type FormEvent,
  useEffect,
  useState,
} from 'react';
// Context
import { useBreakpoint } from '../../context/ui/useBreakpoint';

// Components
import Button from '../Button';
import Select from './Select';

type SearchFormProps = {
  query: string;
  handleSearch: (query?: string) => void;
  handleSortUpdate?: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleSortOrderUpdate?: (e: ChangeEvent<HTMLSelectElement>) => void;
  sortValue?: string;
  sortOrder?: string;
  autoSearch?: boolean; // when true, perform search automatically after debounce
  debounceDelay?: number; // milliseconds to wait after typing
  showSort?: boolean; // when false, hide sort controls (used by Profiles page)
};

const SearchForm: FC<SearchFormProps> = ({
  query,
  handleSearch,
  handleSortUpdate,
  handleSortOrderUpdate,
  sortValue = '',
  sortOrder = 'asc',
  autoSearch = false,
  debounceDelay = 1200,
  showSort = true,
}) => {
  const [localQuery, setLocalQuery] = useState<string>(query);

  const { breakpoint } = useBreakpoint();
  const isDesktop = breakpoint === 'desktop';

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    if (!autoSearch) return;

    const handler = setTimeout(() => {
      handleSearch(localQuery.trim());
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [localQuery, autoSearch, debounceDelay, handleSearch]);
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSearch(localQuery.trim());
  }

  if (isDesktop) {
    // Keep original inline layout for desktop
    return (
      <form
        onSubmit={handleSubmit}
        className='mx-auto flex w-fit gap-3 md:flex'
      >
        <input
          aria-label='Enter a search query to refine the list of venues.'
          type='text'
          name='query'
          value={localQuery}
          onChange={(e) => {
            const v = e.currentTarget.value;
            setLocalQuery(v);
          }}
          className='border-border-dark focus:outline-border-focus mr-2 w-96 rounded-sm border-2 px-2 py-2'
          placeholder='Enter search...'
        />
        {!autoSearch && <Button label='Search for Venues' type='submit' />}
        {showSort && (
          <>
            <Select
              ariaLabel='Sort venues by attributes'
              value={sortValue}
              onChange={(e) => handleSortUpdate?.(e)}
              name='sortByVenues'
              options={[
                { value: '', label: 'Sort by' },
                { value: 'name', label: 'Venue name' },
                { value: 'price', label: 'Venue price' },
                { value: 'maxGuests', label: 'Maximum guests' },
                { value: 'rating', label: 'Rating' },
              ]}
            />
            <Select
              ariaLabel='Define sort order'
              value={sortOrder}
              onChange={(e) => handleSortOrderUpdate?.(e)}
              name='sortOrderVenues'
              options={[
                { value: '', label: 'Sort order' },
                { value: 'asc', label: 'Ascending' },
                { value: 'desc', label: 'Descending' },
              ]}
            />
          </>
        )}
      </form>
    );
  }

  // Stacked layout for non-desktop breakpoints: first row input + button, second row sort controls
  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto flex w-full flex-col gap-3'
    >
      <div className='grid w-full gap-3 sm:flex'>
        <input
          aria-label='Enter a search query to refine the list of venues.'
          type='text'
          name='query'
          value={localQuery}
          onChange={(e) => {
            const v = e.currentTarget.value;
            setLocalQuery(v);
          }}
          className='border-border-dark focus:outline-border-focus w-full rounded-sm border-2 px-2 py-2'
          placeholder='Enter search...'
        />
        {!autoSearch && <Button label='Search for Venues' type='submit' />}
      </div>

      {showSort && (
        <div className='flex w-full items-center justify-end gap-3'>
          <Select
            ariaLabel='Sort venues by attributes'
            value={sortValue}
            onChange={(e) => handleSortUpdate?.(e)}
            name='sortByVenues'
            options={[
              { value: '', label: 'Sort by' },
              { value: 'name', label: 'Venue name' },
              { value: 'price', label: 'Venue price' },
              { value: 'maxGuests', label: 'Maximum guests' },
              { value: 'rating', label: 'Rating' },
            ]}
          />
          <Select
            ariaLabel='Define sort order'
            value={sortOrder}
            onChange={(e) => handleSortOrderUpdate?.(e)}
            name='sortOrderVenues'
            options={[
              { value: '', label: 'Sort order' },
              { value: 'asc', label: 'Ascending' },
              { value: 'desc', label: 'Descending' },
            ]}
          />
        </div>
      )}
    </form>
  );
};

export default SearchForm;

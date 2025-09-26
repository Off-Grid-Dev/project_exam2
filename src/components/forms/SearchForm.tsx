// React imports
import {
  type ChangeEvent,
  type FC,
  type FormEvent,
  useEffect,
  useState,
} from 'react';

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

  return (
    <form onSubmit={handleSubmit} className='mx-auto flex w-fit gap-3'>
      <input
        aria-label='Enter a search query to refine the list of venues.'
        type='text'
        name='query'
        value={localQuery}
        onChange={(e) => {
          const v = e.currentTarget.value;
          setLocalQuery(v);
        }}
        className='border-border-dark focus:outline-border-focus w-96 rounded-sm border-2 px-2 py-2'
        placeholder='Enter search...'
      />
      {!autoSearch && (
        <Button label='Search for Venues' type='submit' additionalClasses='' />
      )}
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
          <select
            aria-label='Define sort order'
            value={sortOrder}
            onChange={(e) => handleSortOrderUpdate?.(e)}
            name='sortOrderVenues'
            className='cursor-pointer'
          >
            <option value='asc'>Ascending</option>
            <option value='desc'>Descending</option>
          </select>
        </>
      )}
    </form>
  );
};

export default SearchForm;

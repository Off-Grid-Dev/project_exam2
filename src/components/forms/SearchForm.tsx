import {
  type ChangeEvent,
  type Dispatch,
  type FC,
  type FormEvent,
  type SetStateAction,
} from 'react';
import Button from '../Button';
import Select from './Select';

type SearchFormProps = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  handleSearch: (query: string) => void;
  handleSortUpdate: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleSortOrderUpdate: (e: ChangeEvent<HTMLSelectElement>) => void;
  sortValue: string;
  sortOrder: string;
};

const SearchForm: FC<SearchFormProps> = ({
  query,
  setQuery,
  handleSearch,
  handleSortUpdate,
  handleSortOrderUpdate,
  sortValue,
  sortOrder,
}) => {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSearch(query);
  }

  return (
    <div onSubmit={() => handleSubmit} className='mx-auto flex w-fit gap-3'>
      <input
        aria-label='Enter a search query to refine the list of venues.'
        type='text'
        name='query'
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        className='border-border-dark focus:outline-border-focus w-96 rounded-sm border-2 px-2 py-2'
        placeholder='Enter search...'
      />
      <Button label='Search for Venues' type='submit' additionalClasses='' />
      <Select
        ariaLabel='Sort venues by attributes'
        value={sortValue}
        onChange={(e) => handleSortUpdate(e)}
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
        onChange={(e) => handleSortOrderUpdate(e)}
        name='sortOrderVenues'
        className='cursor-pointer'
      >
        <option value='asc'>Ascending</option>
        <option value='desc'>Descending</option>
      </select>
    </div>
  );
};

export default SearchForm;

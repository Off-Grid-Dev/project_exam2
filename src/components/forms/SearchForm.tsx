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
  venueQuery: string;
  setVenueQuery: Dispatch<SetStateAction<string>>;
  handleVenueSearch: (query: string) => void;
  handleSortUpdate: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleSortOrderUpdate: (e: ChangeEvent<HTMLSelectElement>) => void;
  sortValue: string;
  sortOrder: string;
};

const SearchForm: FC<SearchFormProps> = ({
  venueQuery,
  setVenueQuery,
  handleVenueSearch,
  handleSortUpdate,
  handleSortOrderUpdate,
  sortValue,
  sortOrder,
}) => {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleVenueSearch(venueQuery);
  }

  return (
    <form onSubmit={handleSubmit} className='mx-auto flex w-fit gap-3'>
      <input
        aria-label='Enter a search query to refine the list of venues.'
        type='text'
        name='venueQuery'
        value={venueQuery}
        onChange={(e) => setVenueQuery(e.currentTarget.value)}
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
      {/* <select
        aria-label='Sort venues by attributes'
        value={sortValue}
        onChange={(e) => handleSortUpdate(e)}
        name='sortByVenues'
        className='cursor-pointer'
      >
        <option value=''>Sort by</option>
        <option value='name'>Venue name</option>
        <option value='price'>Venue price</option>
        <option value='maxGuests'>Maximum guests</option>
        <option value='rating'>Ratings</option>
      </select> */}
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
    </form>
  );
};

export default SearchForm;

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchForm from '../../forms/SearchForm';

describe('SearchForm', () => {
  it('calls handleSearch on submit with trimmed query', async () => {
    const handleSearch = vi.fn();
    render(<SearchForm query={'  hello  '} handleSearch={handleSearch} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /Search/i });

    expect(input.value).toBe('  hello  ');
    fireEvent.change(input, { target: { value: '  abc  ' } });
    fireEvent.click(button);

    await waitFor(() => expect(handleSearch).toHaveBeenCalledWith('abc'));
  });

  it('performs autoSearch after debounce when autoSearch is true', async () => {
    const handleSearch = vi.fn();
    render(
      <SearchForm
        query={''}
        handleSearch={handleSearch}
        autoSearch={true}
        debounceDelay={50}
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'search me' } });

    // wait for debounce
    await waitFor(
      () => expect(handleSearch).toHaveBeenCalledWith('search me'),
      { timeout: 500 },
    );
  });

  it('shows sort controls when showSort is true and calls handlers', async () => {
    const handleSortUpdate = vi.fn();
    const handleSortOrderUpdate = vi.fn();
    render(
      <SearchForm
        query={''}
        handleSearch={() => {}}
        handleSortUpdate={handleSortUpdate}
        handleSortOrderUpdate={handleSortOrderUpdate}
        showSort={true}
        sortValue={'name'}
        sortOrder={'desc'}
      />,
    );

    const sortSelect = screen.getByLabelText(
      /Sort venues by attributes/i,
    ) as HTMLSelectElement;
    const orderSelect = screen.getByLabelText(
      /Define sort order/i,
    ) as HTMLSelectElement;

    fireEvent.change(sortSelect, { target: { value: 'price' } });
    fireEvent.change(orderSelect, { target: { value: 'asc' } });

    expect(handleSortUpdate).toHaveBeenCalled();
    expect(handleSortOrderUpdate).toHaveBeenCalled();
  });
});

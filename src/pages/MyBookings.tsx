import { useEffect, useState } from 'react';
import { Wrapper } from '../components/layout/Wrapper';
import LoadingPlaceholder from '../components/layout/LoadingPlaceholder';
import { fetchBookings } from '../api/api';
import { ApiFunctions } from '../api/apiFunctionsEnum';
import { getStoredName, getToken } from '../api/authToken';
import BookingList from '../components/bookings/BookingList';
import type { Booking } from '../types/api/booking';
import type { BookingsResponse } from '../types/api/responses';

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const name = getStoredName();
      const token = getToken();
      if (!name || !token) {
        setError('You must be logged in to view your bookings');
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const res = (await fetchBookings(ApiFunctions.GetBookingsByProfile, {
          name,
          token,
          _customer: true,
          sort: 'dateFrom',
          sortOrder: 'asc',
        })) as BookingsResponse | boolean;
        setBookings(
          res && typeof res === 'object' && Array.isArray(res.data)
            ? res.data
            : [],
        );
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <Wrapper>
      <h1 className='text-heading text-text-dark font-bold'>My bookings</h1>
      {isLoading && <LoadingPlaceholder />}
      {error && <p className='text-red-600'>Error: {error}</p>}
      {!isLoading && !error && <BookingList bookings={bookings ?? []} />}
    </Wrapper>
  );
};

export default MyBookings;

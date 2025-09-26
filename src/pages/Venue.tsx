// React imports
import { useCallback, useLayoutEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';

// Components
import { Wrapper } from '../components/layout/Wrapper';

// Local functions / hooks / api
import { fetchVenues, fetchBookings } from '../api/api.ts';
import { ApiFunctions } from '../api/apiFunctionsEnum.ts';
import { getToken } from '../api/authToken';
import { useToast } from '../context/toast/useToast';
import type { BookingCreatePayload } from '../types/api/booking';
import type { Venue as VenueType } from '../types/api/venue';

// Types
import type { VenueResponse } from '../types/api/responses.ts';

const Venue = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [venue, setVenue] = useState<VenueType | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [guests, setGuests] = useState<number>(1);
  const [maxGuests, setMaxGuests] = useState<number | undefined>(undefined);
  const { id } = useParams();
  const { GetVenueById, CreateBooking } = ApiFunctions;
  const { addToast } = useToast();

  const fetchVenue = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const res = (await fetchVenues(GetVenueById, { id })) as
          | VenueResponse
          | undefined;

        if (res && res.data) {
          setVenue(res.data);
          setMaxGuests(res.data.maxGuests);
        }
        return res;
      } catch (err) {
        addToast({ type: 'warning', text: `Could not fetch this venue` });
        throw new Error(`Could not fetch this venue: ${err}`);
      } finally {
        setIsLoading(false);
      }
    },
    [GetVenueById, addToast],
  );

  useLayoutEffect(() => {
    if (typeof id === 'string') void fetchVenue(id);
  }, [fetchVenue, id]);

  async function handleBookingSubmit(e: FormEvent) {
    e.preventDefault();
    // basic validation
    if (!startDate || !endDate) {
      addToast({ type: 'warning', text: 'Please select start and end dates' });
      return;
    }

    const token = getToken() || '';
    const payload: BookingCreatePayload = {
      venueId: id as string,
      dateFrom: startDate,
      dateTo: endDate,
      guests,
    };

    try {
      await fetchBookings(CreateBooking, {
        bookingCreatePayload: payload,
        bookingUpdatePayload: {},
        token,
      });
      addToast({ type: 'success', text: 'Booking created' });
      // reset form
      setStartDate('');
      setEndDate('');
      setGuests(1);
    } catch (err) {
      addToast({ type: 'warning', text: `Booking failed: ${String(err)}` });
    }
  }

  return (
    <Wrapper>
      {isLoading && <p>Loading venue...</p>}
      {!isLoading && venue && (
        <>
          <h1 className='text-heading text-text-dark font-bold'>
            {venue?.name ?? `Venue ${id}`}
          </h1>
          <div className='my-4'>
            <img
              src={venue?.media?.[0]?.url ?? ''}
              alt={venue?.media?.[0]?.alt ?? 'Venue image'}
              className='max-h-96 w-full rounded object-cover'
            />
            <p className='mt-3'>{venue?.description}</p>
            <p className='mt-2 font-semibold'>Price: {venue?.price}</p>
            <p>Max guests: {venue?.maxGuests}</p>

            <form onSubmit={handleBookingSubmit} className='mt-4 grid gap-2'>
              <label>
                Start date:
                <input
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.currentTarget.value)}
                  required
                />
              </label>
              <label>
                End date:
                <input
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.currentTarget.value)}
                  required
                />
              </label>
              <label>
                Guests:
                <input
                  type='number'
                  min={1}
                  max={maxGuests}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.currentTarget.value))}
                />
              </label>
              <button
                type='submit'
                className='btn-primary text-on-dark hover:bg-med focus-ring-focus rounded px-3 py-1'
              >
                Book
              </button>
            </form>
          </div>
        </>
      )}
    </Wrapper>
  );
};

export default Venue;

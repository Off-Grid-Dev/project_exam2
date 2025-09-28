// React imports
import { useCallback, useLayoutEffect, useState, type FormEvent } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

// Components
import { Wrapper } from '../components/layout/Wrapper';
import Calendar from '../components/Calendar';
import Button from '../components/Button';
import LoadingPlaceholder from '../components/layout/LoadingPlaceholder';
import { expandRangeToISODates } from '../utils/dates';

// Local functions / hooks / api
import { fetchVenues, fetchBookings } from '../api/api.ts';
import { ApiFunctions } from '../api/apiFunctionsEnum.ts';
import { getToken } from '../api/authToken';
import { useToast } from '../context/toast/useToast';
import EditVenueForm from '../components/forms/EditVenue';
import { getStoredName } from '../api/authToken';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { GetVenueById, CreateBooking } = ApiFunctions;
  const { addToast } = useToast();
  const [bookedIsoDates, setBookedIsoDates] = useState<string[]>([]);
  const [selectionConflicts, setSelectionConflicts] = useState<string[]>([]);

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
          // if bookings are included on the venue, expand them to disabled ISO dates
          if (res.data.bookings && Array.isArray(res.data.bookings)) {
            const dates = res.data.bookings.flatMap((b) =>
              expandRangeToISODates(b.dateFrom, b.dateTo),
            );
            setBookedIsoDates(dates);
          }
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

  // legacy handler removed; use handleCalendarRangeWithConflicts to receive conflict info

  const handleCalendarRangeWithConflicts = (
    fromISO: string,
    toISO: string,
    conflicts?: string[],
  ) => {
    setStartDate(fromISO);
    setEndDate(toISO);
    setSelectionConflicts(conflicts && conflicts.length ? conflicts : []);
  };

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
      {isLoading && <LoadingPlaceholder />}
      {!isLoading && venue && (
        <>
          <div className='flex items-center justify-between'>
            <h1 className='text-heading text-text-dark font-bold'>
              {venue?.name ?? `Venue ${id}`}
            </h1>
            {/* show edit button if current user is the owner */}
            {(() => {
              const ownerName = venue.owner?.name ?? '';
              const stored = getStoredName();
              if (
                stored &&
                ownerName &&
                ownerName.toLowerCase() === stored.toLowerCase()
              ) {
                const edit = searchParams.get('edit') === 'true';
                return (
                  <div>
                    <Button
                      onClick={() => {
                        if (edit) {
                          // clear edit param
                          const next = new URLSearchParams(searchParams);
                          next.delete('edit');
                          setSearchParams(next);
                        } else {
                          const next = new URLSearchParams(searchParams);
                          next.set('edit', 'true');
                          setSearchParams(next);
                        }
                      }}
                    >
                      {edit ? 'Close editor' : 'Edit venue'}
                    </Button>
                  </div>
                );
              }
              return null;
            })()}
          </div>
          {/* Render edit form when requested and user is owner */}
          {venue.owner?.name &&
            getStoredName() &&
            venue.owner.name.toLowerCase() === getStoredName()!.toLowerCase() &&
            searchParams.get('edit') === 'true' && (
              <div className='mt-4'>
                <h2 className='font-semibold'>Edit venue</h2>
                <EditVenueForm
                  venue={venue}
                  onSaved={(v) => {
                    // update local state after save
                    setVenue(v);
                    // clear edit param
                    const next = new URLSearchParams(searchParams);
                    next.delete('edit');
                    setSearchParams(next);
                  }}
                />
              </div>
            )}
          <div className='my-4'>
            {/* Only render an <img> when a valid absolute URL is present; otherwise show a placeholder */}
            {(() => {
              const url = venue?.media?.[0]?.url ?? '';
              const alt = venue?.media?.[0]?.alt ?? 'Venue image';
              if (!url) {
                return (
                  <div className='bg-bg-dark flex h-48 w-full items-center justify-center rounded'>
                    <span className='text-text-base'>Invalid image</span>
                  </div>
                );
              }
              try {
                const parsed = new URL(url);
                if (!['http:', 'https:'].includes(parsed.protocol)) {
                  return (
                    <div className='bg-bg-dark flex h-48 w-full items-center justify-center rounded'>
                      <span className='text-text-base'>Invalid image</span>
                    </div>
                  );
                }
              } catch {
                return (
                  <div className='bg-bg-dark flex h-48 w-full items-center justify-center rounded'>
                    <span className='text-text-base'>Invalid image</span>
                  </div>
                );
              }

              return (
                <img
                  src={url}
                  alt={alt}
                  className='max-h-96 w-full rounded object-cover'
                />
              );
            })()}
            <p className='mt-3'>{venue?.description}</p>
            <p className='mt-2 font-semibold'>Price: {venue?.price}</p>
            <p>Max guests: {venue?.maxGuests}</p>

            <form onSubmit={handleBookingSubmit} className='mt-4 grid gap-2'>
              <div>
                <label className='font-semibold'>Selected dates</label>
                <div className='mt-1'>
                  {startDate && endDate ? (
                    <p className='text-sm'>
                      {new Date(startDate).toLocaleDateString()} —{' '}
                      {new Date(endDate).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className='text-muted text-sm'>
                      Please select a start and end date from the calendar
                      above.
                    </p>
                  )}
                </div>
              </div>
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
              <Button
                type='submit'
                disabled={
                  !startDate ||
                  !endDate ||
                  (maxGuests !== undefined && guests > maxGuests) ||
                  selectionConflicts.length > 0
                }
              >
                Book
              </Button>
            </form>
            {selectionConflicts.length > 0 && (
              <p className='mt-2 text-sm text-amber-200'>
                The selected range includes dates that are already booked.
                Please choose a different range.
              </p>
            )}

            <Calendar
              disabledDates={bookedIsoDates}
              onRangeSelect={handleCalendarRangeWithConflicts}
              initialMonth={new Date().getMonth()}
              initialYear={new Date().getFullYear()}
            />
          </div>
        </>
      )}
    </Wrapper>
  );
};

export default Venue;

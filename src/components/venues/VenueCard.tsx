import { type FC } from 'react';
import type { Venue } from '../../types/api/venue';
import {
  createClassOptions,
  getClassFor,
  composeClasses,
} from '../../context/ui/classOptionsTemplate';
import { useBreakpoint } from '../../context/ui/useBreakpoint';

export const VenuesCard: FC<Venue> = ({
  id,
  name,
  description,
  media,
  price,
  maxGuests,
  rating,
  created,
  updated,
  meta,
  location,
  owner,
  bookings,
  _count,
}) => {
  const { url, alt } = media[0] || {};
  const { wifi, parking, breakfast, pets } = meta;
  const { address, city, zip, country, continent, lat, lng } = location;

  const rootOpts = createClassOptions({
    desktopStyles: 'grid rounded-md border-2 p-4 gap-3',
    tabletStyles: 'grid rounded-md border-2 p-3 gap-3',
    mobileStyles: 'grid rounded-md border-2 p-2 gap-2',
  });

  const imgWrapper =
    'w-28 rounded-md border-2 overflow-hidden bg-[var(--color-base-100)]';

  const { breakpoint } = useBreakpoint();
  const rootClass = composeClasses(
    getClassFor(breakpoint, rootOpts),
    'border-[var(--color-border-dark)] bg-[var(--color-base-100)]',
  );

  return (
    <div id={id} className={rootClass}>
      <h3 className='font-semibold text-[var(--color-text-dark)]'>{name}</h3>
      <div className={imgWrapper}>
        {url && (
          <img className='max-w-full' src={url} alt={alt ?? 'venue image'} />
        )}
      </div>
      <button className='cursor-pointer rounded bg-[var(--color-bg-dark)] px-3 py-1 text-[var(--color-text-base)] hover:bg-[var(--color-bg-med)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:outline-none'>
        BOOK
      </button>
      <p>Description: {description}</p>
      <p>Price: {price}</p>
      <p>Maximum Guests: {maxGuests}</p>
      <p>Rating: {rating}</p>
      <p>Date Created: {created}</p>
      <p>Last Updated: {updated}</p>
      <ul>
        <li>Wifi: {wifi ? 'yes' : 'no'}</li>
        <li>Parking: {parking ? 'yes' : 'no'}</li>
        <li>Breakfast: {breakfast ? 'yes' : 'no'}</li>
        <li>Pets: {pets ? 'yes' : 'no'}</li>
      </ul>
      <ul>
        <li>Address: {address}</li>
        <li>City: {city}</li>
        <li>Zip code: {zip}</li>
        <li>Country: {country}</li>
        <li>Continent: {continent}</li>
        <li>Latitude: {lat}</li>
        <li>Longitude: {lng}</li>
      </ul>
      {owner && (
        <div>
          <p>Owner: {owner.name}</p>
          <p>Owner: {owner.email}</p>
          <p>Owner: {owner.bio}</p>
          {owner.avatar.url && (
            <img
              src={owner.avatar.url}
              alt={owner.avatar.alt ?? 'owner image'}
            />
          )}
          {owner.banner.url && (
            <img
              src={owner.banner.url ?? ''}
              alt={owner.banner.alt ?? 'owner banner'}
            />
          )}
        </div>
      )}
      {Array.isArray(bookings) && (
        <>
          <h2>Bookings:</h2>
          <ul>
            {bookings.map((booking) => (
              <li key={booking.id}>
                <p>Booking ID: {booking.id}</p>
                <p>From Date: {booking.dateFrom}</p>
                <p>To Date: {booking.dateTo}</p>
                <p>Guests: {booking.guests}</p>
                <p>Date Created: {booking.created}</p>
                <p>Last Updated: {booking.updated}</p>
                <p>Venue: {booking.venue.id}</p>
                <p>Customer: {booking.customer.name}</p>
                <p>Total Bookings: {_count.bookings}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

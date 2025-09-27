import type { FC } from 'react';
import type { Booking } from '../../types/api/booking';

type Props = {
  bookings: Booking[];
};

const BookingList: FC<Props> = ({ bookings }) => {
  if (!bookings || bookings.length === 0) {
    return <p>No bookings found</p>;
  }

  return (
    <ul className='space-y-3'>
      {bookings.map((b) => (
        <li key={b.id} className='rounded border p-3'>
          <h3 className='font-semibold'>{b.venue?.name ?? 'Venue'}</h3>
          <p>
            From: {new Date(b.dateFrom).toLocaleDateString()} — To:{' '}
            {new Date(b.dateTo).toLocaleDateString()}
          </p>
          <p>Guests: {b.guests}</p>
        </li>
      ))}
    </ul>
  );
};

export default BookingList;

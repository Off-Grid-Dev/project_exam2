import { type FC } from 'react';
import type { Venue } from '../../types/api/venue';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
// import { useBreakpoint } from '../../context/ui/useBreakpoint';

export const VenuesCard: FC<Venue> = ({
  id,
  name,
  media,
  price,
  rating,
  meta,
}) => {
  const navigate = useNavigate();

  function handleBookVenue(id: string) {
    navigate(`/venues/${id}`);
  }
  const { url, alt } = media[0] || {};
  const { wifi, parking, breakfast, pets } = meta;

  return (
    <div id={id} className='border-border-dark rounded-sm border-2 p-2'>
      <div className='h-72 w-full overflow-clip rounded-sm'>
        {url && (
          <img
            className='h-full w-full object-cover object-center'
            src={url}
            alt={alt ? alt : `venue image ${id}`}
          />
        )}
      </div>
      <h2 className='font-semibold text-[var(--color-text-dark)]'>{name}</h2>
      <div className='flex justify-between'>
        <div>
          <p>Price: {price}</p>
          <p>Rating: {rating}</p>
        </div>
        <ul>
          <li>Wifi: {wifi ? 'yes' : 'no'}</li>
          <li>Parking: {parking ? 'yes' : 'no'}</li>
          <li>Breakfast: {breakfast ? 'yes' : 'no'}</li>
          <li>Pets: {pets ? 'yes' : 'no'}</li>
        </ul>
      </div>
      <Button
        label='Book now'
        type='button'
        onclick={() => handleBookVenue(id)}
        additionalClasses='ml-auto'
      />
    </div>
  );
};

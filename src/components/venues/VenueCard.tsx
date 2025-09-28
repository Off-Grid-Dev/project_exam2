// React imports
import { useEffect, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import Button from '../Button';

// Types
import type { Venue } from '../../types/api/venue';
import { getStoredName } from '../../api/authToken';

export const VenuesCard: FC<Venue> = ({
  id,
  name,
  media,
  price,
  rating,
  meta,
  owner,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const navigate = useNavigate();

  function handleBookVenue(id: string) {
    navigate(`/venues/${id}`);
  }
  const { url, alt } = media[0] || {};
  const { wifi, parking, breakfast, pets } = meta;

  useEffect(() => {
    // Reset image error state whenever url changes so we attempt to load again.
    setImageError(false);
  }, [url]);

  if (name === '' || name === undefined || !name) return null;

  return (
    <div id={id} className='border-border-dark rounded-sm border-2 p-2'>
      <div className='h-72 w-full overflow-clip rounded-sm'>
        {/* Only render an <img> when url is an absolute http(s) URL; otherwise show placeholder. */}
        {(() => {
          if (!url)
            return (
              <div className='bg-bg-dark flex h-full w-full items-center justify-center'>
                <span className='text-text-base'>Invalid image</span>
              </div>
            );

          try {
            const parsed = new URL(url);
            if (!['http:', 'https:'].includes(parsed.protocol)) {
              return (
                <div className='bg-bg-dark flex h-full w-full items-center justify-center'>
                  <span className='text-text-base'>Invalid image</span>
                </div>
              );
            }
          } catch {
            return (
              <div className='bg-bg-dark flex h-full w-full items-center justify-center'>
                <span className='text-text-base'>Invalid image</span>
              </div>
            );
          }

          if (imageError) {
            return (
              <div className='bg-bg-dark flex h-full w-full items-center justify-center'>
                <span className='text-text-base'>Invalid image</span>
              </div>
            );
          }

          return (
            <img
              className='h-full w-full object-cover object-center'
              src={url}
              alt={alt ? alt : `venue image ${id}`}
              onError={() => setImageError(true)}
            />
          );
        })()}
      </div>
      <div className='flex justify-between align-top'>
        <div>
          <h2 className='font-semibold text-[var(--color-text-dark)]'>
            {name !== '' ? name : 'Venue has no name (must be haunted)'}
          </h2>
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
        onClick={() => handleBookVenue(id)}
        additionalClasses='ml-auto'
      />
      {/* Edit button for owners */}
      {(() => {
        const stored = getStoredName();
        if (!stored || !owner || !owner.name) return null;
        if (stored.toLowerCase() !== owner.name.toLowerCase()) return null;
        return (
          <Button
            label='Edit'
            type='button'
            onClick={() => navigate(`/venues/${id}?edit=true`)}
            additionalClasses='ml-2'
          />
        );
      })()}
    </div>
  );
};

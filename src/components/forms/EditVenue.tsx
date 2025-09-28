import { type FormEvent, useState } from 'react';
import { ApiFunctions } from '../../api/apiFunctionsEnum';
import type { Venue, VenuePayload } from '../../types/api/venue';
import { fetchVenues } from '../../api/api';
import type { VenueResponse } from '../../types/api/responses';
import { useToast } from '../../context/toast/useToast';
import { getToken } from '../../api/authToken';
import Button from '../Button';

// Small helper to build payload from a FormData like CreateVenue
function buildVenuePayload(raw?: unknown): VenuePayload | undefined {
  const formData = raw instanceof FormData ? raw : undefined;
  if (!formData) return undefined;

  const name = formData.get('name');
  if (!name || (typeof name === 'string' && name.trim() === ''))
    return undefined;

  const description = String(formData.get('description') || '');

  const venue: Partial<VenuePayload> = {
    name: String(name),
    description,
  };

  const mediaUrls = formData.getAll('mediaUrl[]');
  const mediaAlts = formData.getAll('mediaAlt[]');
  const mediaArr: { url: string; alt: string }[] = [];
  for (let i = 0; i < Math.max(mediaUrls.length, mediaAlts.length); i++) {
    const url = mediaUrls[i] ? String(mediaUrls[i]) : '';
    const alt = mediaAlts[i] ? String(mediaAlts[i]) : '';
    if (url || alt) mediaArr.push({ url, alt });
  }
  if (mediaArr.length > 0) venue.media = mediaArr;

  const price = formData.get('price');
  if (price !== null && String(price).trim() !== '')
    venue.price = Number(price);

  const maxGuests = formData.get('maxGuests');
  if (maxGuests !== null && String(maxGuests).trim() !== '')
    venue.maxGuests = Number(maxGuests);

  const rating = formData.get('rating');
  if (rating !== null && String(rating).trim() !== '')
    venue.rating = Number(rating);

  const wifi = formData.get('meta_wifi') !== null;
  const parking = formData.get('meta_parking') !== null;
  const breakfast = formData.get('meta_breakfast') !== null;
  const pets = formData.get('meta_pets') !== null;
  venue.meta = { wifi, parking, breakfast, pets };

  const address = formData.get('address');
  const city = formData.get('city');
  const zip = formData.get('zip');
  const country = formData.get('country');
  const continent = formData.get('continent');
  const lat = formData.get('lat');
  const lng = formData.get('lng');

  if (
    address ||
    city ||
    zip ||
    country ||
    continent ||
    (lat !== null && String(lat).trim() !== '') ||
    (lng !== null && String(lng).trim() !== '')
  ) {
    const loc: Partial<VenuePayload['location']> = {
      address: String(address || ''),
      city: String(city || ''),
      zip: String(zip || ''),
      country: String(country || ''),
      continent: String(continent || ''),
      lat: lat !== null && String(lat).trim() !== '' ? Number(lat) : 0,
      lng: lng !== null && String(lng).trim() !== '' ? Number(lng) : 0,
    };
    venue.location = loc as VenuePayload['location'];
  }

  return venue as VenuePayload;
}

type EditVenueProps = {
  venue: Venue;
  onSaved?: (v: Venue) => void;
};

const EditVenueForm = ({ venue, onSaved }: EditVenueProps) => {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = buildVenuePayload(fd);
    if (!payload) {
      setErrors({ name: 'Please provide at least a name' });
      addToast({ type: 'warning', text: 'Please provide at least a name' });
      return;
    }

    try {
      setIsSaving(true);
      const token = getToken();
      if (!token) throw new Error('Missing auth token');
      const res = await fetchVenues(ApiFunctions.UpdateVenue, {
        id: venue.id,
        venuePayload: payload,
        token,
      });
      addToast({ type: 'success', text: 'Venue updated' });
      if (onSaved && res && typeof res === 'object' && 'data' in res) {
        const venueRes = res as VenueResponse;
        onSaved(venueRes.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addToast({ type: 'error', text: `Update failed: ${msg}` });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto grid w-full max-w-3xl gap-4 p-4'
    >
      <label className='flex flex-col'>
        <span className='mb-1 text-sm font-medium'>Name</span>
        <input
          name='name'
          defaultValue={venue.name}
          required
          onChange={() => {
            setIsDirty(true);
            setErrors({});
          }}
          className='mt-1 w-full rounded border px-2 py-1'
        />
        {errors.name ? (
          <small className='mt-1 text-red-600' role='alert'>
            {errors.name}
          </small>
        ) : null}
      </label>

      <label className='flex flex-col'>
        <span className='mb-1 text-sm font-medium'>Description</span>
        <textarea
          name='description'
          defaultValue={venue.description}
          onChange={() => setIsDirty(true)}
          className='mt-1 w-full rounded border px-2 py-1'
        />
      </label>

      <div>
        <label className='font-semibold'>Images</label>
        {(venue.media || []).map((m, idx) => (
          <div key={idx} className='grid gap-2 sm:grid-cols-2'>
            <label className='flex flex-col'>
              <span className='mb-1 text-sm'>Image URL</span>
              <input
                name='mediaUrl[]'
                defaultValue={m.url}
                onChange={() => setIsDirty(true)}
                className='mt-1 rounded border px-2 py-1'
              />
            </label>

            <label className='flex flex-col'>
              <span className='mb-1 text-sm'>Image alt</span>
              <input
                name='mediaAlt[]'
                defaultValue={m.alt}
                onChange={() => setIsDirty(true)}
                className='mt-1 rounded border px-2 py-1'
              />
            </label>
          </div>
        ))}
        <div>
          <small className='text-muted'>
            You can add more image fields after save.
          </small>
        </div>
      </div>

      <div className='grid gap-2 sm:grid-cols-3'>
        <label className='flex flex-col'>
          <span className='mb-1 text-sm'>Price</span>
          <input
            name='price'
            type='number'
            min='0'
            step='0.01'
            defaultValue={String(venue.price ?? '')}
            onChange={() => setIsDirty(true)}
            className='mt-1 rounded border px-2 py-1'
          />
        </label>

        <label className='flex flex-col'>
          <span className='mb-1 text-sm'>Max guests</span>
          <input
            name='maxGuests'
            type='number'
            min='1'
            defaultValue={String(venue.maxGuests ?? '')}
            onChange={() => setIsDirty(true)}
            className='mt-1 rounded border px-2 py-1'
          />
        </label>

        <label className='flex flex-col'>
          <span className='mb-1 text-sm'>Rating</span>
          <input
            name='rating'
            type='number'
            min='0'
            max='5'
            step='0.1'
            defaultValue={String(venue.rating ?? '')}
            onChange={() => setIsDirty(true)}
            className='mt-1 rounded border px-2 py-1'
          />
        </label>
      </div>

      <fieldset className='grid gap-2 sm:grid-cols-2'>
        <legend className='font-semibold'>Meta</legend>
        <label className='flex items-center gap-2'>
          <input
            name='meta_wifi'
            type='checkbox'
            defaultChecked={venue.meta?.wifi}
            onChange={() => setIsDirty(true)}
          />
          <span>Wifi</span>
        </label>
        <label className='flex items-center gap-2'>
          <input
            name='meta_parking'
            type='checkbox'
            defaultChecked={venue.meta?.parking}
            onChange={() => setIsDirty(true)}
          />
          <span>Parking</span>
        </label>
        <label className='flex items-center gap-2'>
          <input
            name='meta_breakfast'
            type='checkbox'
            defaultChecked={venue.meta?.breakfast}
            onChange={() => setIsDirty(true)}
          />
          <span>Breakfast</span>
        </label>
        <label className='flex items-center gap-2'>
          <input
            name='meta_pets'
            type='checkbox'
            defaultChecked={venue.meta?.pets}
            onChange={() => setIsDirty(true)}
          />
          <span>Pets</span>
        </label>
      </fieldset>

      <fieldset className='grid gap-2 sm:grid-cols-2'>
        <legend className='font-semibold'>Location</legend>
        <label className='flex flex-col'>
          <span className='mb-1 text-sm'>Address</span>
          <input
            name='address'
            defaultValue={venue.location?.address || ''}
            onChange={() => setIsDirty(true)}
            className='mt-1 rounded border px-2 py-1'
          />
        </label>
        <label className='flex flex-col'>
          <span className='mb-1 text-sm'>City</span>
          <input
            name='city'
            defaultValue={venue.location?.city || ''}
            onChange={() => setIsDirty(true)}
            className='mt-1 rounded border px-2 py-1'
          />
        </label>
        <label className='flex flex-col'>
          <span className='mb-1 text-sm'>Zip</span>
          <input
            name='zip'
            defaultValue={venue.location?.zip || ''}
            onChange={() => setIsDirty(true)}
            className='mt-1 rounded border px-2 py-1'
          />
        </label>
        <label className='flex flex-col'>
          <span className='mb-1 text-sm'>Country</span>
          <input
            name='country'
            defaultValue={venue.location?.country || ''}
            onChange={() => setIsDirty(true)}
            className='mt-1 rounded border px-2 py-1'
          />
        </label>
        <label className='flex flex-col'>
          <span className='mb-1 text-sm'>Continent</span>
          <input
            name='continent'
            defaultValue={venue.location?.continent || ''}
            onChange={() => setIsDirty(true)}
            className='mt-1 rounded border px-2 py-1'
          />
        </label>
        <label className='flex flex-col'>
          <span className='mb-1 text-sm'>Latitude</span>
          <input
            name='lat'
            type='number'
            step='any'
            defaultValue={String(venue.location?.lat ?? '')}
            onChange={() => setIsDirty(true)}
            className='mt-1 rounded border px-2 py-1'
          />
        </label>
        <label className='flex flex-col'>
          <span className='mb-1 text-sm'>Longitude</span>
          <input
            name='lng'
            type='number'
            step='any'
            defaultValue={String(venue.location?.lng ?? '')}
            onChange={() => setIsDirty(true)}
            className='mt-1 rounded border px-2 py-1'
          />
        </label>
      </fieldset>

      <Button
        disabled={isSaving || !isDirty}
        type='submit'
        additionalClasses='w-full sm:w-auto'
      >
        Save changes
      </Button>
    </form>
  );
};

export default EditVenueForm;

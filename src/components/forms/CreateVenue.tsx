import { type FormEvent, useState } from 'react';
import { useActionState } from 'react';
import { ApiFunctions } from '../../api/apiFunctionsEnum.ts';
import type { VenuePayload } from '../../types/api/venue.ts';
import { fetchVenues } from '../../api/api.ts';
import { useToast } from '../../context/toast/useToast.ts';
import { getToken } from '../../api/authToken.ts';
import { useManagerContext } from '../../context/manager/useManagerContext';
import Button from '../Button';

const { CreateVenue } = ApiFunctions;

function buildVenuePayload(
  _prevState: VenuePayload | undefined,
  raw?: unknown,
): VenuePayload | undefined {
  const formData = raw instanceof FormData ? raw : undefined;
  if (!formData) return undefined;

  const name = formData.get('name');
  const description = formData.get('description');

  // Basic required fields
  if (!name || (typeof name === 'string' && name.trim() === ''))
    return undefined;

  const venue: Partial<VenuePayload> = {
    name: String(name),
    description: String(description || ''),
  };

  // media: support multiple entries submitted as mediaUrl[] / mediaAlt[]
  const mediaUrls = formData.getAll('mediaUrl[]');
  const mediaAlts = formData.getAll('mediaAlt[]');
  const mediaArr: { url: string; alt: string }[] = [];
  for (let i = 0; i < Math.max(mediaUrls.length, mediaAlts.length); i++) {
    const url = mediaUrls[i] ? String(mediaUrls[i]) : '';
    const alt = mediaAlts[i] ? String(mediaAlts[i]) : '';
    if (url || alt) mediaArr.push({ url, alt });
  }
  if (mediaArr.length > 0) venue.media = mediaArr;

  // numbers
  const price = formData.get('price');
  if (price !== null && String(price).trim() !== '')
    venue.price = Number(price);

  const maxGuests = formData.get('maxGuests');
  if (maxGuests !== null && String(maxGuests).trim() !== '')
    venue.maxGuests = Number(maxGuests);

  const rating = formData.get('rating');
  if (rating !== null && String(rating).trim() !== '')
    venue.rating = Number(rating);

  // meta
  const wifi = formData.get('meta_wifi') !== null;
  const parking = formData.get('meta_parking') !== null;
  const breakfast = formData.get('meta_breakfast') !== null;
  const pets = formData.get('meta_pets') !== null;
  venue.meta = { wifi, parking, breakfast, pets };

  // location (only include if any present)
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

const CreateVenueForm = () => {
  const { addToast } = useToast();
  const { isManager } = useManagerContext();
  // manage dynamic media inputs (url + alt)
  const [mediaFields, setMediaFields] = useState([{ url: '', alt: '' }] as {
    url: string;
    alt: string;
  }[]);

  function addMediaField() {
    setMediaFields((s) => [...s, { url: '', alt: '' }]);
  }

  function removeMediaField(idx: number) {
    setMediaFields((s) => s.filter((_, i) => i !== idx));
  }

  function updateMediaField(idx: number, key: 'url' | 'alt', value: string) {
    setMediaFields((s) =>
      s.map((m, i) => (i === idx ? { ...m, [key]: value } : m)),
    );
  }

  // useActionState to support progressive enhancement like EditProfile
  const [, formAction, isPending] = useActionState(
    buildVenuePayload,
    undefined,
  );

  if (!isManager) return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // capture the form element so we don't rely on the synthetic event after await
    const form = e.currentTarget as HTMLFormElement;
    // Validate media URLs entered in the controlled inputs before submitting
    for (let i = 0; i < mediaFields.length; i++) {
      const url = mediaFields[i].url?.trim();
      if (!url) continue; // empty is allowed
      try {
        // validate absolute URL by constructing a URL object
        void new URL(url);
      } catch {
        addToast({
          type: 'error',
          text: `Image URL #${i + 1} is not a valid absolute URL: ${url}`,
        });
        return;
      }
    }
    const fd = new FormData(e.currentTarget);
    const payload = buildVenuePayload(undefined, fd);
    if (!payload) {
      addToast({
        type: 'warning',
        text: 'Please provide at least a venue name',
      });
      return;
    }

    try {
      const token = getToken();
      if (!token) throw new Error('Missing auth token');
      await fetchVenues(CreateVenue, { venuePayload: payload, token });
      addToast({ type: 'success', text: 'Venue created' });
      // reset the form using the captured element (avoids accessing pooled event)
      form.reset();
      // signal other parts of the app (Profile page) that a venue was created so they
      // can refresh their data / UI
      try {
        window.dispatchEvent(new CustomEvent('venue:created'));
      } catch {
        // ignore if CustomEvent not supported in some environments
        window.dispatchEvent(new Event('venue:created'));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addToast({ type: 'error', text: `Create failed: ${msg}` });
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className='grid gap-2'>
      <label>
        Name
        <input name='name' required />
      </label>

      <label>
        Description
        <textarea name='description' />
      </label>

      <div>
        <label className='font-semibold'>Images</label>
        {mediaFields.map((m, idx) => (
          <div key={idx} className='grid gap-1'>
            <label>
              Image URL
              <input
                name='mediaUrl[]'
                value={m.url}
                onChange={(e) => updateMediaField(idx, 'url', e.target.value)}
              />
            </label>

            <label>
              Image alt
              <input
                name='mediaAlt[]'
                value={m.alt}
                onChange={(e) => updateMediaField(idx, 'alt', e.target.value)}
              />
            </label>

            <div>
              <Button
                type='button'
                onClick={() => removeMediaField(idx)}
                disabled={mediaFields.length === 1}
                additionalClasses='mt-1'
              >
                Remove image
              </Button>
            </div>
          </div>
        ))}
        <div>
          <Button
            type='button'
            onClick={addMediaField}
            additionalClasses='mt-1'
          >
            Add image
          </Button>
        </div>
      </div>

      <label>
        Price
        <input name='price' type='number' min='0' step='0.01' />
      </label>

      <label>
        Max guests
        <input name='maxGuests' type='number' min='1' />
      </label>

      <label>
        Rating
        <input name='rating' type='number' min='0' max='5' step='0.1' />
      </label>

      <fieldset>
        <legend>Meta</legend>
        <label>
          Wifi
          <input name='meta_wifi' type='checkbox' />
        </label>
        <label>
          Parking
          <input name='meta_parking' type='checkbox' />
        </label>
        <label>
          Breakfast
          <input name='meta_breakfast' type='checkbox' />
        </label>
        <label>
          Pets
          <input name='meta_pets' type='checkbox' />
        </label>
      </fieldset>

      <fieldset>
        <legend>Location</legend>
        <label>
          Address
          <input name='address' />
        </label>
        <label>
          City
          <input name='city' />
        </label>
        <label>
          Zip
          <input name='zip' />
        </label>
        <label>
          Country
          <input name='country' />
        </label>
        <label>
          Continent
          <input name='continent' />
        </label>
        <label>
          Latitude
          <input name='lat' type='number' step='any' />
        </label>
        <label>
          Longitude
          <input name='lng' type='number' step='any' />
        </label>
      </fieldset>

      <Button disabled={isPending} type='submit'>
        Create venue
      </Button>
    </form>
  );
};

export default CreateVenueForm;

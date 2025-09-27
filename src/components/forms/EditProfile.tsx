import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useActionState } from 'react';
import { ApiFunctions } from '../../api/apiFunctionsEnum.ts';
import type { ProfilePayload, Profile } from '../../types/api/profile.ts';
import type { ProfileResponse } from '../../types/api/responses.ts';
import { fetchProfiles } from '../../api/api.ts';
import { useToast } from '../../context/toast/useToast.ts';
import { getToken, getStoredName } from '../../api/authToken.ts';
import { useManagerContext } from '../../context/manager/useManagerContext';

const { UpdateProfile } = ApiFunctions;

async function handleUpdateProfilePayload(
  _prevState: ProfilePayload | undefined,
  formData: FormData,
): Promise<ProfilePayload | undefined> {
  const payload: ProfilePayload = {} as ProfilePayload;

  // Only add properties if present in formData so we can compare
  const bio = formData.get('bio');
  if (bio !== null) payload.bio = (bio as string) || '';

  const avatarUrl = formData.get('avatarUrl');
  const avatarAlt = formData.get('avatarAlt');
  if (avatarUrl !== null || avatarAlt !== null) {
    payload.avatar = {
      url: (avatarUrl as string) || '',
      alt: (avatarAlt as string) || '',
    };
  }

  const bannerUrl = formData.get('bannerUrl');
  const bannerAlt = formData.get('bannerAlt');
  if (bannerUrl !== null || bannerAlt !== null) {
    payload.banner = {
      url: (bannerUrl as string) || '',
      alt: (bannerAlt as string) || '',
    };
  }

  const vm = formData.get('venueManager');
  // checkbox: present when checked, absent (null) when unchecked
  if (vm !== null) {
    payload.venueManager = true;
  }

  return payload;
}

const EditProfileForm = () => {
  const { name: routeName } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const { addToast } = useToast();
  const { isManager } = useManagerContext();

  // useActionState will return a function suitable for the form action
  const [, formAction, isPending] = useActionState(
    handleUpdateProfilePayload,
    undefined,
  );

  useEffect(() => {
    // determine ownership from stored name and token
    const token = getToken();
    const storedName = getStoredName();
    if (!token || !storedName || !routeName) {
      setIsOwner(false);
      return;
    }
    setIsOwner(decodeURIComponent(routeName) === storedName);
  }, [routeName]);

  useEffect(() => {
    // load profile data to prefill form fields and to compare changes
    if (!routeName) return;
    const load = async () => {
      try {
        const token = getToken() || undefined;
        if (!token) return;
        const res = (await fetchProfiles(ApiFunctions.GetProfileByName, {
          token,
          name: decodeURIComponent(routeName),
        })) as ProfileResponse;
        setProfile(res.data);
      } catch {
        // silent; form will simply not show
      }
    };
    void load();
  }, [routeName]);

  if (!isOwner) return null;

  // Submit handler: compare payload with original profile and call API only if changed
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!profile) {
      addToast({ type: 'error', text: 'Profile data not available' });
      return;
    }

    const fd = new FormData(e.currentTarget);
    const payload = await handleUpdateProfilePayload(undefined, fd);
    if (!payload) {
      addToast({ type: 'warning', text: 'No changes detected' });
      return;
    }

    // compare payload fields to profile
    const changes: Partial<ProfilePayload> = {};
    if ('bio' in payload && payload.bio !== profile.bio)
      changes.bio = payload.bio;
    if (payload.avatar) {
      const oldAvatar = profile.avatar || { url: '', alt: '' };
      if (
        payload.avatar.url !== oldAvatar.url ||
        payload.avatar.alt !== oldAvatar.alt
      ) {
        changes.avatar = payload.avatar;
      }
    }
    if (payload.banner) {
      const oldBanner = profile.banner || { url: '', alt: '' };
      if (
        payload.banner.url !== oldBanner.url ||
        payload.banner.alt !== oldBanner.alt
      ) {
        changes.banner = payload.banner;
      }
    }
    if (
      typeof payload.venueManager === 'boolean' &&
      payload.venueManager !== profile.venueManager
    ) {
      changes.venueManager = payload.venueManager;
    }

    if (Object.keys(changes).length === 0) {
      addToast({ type: 'info', text: 'No changes to update' });
      return;
    }

    try {
      const token = getToken() || undefined;
      if (!token) throw new Error('Missing auth token');
      await fetchProfiles(UpdateProfile, {
        token,
        name: profile.name,
        profilePayload: changes as ProfilePayload,
      });
      addToast({ type: 'success', text: 'Profile updated' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addToast({ type: 'error', text: `Update failed: ${msg}` });
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className='grid gap-2'>
      <label>
        Bio
        <input name='bio' defaultValue={profile?.bio ?? ''} />
      </label>
      <label>
        Avatar URL
        <input name='avatarUrl' defaultValue={profile?.avatar?.url ?? ''} />
      </label>
      <label>
        Avatar alt
        <input name='avatarAlt' defaultValue={profile?.avatar?.alt ?? ''} />
      </label>
      <label>
        Banner URL
        <input name='bannerUrl' defaultValue={profile?.banner?.url ?? ''} />
      </label>
      <label>
        Banner alt
        <input name='bannerAlt' defaultValue={profile?.banner?.alt ?? ''} />
      </label>
      <label>
        Venue manager
        <input name='venueManager' type='checkbox' defaultChecked={isManager} />
      </label>
      <button disabled={isPending} type='submit'>
        Save
      </button>
    </form>
  );
};

export default EditProfileForm;

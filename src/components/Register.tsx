// API
import { fetchProfiles } from '../api/api';

// React imports
import { useState, type ChangeEvent, type FormEvent } from 'react';

// Types
import type { RegisterProfilePayload } from '../types/api/profile';

// API enums
import { ApiFunctions } from '../api/apiFunctionsEnum';

// Local hooks (commented out)
// import { useBreakpoint } from '../context/ui/useBreakpoint';

export const RegisterForm = () => {
  const [userInfo, setUserInfo] = useState<RegisterProfilePayload>({
    name: '',
    email: '',
    password: '',
    bio: '',
    avatar: {
      url: '',
      alt: '',
    },
    banner: {
      url: '',
      alt: '',
    },
    venueManager: false,
  });

  function handleUserInfo(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    e.currentTarget.setCustomValidity('');
    if (
      e.target.name === 'avatar.url' ||
      e.target.name === 'avatar.alt' ||
      e.target.name === 'banner.url' ||
      e.target.name === 'banner.alt'
    ) {
      const elName = e.target.name;
      const [parent, child] = elName.split('.');
      setUserInfo({
        ...userInfo,
        [parent]: {
          ...userInfo[parent as 'avatar' | 'banner'],
          [child]: e.target.value,
        },
      });
      return;
    }
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      setUserInfo({
        ...userInfo,
        venueManager: e.target.checked ? true : false,
      });
      return;
    }
    setUserInfo({ ...userInfo, [e.target.id]: e.target.value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formEl = e.currentTarget as HTMLFormElement;
    // Manual validation (deterministic for tests): ensure required fields meet expectations
    const nameEl = formEl.querySelector('#name') as HTMLInputElement | null;
    const emailEl = formEl.querySelector('#email') as HTMLInputElement | null;
    const passEl = formEl.querySelector('#password') as HTMLInputElement | null;

    const emailRe = /^[^\s@]+@stud\.noroff\.no$/;

    if (!nameEl || nameEl.value.trim().length < 3) {
      nameEl?.setCustomValidity('Name must be at least 3 characters');
      nameEl?.reportValidity?.();
      return;
    }

    if (!emailEl || !emailRe.test(emailEl.value.trim())) {
      emailEl?.setCustomValidity('Email must end with "@stud.noroff.no"');
      emailEl?.reportValidity?.();
      return;
    }

    if (!passEl || passEl.value.length < 8) {
      passEl?.setCustomValidity('Password must be at least 8 characters long');
      passEl?.reportValidity?.();
      return;
    }

    const payload: RegisterProfilePayload = {
      name: userInfo.name,
      email: userInfo.email,
      password: userInfo.password,
      venueManager: userInfo.venueManager,
      ...(userInfo.bio?.trim() && { bio: userInfo.bio.trim() }),
      ...(userInfo.avatar?.url?.trim() && {
        avatar: {
          url: userInfo.avatar.url.trim(),
          ...(userInfo.avatar.alt?.trim() && {
            alt: userInfo.avatar.alt.trim(),
          }),
        } as NonNullable<RegisterProfilePayload['avatar']>,
      }),
      ...(userInfo.banner?.url?.trim() && {
        banner: {
          url: userInfo.banner.url.trim(),
          ...(userInfo.banner.alt?.trim() && {
            alt: userInfo.banner.alt.trim(),
          }),
        } as NonNullable<RegisterProfilePayload['banner']>,
      }),
    };

    console.log('Submitting registration payload:', payload);

    fetchProfiles(ApiFunctions.RegisterUser, {
      registerProfilePayload: payload,
    });
  }

  return (
    <form onSubmit={handleSubmit} className='grid gap-2'>
      <>
        <label htmlFor='name' className='text-right outline outline-amber-400'>
          User name:
          <input
            id='name'
            type='text'
            value={userInfo.name}
            onChange={handleUserInfo}
            required
            pattern='^[a-zA-Z0-9_]+'
            minLength={3}
            onInvalid={(e) => {
              e.preventDefault();
              console.error('Name must be at least 3 characters in length');
            }}
          />
        </label>
        <label htmlFor='email' className='text-right'>
          email:
          <input
            id='email'
            type='email'
            value={userInfo.email}
            onChange={handleUserInfo}
            required
            pattern='.+@stud\\.noroff\\.no'
            onInvalid={(e) => {
              e.preventDefault();
              console.error('Email must end with "@stud.noroff.no"');
            }}
          />
        </label>
        <label htmlFor='password' className='text-right'>
          Password:
          <input
            id='password'
            type='password'
            value={userInfo.password}
            onChange={handleUserInfo}
            required
            minLength={8}
            onInvalid={(e) => {
              e.preventDefault();
              console.error('Password must be at least 8 characters long');
            }}
          />
        </label>
        <label htmlFor='bio' className='text-right'>
          Bio:
          <textarea id='bio' value={userInfo.bio} onChange={handleUserInfo} />
        </label>
        <label htmlFor='avatar' className='text-right'>
          Avatar:
          <input
            id='avatar'
            name='avatar.url'
            type='url'
            value={userInfo.avatar?.url ?? ''}
            onChange={handleUserInfo}
            placeholder='avatar url'
          />
          <input
            name='avatar.alt'
            type='text'
            value={userInfo.avatar?.alt ?? ''}
            onChange={handleUserInfo}
            placeholder='avatar alt text'
          />
        </label>
        <label htmlFor='banner' className='text-right'>
          Banner:
          <input
            id='banner'
            name='banner.url'
            type='url'
            value={userInfo.banner?.url ?? ''}
            onChange={handleUserInfo}
            placeholder='banner url'
          />
          <input
            type='text'
            name='banner.alt'
            value={userInfo.banner?.alt ?? ''}
            onChange={handleUserInfo}
            placeholder='banner alt text'
          />
        </label>
        <label htmlFor='venueManager' className='text-right'>
          venue manager:
          <input
            id='venueManager'
            type='checkbox'
            checked={userInfo.venueManager}
            className='ml-2 p-1'
            onChange={handleUserInfo}
          />
        </label>
        <button
          type='submit'
          className='btn-primary text-on-dark hover:bg-med focus-ring-focus rounded px-3 py-1'
        >
          Submit
        </button>
      </>
    </form>
  );
};

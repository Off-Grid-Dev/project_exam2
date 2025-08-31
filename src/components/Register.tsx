import { getData } from '../api/api';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { RegisterProfilePayload } from '../types/api/profile';
import { ApiFunctions } from '../api/api';

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

    getData(ApiFunctions.RegisterUser, { registerProfilePayload: payload });
  }

  return (
    <form onSubmit={handleSubmit} className='grid gap-2'>
      <label htmlFor='name' className='text-right outline outline-amber-400'>
        User name:
        <input
          id='name'
          type='text'
          value={userInfo.name}
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
          onChange={handleUserInfo}
          required
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
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
          onChange={handleUserInfo}
          required
          pattern='.+@stud\.noroff\.no'
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
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
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
        <textarea
          id='bio'
          value={userInfo.bio}
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
          onChange={handleUserInfo}
        />
      </label>
      <label htmlFor='avatar' className='text-right'>
        Avatar:
        <input
          id='avatar'
          name='avatar.url'
          type='url'
          value={userInfo.avatar?.url ?? ''}
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
          onChange={handleUserInfo}
          placeholder='avatar url'
        />
        <input
          name='avatar.alt'
          type='text'
          value={userInfo.avatar?.alt ?? ''}
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
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
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
          onChange={handleUserInfo}
          placeholder='banner url'
        />
        <input
          type='text'
          name='banner.alt'
          value={userInfo.banner?.alt ?? ''}
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
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
      <button type='submit'>Submit</button>
    </form>
  );
};

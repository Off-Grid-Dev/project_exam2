import { getData } from '../api/api';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import type { RegisterProfilePayload } from '../types/api/profile';

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

  function handleUserInfo(e: ChangeEvent<HTMLInputElement>) {
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
    if (e.target.type === 'checkbox') {
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
    getData('register user', {});
  }

  useEffect(() => {
    console.log(
      `\n\tname: ${userInfo.name}
    email: ${userInfo.email}
    password: ${userInfo.password}
    bio: ${userInfo.bio}
    avatar:\n\t\turl: ${userInfo.avatar?.url}\n\t\talt: ${userInfo.avatar?.alt}
    banner:\n\t\turl: ${userInfo.banner?.url}\n\t\talt: ${userInfo.banner?.alt}
    venue manager: ${userInfo.venueManager}`,
    );
  }, [userInfo]);

  return (
    <form onSubmit={handleSubmit} className='grid gap-2'>
      <label htmlFor='name' className='text-right'>
        User name:
        <input
          id='name'
          type='text'
          value={userInfo.name}
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
          onChange={handleUserInfo}
        />
      </label>
      <label htmlFor='email' className='text-right'>
        email:
        <input
          id='email'
          type='text'
          value={userInfo.email}
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
          onChange={handleUserInfo}
        />
      </label>
      <label htmlFor='password' className='text-right'>
        Password:
        <input
          id='password'
          type='text'
          value={userInfo.password}
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
          onChange={handleUserInfo}
        />
      </label>
      <label htmlFor='bio' className='text-right'>
        Bio:
        <input
          id='bio'
          type='text'
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
          type='text'
          value={userInfo.avatar?.url}
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
          onChange={handleUserInfo}
          placeholder='avatar url'
        />
        <input
          name='avatar.alt'
          type='text'
          value={userInfo.avatar?.alt}
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
          type='text'
          value={userInfo.banner?.url}
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
          onChange={handleUserInfo}
          placeholder='banner url'
        />
        <input
          type='text'
          name='banner.alt'
          value={userInfo.banner?.alt}
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
      <button>Submit</button>
    </form>
  );
};

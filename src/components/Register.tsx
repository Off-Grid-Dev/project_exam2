// API
import { fetchProfiles } from '../api/api';
import { useNavigate } from 'react-router-dom';

// React imports
import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';

// Types
import type { RegisterProfilePayload } from '../types/api/profile';

// API enums
import { ApiFunctions } from '../api/apiFunctionsEnum';
import Button from './Button';
import { useAuth } from '../context/auth/useAuth';

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
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  function handleUserInfo(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    e.currentTarget.setCustomValidity('');
    // clear inline error for this field
    const id = e.currentTarget.id;
    if (id) setErrors((s) => ({ ...s, [id]: undefined }));
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

  const navigate = useNavigate();
  const { login } = useAuth();

  // form validity state
  const [isValid, setIsValid] = useState(false);

  // validate fields whenever they change
  useEffect(() => {
    const emailRe = /^[^\s@]+@stud\.noroff\.no$/;
    // require at least 3 characters for the name to match submit-time validation
    const okName = Boolean(userInfo.name && userInfo.name.trim().length >= 3);
    const okEmail = Boolean(userInfo.email && emailRe.test(userInfo.email));
    const okPass = Boolean(userInfo.password && userInfo.password.length >= 8);
    setIsValid(Boolean(okName && okEmail && okPass));
  }, [userInfo]);

  async function handleSubmit(e: FormEvent) {
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

    const res = await fetchProfiles(ApiFunctions.RegisterUser, {
      registerProfilePayload: payload,
    });
    // After registering, attempt to log the user in using the submitted credentials.
    await fetchProfiles(ApiFunctions.LoginUser, {
      loginProfilePayload: {
        email: payload.email,
        password: payload.password,
      },
    });
    // storeToken is handled by fetchProfiles(LoginUser), now tell context we're logged in
    login();

    // After registration (and attempted login), navigate to the home page.
    navigate('/');
    return res;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto grid w-full max-w-lg gap-3 p-4'
    >
      <label htmlFor='name' className='flex flex-col text-sm'>
        <span className='mb-1'>User name:</span>
        <input
          id='name'
          type='text'
          value={userInfo.name}
          onChange={handleUserInfo}
          required
          pattern='^[a-zA-Z0-9_]+'
          minLength={3}
          onInvalid={(e) => {
            const el = e.currentTarget as HTMLInputElement;
            const msg = 'Name must be at least 3 characters in length';
            el.setCustomValidity(msg);
            setErrors((s) => ({ ...s, name: msg }));
          }}
          className='mt-1 w-full rounded border px-2 py-1 focus:ring focus:outline-none'
        />
        {errors.name ? (
          <small className='mt-1 text-red-600' role='alert'>
            {errors.name}
          </small>
        ) : null}
      </label>

      <label htmlFor='email' className='flex flex-col text-sm'>
        <span className='mb-1'>Email:</span>
        <input
          id='email'
          type='email'
          value={userInfo.email}
          onChange={handleUserInfo}
          required
          // remove HTML pattern to avoid browser-level mismatches; validation is handled
          // in-code (useEffect and onSubmit) where we use a deterministic regex
          onInvalid={(e) => {
            const el = e.currentTarget as HTMLInputElement;
            const msg = 'Email must end with "@stud.noroff.no"';
            el.setCustomValidity(msg);
            setErrors((s) => ({ ...s, email: msg }));
          }}
          className='mt-1 w-full rounded border px-2 py-1 focus:ring focus:outline-none'
        />
        {errors.email ? (
          <small className='mt-1 text-red-600' role='alert'>
            {errors.email}
          </small>
        ) : null}
      </label>

      <label htmlFor='password' className='flex flex-col text-sm'>
        <span className='mb-1'>Password:</span>
        <input
          id='password'
          type='password'
          value={userInfo.password}
          onChange={handleUserInfo}
          required
          minLength={8}
          onInvalid={(e) => {
            const el = e.currentTarget as HTMLInputElement;
            const msg = 'Password must be at least 8 characters long';
            el.setCustomValidity(msg);
            setErrors((s) => ({ ...s, password: msg }));
          }}
          className='mt-1 w-full rounded border px-2 py-1 focus:ring focus:outline-none'
        />
        {errors.password ? (
          <small className='mt-1 text-red-600' role='alert'>
            {errors.password}
          </small>
        ) : null}
      </label>

      <label htmlFor='bio' className='flex flex-col text-sm'>
        <span className='mb-1'>Bio:</span>
        <textarea
          id='bio'
          value={userInfo.bio}
          onChange={handleUserInfo}
          className='mt-1 w-full rounded border px-2 py-1'
        />
      </label>

      <div className='grid gap-2'>
        <label className='flex flex-col text-sm'>
          <span className='mb-1'>Avatar URL</span>
          <input
            id='avatar'
            name='avatar.url'
            type='url'
            value={userInfo.avatar?.url ?? ''}
            onChange={handleUserInfo}
            placeholder='avatar url'
            className='mt-1 w-full rounded border px-2 py-1'
          />
        </label>
        <label className='flex flex-col text-sm'>
          <span className='mb-1'>Avatar alt text</span>
          <input
            name='avatar.alt'
            type='text'
            value={userInfo.avatar?.alt ?? ''}
            onChange={handleUserInfo}
            placeholder='avatar alt text'
            className='mt-1 w-full rounded border px-2 py-1'
          />
        </label>
      </div>

      <div className='grid gap-2'>
        <label className='flex flex-col text-sm'>
          <span className='mb-1'>Banner URL</span>
          <input
            id='banner'
            name='banner.url'
            type='url'
            value={userInfo.banner?.url ?? ''}
            onChange={handleUserInfo}
            placeholder='banner url'
            className='mt-1 w-full rounded border px-2 py-1'
          />
        </label>
        <label className='flex flex-col text-sm'>
          <span className='mb-1'>Banner alt text</span>
          <input
            type='text'
            name='banner.alt'
            value={userInfo.banner?.alt ?? ''}
            onChange={handleUserInfo}
            placeholder='banner alt text'
            className='mt-1 w-full rounded border px-2 py-1'
          />
        </label>
      </div>

      <label htmlFor='venueManager' className='flex items-center gap-2 text-sm'>
        <input
          id='venueManager'
          type='checkbox'
          checked={userInfo.venueManager}
          className='ml-0 p-1'
          onChange={handleUserInfo}
        />
        <span>Venue manager:</span>
      </label>

      <Button
        type='submit'
        disabled={!isValid}
        additionalClasses='w-full sm:w-auto'
      >
        Submit
      </Button>
    </form>
  );
};

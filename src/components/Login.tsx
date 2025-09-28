// React imports
import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
import type { LoginProfilePayload } from '../types/api/profile';

// API
import { fetchProfiles } from '../api/api';

// Context/hooks
import { useAuth } from '../context/auth/useAuth';

// API enums
import { ApiFunctions } from '../api/apiFunctionsEnum';
import Button from './Button';

type LoginInfo = LoginProfilePayload;

export const LoginForm = () => {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const { login } = useAuth();
  const navigate = useNavigate();

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const emailRe = /^[^\s@]+@stud\.noroff\.no$/;
    const okEmail = Boolean(loginInfo.email && emailRe.test(loginInfo.email));
    const okPass = Boolean(
      loginInfo.password && loginInfo.password.length >= 8,
    );
    setIsValid(okEmail && okPass);
  }, [loginInfo]);

  function setFieldInvalid(field: 'email' | 'password', message: string) {
    setErrors((s) => ({ ...s, [field]: message }));
  }

  function handleFormUpdate(e: ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    // clear browser custom validity and inline error when user edits
    (e.currentTarget as HTMLInputElement).setCustomValidity('');
    setErrors((s) => ({ ...s, [id]: undefined }));
    setLoginInfo({ ...loginInfo, [id]: value });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const payload: LoginProfilePayload = {
      email: loginInfo.email,
      password: loginInfo.password,
    };

    const res = await fetchProfiles(ApiFunctions.LoginUser, {
      loginProfilePayload: payload,
    });

    // if the API stored the token, call login() and navigate to profile
    const accessToken = localStorage.getItem('accessToken');
    const name = localStorage.getItem('accessName');
    if (accessToken && accessToken !== '') {
      login();
      if (name) navigate(`/profiles/${encodeURIComponent(name)}`);
    }
    return res;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto grid w-full max-w-md gap-3 bg-transparent p-4'
    >
      <label htmlFor='email' className='flex flex-col text-sm'>
        <span className='mb-1'>Email:</span>
        <input
          id='email'
          name='email'
          type='email'
          onChange={handleFormUpdate}
          value={loginInfo.email}
          required
          onInvalid={(e) => {
            const el = e.currentTarget as HTMLInputElement;
            const msg =
              'Email must end with "@stud.noroff.no" and be a valid address';
            el.setCustomValidity(msg);
            setFieldInvalid('email', msg);
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
          name='password'
          type='password'
          onChange={handleFormUpdate}
          value={loginInfo.password}
          required
          minLength={8}
          onInvalid={(e) => {
            const el = e.currentTarget as HTMLInputElement;
            const msg = 'Password must be at least 8 characters';
            el.setCustomValidity(msg);
            setFieldInvalid('password', msg);
          }}
          className='mt-1 w-full rounded border px-2 py-1 focus:ring focus:outline-none'
        />
        {errors.password ? (
          <small className='mt-1 text-red-600' role='alert'>
            {errors.password}
          </small>
        ) : null}
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

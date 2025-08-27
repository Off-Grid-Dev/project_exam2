import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';

import type { LoginProfilePayload } from '../types/api/profile';
import { getData } from '../api/api';
import { useAuth } from '../api/AuthContext';

type LoginInfo = LoginProfilePayload;

export const LoginForm = () => {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: '',
    password: '',
  });

  const { login } = useAuth();

  function handleInvalid(e: FormEvent<HTMLInputElement>, message: string) {
    e.preventDefault();
    console.error(message);
  }

  function handleFormUpdate(e: ChangeEvent<HTMLInputElement>) {
    setLoginInfo({ ...loginInfo, [e.target.id]: e.target.value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const payload: LoginProfilePayload = {
      email: loginInfo.email,
      password: loginInfo.password,
    };

    console.log('Submitting login payload:', payload);

    getData('login user', { loginProfilePayload: payload });

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && accessToken !== undefined) login();
  }

  useEffect(() => {
    console.log(` email: ${loginInfo.email}\n password: ${loginInfo.password}`);
  }, [loginInfo]);

  return (
    <form onSubmit={handleSubmit} className='grid gap-2'>
      <label htmlFor='email' className='text-right outline outline-amber-400'>
        Email:
        <input
          id='email'
          name='email'
          type='text'
          onChange={handleFormUpdate}
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
          value={loginInfo.email}
          pattern='.+@stud\.noroff\.no'
          required
          onInvalid={(e) => handleInvalid(e, 'please enter a valid email')}
        />
      </label>
      <label
        htmlFor='password'
        className='text-right outline outline-amber-400'
      >
        Password:
        <input
          id='password'
          name='password'
          type='password'
          onChange={handleFormUpdate}
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
          value={loginInfo.password}
          required
          minLength={8}
          onInvalid={(e) => {
            handleInvalid(e, 'please enter a valid password');
          }}
        />
      </label>
      <button type='submit'>Submit</button>
    </form>
  );
};

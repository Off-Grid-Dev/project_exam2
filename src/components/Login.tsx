import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { LoginProfilePayload } from '../types/api/profile';
import { fetchProfiles } from '../api/api';
import { useAuth } from '../context/auth/useAuth';
import { ApiFunctions } from '../api/apiFunctionsEnum';
import {
  createClassOptions,
  composeClasses,
  getClassFor,
} from '../context/ui/classOptionsTemplate';
import { useBreakpoint } from '../context/ui/useBreakpoint';

type LoginInfo = LoginProfilePayload;

export const LoginForm = () => {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: '',
    password: '',
  });

  const { login } = useAuth();

  // TODO abstract to file and use in other forms
  // TODO add toast
  function handleInvalid(
    e: FormEvent<HTMLInputElement>,
    message: string,
    type: string,
  ) {
    e.preventDefault();
    let typeMessage;
    if (type === 'warning') {
      typeMessage = 'Warning: ';
    }
    console.error(typeMessage, message);
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

    fetchProfiles(ApiFunctions.LoginUser, { loginProfilePayload: payload });

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && accessToken !== undefined && accessToken !== '') login();
  }

  return (
    <form onSubmit={handleSubmit} className='grid gap-2'>
      {(() => {
        const opts = createClassOptions({
          desktopStyles: 'ml-2 rounded-lg border-2 border-border-dark p-2',
          tabletStyles: 'ml-2 rounded-lg border-2 border-border-dark p-2',
          mobileStyles:
            'ml-2 rounded-lg border-2 border-border-dark p-2 w-full',
        });

        const { breakpoint } = useBreakpoint();
        const inputClass = composeClasses(
          getClassFor(breakpoint, opts),
          'text-[var(--color-text-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]',
        );

        return (
          <>
            <label
              htmlFor='email'
              className='text-right outline outline-amber-400'
            >
              Email:
              <input
                id='email'
                name='email'
                type='text'
                onChange={handleFormUpdate}
                className={inputClass}
                value={loginInfo.email}
                pattern='.+@stud\.noroff\.no'
                required
                onInvalid={(e) =>
                  handleInvalid(e, 'warning', 'please enter a valid email')
                }
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
                className={inputClass}
                value={loginInfo.password}
                required
                minLength={8}
                onInvalid={(e) => {
                  handleInvalid(e, 'warning', 'please enter a valid password');
                }}
              />
            </label>
            <button
              type='submit'
              className='bg-dark text-on-dark hover:bg-med focus-ring-focus rounded px-3 py-1'
            >
              Submit
            </button>
          </>
        );
      })()}
    </form>
  );
};

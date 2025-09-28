// React imports
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
import type { LoginProfilePayload } from '../types/api/profile';

// API
import { fetchProfiles } from '../api/api';

// Context/hooks
import { useAuth } from '../context/auth/useAuth';

// API enums
import { ApiFunctions } from '../api/apiFunctionsEnum';

// Local hooks (commented out intentionally)
// import { useBreakpoint } from '../context/ui/useBreakpoint';

type LoginInfo = LoginProfilePayload;

export const LoginForm = () => {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: '',
    password: '',
  });

  const { login } = useAuth();
  const navigate = useNavigate();

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const payload: LoginProfilePayload = {
      email: loginInfo.email,
      password: loginInfo.password,
    };

    try {
      console.log('Submitting login payload:', payload);
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
    } catch (err) {
      console.error('Login failed', err);
      throw err;
    }
  }

  return (
    <form onSubmit={handleSubmit} className='grid gap-2'>
      <>
        <label htmlFor='email' className='text-right outline outline-amber-400'>
          Email:
          <input
            id='email'
            name='email'
            type='text'
            onChange={handleFormUpdate}
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
    </form>
  );
};

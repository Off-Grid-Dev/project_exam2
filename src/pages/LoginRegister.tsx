// React imports
import { useState, useEffect } from 'react';

// Components
import { LoginForm } from '../components/Login';
import { RegisterForm } from '../components/Register';

// Local hooks (commented out)
// import { useBreakpoint } from '../context/ui/useBreakpoint';

interface LoginRegisterProps {
  initialView?: 'login' | 'register';
}

export const LoginRegister = ({ initialView }: LoginRegisterProps) => {
  const [isLoginOrRegister, setIsLoginOrRegister] = useState<
    undefined | 'login' | 'register'
  >(initialView ?? undefined);

  // If the route provides an initialView prop (e.g. /login or /register),
  // ensure the internal state updates when that prop changes. This handles
  // the case where React re-uses the same component instance across route
  // transitions — updating state directly from props keeps the UI in sync.
  useEffect(() => {
    if (initialView !== undefined) setIsLoginOrRegister(initialView);
  }, [initialView]);

  return (
    <div>
      {isLoginOrRegister === undefined && (
        <>
          <h1 className='text-text-dark text-heading font-semibold'>
            LOGIN OR REGISTER
          </h1>
          <div className='my-4 flex justify-center gap-4'>
            <button
              onClick={() => setIsLoginOrRegister('login')}
              className='border-dark hover:bg-med cursor-pointer rounded-lg border px-3 py-2'
            >
              Log In
            </button>
            <button
              onClick={() => setIsLoginOrRegister('register')}
              className='border-dark hover:bg-med cursor-pointer rounded-lg border px-3 py-2'
            >
              Register
            </button>
          </div>
        </>
      )}
      {isLoginOrRegister === 'login' && (
        <div>
          <LoginForm />
          <p className='mt-3 text-center text-sm'>
            Do not have an account?{' '}
            <button
              onClick={() => setIsLoginOrRegister('register')}
              className='hover:text-dark underline'
              aria-label='switch to create account'
            >
              Create account
            </button>
          </p>
        </div>
      )}
      {isLoginOrRegister === 'register' && (
        <div>
          <RegisterForm />
          <p className='mt-3 text-center text-sm'>
            Already have an account?{' '}
            <button
              onClick={() => setIsLoginOrRegister('login')}
              className='hover:text-dark underline'
              aria-label='switch to sign in'
            >
              Sign in
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

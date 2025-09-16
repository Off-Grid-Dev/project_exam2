import { useState } from 'react';
import { LoginForm } from '../components/Login';
import { RegisterForm } from '../components/Register';
import {
  createClassOptions,
  getClassFor,
  composeClasses,
} from '../context/ui/classOptionsTemplate';
import { useBreakpoint } from '../context/ui/useBreakpoint';

export const LoginRegister = () => {
  const [isLoginOrRegister, setIsLoginOrRegister] = useState<
    undefined | 'login' | 'register'
  >(undefined);

  const opts = createClassOptions({
    desktopStyles:
      'm-auto mt-12 grid w-fit place-content-center gap-6 rounded-lg border-2 p-6 text-center',
    tabletStyles:
      'm-auto mt-10 grid w-fit place-content-center gap-4 rounded-lg border-2 p-4 text-center',
    mobileStyles:
      'm-auto mt-6 grid w-full place-content-center gap-3 rounded-lg border-2 p-3 text-center',
  });

  const { breakpoint } = useBreakpoint();
  const containerClass = composeClasses(getClassFor(breakpoint, opts));

  return (
    <div className={composeClasses(containerClass, 'border-dark bg-base-100')}>
      {isLoginOrRegister === undefined && (
        <>
          <h1 className='text-text-dark font-semibold'>LOGIN OR REGISTER</h1>
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
      {isLoginOrRegister === 'login' && <LoginForm />}
      {isLoginOrRegister === 'register' && <RegisterForm />}
    </div>
  );
};

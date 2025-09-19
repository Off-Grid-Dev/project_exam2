import { useState } from 'react';
import { LoginForm } from '../components/Login';
import { RegisterForm } from '../components/Register';
// import { useBreakpoint } from '../context/ui/useBreakpoint';

export const LoginRegister = () => {
  const [isLoginOrRegister, setIsLoginOrRegister] = useState<
    undefined | 'login' | 'register'
  >(undefined);

  return (
    <div>
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

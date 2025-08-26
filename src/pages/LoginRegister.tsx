import { useState } from 'react';
import { LoginForm } from '../components/Login';
import { RegisterForm } from '../components/Register';

export const LoginRegister = () => {
  const [isLoginOrRegister, setIsLoginOrRegister] = useState<
    undefined | 'login' | 'register'
  >(undefined);

  return (
    <div className='m-auto mx-auto mt-8 grid w-fit place-content-center gap-4 rounded-lg border-2 border-amber-700 p-4 text-center'>
      {isLoginOrRegister === undefined && (
        <>
          <h1>LOGIN OR REGISTER</h1>
          <div className='my-4 flex justify-center gap-4'>
            <button
              onClick={() => setIsLoginOrRegister('login')}
              className='cursor-pointer rounded-lg border border-amber-400 px-3 py-2 hover:border-amber-950'
            >
              Log In
            </button>
            <button
              onClick={() => setIsLoginOrRegister('register')}
              className='cursor-pointer rounded-lg border border-amber-400 px-3 py-2 hover:border-amber-950'
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

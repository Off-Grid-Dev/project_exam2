import { useEffect, useState, type ChangeEvent } from 'react';

export const RegisterForm = () => {
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  function handleEnterUserName(e: ChangeEvent<HTMLInputElement>) {
    setUserName(e.target.value);
  }
  function handleEnterPassword(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  useEffect(() => {
    console.log(`user name: ${userName}`, `password: ${password}`);
  }, [userName, password]);

  return (
    <form className='grid gap-2'>
      <label htmlFor='userName' className='text-right'>
        User name:
        <input
          type='text'
          value={userName ?? ''}
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
          onChange={handleEnterUserName}
        />
      </label>
      <label htmlFor='password' className='text-right'>
        Password:
        <input
          type='text'
          value={password ?? ''}
          className='ml-2 rounded-lg border-2 border-amber-300 p-1'
          onChange={handleEnterPassword}
        />
      </label>
      <button>Submit</button>
    </form>
  );
};

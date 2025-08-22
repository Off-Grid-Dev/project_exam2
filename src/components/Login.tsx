import { useState } from 'react';

export const LoginForm = () => {
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  return (
    <form>
      <label htmlFor='userName'>
        <input type='text' value={userName} />
      </label>
      <label htmlFor='password'>
        <input type='text' value={password} />
      </label>
      <button type='submit'>Submit</button>
    </form>
  );
};

import type { ReactNode, FC } from 'react';
import { Link } from 'react-router-dom';

type WrapperProps = {
  children: ReactNode;
};

export const Wrapper: FC<WrapperProps> = ({ children }) => {
  return (
    <>
      <header>
        <div>HOLIDAZE</div>
        <ul role='navigation'>
          <li>
            <Link to={'/'}>home</Link>
          </li>
          <li>
            <Link to={'/welcome'}>welcome</Link>
          </li>
        </ul>
      </header>
      {children}
    </>
  );
};

import type { ReactNode, FC } from 'react';
import { Link } from 'react-router-dom';

type WrapperProps = {
  children: ReactNode;
};

export const Wrapper: FC<WrapperProps> = ({ children }) => {
  return (
    <>
      <header className='flex justify-between bg-amber-950 px-8 py-6 align-middle text-white'>
        <Link to={'/'}>HOLIDAZE</Link>
        <ul className='flex gap-3 align-middle' role='navigation'>
          <li>
            <Link
              className='rounded-lg bg-white px-3 py-2 font-semibold text-amber-950 transition-colors duration-200 hover:bg-amber-800 hover:text-white'
              to={'/'}
            >
              home
            </Link>
          </li>
          <li>
            <Link
              className='rounded-lg bg-white px-3 py-2 font-semibold text-amber-950 transition-colors duration-200 hover:bg-amber-800 hover:text-white'
              to={'/welcome'}
            >
              welcome
            </Link>
          </li>
        </ul>
      </header>
      {children}
    </>
  );
};

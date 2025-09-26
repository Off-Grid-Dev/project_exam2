// React imports
import { type FC } from 'react';

// Routing
import { Link } from 'react-router-dom';

// Layout components
import { Wrapper } from './Wrapper';
import Nav from '../Nav';

export const Header: FC = () => {
  return (
    <>
      <header className='bg-bg-dark py-2'>
        <Wrapper>
          <div className='flex w-full items-center justify-between'>
            <Link to={'/'} className='text-text-logo text-xl font-semibold'>
              HOLIDAZE
            </Link>
            <Nav />
          </div>
        </Wrapper>
      </header>
    </>
  );
};

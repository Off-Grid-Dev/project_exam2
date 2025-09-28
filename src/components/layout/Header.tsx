// React imports
import { type FC, type MouseEvent } from 'react';

// Routing
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Layout components
import { Wrapper } from './Wrapper';
import Nav from '../Nav';

export const Header: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogoClick(e: MouseEvent<HTMLAnchorElement>) {
    if (location.pathname === '/') {
      e.preventDefault();
      navigate('/', { state: { reset: Date.now() } });
    }
    // otherwise Link will navigate normally
  }

  return (
    <>
      <header className='bg-bg-dark py-2'>
        <Wrapper>
          <div className='flex w-full items-center justify-between'>
            <Link
              to={'/'}
              className='text-text-logo text-xl font-semibold'
              onClick={handleLogoClick}
            >
              HOLIDAZE
            </Link>
            <Nav />
          </div>
        </Wrapper>
      </header>
    </>
  );
};

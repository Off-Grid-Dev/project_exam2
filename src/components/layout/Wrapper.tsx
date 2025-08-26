import type { ReactNode, FC } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../api/AuthContext';
import { getData } from '../../api/api';
import { useNavigate } from 'react-router-dom';

type WrapperProps = {
  children: ReactNode;
};

export const Wrapper: FC<WrapperProps> = ({ children }) => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    logout();
    console.log('user is logged out.');
    await getData('logout user');
    navigate('/');
  }
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
          {!isLoggedIn && (
            <li>
              <Link
                className='rounded-lg bg-white px-3 py-2 font-semibold text-amber-950 transition-colors duration-200 hover:bg-amber-800 hover:text-white'
                to={'/welcome'}
              >
                welcome
              </Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button
                className='rounded-lg bg-white px-3 py-2 font-semibold text-amber-950 transition-colors duration-200 hover:bg-amber-800 hover:text-white'
                onClick={handleLogout}
              >
                logout
              </button>
            </li>
          )}
        </ul>
      </header>
      {children}
    </>
  );
};

import { type FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth/useAuth';
import { fetchProfiles } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenValid } from '../../api/authToken';
import { Wrapper } from './Wrapper';

export const Header: FC = () => {
  const { isLoggedIn, login, logout } = useAuth();
  const navigate = useNavigate();

  function isUserLoggedIn() {
    const token = getToken();
    return isTokenValid(token);
  }

  async function handleLogout() {
    await fetchProfiles('logout user');
    logout();
    console.log('user is logged out.');
    navigate('/');
  }

  useEffect(() => {
    if (isUserLoggedIn()) login();
  }, [login]);

  return (
    <>
      <header className='bg-dark text-on-dark py-6'>
        <Wrapper>
          <Link to={'/'}>HOLIDAZE</Link>
          <ul className='flex gap-3 align-middle' role='navigation'>
            <li>
              <Link
                className='header-link inline-block rounded-lg px-3 py-2 font-semibold transition-colors duration-200'
                to={'/'}
              >
                home
              </Link>
            </li>
            {!isLoggedIn && (
              <li>
                <Link
                  className='header-link inline-block rounded-lg px-3 py-2 font-semibold transition-colors duration-200'
                  to={'/welcome'}
                >
                  welcome
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <>
                <li>
                  <Link
                    className='header-link inline-block rounded-lg px-3 py-2 font-semibold transition-colors duration-200'
                    to={'/profile'}
                  >
                    profile
                  </Link>
                </li>
                <li>
                  <button
                    className='header-link rounded-lg px-3 py-2 font-semibold transition-colors duration-200'
                    onClick={handleLogout}
                  >
                    logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </Wrapper>
      </header>
    </>
  );
};

import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/auth/useAuth';
import { fetchProfiles } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenValid } from '../api/authToken';
import NavLink from './NavLink';

const Nav = () => {
  const { isLoggedIn, login, logout } = useAuth();
  const navigate = useNavigate();

  function isUserLoggedIn() {
    const token = getToken();
    return isTokenValid(token);
  }

  async function handleLogout() {
    await fetchProfiles('logout user');
    logout();
    navigate('/');
  }

  useEffect(() => {
    if (isUserLoggedIn()) login();
  }, [login]);

  return (
    <ul className='text-text-base flex gap-3 align-middle' role='navigation'>
      <NavLink path='/' label='home' />
      {!isLoggedIn && <NavLink path='/welcome' label='welcome' />}
      {isLoggedIn && (
        <>
          <NavLink path='/profile' label='profile' />
          <li>
            <button
              aria-label='log out of current profile'
              className='header-link rounded-lg px-3 py-2 font-semibold transition-colors duration-200'
              onClick={handleLogout}
            >
              logout
            </button>
          </li>
        </>
      )}
    </ul>
  );
};

export default Nav;

// React imports
import { useEffect } from 'react';

// Context/hooks/components
import { useAuth } from '../context/auth/useAuth';
import NavLink from './NavLink';
import NavDropdown from './NavDropdown';

// Routing
import { useNavigate } from 'react-router-dom';

// Utilities
import {
  getToken,
  isTokenValid,
  getStoredVenueManager,
  getStoredName,
} from '../api/authToken';

const Nav = () => {
  const { isLoggedIn, login, logout } = useAuth();
  const navigate = useNavigate();

  function isUserLoggedIn() {
    const token = getToken();
    return isTokenValid(token);
  }

  async function handleLogout() {
    logout();
    navigate('/');
  }

  useEffect(() => {
    if (isUserLoggedIn()) login();
  }, [login]);

  const isVenueManager = getStoredVenueManager();
  const storedName = getStoredName();
  const profilePath = storedName
    ? `/profiles/${encodeURIComponent(storedName)}`
    : '/profiles';

  const accountItems = [
    {
      label: 'my venues',
      path: `${profilePath}?tab=venues`,
      aria: 'view my venues',
      condition: isVenueManager,
    },
    {
      label: 'my bookings',
      path: `${profilePath}?tab=bookings`,
      aria: 'view my bookings',
    },
    {
      label: 'my account',
      path: `${profilePath}?tab=account`,
      aria: 'view my account',
    },
    {
      label: 'create venue',
      path: `${profilePath}?tab=create`,
      aria: 'create a new venue',
      condition: isVenueManager,
    },
  ];

  return (
    <ul className='text-text-base flex gap-3 align-middle' role='navigation'>
      <NavLink path='/' label='home' aria='return to home page' />

      {!isLoggedIn && (
        <NavDropdown
          label='welcome'
          ariaLabel='welcome menu'
          items={[
            { label: 'log in', path: '/login', aria: 'go to login page' },
            {
              label: 'register',
              path: '/register',
              aria: 'go to register page',
            },
          ]}
        />
      )}

      {isLoggedIn && (
        <>
          <NavLink path='/profiles' label='profile' aria='view profiles' />

          <NavDropdown
            label='account'
            ariaLabel='account menu'
            items={accountItems}
          />

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

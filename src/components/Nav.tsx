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
  clearToken,
} from '../api/authToken';

const Nav = () => {
  const { isLoggedIn, login, logout } = useAuth();
  const navigate = useNavigate();

  function isUserLoggedIn() {
    const token = getToken();
    return isTokenValid(token);
  }

  function handleLogout() {
    // update auth state and clear stored token synchronously
    logout();
    clearToken();

    // ensure React state updates have been flushed before navigating
    // (navigation can cause unmounts that may interfere with pending state updates)
    Promise.resolve().then(() => navigate('/'));
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
          <NavLink path='/profiles' label='profiles' aria='view profiles' />

          <NavDropdown
            label='account'
            ariaLabel='account menu'
            items={accountItems}
          />

          <li>
            <button
              type='button'
              onClick={handleLogout}
              className='header-link rounded-lg px-3 py-2 font-semibold transition-colors duration-200'
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

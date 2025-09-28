// React imports
import { useEffect } from 'react';

// Context/hooks/components
import { useAuth } from '../context/auth/useAuth';
import NavLink from './NavLink';
import NavDropdown from './NavDropdown';

// API
import { fetchProfiles } from '../api/api';

// Routing
import { useNavigate } from 'react-router-dom';

// Utilities
import {
  getToken,
  isTokenValid,
  getStoredVenueManager,
} from '../api/authToken';

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

  const isVenueManager = getStoredVenueManager();

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

          <NavLink
            path='/my/bookings'
            label='my bookings'
            aria='view my bookings'
          />

          <NavDropdown
            label='account'
            ariaLabel='account menu'
            items={[
              {
                label: 'my venues',
                path: '/venues/mine',
                aria: 'view my venues',
                condition: isVenueManager,
              },
              {
                label: 'venue bookings',
                path: '/venues/mine/bookings',
                aria: 'view venue bookings',
                condition: isVenueManager,
              },
              {
                label: 'create venue',
                path: '/venues/new',
                aria: 'create a new venue',
                condition: isVenueManager,
              },
            ]}
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

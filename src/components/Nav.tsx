// React imports
import { useEffect, useState, useRef } from 'react';

// Context/hooks/components
import { useAuth } from '../context/auth/useAuth';
import NavLink from './NavLink';
import NavDropdown from './NavDropdown';
import { useBreakpoint } from '../context/ui/useBreakpoint';

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
  const { breakpoint } = useBreakpoint();

  const isMobileOrTablet = breakpoint !== 'desktop';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const openButtonRef = useRef<HTMLButtonElement | null>(null);

  function openMobileMenu() {
    setMobileMenuOpen(true);
  }

  // close immediately (animate) when we switch to desktop so UI stays consistent
  useEffect(() => {
    if (breakpoint === 'desktop') setMobileMenuOpen(false);
  }, [breakpoint]);

  function handleCloseRequest() {
    // animate panel off-screen to the right, then set state false when transition ends
    const el = panelRef.current;
    if (!el) {
      setMobileMenuOpen(false);
      return;
    }

    const onTransitionEnd = () => {
      el.removeEventListener('transitionend', onTransitionEnd);
      setMobileMenuOpen(false);
    };

    el.addEventListener('transitionend', onTransitionEnd);
    // trigger closing transform
    el.style.transform = 'translateX(100%)';
  }

  // when panel opens, run an entry animation from translateX(100%) -> 0
  useEffect(() => {
    const el = panelRef.current;
    if (!mobileMenuOpen || !el) return;
    // ensure starting off-screen
    el.style.transition = 'transform 300ms ease';
    el.style.transform = 'translateX(100%)';
    // start on next frame so transition runs
    requestAnimationFrame(() => {
      el.style.transform = 'translateX(0)';
    });
  }, [mobileMenuOpen]);

  // Close the mobile panel when clicking outside of it (and not on the open button)
  useEffect(() => {
    if (!isMobileOrTablet || !mobileMenuOpen) return;

    function handleDocClick(e: MouseEvent) {
      const target = e.target as Node | null;
      const panel = panelRef.current;
      const btn = openButtonRef.current;
      if (!panel) return;
      const element = target as HTMLElement | null;
      if (element?.closest('[data-dropdown-toggle="true"]')) return;
      if (panel.contains(target)) return; // click inside panel -> ignore
      if (btn && btn.contains(target)) return; // click on open button -> ignore
      // otherwise request close
      handleCloseRequest();
    }

    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [isMobileOrTablet, mobileMenuOpen]);

  if (isMobileOrTablet) {
    return (
      <div>
        <button
          ref={openButtonRef}
          aria-label='open menu'
          className='rounded-lg px-3 py-2 font-semibold'
          onClick={openMobileMenu}
        >
          {/* simple hamburger icon */}
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            aria-hidden
          >
            <path
              d='M3 6h18M3 12h18M3 18h18'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
            />
          </svg>
        </button>

        {/* slide-out panel */}
        {mobileMenuOpen && (
          <div
            ref={panelRef}
            className='bg-bg-dark fixed top-0 right-0 z-50 h-full w-72 shadow-lg'
            style={{
              transform: 'translateX(100%)',
              transition: 'transform 300ms ease',
            }}
            role='dialog'
            aria-label='mobile navigation'
          >
            <div className='flex justify-end p-3'>
              <button
                type='button'
                aria-label='close menu'
                onClick={handleCloseRequest}
                className='relative z-60 rounded px-2 py-1'
              >
                ✕
              </button>
            </div>
            <nav
              className='p-4'
              // close menu when any link/button inside the nav is clicked (mobile/tablet only)
              onClick={(e) => {
                if (!isMobileOrTablet) return;
                const target = e.target as HTMLElement | null;
                if (!target) return;
                const actionable = target.closest('a,button');
                if (actionable) {
                  // If the click originated from a dropdown toggle button,
                  // allow the dropdown to toggle without closing the mobile nav.
                  if (actionable.closest('[data-dropdown-toggle="true"]')) {
                    return;
                  }
                  // if the click is on the close button inside panel, it already
                  // calls handleCloseRequest; still safe to call again
                  handleCloseRequest();
                }
              }}
            >
              <ul className='flex flex-col gap-3'>
                <NavLink path='/' label='home' aria='return to home page' />

                {!isLoggedIn && (
                  <NavDropdown
                    label='welcome'
                    ariaLabel='welcome menu'
                    items={[
                      {
                        label: 'log in',
                        path: '/login',
                        aria: 'go to login page',
                      },
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
                    <NavLink
                      path='/profiles'
                      label='profiles'
                      aria='view profiles'
                    />
                    <NavDropdown
                      label='account'
                      ariaLabel='account menu'
                      items={accountItems}
                    />
                    <li>
                      <button
                        type='button'
                        onClick={handleLogout}
                        className='cursor-pointer rounded-lg px-3 py-2 font-semibold transition-colors duration-200'
                      >
                        logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        )}
      </div>
    );
  }

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
          <NavLink
            path='/profiles'
            label='profiles'
            aria='view profiles'
            resetOnClick
          />

          <NavDropdown
            label='account'
            ariaLabel='account menu'
            items={accountItems}
          />

          <li>
            <button
              type='button'
              onClick={handleLogout}
              className='cursor-pointer rounded-lg px-3 py-2 font-semibold transition-colors duration-200'
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

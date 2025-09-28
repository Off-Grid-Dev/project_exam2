// React imports
import type { FC } from 'react';
import type { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useContext } from 'react';
import { BreakpointContext } from '../context/ui/BreakpointContext';

// Reuse the NavLink visual style for dropdown anchor items. NavLink component
// currently renders an <li><Link/></li>, so we create a small in-file anchor
// that matches the same classes for consistent visuals inside the dropdown.
// NOTE: keep this string in sync with src/components/NavLink.tsx
const dropdownAnchorClass = `hover:text-secondary-200 after:to-secondary-200 relative inline-block cursor-pointer rounded-lg w-fit py-2 font-semibold transition-colors duration-200 after:absolute after:inset-x-1 after:bottom-1 after:h-[2px] after:rounded-full after:bg-linear-to-r after:from-transparent after:from-45% after:bg-size-[400%] after:bg-left after:transition-[background-position] after:duration-300 after:content-[''] hover:after:bg-right hover:after:duration-1000`;

type DropdownItem = {
  label: string;
  path?: string;
  onClick?: ((e?: MouseEvent<HTMLButtonElement>) => void) | undefined;
  condition?: boolean;
  aria?: string;
};

type NavDropdownProps = {
  label: string;
  items: DropdownItem[];
  ariaLabel?: string;
  align?: 'left' | 'right';
};

const NavDropdown: FC<NavDropdownProps> = ({
  label,
  items,
  ariaLabel = undefined,
  align = 'right',
}) => {
  // Use BreakpointContext directly so this component is resilient in tests
  // (useBreakpoint hook throws when there's no provider). If there's no provider
  // assume non-desktop so dropdowns stay hidden.
  const ctx = useContext(BreakpointContext);
  const breakpoint = ctx?.breakpoint ?? 'mobile';
  const isDesktop = breakpoint === 'desktop';

  const menuAlignClass = align === 'left' ? 'left-0' : 'right-0';

  const desktopVisibilityClasses =
    'absolute top-full grid ' +
    menuAlignClass +
    ' bg-bg-dark w-36 text-text-base rounded-md shadow-lg px-3 py-1 ring-1 ring-black ring-opacity-5 transition-opacity duration-200 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto focus-within:opacity-100 focus-within:pointer-events-auto';

  const hiddenOnNonDesktop = isDesktop ? desktopVisibilityClasses : 'hidden';

  const navigate = useNavigate();

  const handleSpecialNav = (e: ReactMouseEvent, path: string) => {
    // If the link points to the login/register routes and we're already on
    // the LoginRegister page, force navigation via the router so the
    // `initialView` prop is updated and the form toggles immediately.
    e.preventDefault();
    navigate(path);
  };

  return (
    <li className='group relative'>
      <button
        type='button'
        aria-label={ariaLabel ?? label}
        className='inline-flex items-center rounded-lg px-3 py-2 font-semibold transition-colors duration-200'
      >
        {label}
      </button>

      <div
        className={hiddenOnNonDesktop}
        role='menu'
        aria-label={ariaLabel ?? `${label} menu`}
      >
        {items.map((it, idx) => {
          if (it.condition === false) return null;

          const key = `${label}-item-${idx}`;

          if (it.path) {
            const isSpecial = it.path === '/login' || it.path === '/register';
            return (
              <Link
                key={key}
                to={it.path}
                role='menuitem'
                aria-label={it.aria ?? it.label}
                className={dropdownAnchorClass}
                onClick={
                  isSpecial ? (e) => handleSpecialNav(e, it.path!) : undefined
                }
              >
                {it.label}
              </Link>
            );
          }

          // if onClick is provided, render a button
          return (
            <button
              key={key}
              type='button'
              onClick={it.onClick}
              className={`${dropdownAnchorClass} block w-full text-left`}
              aria-label={it.aria ?? it.label}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </li>
  );
};

export default NavDropdown;

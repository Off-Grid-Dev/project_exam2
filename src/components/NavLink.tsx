// React imports
import type { FC } from 'react';
import type { MouseEvent } from 'react';

// Routing
import { Link, useNavigate, useLocation } from 'react-router-dom';

type NavLinkProps = {
  path: string;
  label: string;
  aria: string;
  resetOnClick?: boolean;
};

const NavLink: FC<NavLinkProps> = ({
  path,
  label,
  aria,
  resetOnClick = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    // If caller requests a reset when clicking this link, always perform a
    // programmatic navigation with a reset token in location.state so the
    // destination route can clear internal UI state (for example SearchForm).
    if (resetOnClick) {
      e.preventDefault();
      navigate(path, { state: { reset: Date.now() } });
      return;
    }

    // Fallback behavior: if clicking the current pathname, force a navigation
    // with reset token so route components can respond and reset their
    // internal UI state.
    if (location.pathname === path) {
      e.preventDefault();
      navigate(path, { state: { reset: Date.now() } });
    }
    // otherwise allow the Link's normal navigation
  }

  return (
    <li>
      <Link
        className={`hover:text-secondary-200 after:to-secondary-200 relative inline-block cursor-pointer rounded-lg px-3 py-2 font-semibold transition-colors duration-200 after:absolute after:inset-x-1 after:bottom-1 after:h-[2px] after:rounded-full after:bg-linear-to-r after:from-transparent after:from-45% after:bg-size-[400%] after:bg-left after:transition-[background-position] after:duration-300 after:content-[''] hover:after:bg-right hover:after:duration-1000`}
        to={path}
        aria-label={aria}
        title={aria}
        onClick={handleClick}
      >
        {label}
      </Link>
    </li>
  );
};

export default NavLink;

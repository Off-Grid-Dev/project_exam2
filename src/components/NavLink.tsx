// React imports
import type { FC } from 'react';

// Routing
import { Link } from 'react-router-dom';

type NavLinkProps = {
  path: string;
  label: string;
  aria: string;
};

const NavLink: FC<NavLinkProps> = ({ path, label, aria }) => {
  return (
    <li>
      <Link
        className={`hover:text-secondary-200 after:to-secondary-200 relative inline-block cursor-pointer rounded-lg px-3 py-2 font-semibold transition-colors duration-200 after:absolute after:inset-x-1 after:bottom-1 after:h-[2px] after:rounded-full after:bg-linear-to-r after:from-transparent after:from-45% after:bg-size-[400%] after:bg-left after:transition-[background-position] after:duration-300 after:content-[''] hover:after:bg-right hover:after:duration-1000`}
        to={path}
        aria-label={aria}
        title={aria}
      >
        {label}
      </Link>
    </li>
  );
};

export default NavLink;

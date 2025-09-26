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
        className='header-link inline-block rounded-lg px-3 py-2 font-semibold transition-colors duration-200'
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

import type { FC } from 'react';
import { Link } from 'react-router-dom';

type NavLinkProps = {
  path: string;
  label: string;
};

const NavLink: FC<NavLinkProps> = ({ path, label }) => {
  return (
    <li>
      <Link
        className='header-link inline-block rounded-lg px-3 py-2 font-semibold transition-colors duration-200'
        to={path}
      >
        {label}
      </Link>
    </li>
  );
};

export default NavLink;

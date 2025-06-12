// components/NavLink.tsx
import { NavLink as RouterNavLink } from 'react-router-dom';
import clsx from 'clsx';

export const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <RouterNavLink
    to={to}
    className={({ isActive }) =>
      clsx(
        'text-sm font-medium transition-all duration-200',
        isActive
          ? 'border-b-2 border-primary pb-1 text-primary'
          : 'text-gray-600 hover:text-primary',
      )
    }
  >
    {children}
  </RouterNavLink>
);

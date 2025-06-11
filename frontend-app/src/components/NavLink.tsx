// components/NavLink.tsx
import { NavLink as RouterNavLink } from 'react-router-dom';
import clsx from 'clsx';

export const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <RouterNavLink
    to={to}
    className={({ isActive }) =>
      clsx(
        'text-sm font-medium transition-all duration-200',
        isActive
          ? 'text-green-accent border-b-2 border-green-accent pb-1'
          : 'text-gray-600 hover:text-green-accent'
      )
    }
  >
    {children}
  </RouterNavLink>
);

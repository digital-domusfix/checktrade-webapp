import { NavLink as RouterNavLink } from 'react-router-dom';

export const MobileNavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <RouterNavLink
    to={to}
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-base hover:text-primary"
  >
    {children}
  </RouterNavLink>
);

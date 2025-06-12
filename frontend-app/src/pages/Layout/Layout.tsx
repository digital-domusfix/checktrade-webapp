import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../../components/Button';
import { MobileNavLink } from '../../components/MobileNavLink';
import { NavLink } from '../../components/NavLink';

const Layout: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-base text-primary">
      <header className="sticky top-0 z-50 border-b border-base bg-base/70 shadow-sm backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-primary"
          >
            CheckTrade
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-6 sm:flex">
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/contractors">Contractors</NavLink>
            <NavLink to="/post-job">Post a Job</NavLink>
          </div>

          {/* Auth Buttons */}
          <div className="hidden gap-2 sm:flex">
            <Button variant="ghost" className="text-sm">
              Login
            </Button>
            <Button variant="primary" className="text-sm">
              Join as Pro
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button className="sm:hidden" onClick={() => setOpen(!open)}>
            {open ? (
              <X className="size-6 text-primary" />
            ) : (
              <Menu className="size-6 text-primary" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {open && (
          <div className="border-t bg-white sm:hidden">
            <MobileNavLink to="/home">Home</MobileNavLink>
            <MobileNavLink to="/contractors">Contractors</MobileNavLink>
            <MobileNavLink to="/post-job">Post a Job</MobileNavLink>
            <div className="flex flex-col gap-2 border-t px-4 py-2">
              <Button variant="ghost" className="w-full text-sm">
                Login
              </Button>
              <Button variant="primary" className="w-full text-sm">
                Join as Pro
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-auto border-t bg-white py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} CheckTrade. Built for Nova Scotia 🇨🇦
      </footer>
    </div>
  );
};

export default Layout;

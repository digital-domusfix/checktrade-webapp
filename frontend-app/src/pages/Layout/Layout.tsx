import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../../components/Button';
import { MobileNavLink } from '../../components/MobileNavLink';
import { NavLink } from '../../components/NavLink';

const Layout: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-cream text-gray-900 min-h-screen flex flex-col">
    <header className="bg-cream-muted/70 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-cream">
  <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
    {/* Logo */}
    <Link to="/" className="text-2xl font-bold text-green-accent tracking-tight">CheckTrade</Link>

    {/* Desktop links */}
    <div className="hidden sm:flex gap-6 items-center">
      <NavLink to="/home">Home</NavLink>
      <NavLink to="/contractors">Contractors</NavLink>
      <NavLink to="/post-job">Post a Job</NavLink>
    </div>

    {/* Auth Buttons */}
    <div className="hidden sm:flex gap-2">
      <Button variant="ghost" className="text-sm">Login</Button>
      <Button variant="primary" className="text-sm">Join as Pro</Button>
    </div>

    {/* Mobile Toggle */}
    <button className="sm:hidden" onClick={() => setOpen(!open)}>
      {open ? <X className="w-6 h-6 text-green-accent" /> : <Menu className="w-6 h-6 text-green-accent" />}
    </button>
  </nav>

  {/* Mobile Menu */}
  {open && (
    <div className="sm:hidden bg-white border-t">
      <MobileNavLink to="/home">Home</MobileNavLink>
      <MobileNavLink to="/contractors">Contractors</MobileNavLink>
      <MobileNavLink to="/post-job">Post a Job</MobileNavLink>
      <div className="px-4 py-2 flex flex-col gap-2 border-t">
        <Button variant="ghost" className="w-full text-sm">Login</Button>
        <Button variant="primary" className="w-full text-sm">Join as Pro</Button>
      </div>
    </div>
  )}
</header>


      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-auto bg-white text-xs text-center py-4 border-t text-gray-500">
        © {new Date().getFullYear()} CheckTrade. Built for Nova Scotia 🇨🇦
      </footer>
    </div>
  );
};

export default Layout;

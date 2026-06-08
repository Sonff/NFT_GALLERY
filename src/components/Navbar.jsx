import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Landmark, Heart, LayoutDashboard, Compass, User } from 'lucide-react';
import WalletConnect from './WalletConnect';
import DarkModeToggle from './DarkModeToggle';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/', icon: Landmark },
    ...(isAuthenticated ? [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Gallery', path: '/gallery', icon: Compass },
      { name: 'Favorites', path: '/favorites', icon: Heart },
      { name: 'Profile', path: '/profile', icon: User }
    ] : [])
  ];

  return (
    <nav className="glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-all duration-300">
              <Compass className="h-6 w-6 animate-pulse" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent group-hover:opacity-80 transition-all">
              NFT Gallery
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {link.name}
                  </NavLink>
                );
              })}
            </div>

            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-6">
              <DarkModeToggle />
              <WalletConnect />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <DarkModeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden glass-card border-x-0 border-b border-t-0 absolute w-full left-0 z-50 animate-fadeIn">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {link.name}
                </NavLink>
              );
            })}
            
            <div className="pt-4 pb-2 px-4 border-t border-slate-200 dark:border-slate-800 flex justify-center">
              <WalletConnect />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
  

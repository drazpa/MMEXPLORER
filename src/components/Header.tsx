import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X } from 'lucide-react';

const Logo = () => (
  <div className="relative w-8 h-8 logo-coins">
    <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg animate-gradient" />
    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg animate-gradient" />
  </div>
);

export const Header: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      onClick={() => setIsMenuOpen(false)}
      className={`text-sm font-medium button-glow px-4 py-2 rounded-lg transition-all ${
        location.pathname === to
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <header className="bg-white/90 dark:bg-gray-800/90 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm header-glow sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title - Always visible */}
          <div className="flex items-center glow-effect">
            <Logo />
            <div className="ml-3">
              <span className="text-xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600">
                  XRPL
                </span>
                <span className="text-gray-400 dark:text-white">Coins</span>
                <span className="text-gray-400 dark:text-white">.co</span>
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block">
                Discover the Future of Digital Assets
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/featured">Featured Coins</NavLink>
            <NavLink to="/all-coins">All XRPL Coins</NavLink>
            <NavLink to="/top-100">Top 100</NavLink>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'max-h-48 opacity-100 py-4'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="flex flex-col space-y-2">
            <NavLink to="/featured">Featured Coins</NavLink>
            <NavLink to="/all-coins">All XRPL Coins</NavLink>
            <NavLink to="/top-100">Top 100</NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-gradient-to-r from-card-bg via-secondary-bg to-card-bg backdrop-blur-sm">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center group">
            <svg 
              className="w-6 h-6 mr-2 text-accent group-hover:animate-pulse" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
              />
            </svg>
            <span className="text-base font-bold bg-gradient-to-r from-accent via-purple-500 to-accent bg-clip-text whitespace-nowrap">
              UFC Fight Predictor
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/"
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-accent/10 text-accent shadow-lg shadow-accent/20' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-accent'
              }`}
            >
              Fighters
            </Link>
            <Link
              to="/predict"
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/predict')
                  ? 'bg-accent/10 text-accent shadow-lg shadow-accent/20'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-accent'
              }`}
            >
              Fight Predictor
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-1 text-gray-400 transition-colors duration-200 rounded-lg hover:text-accent hover:bg-gray-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-48 opacity-100' 
            : 'max-h-0 opacity-0 pointer-events-none'
        }`} 
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive('/')
                ? 'bg-accent/10 text-accent'
                : 'text-gray-300 hover:bg-gray-800 hover:text-accent'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Fighters
          </Link>
          <Link
            to="/predict"
            className={`block px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive('/predict')
                ? 'bg-accent/10 text-accent'
                : 'text-gray-300 hover:bg-gray-800 hover:text-accent'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Fight Predictor
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, Compass, Map, Image, Video, DollarSign, MessageSquare, LayoutDashboard, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'AI Planner', path: '/planner', icon: Map },
    { name: 'Budget', path: '/budget', icon: DollarSign },
    { name: 'Community', path: '/community', icon: Share2 },
    { name: 'AI Assistant', path: '/assistant', icon: MessageSquare },
    { name: 'Photo AI', path: '/photo-editor', icon: Image },
    { name: 'Video AI', path: '/video-editor', icon: Video },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-md dark:border-white/5 dark:bg-slate-950/45 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Travel<span className="bg-gradient-to-r from-orange-500 to-sky-400 bg-clip-text text-transparent">Verse AI</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-orange-500/10 text-orange-500 dark:text-orange-400'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-orange-400" /> : <Moon className="h-5 w-5 text-sky-600" />}
            </button>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2 group">
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="h-8 w-8 rounded-full object-cover border-2 border-orange-500 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                    {user.displayName}
                  </span>
                </Link>
                <button
                  onClick={signOut}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-all"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-orange-500 to-sky-500 text-white shadow-lg shadow-orange-500/20 hover:opacity-90 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-orange-400" /> : <Moon className="h-5 w-5 text-sky-600" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-slate-50 dark:bg-slate-900/95 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-base font-medium ${
                      isActive(link.path)
                        ? 'bg-orange-500/10 text-orange-500 dark:text-orange-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-white/10 mt-4">
                {user ? (
                  <div className="space-y-3">
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4"
                    >
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="h-10 w-10 rounded-full object-cover border-2 border-orange-500"
                      />
                      <div>
                        <div className="text-base font-medium text-slate-800 dark:text-slate-100">{user.displayName}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                      </div>
                    </Link>
                    <div className="flex space-x-2 px-4">
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 text-center py-2 rounded-lg bg-slate-100 dark:bg-white/5 text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          signOut();
                        }}
                        className="flex-1 py-2 rounded-lg border border-slate-300 dark:border-white/10 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-2.5 px-4 rounded-lg font-semibold bg-gradient-to-r from-orange-500 to-sky-500 text-white shadow-lg"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

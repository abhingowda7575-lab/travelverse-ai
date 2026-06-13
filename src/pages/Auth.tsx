import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // UI state feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        setSuccess('Successfully signed in! Logging you in...');
      } else {
        await signUp(email, password, name);
        setSuccess('Successfully registered account! Logging you in...');
      }
      // Redirect after showing success banner
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] relative w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-16 transition-colors duration-300">
      {/* Dynamic colorful blobs in the background */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 rounded-3xl border border-white/10 dark:border-white/5 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl p-8 overflow-hidden"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-4.5 w-4.5 animate-pulse" />
            <span>TravelVerse Authentication</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isLogin ? 'Enter credentials to coordinate your escapes.' : 'Sign up to start saving itineraries.'}
          </p>
        </div>

        {/* Info alerts */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-600 dark:text-red-400 flex items-start gap-2"
            >
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-start gap-2"
            >
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Traveler Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 text-slate-950 dark:text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
              <input
                type="email"
                placeholder="traveler@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 text-slate-950 dark:text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 text-slate-950 dark:text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-sky-500 text-white font-bold tracking-wide shadow-lg shadow-orange-500/20 hover:opacity-95 transition-opacity disabled:opacity-50 text-sm mt-6 flex justify-center items-center gap-2"
          >
            {loading ? (
              <span className="h-4.5 w-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span>{isLogin ? 'Sign In To Account' : 'Register New Account'}</span>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center border-t border-slate-200 dark:border-white/5 pt-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => {
                setError('');
                setIsLogin(!isLogin);
              }}
              className="text-orange-500 dark:text-orange-400 font-bold hover:underline focus:outline-none"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>

        {/* Quick Demo Credentials */}
        {isLogin && (
          <div className="mt-4 p-3 rounded-xl border border-orange-500/20 bg-orange-500/5 text-center text-[10px] text-orange-600 dark:text-orange-400">
            💡 <b>Quick demo:</b> Type any email and password to instantly log in!
          </div>
        )}
      </motion.div>
    </div>
  );
};

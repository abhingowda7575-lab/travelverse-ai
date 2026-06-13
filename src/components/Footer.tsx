import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, MapPin, Phone, Mail, Globe, Share2, Compass, Navigation } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    
    // Celebratory confetti when user subscribes!
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <footer className="w-full border-t border-white/10 bg-slate-50 dark:bg-slate-950 dark:border-white/5 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Travel<span className="bg-gradient-to-r from-orange-500 to-sky-400 bg-clip-text text-transparent">Verse AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Synthesizing cutting-edge artificial intelligence with immersive traveler communities to orchestrate next-generation journeys.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"><Globe className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"><Compass className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"><Share2 className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"><Navigation className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-950 dark:text-slate-200 uppercase mb-4">Core Ecosystem</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/explore" className="text-sm text-slate-600 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 transition-colors">Destination Explorer</Link>
              </li>
              <li>
                <Link to="/planner" className="text-sm text-slate-600 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 transition-colors">AI Itinerary Planner</Link>
              </li>
              <li>
                <Link to="/budget" className="text-sm text-slate-600 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 transition-colors">Smart Budget Calculator</Link>
              </li>
              <li>
                <Link to="/community" className="text-sm text-slate-600 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 transition-colors">Community Story Feed</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-950 dark:text-slate-200 uppercase mb-4">Support & Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="h-5 w-5 text-orange-500 shrink-0" />
                <span>Orbit Towers, Silicon Boulevard, Cape Canaveral, FL</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Phone className="h-4 w-4 text-sky-500 shrink-0" />
                <span>+1 (800) Travel-AI</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="h-4 w-4 text-orange-500 shrink-0" />
                <span>support@travelverse.ai</span>
              </li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-950 dark:text-slate-200 uppercase mb-4">Travel Intel Feed</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Get notified of exclusive flight deals and algorithmic updates directly to your inbox.
            </p>
            {subscribed ? (
              <div className="rounded-lg bg-orange-500/10 border border-orange-500/30 p-3 text-sm text-orange-600 dark:text-orange-400 text-center font-medium animate-pulse">
                🎉 Subscribed Successfully!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-sky-500 text-white hover:opacity-90 transition-opacity"
                  aria-label="Subscribe"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            &copy; {new Date().getFullYear()} TravelVerse AI Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-slate-500 dark:text-slate-500">
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

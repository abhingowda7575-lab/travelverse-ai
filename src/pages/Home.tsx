import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Compass, Map, MessageSquare, ArrowRight, Star, Heart, MessageCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { destinationsData, travelStoriesData, testimonialsData } from '../services/mockData';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/explore');
    }
  };

  const trendingDestinations = destinationsData.slice(0, 3);
  const hotStories = travelStoriesData.slice(0, 3);

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. Hero Section with Video Background */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-slate-50 dark:to-slate-950 z-10 transition-colors duration-300" />
        
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-thick-forest-and-river-42721-large.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl px-4 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass border border-white/20 text-white text-xs font-semibold uppercase tracking-wider shadow-lg"
          >
            <Sparkles className="h-4 w-4 text-orange-400" />
            <span>The Next Era of Travel Planning</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight"
          >
            Explore the World with{' '}
            <span className="bg-gradient-to-r from-orange-400 to-sky-400 bg-clip-text text-transparent">
              Artificial Intelligence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-200 font-medium max-w-2xl mx-auto"
          >
            Plan itineraries, track travel budgets, sync with community feeds, and leverage AI photo & video tools.
          </motion.p>

          {/* Search bar */}
          <motion.form
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-xl mx-auto flex items-center p-1.5 rounded-2xl glass border border-white/25 shadow-2xl mt-4"
          >
            <div className="flex items-center flex-1 px-3">
              <Search className="h-5 w-5 text-white/70" />
              <input
                type="text"
                placeholder="Search Paris, Tokyo, Bali..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-white placeholder-white/60 text-sm ml-2.5"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-5 py-2.5 font-bold text-sm transition-all shadow-md shrink-0 flex items-center space-x-1"
            >
              <span>Explore</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.form>

          {/* Quick Action Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-4"
          >
            <Link
              to="/planner"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-white/20 hover:border-orange-500 hover:bg-orange-500/10 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all"
            >
              <Map className="h-4 w-4" />
              <span>AI Planner</span>
            </Link>
            <Link
              to="/assistant"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-white/20 hover:border-sky-400 hover:bg-sky-400/10 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              <span>AI Assistant</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Trending Destinations Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10">
          <div>
            <span className="text-orange-500 font-bold uppercase text-xs tracking-widest">Recommended</span>
            <h2 className="text-3xl font-black tracking-tight mt-1">Trending Destinations</h2>
          </div>
          <Link
            to="/explore"
            className="text-sky-500 dark:text-sky-400 hover:text-orange-500 text-sm font-semibold flex items-center mt-2 md:mt-0 transition-colors"
          >
            <span>See All Destinations</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => navigate(`/explore?id=${dest.id}`)}
              className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 transition-all hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={dest.imageUrl}
                  alt={dest.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                  {dest.category}
                </div>
                <div className="absolute top-4 right-4 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-orange-500 text-white text-xs font-bold shadow-md">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{dest.rating}</span>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {dest.country}
                </div>
                <h3 className="text-xl font-bold group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                  {dest.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
                  <span>Best Time: <b>{dest.bestTime}</b></span>
                  <span className="text-orange-500 font-bold">~${dest.budgetEstimate}/day</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CTA AI Section (Dual color premium block) */}
      <section className="py-16 bg-gradient-to-r from-orange-500/10 to-sky-500/10 dark:from-orange-950/20 dark:to-sky-950/20 border-y border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <span className="text-sky-500 dark:text-sky-400 font-bold uppercase text-xs tracking-widest">
              AI Travel Architect
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Create a personalized, day-by-day itinerary in seconds.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Enter your destination, select interests, define your budget limits, and watch the TravelVerse AI coordinate daily events, travel times, and calculate cost breakdowns.
            </p>
          </div>
          <Link
            to="/planner"
            className="glow-effect flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-sky-500 text-white font-bold tracking-wide shadow-xl hover:scale-105 transition-all text-sm uppercase"
          >
            <Compass className="h-5 w-5" />
            <span>Launch AI Planner</span>
          </Link>
        </div>
      </section>

      {/* 4. Travel Stories Feed Preview */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10">
          <div>
            <span className="text-orange-500 font-bold uppercase text-xs tracking-widest">Community Feed</span>
            <h2 className="text-3xl font-black tracking-tight mt-1">Stories from the Verse</h2>
          </div>
          <Link
            to="/community"
            className="text-sky-500 dark:text-sky-400 hover:text-orange-500 text-sm font-semibold flex items-center mt-2 md:mt-0 transition-colors"
          >
            <span>Enter Social Feed</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {hotStories.map((story) => (
            <div
              key={story.id}
              className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-md flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-4 flex items-center space-x-3">
                <img
                  src={story.userAvatar}
                  alt={story.username}
                  className="h-8 w-8 rounded-full object-cover border border-orange-500"
                />
                <div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{story.username}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{story.location}</div>
                </div>
              </div>

              {/* Media */}
              <div className="h-64 overflow-hidden relative">
                <img
                  src={story.mediaUrl}
                  alt=""
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
                />
              </div>

              {/* Feed Actions / Text */}
              <div className="p-4 space-y-2">
                <div className="flex items-center space-x-4 text-slate-700 dark:text-slate-300">
                  <div className="flex items-center space-x-1 text-xs">
                    <Heart className="h-4.5 w-4.5 text-rose-500 fill-current" />
                    <span className="font-bold">{story.likesCount}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <MessageCircle className="h-4.5 w-4.5 text-sky-500" />
                    <span className="font-bold">{story.commentsCount}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {story.content}
                </p>
                <div className="text-[9px] text-slate-400 uppercase pt-1">{story.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="py-16 bg-slate-100 dark:bg-slate-900/40 border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-orange-500 font-bold uppercase text-xs tracking-widest">Testimonials</span>
          <h2 className="text-3xl font-black tracking-tight mt-1 mb-12">Travelers Love TravelVerse</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((test) => (
              <div
                key={test.id}
                className="glass-card-dark p-6 text-left rounded-2xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex space-x-1 text-orange-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    "{test.feedback}"
                  </p>
                </div>

                <div className="flex items-center space-x-3 mt-6">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="h-10 w-10 rounded-full object-cover border border-sky-400"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{test.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-500 font-medium">{test.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

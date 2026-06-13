import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/firebase';
import { LayoutDashboard, Calendar, Share2, Award, Bookmark, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dashboard state
  const [savedTrips, setSavedTrips] = useState<any[]>([]);
  const [savedStories, setSavedStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const loadDashboardData = async () => {
      try {
        const trips = await dbService.getSavedTrips();
        setSavedTrips(trips);

        const feed = await dbService.getStories();
        const bookmarked = feed.filter(s => s.isSaved);
        setSavedStories(bookmarked);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [user, navigate]);

  const handleDeleteTrip = async (tripId: string) => {
    if (!window.confirm('Delete this trip?')) return;
    try {
      const updated = await dbService.deleteTrip(tripId);
      setSavedTrips(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnsaveStory = async (storyId: string) => {
    try {
      await dbService.saveStory(storyId);
      // Refresh list
      const feed = await dbService.getStories();
      setSavedStories(feed.filter(s => s.isSaved));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  // Mock travel stats chart metrics (SVG drawing helper)
  const monthlyStats = [
    { month: 'Jan', count: 1 },
    { month: 'Feb', count: 3 },
    { month: 'Mar', count: 2 },
    { month: 'Apr', count: 5 },
    { month: 'May', count: 4 },
    { month: 'Jun', count: 6 }
  ];

  const maxVal = 7;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      {/* 1. Header Welcome Bar */}
      <div className="border-b border-slate-200 dark:border-white/5 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <span className="text-orange-500 font-bold uppercase text-xs tracking-widest flex items-center gap-1">
            <LayoutDashboard className="h-4 w-4 text-orange-500" />
            <span>TravelVerse Telemetry</span>
          </span>
          <h1 className="text-3xl font-black tracking-tight mt-1">Traveler Dashboard</h1>
        </div>
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Welcome back, <span className="text-orange-500 font-black">{user.displayName}</span>!
        </div>
      </div>

      {/* 2. Overview Stats counters grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Saved Trips', val: user.tripsCount, icon: Calendar, color: 'text-orange-500 bg-orange-500/10' },
          { label: 'Followers', val: user.followerCount || 1420, icon: Share2, color: 'text-sky-500 bg-sky-500/10' },
          { label: 'Stories Shared', val: user.postsCount, icon: Bookmark, color: 'text-orange-500 bg-orange-500/10' },
          { label: 'Countries Visited', val: user.countriesCount, icon: Award, color: 'text-sky-500 bg-sky-500/10' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-5 shadow-sm flex items-center justify-between gap-4"
            >
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-500 uppercase font-bold tracking-wider">{stat.label}</span>
                <div className="text-2xl font-black mt-1">{stat.val}</div>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Dashboard Matrix: Statistics Chart (Left 60%) + Trips Checklist (Right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
        
        {/* Left Column: Custom SVG Statistics chart */}
        <div className="lg:col-span-7 rounded-3xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-md p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-1">Monthly Travel Progress</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Activity indices synced over the last 6 months.</p>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-200 dark:border-white/5">
            {monthlyStats.map((item, idx) => {
              const barHeight = (item.count / maxVal) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="text-[10px] font-bold text-sky-500 font-mono">{item.count}</div>
                  
                  {/* Dynamic Height Bar */}
                  <div className="w-full relative rounded-t-lg overflow-hidden h-full flex items-end">
                    <motion.div
                      className="w-full rounded-t-md bg-gradient-to-t from-sky-500 to-orange-400 shadow-sm"
                      initial={{ height: 0 }}
                      animate={{ height: `${barHeight}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                    />
                  </div>

                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-500 uppercase">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-500 font-semibold pt-4">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sky-500"></span> Transit Bookings</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span> Hotel Stays</span>
          </div>
        </div>

        {/* Right Column: Upcoming/Completed Trips checklist */}
        <div className="lg:col-span-5 rounded-3xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-md p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold">Recent Flight Matrix</h2>
          
          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 no-scrollbar">
            {[
              { id: 'rt-1', destination: 'Tokyo, Japan', date: 'Oct 2025', status: 'Completed', budget: 1500, color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' },
              { id: 'rt-2', destination: 'Bali, Indonesia', date: 'Jan 2026', status: 'Completed', budget: 900, color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' },
              { id: 'rt-3', destination: 'Swiss Alps, Switzerland', date: 'Jul 2026', status: 'Upcoming', budget: 2200, color: 'text-orange-500 border-orange-500/20 bg-orange-500/5 animate-pulse' }
            ].map((rt) => (
              <div
                key={rt.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between text-xs gap-3"
              >
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{rt.destination}</h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-500 font-semibold">{rt.date} • ${rt.budget}</span>
                </div>
                
                <span className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border ${rt.color}`}>
                  {rt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Bottom Grid: Saved Trips lists + Saved stories bookmarked */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Saved Trips */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-black flex items-center gap-1.5">
            <Calendar className="h-5 w-5 text-orange-500" />
            <span>Saved AI Plans ({savedTrips.length})</span>
          </h2>

          {loading ? (
            <div className="py-6 flex justify-center"><span className="h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span></div>
          ) : savedTrips.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-xs text-slate-500">
              No saved trips. Generate plans in the <Link to="/planner" className="text-orange-500 font-bold hover:underline">AI Planner</Link>.
            </div>
          ) : (
            <div className="space-y-4">
              {savedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{trip.destination}</h3>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-500 font-semibold uppercase">
                      <span>{trip.days} Days</span>
                      <span>•</span>
                      <span className="text-orange-500">${trip.totalEstimatedCost}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/planner?viewSaved=${trip.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-orange-500 hover:text-white dark:bg-white/5 dark:hover:bg-orange-500 text-[10px] font-bold uppercase transition-colors"
                    >
                      View Schedule
                    </Link>
                    <button
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-500 transition-colors"
                      title="Delete saved plan"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Saved Stories / Bookmarked */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xl font-black flex items-center gap-1.5">
            <Bookmark className="h-5 w-5 text-sky-500" />
            <span>Saved Stories ({savedStories.length})</span>
          </h2>

          {loading ? (
            <div className="py-6 flex justify-center"><span className="h-6 w-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span></div>
          ) : savedStories.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-xs text-slate-500">
              No saved stories. Browse and bookmark items in the <Link to="/community" className="text-sky-500 font-bold hover:underline">Community Feed</Link>.
            </div>
          ) : (
            <div className="space-y-4">
              {savedStories.map((story) => (
                <div
                  key={story.id}
                  className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow gap-4 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={story.mediaUrl} alt="" className="h-10 w-10 object-cover rounded-lg shrink-0 border" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate">{story.content}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-500 font-semibold">by @{story.username}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnsaveStory(story.id)}
                    className="p-1.5 rounded-lg border border-orange-500/20 hover:bg-orange-500/10 text-orange-500 shrink-0 transition-colors"
                    title="Unsave Story"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

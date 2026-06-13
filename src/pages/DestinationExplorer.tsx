import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { dbService } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { Star, DollarSign, Calendar, Search, MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveMap } from '../components/InteractiveMap';
import type { Destination } from '../services/mockData';

export const DestinationExplorer: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Search parameters check
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const initialId = searchParams.get('id') || '';

  // Data states
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Selection
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);

  // Review states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const list = await dbService.getDestinations();
        setDestinations(list);
        
        // Auto select destination if ID was passed in query
        if (initialId) {
          const matched = list.find(d => d.id === initialId);
          if (matched) setSelectedDest(matched);
        } else if (list.length > 0) {
          setSelectedDest(list[0]); // Default selection for map
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, [initialId]);

  // Categories
  const categories = [
    { value: 'all', label: 'All Places' },
    { value: 'beach', label: '🏖️ Beaches' },
    { value: 'city', label: '🏙️ Cities' },
    { value: 'nature', label: '⛰️ Nature' },
    { value: 'culture', label: '🏛️ Culture' },
    { value: 'adventure', label: '🥾 Adventure' }
  ];

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setReviewError('Please sign in to leave a review.');
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError('Comment cannot be empty.');
      return;
    }

    try {
      const updated = await dbService.addDestinationReview(selectedDest!.id, reviewRating, reviewComment);
      setDestinations(updated);
      
      const refreshedDest = updated.find(d => d.id === selectedDest!.id);
      if (refreshedDest) setSelectedDest(refreshedDest);

      setReviewComment('');
      setReviewRating(5);
      setShowReviewModal(false);
      setReviewError('');
    } catch (err) {
      console.error(err);
    }
  };

  // Filter logic
  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    const matchesSearch = dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      {/* Search Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-6 mb-8 shrink-0">
        <div>
          <span className="text-orange-500 font-bold uppercase text-xs tracking-widest">TravelVerse Catalog</span>
          <h1 className="text-3xl font-black tracking-tight mt-1">Destination Explorer</h1>
        </div>

        {/* Search input */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search country, city, vibes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-950 dark:text-white text-xs focus:outline-none focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-none no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.value
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white border border-slate-200 dark:bg-slate-900 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Destinations Cards (Left 60%) + Map Panel (Right 40%) */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <span className="h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Cards List */}
          <div className="lg:col-span-7 space-y-6">
            {filteredDestinations.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No destinations match your filters. Try search keywords.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredDestinations.map((dest) => (
                  <div
                    key={dest.id}
                    onClick={() => setSelectedDest(dest)}
                    className={`group cursor-pointer rounded-2xl border overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
                      selectedDest?.id === dest.id
                        ? 'border-orange-500 ring-2 ring-orange-500/10'
                        : 'border-slate-200 dark:border-white/5'
                    }`}
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={dest.imageUrl}
                        alt={dest.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-bold">
                        <Star className="h-3 w-3 text-orange-400 fill-current" />
                        <span>{dest.rating}</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{dest.country}</div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{dest.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{dest.description}</p>
                      
                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-2 mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center"><Calendar className="h-3 w-3 mr-1 text-sky-500" /> {dest.bestTime}</span>
                        <span className="text-orange-500 font-bold flex items-center"><DollarSign className="h-3 w-3" />{dest.budgetEstimate}/day</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Map and Info Summary Card */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 h-fit">
            {selectedDest && (
              <div className="space-y-6">
                {/* 1. Vector Map Simulation */}
                <InteractiveMap
                  lat={selectedDest.coordinates.lat}
                  lng={selectedDest.coordinates.lng}
                  destinationName={selectedDest.title}
                />

                {/* 2. Destination Details Card */}
                <div className="rounded-2xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900 p-5 shadow-lg space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-black">{selectedDest.title}</h2>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{selectedDest.country}</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-orange-500 font-bold">
                        <Star className="h-4.5 w-4.5 fill-current" />
                        <span>{selectedDest.rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{selectedDest.reviewsCount} reviews</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedDest.description}
                  </p>

                  <div className="border-t border-slate-200 dark:border-white/5 pt-3 space-y-2 text-xs">
                    <h3 className="font-bold uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-500">Travel Survival Tips</h3>
                    <ul className="space-y-1.5 list-disc pl-4 text-slate-700 dark:text-slate-300">
                      {selectedDest.travelTips.map((tip, idx) => (
                        <li key={idx} className="leading-relaxed">{tip}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Add Review Button */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-white/5 mt-4">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Vibe checked? Add yours!</span>
                    <button
                      onClick={() => {
                        if (!user) {
                          alert('Sign in to leave reviews.');
                          return;
                        }
                        setReviewError('');
                        setShowReviewModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Write Review</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Review Dialog Modal */}
      <AnimatePresence>
        {showReviewModal && selectedDest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setShowReviewModal(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-slate-950 dark:text-white"
            >
              <h3 className="text-xl font-bold">Review {selectedDest.title}</h3>
              {reviewError && (
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  <span>{reviewError}</span>
                </div>
              )}
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                
                {/* Rating selection (Stars) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-500">Star Rating</label>
                  <div className="flex items-center space-x-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`h-7 w-7 transition-colors ${
                            star <= reviewRating
                              ? 'text-orange-500 fill-orange-500 animate-pulse'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-500">Review Comments</label>
                  <textarea
                    placeholder="Add local tips, safety advice, or budget secrets..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/5 text-slate-950 dark:text-white focus:outline-none focus:border-orange-500 h-24"
                    required
                  />
                </div>

                <div className="flex space-x-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/5 text-slate-700 dark:text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md"
                  >
                    Submit Review
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

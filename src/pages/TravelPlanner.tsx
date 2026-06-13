import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/firebase';
import { generateItinerary } from '../services/ai';
import type { GeneratedPlan } from '../services/ai';
import { Sparkles, MapPin, Calendar, DollarSign, ChevronDown, ChevronUp, Plane, Train, Car, Compass, Save, Check, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const TravelPlanner: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Saved query loading
  const queryParams = new URLSearchParams(location.search);
  const viewSavedId = queryParams.get('viewSaved') || '';

  // Form State
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(600);
  const [transport, setTransport] = useState('flight');
  const [interests, setInterests] = useState<string[]>(['nature', 'culture']);

  // Results State
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [tripSaved, setTripSaved] = useState(false);

  // Interest options
  const interestOptions = [
    { value: 'adventure', label: '🥾 Adventure' },
    { value: 'culture', label: '🏛️ Culture' },
    { value: 'nature', label: '⛰️ Nature' },
    { value: 'food', label: '🍜 Food & Gastronomy' },
    { value: 'city', label: '🏙️ City Life' }
  ];

  useEffect(() => {
    // If a saved trip ID is requested, fetch it from storage and load it
    const loadSavedTrip = async () => {
      if (viewSavedId) {
        setLoading(true);
        try {
          const savedTrips = await dbService.getSavedTrips();
          const matched = savedTrips.find(t => t.id === viewSavedId);
          if (matched) {
            setGeneratedPlan(matched);
            setDestination(matched.destination);
            setDays(matched.days);
            setBudget(matched.totalEstimatedCost);
            setTripSaved(true);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    loadSavedTrip();
  }, [viewSavedId]);

  const handleInterestToggle = (val: string) => {
    setInterests(prev =>
      prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]
    );
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setLoading(true);
    setTripSaved(false);
    
    // Simulate AI generation processing delay
    setTimeout(() => {
      const plan = generateItinerary(destination, days, budget, interests, transport);
      setGeneratedPlan(plan);
      setLoading(false);
      setExpandedDay(1); // Auto expand day 1

      // Fire celebratory confetti!
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  const handleSaveTrip = async () => {
    if (!user) {
      alert('Please sign in to save your itinerary.');
      navigate('/auth');
      return;
    }
    if (!generatedPlan) return;

    try {
      await dbService.saveTrip(generatedPlan);
      setTripSaved(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/5 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <span className="text-orange-500 font-bold uppercase text-xs tracking-widest flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-orange-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>TravelVerse Intelligence</span>
          </span>
          <h1 className="text-3xl font-black tracking-tight mt-1">AI Trip Planner</h1>
        </div>
        
        {viewSavedId && (
          <button
            onClick={() => {
              navigate('/planner');
              setGeneratedPlan(null);
              setDestination('');
              setTripSaved(false);
            }}
            className="px-4 py-2 border border-slate-300 dark:border-white/10 text-xs font-bold rounded-xl mt-3 md:mt-0 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            Create New Plan
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Input Form Panel */}
        <div className="lg:col-span-4 rounded-3xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-md p-5 sm:p-6 shadow-xl h-fit">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Compass className="h-5 w-5 text-orange-500" />
            <span>Itinerary Parameters</span>
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* Destination */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Bali, Paris, Tokyo"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 text-slate-950 dark:text-white text-xs font-semibold focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>

            {/* Duration and Budget */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Duration (Days)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 text-slate-950 dark:text-white text-xs font-semibold focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Budget Limit (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    step="50"
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value) || 100)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 text-slate-950 dark:text-white text-xs font-semibold focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Transport Options */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transport</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'flight', label: 'Flight', icon: Plane },
                  { value: 'train', label: 'Train', icon: Train },
                  { value: 'car', label: 'Car', icon: Car }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setTransport(item.value)}
                      className={`py-2 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        transport === item.value
                          ? 'bg-sky-500/10 border-sky-500 text-sky-500'
                          : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interests Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Activities Interests</label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleInterestToggle(opt.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      interests.includes(opt.value)
                        ? 'bg-orange-500/10 border-orange-500 text-orange-500'
                        : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit btn */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-sky-500 text-white font-bold tracking-wide shadow-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2 text-xs uppercase"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 animate-bounce" />
                  <span>Generate Itinerary</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Results / Itinerary Output */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="h-full min-h-[350px] flex flex-col justify-center items-center rounded-3xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900/40 p-8 shadow-xl text-center space-y-4">
              <div className="h-16 w-16 relative">
                <Compass className="h-16 w-16 text-sky-500 animate-spin absolute" style={{ animationDuration: '6s' }} />
                <Sparkles className="h-6 w-6 text-orange-500 animate-ping absolute -top-2 -right-2" />
              </div>
              <h3 className="text-xl font-bold">Orchestrating Trip Matrix</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                TravelVerse AI is compiling historical travel logs, local transit data, and weather forecasts to output a optimized day-by-day plan.
              </p>
            </div>
          ) : generatedPlan ? (
            <div className="space-y-6">
              
              {/* Plan Summary header */}
              <div className="rounded-3xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-md p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Algorithmic Output</span>
                  <h2 className="text-2xl font-black">{generatedPlan.destination} - {generatedPlan.days} Days Plan</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Estimated expenses compiled dynamically.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500 tracking-wider">Total Est. Cost</span>
                    <div className="text-2xl font-black text-orange-500 dark:text-orange-400 flex items-center"><DollarSign className="h-5.5 w-5.5 -mr-1" />{generatedPlan.totalEstimatedCost}</div>
                  </div>

                  <button
                    onClick={handleSaveTrip}
                    disabled={tripSaved}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md ${
                      tripSaved
                        ? 'bg-emerald-500 text-white'
                        : 'bg-sky-500 hover:bg-sky-600 text-white'
                    }`}
                  >
                    {tripSaved ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Saved to Profile</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Trip</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Expense Breakdown mini grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Transit & Flight', cost: generatedPlan.transportCost, color: 'text-sky-500' },
                  { label: 'Accommodation', cost: generatedPlan.accommodationCost, color: 'text-orange-500' },
                  { label: 'Meals & Food', cost: generatedPlan.foodCost, color: 'text-sky-500' },
                  { label: 'Activities', cost: generatedPlan.activitiesCost, color: 'text-orange-500' }
                ].map((item, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-4 shadow-sm text-center">
                    <div className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase">{item.label}</div>
                    <div className={`text-lg font-black mt-1 ${item.color}`}>${item.cost}</div>
                  </div>
                ))}
              </div>

              {/* Day-by-Day schedule accordion */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold uppercase tracking-wider text-xs text-slate-500 dark:text-slate-500">Daily Schedule Matrix</h3>
                
                {generatedPlan.dailyItinerary.map((day) => (
                  <div
                    key={day.day}
                    className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
                  >
                    {/* Accordion header */}
                    <div
                      onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                      className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 select-none transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-lg bg-orange-500 text-white font-black flex items-center justify-center text-xs shadow-sm">
                          D{day.day}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{day.title}</h4>
                          <span className="text-[9px] font-bold text-sky-500 uppercase tracking-wider">Est: ${day.dailyExpense}</span>
                        </div>
                      </div>
                      <div className="text-slate-400">
                        {expandedDay === day.day ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </div>

                    {/* Accordion content */}
                    <AnimatePresence>
                      {expandedDay === day.day && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20"
                        >
                          <div className="p-4 space-y-4 text-xs">
                            {/* Meals summary */}
                            <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div>🍳 <b>Breakfast:</b> <span className="text-slate-600 dark:text-slate-300">{day.meals.breakfast}</span></div>
                              <div>🥗 <b>Lunch:</b> <span className="text-slate-600 dark:text-slate-300">{day.meals.lunch}</span></div>
                              <div>🥩 <b>Dinner:</b> <span className="text-slate-600 dark:text-slate-300">{day.meals.dinner}</span></div>
                            </div>

                            {/* Activities steps */}
                            <div className="space-y-4 pl-2 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-white/5">
                              
                              {/* Morning */}
                              <div className="relative pl-7">
                                <span className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-white dark:ring-slate-950"></span>
                                <div className="flex justify-between items-start">
                                  <h5 className="font-bold text-slate-800 dark:text-slate-200">☀️ Morning: {day.activities.morning.title}</h5>
                                  <span className="text-orange-500 font-bold shrink-0">${day.activities.morning.cost}</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{day.activities.morning.description}</p>
                              </div>

                              {/* Afternoon */}
                              <div className="relative pl-7">
                                <span className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full bg-sky-500 ring-4 ring-white dark:ring-slate-950"></span>
                                <div className="flex justify-between items-start">
                                  <h5 className="font-bold text-slate-800 dark:text-slate-200">⛅ Afternoon: {day.activities.afternoon.title}</h5>
                                  <span className="text-sky-500 font-bold shrink-0">${day.activities.afternoon.cost}</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{day.activities.afternoon.description}</p>
                              </div>

                              {/* Evening */}
                              <div className="relative pl-7">
                                <span className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-white dark:ring-slate-950"></span>
                                <div className="flex justify-between items-start">
                                  <h5 className="font-bold text-slate-800 dark:text-slate-200">🌙 Evening: {day.activities.evening.title}</h5>
                                  <span className="text-orange-500 font-bold shrink-0">${day.activities.evening.cost}</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{day.activities.evening.description}</p>
                              </div>

                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[350px] flex flex-col justify-center items-center rounded-3xl border border-dashed border-slate-300 dark:border-white/10 p-8 text-center space-y-4">
              <Award className="h-12 w-12 text-orange-500 animate-bounce" />
              <h3 className="text-lg font-bold">Awaiting Parameters</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Define your target destination and budget on the left to activate the TravelVerse AI itinerary generator.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

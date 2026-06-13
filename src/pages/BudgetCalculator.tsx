import React, { useState } from 'react';
import { DollarSign, AlertTriangle, Lightbulb, TrendingDown, RefreshCw, BarChart } from 'lucide-react';

export const BudgetCalculator: React.FC = () => {
  // Budget categories
  const [transport, setTransport] = useState(250);
  const [hotel, setHotel] = useState(350);
  const [food, setFood] = useState(150);
  const [activities, setActivities] = useState(150);
  
  // Set total limit target
  const [limit, setLimit] = useState(1000);

  const totalBudget = transport + hotel + food + activities;
  const isOverLimit = totalBudget > limit;

  // Percentage calculations
  const getPercentage = (val: number) => {
    if (totalBudget === 0) return 0;
    return Math.round((val / totalBudget) * 100);
  };

  const pctTransport = getPercentage(transport);
  const pctHotel = getPercentage(hotel);
  const pctFood = getPercentage(food);
  const pctActivities = getPercentage(activities);

  // Recommendations logic based on thresholds
  const getRecommendations = () => {
    const recs = [];
    if (pctHotel > 45) {
      recs.push({
        title: 'High Hotel Expense',
        desc: 'Your hotel takes up over 45% of your total budget. Consider booking boutique guesthouses, homestays, or search in surrounding suburbs to cut costs.',
        saving: Math.round(hotel * 0.3)
      });
    }
    if (pctTransport > 40) {
      recs.push({
        title: 'High Transit Expense',
        desc: 'Transportation takes up a massive portion of your budget. Search flights in private browsing mode, buy train passes in advance, or rely on bus systems.',
        saving: Math.round(transport * 0.25)
      });
    }
    if (pctFood > 30) {
      recs.push({
        title: 'Gourmet Heavy Spend',
        desc: 'Food costs are high. Try shopping at local farmer markets or tasting local street foods once a day instead of doing fine-dining for every meal.',
        saving: Math.round(food * 0.2)
      });
    }
    if (recs.length === 0) {
      recs.push({
        title: 'Budget Optimized',
        desc: 'Your expenses are beautifully balanced across transit, stays, and activities. Ready to secure reservations!',
        saving: 0
      });
    }
    return recs;
  };

  const handleReset = () => {
    setTransport(200);
    setHotel(300);
    setFood(150);
    setActivities(150);
    setLimit(900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/5 pb-6 mb-8 flex justify-between items-center">
        <div>
          <span className="text-orange-500 font-bold uppercase text-xs tracking-widest flex items-center gap-1">
            <BarChart className="h-4 w-4 text-orange-500" />
            <span>TravelVerse Financials</span>
          </span>
          <h1 className="text-3xl font-black tracking-tight mt-1">Budget Calculator</h1>
        </div>

        <button
          onClick={handleReset}
          className="p-2 border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
          title="Reset Calculator"
        >
          <RefreshCw className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Sliders Form */}
        <div className="lg:col-span-5 rounded-3xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-md p-6 shadow-xl space-y-6">
          <h2 className="text-lg font-bold">Category Allotment</h2>

          {/* Target Limit */}
          <div className="space-y-1 bg-orange-500/5 border border-orange-500/10 p-4 rounded-2xl">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
              <span>Target Budget Limit</span>
              <span className="text-orange-500 font-black">${limit}</span>
            </div>
            <input
              type="range"
              min="200"
              max="5000"
              step="50"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-white/15 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          <div className="space-y-5">
            {/* Transit Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">✈️ Flights & Transit</span>
                <span>${transport}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="25"
                value={transport}
                onChange={(e) => setTransport(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* Hotel Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">🏨 Stays & Accommodation</span>
                <span>${hotel}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2500"
                step="25"
                value={hotel}
                onChange={(e) => setHotel(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Food Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">🍜 Food & Dining</span>
                <span>${food}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={food}
                onChange={(e) => setFood(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* Activities Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">🥾 Tours & Activities</span>
                <span>${activities}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1500"
                step="25"
                value={activities}
                onChange={(e) => setActivities(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Visualization & Recs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main cost metrics card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Total Budget Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <div className="text-[10px] text-slate-500 dark:text-slate-500 uppercase font-bold">Total Estimated Budget</div>
              <div className="text-3xl font-black text-slate-800 dark:text-white mt-1 flex items-center"><DollarSign className="h-6.5 w-6.5 -ml-1 text-sky-500" />{totalBudget}</div>
            </div>

            {/* Budget status alerts */}
            <div className={`rounded-2xl border p-5 shadow-sm sm:col-span-2 flex items-center gap-4 ${
              isOverLimit
                ? 'bg-rose-500/5 border-rose-500/20 text-rose-700 dark:text-rose-400'
                : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
            }`}>
              {isOverLimit ? (
                <>
                  <AlertTriangle className="h-10 w-10 text-rose-500 shrink-0 animate-bounce" />
                  <div>
                    <h3 className="font-bold text-sm">Budget Limit Exceeded</h3>
                    <p className="text-[11px] leading-relaxed mt-0.5 opacity-90">
                      Your current budget of ${totalBudget} exceeds your target limit of ${limit} by <b>${totalBudget - limit}</b>. Check optimization ideas below!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Lightbulb className="h-10 w-10 text-emerald-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm">Budget In Safe Zone</h3>
                    <p className="text-[11px] leading-relaxed mt-0.5 opacity-90">
                      Congratulations! You have <b>${limit - totalBudget}</b> remaining headroom beneath your target ceiling of ${limit}.
                    </p>
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Visual Percentage Donut Ring (Styled SVG) */}
          <div className="rounded-3xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-md p-6 shadow-xl flex flex-col md:flex-row items-center justify-around gap-6">
            
            {/* SVG circle rendering */}
            <div className="relative h-44 w-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="40" stroke="rgba(14,165,233,0.05)" strokeWidth="12" fill="transparent" />
                
                {/* Transit Segment */}
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#0ea5e9" strokeWidth="12" fill="transparent"
                  strokeDasharray={`${pctTransport * 2.51} 251`}
                  strokeDashoffset={0}
                />
                {/* Hotel Segment */}
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#f97316" strokeWidth="12" fill="transparent"
                  strokeDasharray={`${pctHotel * 2.51} 251`}
                  strokeDashoffset={`-${pctTransport * 2.51}`}
                />
                {/* Food Segment */}
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#38bdf8" strokeWidth="12" fill="transparent"
                  strokeDasharray={`${pctFood * 2.51} 251`}
                  strokeDashoffset={`-${(pctTransport + pctHotel) * 2.51}`}
                />
                {/* Activities Segment */}
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#fdba74" strokeWidth="12" fill="transparent"
                  strokeDasharray={`${pctActivities * 2.51} 251`}
                  strokeDashoffset={`-${(pctTransport + pctHotel + pctFood) * 2.51}`}
                />
              </svg>
              
              {/* Inner details label */}
              <div className="absolute text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total</span>
                <div className="text-xl font-black text-slate-800 dark:text-white">${totalBudget}</div>
              </div>
            </div>

            {/* Color Legend Columns */}
            <div className="space-y-3 w-full max-w-xs text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-1">
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-sky-500 shrink-0"></span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Transit</span>
                </div>
                <b>{pctTransport}% (${transport})</b>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-1">
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-orange-500 shrink-0"></span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Accommodation</span>
                </div>
                <b>{pctHotel}% (${hotel})</b>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-1">
                <div className="flex items-center space-x-2">
                  <span className="h-3.5 w-3.5 rounded-full bg-sky-300 shrink-0"></span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Dining</span>
                </div>
                <b>{pctFood}% (${food})</b>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-1">
                <div className="flex items-center space-x-2">
                  <span className="h-3.5 w-3.5 rounded-full bg-orange-300 shrink-0"></span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Activities</span>
                </div>
                <b>{pctActivities}% (${activities})</b>
              </div>
            </div>
          </div>

          {/* AI Budget Recommendations */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold uppercase tracking-wider text-xs text-slate-500 dark:text-slate-500">AI Budget Recommendations</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getRecommendations().map((rec, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
                      <TrendingDown className="h-4 w-4 text-orange-500" />
                      <span>{rec.title}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {rec.desc}
                    </p>
                  </div>
                  {rec.saving > 0 && (
                    <div className="text-[10px] text-emerald-500 font-bold uppercase pt-3 border-t border-slate-100 dark:border-white/5 mt-3">
                      💡 Est. Saving: +${rec.saving}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

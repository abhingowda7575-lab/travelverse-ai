import React, { useState } from 'react';
import { Film, Sparkles, Music, Play, Plus, Layers, CheckCircle2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface VideoClip {
  id: string;
  name: string;
  duration: number; // in seconds
  thumbnail: string;
}

export const VideoEditor: React.FC = () => {
  const [clips, setClips] = useState<VideoClip[]>([
    { id: 'c1', name: 'Bali Beach Sunset.mp4', duration: 4.2, thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=120&q=80' },
    { id: 'c2', name: 'Scuba Diving Reef.mp4', duration: 3.5, thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=120&q=80' }
  ]);
  const [selectedMusic, setSelectedMusic] = useState('tropical');
  const [pacing, setPacing] = useState('dynamic');

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [reelGenerated, setReelGenerated] = useState(false);

  const musicTracks = [
    { id: 'tropical', label: '🏖️ Tropical House Beats' },
    { id: 'folk', label: '🥾 Acoustic Campfire Folk' },
    { id: 'cinematic', label: '🎬 Cinematic Uplifting Orchestral' },
    { id: 'cyberpunk', label: '🌌 Cyberpunk Neon Synthwave' }
  ];

  const stepsList = [
    'Decompressing clip arrays...',
    'Analyzing audio rhythm spikes...',
    'Syncing transition wipes to beats...',
    'Injecting high-definition ambient sound overlays...',
    'Compiling final highlight reel MP4...'
  ];

  const handleAddClip = () => {
    const randomIdx = Math.floor(Math.random() * 4) + 1;
    const names = ['Mountain Summit Trek.mp4', 'Temple Lantern Walk.mp4', 'Street Noodles Vlog.mp4', 'Waterfall Cliff Dive.mp4'];
    const thumbs = [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=120&q=80',
      'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=120&q=80'
    ];

    const newClip: VideoClip = {
      id: 'clip_' + Math.random().toString(36).substr(2, 5),
      name: names[randomIdx - 1],
      duration: parseFloat((Math.random() * 3 + 2).toFixed(1)),
      thumbnail: thumbs[randomIdx - 1]
    };
    setClips(prev => [...prev, newClip]);
  };

  const handleRemoveClip = (id: string) => {
    setClips(prev => prev.filter(c => c.id !== id));
  };

  const handleGenerateReel = () => {
    if (clips.length === 0) return alert('Add at least one clip.');
    setIsGenerating(true);
    setReelGenerated(false);
    setGenerationStep(0);

    // Run simulated steps with timeouts
    const runStep = (idx: number) => {
      if (idx < stepsList.length) {
        setGenerationStep(idx);
        setTimeout(() => runStep(idx + 1), 1200);
      } else {
        setIsGenerating(false);
        setReelGenerated(true);

        // Fire confetti on complete!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.7 }
        });
      }
    };

    runStep(0);
  };

  const handleDownloadReel = () => {
    alert('Mock Highlight Reel downloaded successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/5 pb-6 mb-8">
        <span className="text-orange-500 font-bold uppercase text-xs tracking-widest flex items-center gap-1">
          <Sparkles className="h-4 w-4 text-orange-500 animate-spin" />
          <span>TravelVerse Creative Suite</span>
        </span>
        <h1 className="text-3xl font-black tracking-tight mt-1">AI Video Editor</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Video Preview Window */}
        <div className="lg:col-span-8 flex flex-col justify-between rounded-3xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-md p-5 shadow-xl min-h-[400px]">
          
          <div className="relative flex-1 min-h-[300px] max-h-[450px] bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-slate-800">
            {isGenerating ? (
              <div className="text-center space-y-4 px-6 relative z-20">
                <Film className="h-12 w-12 text-sky-500 animate-spin mx-auto" />
                <h3 className="text-lg font-bold text-white">Synthesizing Travel Reel</h3>
                
                {/* Generation step logs */}
                <div className="text-xs text-orange-400 font-mono animate-pulse min-h-[16px]">
                  {stepsList[generationStep]}
                </div>

                {/* Progress bar */}
                <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-sky-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((generationStep + 1) / stepsList.length) * 100}%` }}
                    transition={{ duration: 1.2 }}
                  />
                </div>
              </div>
            ) : reelGenerated ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
                
                {/* Synced Video playback overlay */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover scale-102 opacity-80"
                >
                  <source
                    src="https://assets.mixkit.co/videos/preview/mixkit-waves-breaking-in-the-ocean-from-above-43022-large.mp4"
                    type="video/mp4"
                  />
                </video>

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-slate-950/40 z-20" />

                {/* Overlay Text representing Music & Captions Sync */}
                <div className="relative z-30 space-y-4 px-4 text-white">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Reel Complete</span>
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black italic tracking-wide drop-shadow-md">
                    🌴 WANDERLUST MEMORIES 🌴
                  </h3>
                  <div className="text-xs font-semibold text-orange-400 font-mono flex items-center justify-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 w-fit mx-auto">
                    <Music className="h-4 w-4 animate-bounce" />
                    <span>Track: {musicTracks.find(m => m.id === selectedMusic)?.label}</span>
                  </div>

                  <button
                    onClick={handleDownloadReel}
                    className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase shadow-md flex items-center space-x-1.5 mx-auto hover:scale-102 transition-all"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export High Definition Reel</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-center space-y-4 px-6 relative z-10 text-slate-400">
                <Film className="h-16 w-16 text-slate-700 animate-pulse mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-slate-300">Highlight Reel Preview</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
                    Select clips, choice of ambient tracks, and pacing details on the right to compile your cinematic escape summary.
                  </p>
                </div>
                <button
                  onClick={handleGenerateReel}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase shadow-md transition-all hover:scale-102 flex items-center gap-1.5 mx-auto"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Compile Reel</span>
                </button>
              </div>
            )}
          </div>

          {/* Timeline track representation */}
          <div className="mt-4 border-t border-slate-200 dark:border-white/5 pt-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-2 flex items-center gap-1">
              <Layers className="h-4 w-4 text-sky-500" />
              <span>Editing Timeline Tracks</span>
            </h3>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-sky-500 no-scrollbar">
              {clips.map((clip) => (
                <div
                  key={clip.id}
                  className="w-24 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-800 p-1 shrink-0 relative group"
                >
                  <img src={clip.thumbnail} alt="" className="h-12 w-full object-cover rounded-lg" />
                  <div className="text-[8px] font-semibold text-slate-500 dark:text-slate-400 truncate mt-1 px-1">
                    {clip.name}
                  </div>
                  <div className="text-[8px] font-bold text-orange-500 px-1 mt-0.5">{clip.duration}s</div>
                  
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveClip(clip.id)}
                    className="absolute top-0 right-0 h-4.5 w-4.5 rounded-bl-lg rounded-tr-xl bg-red-500 text-white text-[9px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              <button
                onClick={handleAddClip}
                className="w-24 h-[84px] border-2 border-dashed border-slate-300 dark:border-white/15 rounded-xl hover:border-orange-500 flex flex-col items-center justify-center text-slate-500 dark:text-slate-500 shrink-0 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span className="text-[8px] uppercase font-bold tracking-wider mt-1">Add Clip</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right: Sound options & Generation Config */}
        <div className="lg:col-span-4 rounded-3xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-md p-5 shadow-xl space-y-5">
          <h2 className="text-sm font-bold flex items-center gap-1.5">
            <Music className="h-4.5 w-4.5 text-orange-500 animate-pulse" />
            <span>Soundtrack Selection</span>
          </h2>

          <div className="space-y-4">
            {/* Music Radio selectors */}
            <div className="flex flex-col gap-2">
              {musicTracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => setSelectedMusic(track.id)}
                  className={`px-3 py-2.5 rounded-xl border text-[10px] font-bold text-left transition-all flex items-center justify-between ${
                    selectedMusic === track.id
                      ? 'bg-sky-500/10 border-sky-500 text-sky-500 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span>{track.label}</span>
                  {selectedMusic === track.id && <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping"></span>}
                </button>
              ))}
            </div>

            {/* Pacing slider / select */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-white/5">
              <label className="text-[9px] font-bold uppercase text-slate-500">Edit Pacing Style</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'dynamic', label: '⚡ Dynamic (Beats sync)' },
                  { value: 'cinematic', label: '🎬 Slow Cinematic (Fades)' }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setPacing(item.value)}
                    className={`py-2 rounded-xl text-[9px] font-bold border transition-all ${
                      pacing === item.value
                        ? 'bg-orange-500/10 border-orange-500 text-orange-500'
                        : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Compile button */}
            <button
              onClick={handleGenerateReel}
              disabled={isGenerating || clips.length === 0}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-sky-500 text-white font-bold tracking-wide shadow-lg hover:opacity-95 transition-opacity disabled:opacity-50 text-xs uppercase flex items-center justify-center gap-1.5"
            >
              <Film className="h-4.5 w-4.5" />
              <span>{isGenerating ? 'Synthesizing...' : 'Compile AI Highlight'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

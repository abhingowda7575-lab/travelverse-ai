import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Sliders, Sparkles, Download, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateCaption, applyPhotoFilter } from '../services/ai';

export const PhotoEditor: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState('none');
  
  // Custom slider adjustments
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  // Background removal simulation
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [bgRemoved, setBgRemoved] = useState(false);

  // Caption generator states
  const [tags, setTags] = useState('Bali, Sunset, Surf');
  const [tone, setTone] = useState('cinematic');
  const [generatedText, setGeneratedText] = useState('');
  const [captionLoading, setCaptionLoading] = useState(false);

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset Filters
  const filters = [
    { id: 'none', label: 'Original' },
    { id: 'vintage', label: '🎞️ Vintage Sepia' },
    { id: 'cinematic', label: '🎬 Cinematic' },
    { id: 'cyberpunk', label: '🌌 Cyberpunk Neon' },
    { id: 'monochrome', label: '📷 Monochrome' },
    { id: 'dreamy', label: '✨ Dreamy Glow' }
  ];

  // Auto-apply preset values when selected
  useEffect(() => {
    switch (selectedFilter) {
      case 'vintage':
        setBrightness(95); setContrast(110); setSaturation(80);
        break;
      case 'cinematic':
        setBrightness(90); setContrast(120); setSaturation(110);
        break;
      case 'cyberpunk':
        setBrightness(100); setContrast(110); setSaturation(180);
        break;
      case 'monochrome':
        setBrightness(95); setContrast(130); setSaturation(0);
        break;
      case 'dreamy':
        setBrightness(110); setContrast(90); setSaturation(120);
        break;
      default:
        setBrightness(100); setContrast(100); setSaturation(100);
    }
  }, [selectedFilter]);

  // Render Image onto canvas with CSS Filters
  useEffect(() => {
    if (!imageSrc) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      // Set sizes
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Apply CSS-like canvas filters
      let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      if (selectedFilter !== 'none') {
        filterString += ' ' + applyPhotoFilter(selectedFilter);
      }
      ctx.filter = filterString;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [imageSrc, brightness, contrast, saturation, selectedFilter]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setBgRemoved(false); // Reset background status
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBg = () => {
    setIsRemovingBg(true);
    // Simulate AI scanning grid scanner
    setTimeout(() => {
      setIsRemovingBg(false);
      setBgRemoved(true);
    }, 2000);
  };

  const handleGenerateCaption = () => {
    if (!tags.trim()) return;
    setCaptionLoading(true);
    setTimeout(() => {
      const cap = generateCaption(tags, tone);
      setGeneratedText(cap);
      setCaptionLoading(false);
    }, 800);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'travelverse-ai-edit.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const loadSample = () => {
    setImageSrc('https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80');
    setBgRemoved(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/5 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-orange-500 font-bold uppercase text-xs tracking-widest flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-orange-500 animate-spin" />
            <span>TravelVerse Creative Suite</span>
          </span>
          <h1 className="text-3xl font-black tracking-tight mt-1">AI Photo Editor</h1>
        </div>

        {!imageSrc && (
          <button
            onClick={loadSample}
            className="px-4 py-2 text-xs font-bold border border-slate-300 dark:border-white/10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            Load Sample Photo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Interactive Editor Area (Canvas) */}
        <div className="lg:col-span-8 flex flex-col justify-between rounded-3xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-md p-5 shadow-xl min-h-[400px]">
          
          {!imageSrc ? (
            <div className="flex-1 flex flex-col justify-center items-center py-20 text-center space-y-4">
              <ImageIcon className="h-16 w-16 text-slate-300 dark:text-slate-700 animate-pulse" />
              <div>
                <h3 className="text-lg font-bold">Import Image to Edit</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-0.5">
                  Import travel photographs to apply presets, modify values, remove backgrounds, or generate captions.
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase shadow-md transition-all hover:scale-102"
              >
                Upload Photo File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              
              {/* Canvas viewport container */}
              <div className="relative flex-1 min-h-[300px] max-h-[450px] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800">
                
                {/* Simulated BG checkerboard checker overlay */}
                <div className={`absolute inset-0 ${bgRemoved ? 'bg-[url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjY2NjIi8+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNjY2MiLz4KPC9zdmc+)] opacity-10 bg-repeat' : 'bg-transparent'}`} />

                {/* Canvas element */}
                <canvas ref={canvasRef} className={`max-h-[400px] max-w-full object-contain ${bgRemoved ? 'mask-bg-simulation' : ''}`} />

                {/* Simulated scanning animation */}
                <AnimatePresence>
                  {isRemovingBg && (
                    <motion.div
                      initial={{ y: '-100%' }}
                      animate={{ y: '100%' }}
                      exit={{ y: '-100%' }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_8px_#f97316]"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Action row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-white/5">
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-slate-300 dark:border-white/5 text-xs font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                  >
                    Replace Photo
                  </button>
                  <button
                    onClick={handleRemoveBg}
                    disabled={isRemovingBg || bgRemoved}
                    className={`px-4 py-2 border text-xs font-bold rounded-xl transition-all ${
                      bgRemoved
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                        : 'border-orange-500/30 hover:bg-orange-500/5 text-orange-500'
                    }`}
                  >
                    {isRemovingBg ? 'Scanning...' : bgRemoved ? 'Background Removed' : 'Remove Background'}
                  </button>
                </div>

                <button
                  onClick={handleDownload}
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase shadow-md flex items-center space-x-1.5"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Edit</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Presets & Caption Generator Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Sliders and Presets panel */}
          {imageSrc && (
            <div className="rounded-3xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-md p-5 shadow-xl space-y-5">
              <h2 className="text-sm font-bold flex items-center gap-1.5">
                <Sliders className="h-4.5 w-4.5 text-orange-500" />
                <span>Filters presets</span>
              </h2>

              {/* Preset selection grid */}
              <div className="grid grid-cols-2 gap-2">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFilter(f.id)}
                    className={`px-3 py-2.5 rounded-xl border text-[10px] font-bold text-left transition-all ${
                      selectedFilter === f.id
                        ? 'bg-orange-500/10 border-orange-500 text-orange-500'
                        : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Fine tuning sliders */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fine Adjustments</h3>
                
                {/* Brightness */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    <span>Brightness</span>
                    <span>{brightness}%</span>
                  </div>
                  <input
                    type="range" min="50" max="150" value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    <span>Contrast</span>
                    <span>{contrast}%</span>
                  </div>
                  <input
                    type="range" min="50" max="150" value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    <span>Saturation</span>
                    <span>{saturation}%</span>
                  </div>
                  <input
                    type="range" min="0" max="200" value={saturation}
                    onChange={(e) => setSaturation(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* AI Caption Generator Panel */}
          <div className="rounded-3xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-md p-5 shadow-xl space-y-4">
            <h2 className="text-sm font-bold flex items-center gap-1.5">
              <Type className="h-4.5 w-4.5 text-sky-500" />
              <span>AI Caption Generator</span>
            </h2>

            <div className="space-y-3">
              {/* Tags input */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-slate-500">Subject Tags</label>
                <input
                  type="text"
                  placeholder="e.g. Paris, Eiffel Tower, Autumn"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/5 text-slate-950 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Tone dropdown */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-slate-500">Caption Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/5 text-slate-950 dark:text-white focus:outline-none focus:border-sky-500 font-semibold"
                >
                  <option value="cinematic">Cinematic</option>
                  <option value="funny">Funny</option>
                  <option value="poetic">Poetic</option>
                  <option value="informative">Informative</option>
                </select>
              </div>

              <button
                onClick={handleGenerateCaption}
                disabled={captionLoading}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase shadow-md flex items-center justify-center gap-1.5"
              >
                {captionLoading ? (
                  <>
                    <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Compiling...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 animate-bounce" />
                    <span>Generate Captions</span>
                  </>
                )}
              </button>

              {/* Caption Output Card */}
              {generatedText && (
                <div className="p-3.5 rounded-xl border border-sky-500/20 bg-sky-500/5 text-[11px] leading-relaxed text-slate-800 dark:text-slate-300 relative">
                  <div className="font-bold text-[9px] uppercase text-sky-500 mb-1">Generated Output</div>
                  {generatedText}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import { Compass } from 'lucide-react';

interface InteractiveMapProps {
  lat: number;
  lng: number;
  destinationName: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ lat, lng, destinationName }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let pulseRadius = 0;
    let pathProgress = 0;

    // Resize handler
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Standard coordinate mapping (simplified projection for flat map)
    const mapCoordinates = (latitude: number, longitude: number, width: number, height: number) => {
      // Map longitude from -180...180 to 0...width
      const x = ((longitude + 180) / 360) * width;
      // Map latitude from -90...90 to height...0 (y is inverted in canvas)
      const y = ((90 - latitude) / 180) * height;
      return { x, y };
    };

    // Home location (e.g. New York, USA)
    const homeCoords = { lat: 40.7128, lng: -74.0060 };

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, w, h);

      // 1. Draw Futuristic Grid Background
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Draw styled landmasses shapes (mock dots for abstract world look)
      ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
      // Abstract landmass dot blocks
      const landPoints = [
        { x: 0.15, y: 0.3, r: 40 }, // North America
        { x: 0.2, y: 0.45, r: 25 },
        { x: 0.3, y: 0.7, r: 35 },  // South America
        { x: 0.5, y: 0.35, r: 30 }, // Europe
        { x: 0.52, y: 0.6, r: 40 }, // Africa
        { x: 0.75, y: 0.35, r: 50 }, // Asia
        { x: 0.72, y: 0.48, r: 20 },
        { x: 0.85, y: 0.75, r: 25 }  // Australia
      ];
      landPoints.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Map Coordinates
      const start = mapCoordinates(homeCoords.lat, homeCoords.lng, w, h);
      const end = mapCoordinates(lat, lng, w, h);

      // Make sure endpoints stay in bounds
      const clamp = (val: number, max: number) => Math.max(20, Math.min(max - 20, val));
      start.x = clamp(start.x, w);
      start.y = clamp(start.y, h);
      end.x = clamp(end.x, w);
      end.y = clamp(end.y, h);

      // 4. Draw Flight Path Bezier Curve
      const cpX = (start.x + end.x) / 2;
      const cpY = Math.min(start.y, end.y) - 60; // Curve up for simulated altitude

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.quadraticCurveTo(cpX, cpY, end.x, end.y);
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.3)'; // Travel orange path
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // Draw active flight trail progress
      pathProgress = (pathProgress + 0.005) % 1;
      const getBezierPoint = (t: number, p0: number, p1: number, p2: number) => {
        return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
      };
      const trailX = getBezierPoint(pathProgress, start.x, cpX, end.x);
      const trailY = getBezierPoint(pathProgress, start.y, cpY, end.y);

      // Draw flight pointer
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(trailX, trailY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Glowing circle behind flight pointer
      ctx.fillStyle = 'rgba(249, 115, 22, 0.4)';
      ctx.beginPath();
      ctx.arc(trailX, trailY, 8, 0, Math.PI * 2);
      ctx.fill();

      // 5. Draw Sonar Waves on Destination
      pulseRadius = (pulseRadius + 0.8) % 30;
      ctx.strokeStyle = `rgba(14, 165, 233, ${1 - pulseRadius / 30})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(end.x, end.y, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(14, 165, 233, ${Math.max(0, 0.5 - pulseRadius / 60)})`;
      ctx.beginPath();
      ctx.arc(end.x, end.y, pulseRadius * 2, 0, Math.PI * 2);
      ctx.stroke();

      // 6. Draw Markers
      // Home Marker
      ctx.fillStyle = '#0ea5e9';
      ctx.beginPath();
      ctx.arc(start.x, start.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Destination Marker
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(end.x, end.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner dot
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(end.x, end.y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 7. Text Labels
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.font = '10px Outfit, sans-serif';
      
      // Home label
      ctx.fillStyle = 'rgba(14, 165, 233, 0.8)';
      ctx.fillText('Departure (NYC)', start.x + 10, start.y + 4);

      // Destination label
      ctx.fillStyle = 'rgba(249, 115, 22, 0.9)';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.fillText(destinationName, end.x + 12, end.y + 4);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [lat, lng, destinationName]);

  // Calculate mock telemetry numbers
  const distance = Math.round(Math.sqrt(Math.pow(lat - 40.7, 2) + Math.pow(lng + 74, 2)) * 300 + 1200);
  const flightTime = (distance / 500).toFixed(1);

  return (
    <div className="relative rounded-2xl border border-white/10 dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/60 backdrop-blur-md overflow-hidden p-4 h-[350px] w-full flex flex-col justify-between">
      
      {/* Map Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2 shrink-0">
        <div className="flex items-center space-x-2">
          <Compass className="h-5 w-5 text-sky-500 animate-spin" style={{ animationDuration: '20s' }} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
            Vector Navigation Matrix
          </span>
        </div>
        <div className="flex space-x-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-[10px] text-emerald-500 font-semibold uppercase">Locked</span>
        </div>
      </div>

      {/* Main Canvas Drawing */}
      <div className="flex-1 w-full relative">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* Map Telemetry Footer */}
      <div className="grid grid-cols-3 gap-2 border-t border-slate-200 dark:border-white/5 pt-3 shrink-0 text-center">
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-500 uppercase font-semibold">Distance</div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{distance} km</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-500 uppercase font-semibold">Est. Flight</div>
          <div className="text-sm font-bold text-orange-500 dark:text-orange-400">{flightTime} hrs</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-500 uppercase font-semibold">Target Lat</div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{lat.toFixed(3)}° N</div>
        </div>
      </div>
    </div>
  );
};

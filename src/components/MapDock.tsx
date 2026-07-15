'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Mountain, Map as MapIcon, Navigation, Image as ImageIcon, Clock, Footprints, ShieldAlert, Compass, Plus, Minus, Maximize, Ruler } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { twMerge } from 'tailwind-merge';

export default function MapDock() {
  const { showTerrain, setShowTerrain, showSatellite, setShowSatellite, showMarkers, setShowMarkers, showVulnerability, setShowVulnerability, timeOfDay, setTimeOfDay, showTreks, setShowTreks } = useStore();
  const [showLayers, setShowLayers] = useState(false);
  const layersRef = useRef<HTMLDivElement>(null);

  // Close layers panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (layersRef.current && !layersRef.current.contains(event.target as Node)) {
        setShowLayers(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleZoomIn = () => window.dispatchEvent(new Event('map-zoom-in'));
  const handleZoomOut = () => window.dispatchEvent(new Event('map-zoom-out'));
  const handleResetNorth = () => window.dispatchEvent(new Event('map-reset-north'));
  const handleFullscreen = () => window.dispatchEvent(new Event('map-fullscreen'));

  const dockItems = [
    {
      id: 'layers',
      icon: <Layers className="w-[22px] h-[22px]" />,
      label: 'Layers',
      onClick: () => setShowLayers(!showLayers),
      active: showLayers
    },
    {
      id: 'compass',
      icon: <Compass className="w-[22px] h-[22px]" />,
      label: 'North',
      onClick: handleResetNorth
    },
    {
      id: 'zoom-in',
      icon: <Plus className="w-[22px] h-[22px]" />,
      label: 'Zoom In',
      onClick: handleZoomIn
    },
    {
      id: 'zoom-out',
      icon: <Minus className="w-[22px] h-[22px]" />,
      label: 'Zoom Out',
      onClick: handleZoomOut
    },
    {
      id: 'fullscreen',
      icon: <Maximize className="w-[22px] h-[22px]" />,
      label: 'Fullscreen',
      onClick: handleFullscreen
    },
    {
      id: 'measure',
      icon: <Ruler className="w-[22px] h-[22px]" />,
      label: 'Measure',
      onClick: () => alert('Measure tool coming soon!')
    }
  ];

  return (
    <div className="relative pointer-events-auto flex flex-col items-center">
      {/* Layers Popover */}
      <AnimatePresence>
        {showLayers && (
          <motion.div
            ref={layersRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-full mb-6 w-72 glass-panel rounded-[24px] overflow-hidden shadow-2xl z-50 border border-white/40 dark:border-slate-700/50 backdrop-blur-3xl bg-white/70 dark:bg-slate-900/80"
          >
            <div className="px-5 py-4 border-b border-slate-200/50 dark:border-slate-700/50">
              <h3 className="text-[11px] font-[800] text-slate-700 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--primary)]" />
                Map Controls
              </h3>
            </div>
            
            <div className="p-3 flex flex-col gap-3">
              {/* Base Map Toggle */}
              <div className="flex bg-slate-100/50 dark:bg-slate-800/50 rounded-xl p-1 shadow-inner">
                <button
                  onClick={() => setShowSatellite(false)}
                  className={twMerge(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300",
                    !showSatellite
                      ? "bg-white dark:bg-slate-700 text-[var(--primary)] shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  )}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  Base Map
                </button>
                <button
                  onClick={() => setShowSatellite(true)}
                  className={twMerge(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300",
                    showSatellite
                      ? "bg-white dark:bg-slate-700 text-[var(--primary)] shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  )}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Satellite
                </button>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-1 mt-1">
                <ToggleRow icon={<Mountain />} label="3D Terrain" active={showTerrain} onClick={() => setShowTerrain(!showTerrain)} />
                <ToggleRow icon={<Navigation />} label="Heritage Markers" active={showMarkers} onClick={() => setShowMarkers(!showMarkers)} color="var(--primary)" />
                <ToggleRow icon={<ShieldAlert />} label="Vulnerability" active={showVulnerability} onClick={() => setShowVulnerability(!showVulnerability)} color="#f43f5e" />
                <ToggleRow icon={<Footprints />} label="Trek Routes" active={showTreks} onClick={() => setShowTreks(!showTreks)} color="var(--primary)" />
              </div>

              {/* Time of Day Slider */}
              <div className="flex flex-col gap-2 px-2 py-1 mt-2 border-t border-slate-200/50 dark:border-slate-700/50 pt-4 pb-2">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    Time of Day
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {Math.floor(timeOfDay).toString().padStart(2, '0')}:{(timeOfDay % 1 === 0.5 ? '30' : '00')}
                  </span>
                </span>
                <input 
                  type="range" 
                  min="0" 
                  max="24" 
                  step="0.5" 
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[var(--primary)] mt-1"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dock */}
      <div className="glass-panel backdrop-blur-3xl bg-white/70 dark:bg-slate-900/80 rounded-[24px] border border-white/60 dark:border-slate-700/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-2 flex items-center gap-2 z-40">
        {dockItems.map((item, index) => (
          <div key={item.id} className="relative group">
            <button
              onClick={item.onClick}
              className={twMerge(
                "w-12 h-12 rounded-[16px] flex items-center justify-center transition-all duration-300 relative",
                item.active 
                  ? "bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white shadow-lg shadow-[var(--primary)]/30" 
                  : "text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:text-[var(--primary)] hover:scale-105 active:scale-95"
              )}
            >
              {item.icon}
            </button>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-slate-800 dark:bg-slate-700 text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
              {item.label}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-800 dark:border-t-slate-700"></div>
            </div>
            
            {/* Divider */}
            {index === 0 && <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-[1px] h-6 bg-slate-200 dark:bg-slate-700"></div>}
            {index === 4 && <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-[1px] h-6 bg-slate-200 dark:bg-slate-700"></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ToggleRow({ icon, label, active, onClick, color = "var(--primary)" }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, color?: string }) {
  return (
    <div 
      className="flex items-center justify-between cursor-pointer px-2 py-2.5 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors duration-300 group"
      onClick={onClick}
    >
      <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-3">
        <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors [&>svg]:w-4 [&>svg]:h-4">
          {icon}
        </span>
        {label}
      </span>
      <button className={twMerge(
        "w-[42px] h-6 rounded-full transition-colors duration-300 relative flex items-center shadow-inner border border-black/5 dark:border-white/10",
        active ? `bg-[${color}]` : "bg-slate-300 dark:bg-slate-600"
      )} style={{ backgroundColor: active ? color : undefined }}>
        <span className={twMerge(
          "w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] absolute left-[2px]",
          active ? "translate-x-[18px]" : "translate-x-0"
        )} />
      </button>
    </div>
  );
}

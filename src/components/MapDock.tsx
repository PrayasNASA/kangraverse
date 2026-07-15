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
      icon: <Layers className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: 'Layers',
      onClick: () => setShowLayers(!showLayers),
      active: showLayers
    },
    {
      id: 'compass',
      icon: <Compass className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: 'North',
      onClick: handleResetNorth
    },
    {
      id: 'zoom-in',
      icon: <Plus className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: 'Zoom In',
      onClick: handleZoomIn
    },
    {
      id: 'zoom-out',
      icon: <Minus className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: 'Zoom Out',
      onClick: handleZoomOut
    },
    {
      id: 'fullscreen',
      icon: <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />,
      label: 'Fullscreen',
      onClick: handleFullscreen
    },
    {
      id: 'measure',
      icon: <Ruler className="w-5 h-5 sm:w-6 sm:h-6" />,
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
            className="absolute bottom-full mb-5 w-[300px] rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.15)] z-50 border border-white/60 dark:border-white/10 backdrop-blur-[24px] bg-white/70 dark:bg-[#1C1C1E]/80"
          >
            <div className="px-5 py-4 border-b border-black/5 dark:border-white/5">
              <h3 className="text-[12px] font-[800] text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--primary)]" />
                Map Settings
              </h3>
            </div>
            
            <div className="p-3 flex flex-col gap-3">
              {/* Base Map Toggle */}
              <div className="flex bg-black/5 dark:bg-black/40 rounded-[16px] p-1 shadow-inner">
                <button
                  onClick={() => setShowSatellite(false)}
                  className={twMerge(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-[12px] text-[13px] font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50",
                    !showSatellite
                      ? "bg-white dark:bg-slate-700 text-[var(--primary)] shadow-sm"
                      : "text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  )}
                  aria-pressed={!showSatellite}
                >
                  <MapIcon className="w-4 h-4" />
                  Default
                </button>
                <button
                  onClick={() => setShowSatellite(true)}
                  className={twMerge(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-[12px] text-[13px] font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50",
                    showSatellite
                      ? "bg-white dark:bg-slate-700 text-[var(--primary)] shadow-sm"
                      : "text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  )}
                  aria-pressed={showSatellite}
                >
                  <ImageIcon className="w-4 h-4" />
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
              <div className="flex flex-col gap-3 px-2 py-2 mt-2 border-t border-black/5 dark:border-white/5 pt-5 pb-3">
                <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Time of Day
                  </span>
                  <span className="text-[12px] font-extrabold text-slate-500 dark:text-slate-400 bg-black/5 dark:bg-black/40 px-2.5 py-1 rounded-lg">
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
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-[var(--primary)] mt-1"
                  aria-label="Time of Day"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Premium Dock */}
      <div className="backdrop-blur-[24px] bg-white/70 dark:bg-[#1C1C1E]/70 rounded-full border border-white/60 dark:border-white/10 shadow-[0_20px_60px_rgba(15,23,42,0.15)] p-2 flex items-center z-40 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,23,42,0.2)]">
        {dockItems.map((item, index) => {
          const showDivider = [0, 1, 3, 4].includes(index);
          return (
            <div key={item.id} className="flex items-center">
              <div className="relative group flex items-center justify-center">
                <button
                  onClick={item.onClick}
                  className={twMerge(
                    "w-[46px] h-[46px] sm:w-[54px] sm:h-[54px] rounded-full flex items-center justify-center transition-all duration-300 ease-out relative focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50",
                    item.active 
                      ? "bg-white/90 dark:bg-white/20 text-[var(--primary)] dark:text-white shadow-sm" 
                      : "text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/15 hover:scale-[1.05] active:scale-[0.95]"
                  )}
                  aria-label={item.label}
                  aria-pressed={item.active}
                >
                  {item.icon}
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-slate-800/90 dark:bg-white/90 text-white dark:text-slate-900 text-[12px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-95 group-hover:scale-100 whitespace-nowrap shadow-xl backdrop-blur-md">
                  {item.label}
                </div>
              </div>
              
              {/* Divider */}
              {showDivider && (
                <div className="w-[1px] h-8 bg-black/10 dark:bg-white/10 mx-1 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ToggleRow({ icon, label, active, onClick, color = "var(--primary)" }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, color?: string }) {
  return (
    <div 
      className="flex items-center justify-between cursor-pointer px-3 py-3 rounded-[16px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300 group"
      onClick={onClick}
      role="switch"
      aria-checked={active}
      aria-label={label}
    >
      <span className="text-[14px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-3">
        <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-100 transition-colors [&>svg]:w-4 [&>svg]:h-4">
          {icon}
        </span>
        {label}
      </span>
      <button className={twMerge(
        "w-[44px] h-6 rounded-full transition-colors duration-300 relative flex items-center shadow-inner border border-black/5 dark:border-white/10 focus:outline-none",
        active ? `bg-[${color}]` : "bg-slate-300 dark:bg-slate-600"
      )} style={{ backgroundColor: active ? color : undefined }} tabIndex={-1}>
        <span className={twMerge(
          "w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] absolute left-[2px]",
          active ? "translate-x-[20px]" : "translate-x-0"
        )} />
      </button>
    </div>
  );
}

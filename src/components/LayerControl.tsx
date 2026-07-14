'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Mountain, Map as MapIcon, Navigation, Image as ImageIcon, Clock, ChevronDown, Footprints } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { twMerge } from 'tailwind-merge';

export default function LayerControl() {
  const { showTerrain, setShowTerrain, showSatellite, setShowSatellite, showMarkers, setShowMarkers, timeOfDay, setTimeOfDay, showTreks, setShowTreks } = useStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="absolute bottom-[120px] right-2 md:bottom-6 md:right-6 z-20 flex flex-col items-end gap-2 pointer-events-none">
      <AnimatePresence mode="wait">
        {!isCollapsed ? (
          <motion.div
            key="expanded"
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden pointer-events-auto"
          >
            <div className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Map Controls
                </h3>
              </div>
              <button 
                onClick={() => setIsCollapsed(true)} 
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors text-slate-500"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-3 flex flex-col gap-3">
          
          {/* Base Map Toggle */}
          <div className="flex bg-slate-100/50 dark:bg-slate-800/50 rounded-lg p-1">
            <button
              onClick={() => setShowSatellite(false)}
              className={twMerge(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all",
                !showSatellite
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              <MapIcon className="w-3.5 h-3.5" />
              Base Map
            </button>
            <button
              onClick={() => setShowSatellite(true)}
              className={twMerge(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all",
                showSatellite
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Satellite
            </button>
          </div>

          {/* 3D Terrain Toggle */}
          <div 
            className="flex items-center justify-between cursor-pointer px-1 py-1"
            onClick={() => setShowTerrain(!showTerrain)}
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Mountain className="w-4 h-4 text-indigo-500" />
              3D Terrain
            </span>
            <button className={twMerge(
              "w-10 h-5 rounded-full transition-colors relative flex items-center shadow-inner",
              showTerrain ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"
            )}>
              <span className={twMerge(
                "w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out absolute left-0.5",
                showTerrain ? "translate-x-5" : "translate-x-0"
              )} />
            </button>
          </div>

          {/* Markers Toggle */}
          <div 
            className="flex items-center justify-between cursor-pointer px-1 py-1"
            onClick={() => setShowMarkers(!showMarkers)}
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-indigo-500" />
              Heritage Markers
            </span>
            <button className={twMerge(
              "w-10 h-5 rounded-full transition-colors relative flex items-center shadow-inner",
              showMarkers ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"
            )}>
              <span className={twMerge(
                "w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out absolute left-0.5",
                showMarkers ? "translate-x-5" : "translate-x-0"
              )} />
            </button>
          </div>

          {/* Treks Toggle */}
          <div 
            className="flex items-center justify-between cursor-pointer px-1 py-1"
            onClick={() => setShowTreks(!showTreks)}
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Footprints className="w-4 h-4 text-indigo-500" />
              Trek Routes
            </span>
            <button className={twMerge(
              "w-10 h-5 rounded-full transition-colors relative flex items-center shadow-inner",
              showTreks ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"
            )}>
              <span className={twMerge(
                "w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out absolute left-0.5",
                showTreks ? "translate-x-5" : "translate-x-0"
              )} />
            </button>
          </div>
          {/* Time of Day Slider */}
          <div className="flex flex-col gap-2 px-1 py-1 mt-2 border-t border-slate-200/50 dark:border-slate-700/50 pt-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                Time of Day
              </span>
              <span className="text-xs text-slate-500 font-mono">
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
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
          </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            onClick={() => setIsCollapsed(false)}
            className="w-12 h-12 bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 pointer-events-auto hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Layers className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, Map as MapIcon, Mountain, Droplets, Landmark, Heart, Route, Filter } from 'lucide-react';
import Fuse from 'fuse.js';
import { twMerge } from 'tailwind-merge';

import { useStore, HeritageFeature, Tour } from '@/store/useStore';
import heritageDataRaw from '@/data/heritage.json';
import toursDataRaw from '@/data/tours.json';

const heritageData = heritageDataRaw as HeritageFeature[];
const toursData = toursDataRaw as Tour[];

const CATEGORIES = [
  { id: 'temple', label: 'Temples', icon: Landmark },
  { id: 'monastery', label: 'Monasteries', icon: Mountain },
  { id: 'lake', label: 'Lakes', icon: Droplets },
  { id: 'fort', label: 'Forts', icon: Landmark },
  { id: 'favorites', label: 'Favorites', icon: Heart },
];

const RELIGIONS = ['Hinduism', 'Buddhism', 'Christianity', 'Sikhism', 'Buddhism / Hinduism / Sikhism'];

export default function Sidebar() {
  const { searchQuery, setSearchQuery, setSelectedFeature, setFlyToLocation, selectedCategory, setSelectedCategory, favorites, activeTour, setActiveTour, filterReligion, setFilterReligion, showFilters, setShowFilters } = useStore();
  const [activeTab, setActiveTab] = useState<'places' | 'tours'>('places');
  
  // Setup Fuse.js
  const fuse = useMemo(() => new Fuse(heritageData, {
    keys: [
      'name',
      'type',
      'long_description',
      'village',
      'district',
      'religion',
      'deity',
      'tags',
      'keywords'
    ],
    threshold: 0.3,
  }), []);

  // Filter data based on search and category
  const filteredData = useMemo(() => {
    let result = heritageData;
    
    if (searchQuery) {
      result = fuse.search(searchQuery).map(res => res.item);
    }
    
    if (selectedCategory) {
      if (selectedCategory === 'favorites') {
        result = result.filter(item => favorites.includes(item.id));
      } else {
        result = result.filter(item => item.type.toLowerCase() === selectedCategory.toLowerCase());
      }
    }
    
    if (filterReligion) {
      result = result.filter(item => item.religion === filterReligion);
    }

    return result;
  }, [searchQuery, selectedCategory, filterReligion, fuse, favorites]);

  const handleStartTour = (tour: Tour) => {
    setActiveTour(tour);
    const firstFeature = heritageData.find(f => f.id === tour.stops[0]);
    if (firstFeature) {
      setSelectedFeature(firstFeature);
      setFlyToLocation({
        lng: firstFeature.longitude,
        lat: firstFeature.latitude,
        altitude: 2000,
        pitch: -45,
      });
    }
  };

  const handleSelectFeature = (feature: HeritageFeature) => {
    setSelectedFeature(feature);
    setFlyToLocation({
      lng: feature.longitude,
      lat: feature.latitude,
      altitude: 2000,
      pitch: -45,
    });
  };

  return (
    <motion.div 
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-4 left-4 z-20 w-80 max-h-[calc(100vh-2rem)] flex flex-col gap-4 pointer-events-none"
    >
      {/* Search & Header Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden pointer-events-auto flex flex-col">
        <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">KangraVerse</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">GIS Explorer</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100/50 dark:bg-slate-800/50 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab('places')}
              className={twMerge(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all",
                activeTab === 'places'
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              <MapIcon className="w-3.5 h-3.5" />
              Places
            </button>
            <button
              onClick={() => setActiveTab('tours')}
              className={twMerge(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all",
                activeTab === 'tours'
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              <Route className="w-3.5 h-3.5" />
              Tours
            </button>
          </div>
          
          {activeTab === 'places' && (
            <div className="flex flex-col gap-3">
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search places, deities, descriptions..." 
                    className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={twMerge(
                    "p-2.5 rounded-xl border transition-all flex items-center justify-center flex-shrink-0",
                    showFilters || filterReligion 
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/25" 
                      : "bg-slate-100/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                  )}
                  title="Advanced Filters"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
              
              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filter by Religion</span>
                      <div className="flex flex-wrap gap-1.5">
                        {RELIGIONS.map(rel => {
                          const isActive = filterReligion === rel;
                          return (
                            <button
                              key={rel}
                              onClick={() => setFilterReligion(isActive ? null : rel)}
                              className={twMerge(
                                "px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors border",
                                isActive 
                                  ? "bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300" 
                                  : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                              )}
                            >
                              {rel}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Categories (Only in Places tab) */}
        {activeTab === 'places' && (
          <div className="p-3 overflow-x-auto no-scrollbar flex gap-2">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                  className={twMerge(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                    isActive 
                      ? (cat.id === 'favorites' ? "bg-red-500 text-white shadow-md shadow-red-500/25" : "bg-indigo-600 text-white shadow-md shadow-indigo-500/25")
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  )}
                >
                  <Icon className={twMerge("w-3.5 h-3.5", isActive && cat.id === 'favorites' && "fill-current")} />
                  {cat.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Results List */}
      <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col pointer-events-auto">
        {activeTab === 'places' ? (
          <>
            <div className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {filteredData.length} {filteredData.length === 1 ? 'Result' : 'Results'} Found
              </h3>
            </div>
            <div className="overflow-y-auto p-2 flex flex-col gap-1 max-h-[50vh] custom-scrollbar">
              {filteredData.map(feature => (
                <button
                  key={feature.id}
                  onClick={() => handleSelectFeature(feature)}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group flex flex-col gap-1"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {feature.name}
                    </h4>
                    {favorites.includes(feature.id) && (
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-current flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="capitalize">{feature.type}</span>
                    <span>{feature.elevation_m}m</span>
                  </div>
                </button>
              ))}
              {filteredData.length === 0 && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                  No results found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Curated Tours
              </h3>
            </div>
            <div className="overflow-y-auto p-2 flex flex-col gap-2 max-h-[50vh] custom-scrollbar">
              {toursData.map(tour => {
                const isActive = activeTour?.id === tour.id;
                return (
                  <div key={tour.id} className={twMerge(
                    "w-full text-left p-3 rounded-xl border transition-colors",
                    isActive ? "bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50" : "bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  )}>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">{tour.name}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{tour.description}</p>
                    
                    <button 
                      onClick={() => handleStartTour(tour)}
                      className={twMerge(
                        "w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all",
                        isActive 
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                      )}
                    >
                      <Route className="w-3.5 h-3.5" />
                      {isActive ? 'Restart Tour' : 'Start Tour'} ({tour.stops.length} stops)
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

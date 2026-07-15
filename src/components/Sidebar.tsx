'use client';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, Map as MapIcon, Mountain, Droplets, Landmark, Heart, Route, Filter, Star, ArrowRight } from 'lucide-react';
import Fuse from 'fuse.js';
import { twMerge } from 'tailwind-merge';

import { useStore, HeritageFeature, Tour } from '@/store/useStore';
import heritageDataRaw from '@/data/heritage.json';
import toursDataRaw from '@/data/tours.json';

const heritageData = heritageDataRaw as HeritageFeature[];
const toursData = toursDataRaw as Tour[];

const CATEGORIES = [
  { id: 'all', label: 'All Places' },
  { id: 'temple', label: 'Temples' },
  { id: 'monastery', label: 'Monasteries' },
  { id: 'sacred grove', label: 'Sacred Groves' },
  { id: 'lake', label: 'Water Sources' }, // Mapping 'lake' to Water Sources for now
  { id: 'tours', label: 'Pilgrimage Routes' },
];

const RELIGIONS = ['Hinduism', 'Buddhism', 'Christianity', 'Sikhism', 'Buddhism / Hinduism / Sikhism'];

export default function Sidebar() {
  const { searchQuery, setSearchQuery, setSelectedFeature, setFlyToLocation, selectedCategory, setSelectedCategory, favorites, activeTour, setActiveTour, filterReligion, setFilterReligion, showFilters, setShowFilters } = useStore();
  const [activeTab, setActiveTab] = useState<'places' | 'tours'>('places');
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fuse = useMemo(() => new Fuse(heritageData, {
    keys: ['name', 'type', 'long_description', 'village', 'district', 'religion', 'deity', 'tags', 'keywords'],
    threshold: 0.3,
  }), []);

  const filteredData = useMemo(() => {
    let result = heritageData;
    if (searchQuery) result = fuse.search(searchQuery).map(res => res.item);
    if (selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'tours') {
      if (selectedCategory === 'favorites') {
        result = result.filter(item => favorites.includes(item.id));
      } else {
        result = result.filter(item => item.type.toLowerCase() === selectedCategory.toLowerCase() || (selectedCategory === 'lake' && item.type.toLowerCase() === 'water source'));
      }
    }
    if (filterReligion) result = result.filter(item => item.religion === filterReligion);
    return result;
  }, [searchQuery, selectedCategory, filterReligion, fuse, favorites]);

  const handleSelectFeature = (feature: HeritageFeature) => {
    setSelectedFeature(feature);
    setFlyToLocation({
      lng: feature.longitude,
      lat: feature.latitude,
      altitude: (feature.elevation_m || 1500) + 1200,
      pitch: -35,
    });
    if (isMobile) setSheetExpanded(false);
  };

  const handleStartTour = (tour: Tour) => {
    setActiveTour(tour);
    const firstFeature = heritageData.find(f => f.id === tour.stops[0]);
    if (firstFeature) {
      setSelectedFeature(firstFeature);
      setFlyToLocation({
        lng: firstFeature.longitude,
        lat: firstFeature.latitude,
        altitude: (firstFeature.elevation_m || 1500) + 1200,
        pitch: -35,
      });
    }
    if (isMobile) setSheetExpanded(false);
  };

  const getCategoryCount = (id: string) => {
    if (id === 'all') return heritageData.length;
    if (id === 'tours') return toursData.length;
    return heritageData.filter(item => item.type.toLowerCase() === id.toLowerCase() || (id === 'lake' && item.type.toLowerCase() === 'water source')).length;
  };

  const renderResultsList = () => (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 mt-4">
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
        <h3 className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          {activeTab === 'places' ? 'Recently Found' : 'Pilgrimage Routes'}
        </h3>
        <span className="text-xs font-medium text-slate-400">
          {activeTab === 'places' ? `${filteredData.length} results` : `${toursData.length} routes`}
        </span>
      </div>

      <div className="overflow-y-auto p-4 flex flex-col gap-2 flex-1 custom-scrollbar">
        {activeTab === 'places' ? (
          filteredData.map((feature, idx) => (
            <button
              key={feature.id}
              onClick={() => handleSelectFeature(feature)}
              className="w-full text-left p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group flex gap-4 items-center border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                <img 
                  src={feature.image_url || `https://images.unsplash.com/photo-1542382156909-9240b97cb724?w=150&h=150&fit=crop`} 
                  alt={feature.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {feature.name}
                </h4>
                <div className="flex items-center text-[11px] text-slate-500 dark:text-slate-400 mt-1 mb-1.5 truncate">
                  <span className="capitalize">{feature.type || 'Location'}</span>
                  <span className="mx-1.5">•</span>
                  <span>{feature.district || 'Kangra'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">4.8</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-500">{((idx + 1) * 1.2).toFixed(1)} km</span>
                </div>
              </div>
            </button>
          ))
        ) : (
          toursData.map(tour => {
            const isActive = activeTour?.id === tour.id;
            return (
              <div key={tour.id} className={twMerge(
                "w-full text-left p-4 rounded-2xl border transition-colors",
                isActive ? "bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50" : "bg-transparent border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">{tour.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{tour.description}</p>
                <button 
                  onClick={() => handleStartTour(tour)}
                  className={twMerge(
                    "w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all",
                    isActive 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  )}
                >
                  <Route className="w-4 h-4" />
                  {isActive ? 'Restart Route' : 'Start Route'} ({tour.stops.length} stops)
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
        <button className="w-full py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors flex items-center justify-center gap-2">
          View all {activeTab === 'places' ? 'places' : 'routes'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isMounted && !isMobile && (
        <motion.div 
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-24 left-6 z-20 w-[380px] flex flex-col pointer-events-none max-h-[calc(100dvh-120px)]"
        >
          {/* Search Header */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden pointer-events-auto shrink-0 mb-4 flex items-center p-2 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search sacred landscapes..." 
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl pl-9 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 font-medium transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                 <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">⌘ K</kbd>
              </div>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={twMerge(
                "p-3 rounded-xl border transition-all flex items-center justify-center flex-shrink-0",
                showFilters || filterReligion 
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/25" 
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
              )}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden pointer-events-auto flex flex-col flex-1 p-6">
            <h3 className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
              Explore Places
            </h3>
            
            <div className="grid grid-cols-2 gap-3 shrink-0">
              {CATEGORIES.map(cat => {
                const isActive = selectedCategory === cat.id || (cat.id === 'all' && !selectedCategory) || (cat.id === 'tours' && activeTab === 'tours');
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (cat.id === 'tours') {
                        setActiveTab('tours');
                        setSelectedCategory(null);
                      } else {
                        setActiveTab('places');
                        setSelectedCategory(cat.id === 'all' ? null : cat.id);
                      }
                    }}
                    className={twMerge(
                      "flex flex-col items-center justify-center py-4 rounded-2xl transition-all border",
                      isActive 
                        ? "bg-indigo-50/80 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-200 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    )}
                  >
                    <span className="text-xs font-semibold">{cat.label}</span>
                    <span className={twMerge(
                      "text-lg font-bold mt-1",
                      isActive ? "text-indigo-700 dark:text-indigo-300" : "text-slate-400 dark:text-slate-500"
                    )}>
                      {getCategoryCount(cat.id)}
                    </span>
                  </button>
                )
              })}
            </div>

            {renderResultsList()}
          </div>
        </motion.div>
      )}

      {/* MOBILE VIEW omitted for brevity as per your focus, though can add if needed */}
    </>
  );
}

'use client';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map as MapIcon, Route, Filter, Star, ArrowRight, ChevronDown, ChevronUp, History } from 'lucide-react';
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
  { id: 'lake', label: 'Water Sources' },
  { id: 'tours', label: 'Pilgrimage Routes' },
];

export default function Sidebar() {
  const { 
    searchQuery, setSearchQuery, 
    setSelectedFeature, setFlyToLocation, 
    selectedCategory, setSelectedCategory, 
    favorites, recentlyViewed, addRecentlyViewed,
    activeTour, setActiveTour, 
    filterReligion, showFilters, setShowFilters 
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'places' | 'tours'>('places');
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sheetState, setSheetState] = useState<'collapsed' | 'half' | 'expanded'>('half');
  
  // Collapsible states
  const [showCategories, setShowCategories] = useState(true);
  const [showRecent, setShowRecent] = useState(true);

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

  const recentFeatures = useMemo(() => {
    return recentlyViewed
      .map(id => heritageData.find(f => f.id === id))
      .filter(Boolean) as HeritageFeature[];
  }, [recentlyViewed]);

  const handleSelectFeature = (feature: HeritageFeature) => {
    setSelectedFeature(feature);
    addRecentlyViewed(feature.id);
    setFlyToLocation({
      lng: feature.longitude,
      lat: feature.latitude,
      altitude: (feature.elevation_m || 1500) + 1200,
      pitch: -35,
    });
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
  };

  const getCategoryCount = (id: string) => {
    if (id === 'all') return heritageData.length;
    if (id === 'tours') return toursData.length;
    return heritageData.filter(item => item.type.toLowerCase() === id.toLowerCase() || (id === 'lake' && item.type.toLowerCase() === 'water source')).length;
  };

  const renderResultsList = () => (
    <div className="flex flex-col gap-4">
      {activeTab === 'places' ? (
        filteredData.length > 0 ? (
          filteredData.map((feature, idx) => (
            <button
              key={feature.id}
              onClick={() => handleSelectFeature(feature)}
              className="w-full text-left p-3 rounded-[24px] glass-card group flex gap-4 items-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent hover:border-white/60"
            >
              <div className="w-20 h-20 rounded-[20px] overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 shadow-sm relative">
                <img 
                  src={feature.image_url || `https://images.unsplash.com/photo-1542382156909-9240b97cb724?w=150&h=150&fit=crop`} 
                  alt={feature.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center h-full py-1">
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-[15px] leading-tight group-hover:text-[var(--primary)] transition-colors truncate">
                  {feature.name}
                </h4>
                <div className="flex items-center text-[12px] text-slate-500 dark:text-slate-400 mt-1 mb-2 truncate font-semibold">
                  <span className="capitalize">{feature.type || 'Location'}</span>
                  <span className="mx-1.5">•</span>
                  <span>{feature.district || 'Kangra'}</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 bg-amber-400/15 px-2 py-0.5 rounded-lg border border-amber-400/20">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 ml-0.5">4.8</span>
                  </div>
                  <span className="text-[11px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-lg border border-[var(--primary)]/20">{((idx + 1) * 1.2).toFixed(1)} km</span>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
            No places found matching your criteria.
          </div>
        )
      ) : (
        toursData.map(tour => {
          const isActive = activeTour?.id === tour.id;
          return (
            <div key={tour.id} className={twMerge(
              "w-full text-left p-4 rounded-[24px] glass-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
              isActive ? "ring-2 ring-[var(--primary)] shadow-md" : "border border-white/20 hover:border-white/40"
            )}>
              <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-[15px] mb-1.5">{tour.name}</h4>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed font-medium">{tour.description}</p>
              <button 
                onClick={() => handleStartTour(tour)}
                className={twMerge(
                  "w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
                  isActive 
                    ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-lg shadow-[var(--primary)]/30"
                    : "bg-white/50 dark:bg-slate-800/50 border border-white/50 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700"
                )}
              >
                <Route className="w-[18px] h-[18px]" />
                {isActive ? 'Restart Route' : 'Start Route'} ({tour.stops.length} stops)
              </button>
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <>
      {isMounted && !isMobile && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative pointer-events-auto w-[380px] h-full flex flex-col gap-5 z-[40]"
        >
          {/* Search Bar - Fixed Top */}
          <div className="glass-panel bg-white/70 dark:bg-slate-900/80 rounded-[18px] pointer-events-auto shrink-0 flex items-center p-2 shadow-xl shadow-black/5 border border-white/60 dark:border-slate-700/50 h-[56px] backdrop-blur-3xl">
            <div className="relative flex-1 group h-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 group-focus-within:text-[var(--primary)] transition-colors" />
              <input 
                type="text" 
                placeholder="Explore Kangra..." 
                className="w-full h-full bg-transparent border-none rounded-xl pl-10 pr-4 text-[15px] focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-semibold transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={twMerge(
                "h-full px-3 rounded-[12px] transition-all flex items-center justify-center flex-shrink-0 ml-1",
                showFilters || filterReligion 
                  ? "bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white shadow-md shadow-[var(--primary)]/30" 
                  : "bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/20"
              )}
            >
              <Filter className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* Main Panel (Categories + Results) */}
          <div className="glass-panel backdrop-blur-3xl bg-white/70 dark:bg-slate-900/80 border border-white/60 dark:border-slate-700/50 rounded-[24px] pointer-events-auto flex flex-col overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] flex-1 min-h-0">
            {/* Categories Section - Fixed Below Search */}
            <div className="p-5 pb-3 flex flex-col gap-4 shrink-0 border-b border-white/40 dark:border-white/5">
              
              <div className="flex flex-col gap-3">
                <div 
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => setShowCategories(!showCategories)}
                >
                  <h3 className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <MapIcon className="w-3.5 h-3.5 text-[var(--primary)]" /> Categories
                  </h3>
                  <button className="text-slate-400 group-hover:text-[var(--primary)] transition-colors">
                    {showCategories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
                
                <AnimatePresence>
                  {showCategories && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-2 pt-1">
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
                                "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 w-full hover:-translate-y-0.5",
                                isActive 
                                  ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-lg shadow-[var(--primary)]/30 border border-transparent"
                                  : "bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white/90 shadow-sm"
                              )}
                            >
                              <span className="text-[12px] font-bold truncate">{cat.label}</span>
                              <span className={twMerge(
                                "text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ml-2",
                                isActive ? "bg-white/20 text-white" : "bg-black/5 dark:bg-white/10 text-slate-500"
                              )}>
                                {getCategoryCount(cat.id)}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Floating Recent Places (Highly rounded thumbnails) */}
              {recentFeatures.length > 0 && !searchQuery && (
                <div className="flex flex-col gap-3">
                  <div 
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => setShowRecent(!showRecent)}
                  >
                    <h3 className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <History className="w-3 h-3" /> Recent Highlights
                    </h3>
                    <button className="text-slate-400 group-hover:text-[var(--primary)] transition-colors">
                      {showRecent ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {showRecent && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2 pt-1 -mx-2 px-2 snap-x">
                          {recentFeatures.map(feature => (
                            <button 
                              key={`recent-${feature.id}`}
                              onClick={() => handleSelectFeature(feature)}
                              className="flex flex-col items-center gap-2 snap-start group w-[72px]"
                            >
                              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/50 shadow-sm group-hover:shadow-md group-hover:border-[var(--primary)] transition-all duration-300 group-hover:-translate-y-1 relative shrink-0">
                                <img 
                                  src={feature.image_url || `https://images.unsplash.com/photo-1542382156909-9240b97cb724?w=150&h=150&fit=crop`} 
                                  alt={feature.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                              </div>
                              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 w-full truncate text-center group-hover:text-[var(--primary)] transition-colors">
                                {feature.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Main Results Section (Scrollable) */}
              <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto custom-scrollbar px-5 py-3 pb-5 scroll-smooth">
                <div className="flex items-center justify-between sticky top-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md py-1.5 -mx-1 px-1 z-10 rounded-lg">
                  <h3 className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    {activeTab === 'places' ? (searchQuery ? 'Search Results' : 'Explore Places') : 'Pilgrimage Routes'}
                  </h3>
                  <motion.span 
                    key={activeTab === 'places' ? filteredData.length : toursData.length}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[10px] font-bold text-white bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-2.5 py-0.5 rounded-full shadow-sm"
                  >
                    {activeTab === 'places' ? filteredData.length : toursData.length}
                  </motion.span>
                </div>

                {renderResultsList()}
                
                <button className="w-full mt-2 py-3 text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 dark:text-indigo-400 dark:bg-indigo-900/20 rounded-xl transition-colors flex items-center justify-center gap-2 group shrink-0">
                  View all {activeTab === 'places' ? 'places' : 'routes'} 
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}

      {isMounted && isMobile && (
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: window.innerHeight * 0.75 }}
          dragElastic={0.1}
          onDragEnd={(e, info) => {
            if (info.offset.y > 50) {
              setSheetState(sheetState === 'expanded' ? 'half' : 'collapsed');
            } else if (info.offset.y < -50) {
              setSheetState(sheetState === 'collapsed' ? 'half' : 'expanded');
            }
          }}
          initial="half"
          animate={sheetState}
          variants={{
            expanded: { y: 0 },
            half: { y: '50vh' },
            collapsed: { y: 'calc(100vh - 120px)' }
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 w-full h-[90vh] z-30 glass-panel backdrop-blur-3xl bg-white/70 dark:bg-slate-900/80 rounded-t-[32px] border-t border-white/60 dark:border-slate-700/50 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] flex flex-col pt-1"
        >
          {/* Drag Handle */}
          <div className="w-full flex justify-center py-3 touch-none cursor-grab active:cursor-grabbing shrink-0" onClick={() => setSheetState(sheetState === 'collapsed' ? 'half' : 'collapsed')}>
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
          </div>

          {/* Mobile Search Bar */}
          <div className="px-5 pb-4 shrink-0 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Explore Kangra..." 
                className="w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/60 rounded-2xl pl-10 pr-4 py-3.5 text-[15px] focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-semibold shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSheetState('expanded')}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={twMerge(
                "w-14 rounded-2xl transition-all flex items-center justify-center flex-shrink-0 shadow-sm",
                showFilters || filterReligion 
                  ? "bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white shadow-[var(--primary)]/20" 
                  : "bg-white/80 dark:bg-slate-800/80 border border-white/60 text-slate-600 dark:text-slate-300"
              )}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Mobile Area */}
          <div className="flex-1 overflow-y-auto px-5 pb-10 custom-scrollbar flex flex-col gap-6" onTouchStart={(e) => { e.stopPropagation(); }}>
            {/* Horizontal Categories */}
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 pt-1 -mx-2 px-2 snap-x">
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
                      setSheetState('expanded');
                    }}
                    className={twMerge(
                      "flex items-center gap-2 px-4 py-2.5 rounded-[20px] whitespace-nowrap snap-start transition-all",
                      isActive 
                        ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-md shadow-[var(--primary)]/20"
                        : "bg-white/60 dark:bg-slate-800/60 border border-white/40 text-slate-700 dark:text-slate-300"
                    )}
                  >
                    <span className="text-[13px] font-bold">{cat.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Results */}
            <div className="flex flex-col gap-3 pb-8">
              <div className="flex items-center justify-between sticky top-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md py-2 -mx-2 px-2 z-10 rounded-lg">
                <h3 className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  {activeTab === 'places' ? (searchQuery ? 'Search Results' : 'Explore Places') : 'Pilgrimage Routes'}
                </h3>
                <span className="text-[10px] font-bold text-white bg-[var(--primary)] px-2.5 py-0.5 rounded-full shadow-sm">
                  {activeTab === 'places' ? filteredData.length : toursData.length}
                </span>
              </div>
              {renderResultsList()}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

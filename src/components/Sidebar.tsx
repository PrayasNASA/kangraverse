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
              className="w-full text-left p-3.5 rounded-[20px] bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-slate-700/50 group flex gap-4 items-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:bg-white/80 dark:hover:bg-slate-700/80 hover:border-white/80 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              aria-label={`Select ${feature.name}`}
            >
              <div className="w-[84px] h-[84px] rounded-[16px] overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 shadow-inner relative">
                <img 
                  src={feature.image_url || `https://images.unsplash.com/photo-1542382156909-9240b97cb724?w=150&h=150&fit=crop`} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center h-full py-0.5">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-[16px] leading-snug group-hover:text-[var(--primary)] transition-colors truncate">
                  {feature.name}
                </h4>
                <div className="flex items-center text-[13px] text-slate-500 dark:text-slate-400 mt-1 mb-2 truncate font-medium">
                  <span className="capitalize">{feature.type || 'Location'}</span>
                  <span className="mx-2 opacity-50">•</span>
                  <span>{feature.district || 'Kangra'}</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="text-[12px] font-bold text-amber-700 dark:text-amber-400 leading-none">4.8</span>
                  </div>
                  <span className="text-[12px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2.5 py-1 rounded-lg border border-[var(--primary)]/20 leading-none">
                    {((idx + 1) * 1.2).toFixed(1)} km
                  </span>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
            <MapIcon className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm font-medium">No places found matching your criteria.</p>
          </div>
        )
      ) : (
        toursData.map(tour => {
          const isActive = activeTour?.id === tour.id;
          return (
            <div key={tour.id} className={twMerge(
              "w-full text-left p-5 rounded-[20px] backdrop-blur-md transition-all duration-300 ease-out flex flex-col gap-3",
              isActive 
                ? "bg-white/80 dark:bg-slate-800/80 ring-2 ring-[var(--primary)] shadow-[0_10px_20px_-10px_var(--primary)] border border-transparent" 
                : "bg-white/40 dark:bg-slate-800/40 border border-white/60 dark:border-slate-700/50 hover:-translate-y-1 hover:shadow-xl hover:bg-white/70 dark:hover:bg-slate-700/70"
            )}>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-[16px] mb-1">{tour.name}</h4>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">{tour.description}</p>
              </div>
              <button 
                onClick={() => handleStartTour(tour)}
                className={twMerge(
                  "w-full py-3 px-4 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]",
                  isActive 
                    ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-md shadow-[var(--primary)]/30 hover:shadow-lg"
                    : "bg-white/60 dark:bg-slate-900/60 border border-white/80 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800"
                )}
                aria-label={isActive ? `Restart ${tour.name}` : `Start ${tour.name}`}
              >
                <Route className="w-4 h-4" />
                {isActive ? 'Restart Route' : 'Start Route'} <span className="opacity-70 font-medium">({tour.stops.length} stops)</span>
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
        <motion.aside
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative pointer-events-auto w-[420px] h-full flex flex-col z-[40] bg-white/60 dark:bg-slate-900/70 backdrop-blur-2xl border-r border-white/50 dark:border-slate-700/50 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.15)]"
        >
          {/* Header / Search - Fixed Top */}
          <header className="shrink-0 p-6 border-b border-black/5 dark:border-white/5 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md z-20">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 group h-[52px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Explore Kangra..." 
                  className="w-full h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/60 dark:border-slate-600/50 rounded-2xl pl-11 pr-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-semibold transition-all shadow-sm hover:bg-white/90 dark:hover:bg-slate-800/90"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search places"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                aria-label="Toggle filters"
                aria-pressed={showFilters || !!filterReligion}
                className={twMerge(
                  "h-[52px] w-[52px] rounded-2xl transition-all flex items-center justify-center flex-shrink-0 shadow-sm border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50",
                  showFilters || filterReligion 
                    ? "bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white border-transparent shadow-[var(--primary)]/30 hover:shadow-[var(--primary)]/50 hover:scale-105" 
                    : "bg-white/70 dark:bg-slate-800/70 border-white/60 dark:border-slate-600/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:scale-105"
                )}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Categories - Fixed, auto-scrolls if it exceeds max height */}
          <nav aria-label="Categories" className="shrink-0 max-h-[35vh] overflow-y-auto custom-scrollbar p-6 border-b border-black/5 dark:border-white/5 z-10 bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm">
            <div className="flex flex-col gap-4">
              <div 
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => setShowCategories(!showCategories)}
                role="button"
                aria-expanded={showCategories}
              >
                <h3 className="text-[12px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-[var(--primary)]" /> Categories
                </h3>
                <button aria-label="Toggle categories" className="text-slate-400 group-hover:text-[var(--primary)] transition-colors focus:outline-none">
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
                    <div className="grid grid-cols-2 gap-3 pt-1">
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
                            aria-pressed={isActive}
                            className={twMerge(
                              "flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-300 w-full hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50",
                              isActive 
                                ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-md shadow-[var(--primary)]/30 border border-transparent"
                                : "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white/90 dark:hover:bg-slate-700/90 shadow-sm hover:shadow"
                            )}
                          >
                            <span className="text-[13px] font-bold truncate">{cat.label}</span>
                            <span className={twMerge(
                              "text-[11px] font-extrabold px-2 py-0.5 rounded-full ml-2 transition-colors",
                              isActive ? "bg-white/20 text-white" : "bg-slate-200/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300"
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
          </nav>

          {/* Explore Places - Flex 1, Scrollable */}
          <main aria-label="Explore Places" className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-8 z-0">
            {/* Floating Recent Places */}
            {recentFeatures.length > 0 && !searchQuery && (
              <section aria-label="Recent Highlights" className="flex flex-col gap-4">
                <div 
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => setShowRecent(!showRecent)}
                  role="button"
                  aria-expanded={showRecent}
                >
                  <h3 className="text-[12px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                    <History className="w-4 h-4 text-[var(--primary)]" /> Recent
                  </h3>
                  <button aria-label="Toggle recent places" className="text-slate-400 group-hover:text-[var(--primary)] transition-colors focus:outline-none">
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
                      <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-3 pt-1 px-1 -mx-1 snap-x">
                        {recentFeatures.map(feature => (
                          <button 
                            key={`recent-${feature.id}`}
                            onClick={() => handleSelectFeature(feature)}
                            className="flex flex-col items-center gap-2.5 snap-start group w-[80px] focus:outline-none"
                            aria-label={`Select recent ${feature.name}`}
                          >
                            <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-white/60 shadow-sm group-hover:shadow-lg group-hover:border-[var(--primary)] group-focus:ring-2 group-focus:ring-[var(--primary)] group-focus:ring-offset-2 transition-all duration-300 group-hover:-translate-y-1 relative shrink-0">
                              <img 
                                src={feature.image_url || `https://images.unsplash.com/photo-1542382156909-9240b97cb724?w=150&h=150&fit=crop`} 
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 w-full truncate text-center group-hover:text-[var(--primary)] transition-colors">
                              {feature.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            )}

            <section aria-label="Results" className="flex flex-col gap-4">
              <div className="flex items-center justify-between sticky top-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl py-2 -mx-2 px-2 z-10 rounded-xl shadow-sm border border-white/40 dark:border-slate-700/50">
                <h3 className="text-[12px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                  {activeTab === 'places' ? (searchQuery ? 'Search Results' : 'Explore Places') : 'Pilgrimage Routes'}
                </h3>
                <motion.span 
                  key={activeTab === 'places' ? filteredData.length : toursData.length}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-[11px] font-bold text-white bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-3 py-1 rounded-full shadow-sm"
                >
                  {activeTab === 'places' ? filteredData.length : toursData.length}
                </motion.span>
              </div>

              {renderResultsList()}
              
              <button className="w-full mt-2 py-4 text-[13px] font-bold text-[var(--primary)] bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 dark:text-indigo-400 dark:bg-indigo-900/20 rounded-xl transition-colors flex items-center justify-center gap-2 group shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50">
                View all {activeTab === 'places' ? 'places' : 'routes'} 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </section>
          </main>
        </motion.aside>
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
          className="fixed bottom-0 left-0 w-full h-[90vh] z-50 bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-t-[32px] border-t border-white/50 dark:border-slate-700/50 shadow-[0_-20px_60px_rgba(0,0,0,0.2)] flex flex-col pt-2"
        >
          {/* Drag Handle */}
          <div className="w-full flex justify-center py-4 touch-none cursor-grab active:cursor-grabbing shrink-0" onClick={() => setSheetState(sheetState === 'collapsed' ? 'half' : 'collapsed')}>
            <div className="w-16 h-1.5 bg-slate-300/80 dark:bg-slate-600/80 rounded-full" />
          </div>

          {/* Mobile Search Bar */}
          <header className="px-5 pb-5 shrink-0 flex gap-3 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="relative flex-1 group h-[52px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors" />
              <input 
                type="text" 
                placeholder="Explore Kangra..." 
                className="w-full h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/60 dark:border-slate-600/50 rounded-2xl pl-11 pr-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-semibold transition-all shadow-sm hover:bg-white/90 dark:hover:bg-slate-800/90"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSheetState('expanded')}
                aria-label="Search places"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
              aria-pressed={showFilters || !!filterReligion}
              className={twMerge(
                "h-[52px] w-[52px] rounded-2xl transition-all flex items-center justify-center flex-shrink-0 shadow-sm border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50",
                showFilters || filterReligion 
                  ? "bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white border-transparent shadow-[var(--primary)]/30 hover:shadow-[var(--primary)]/50" 
                  : "bg-white/70 dark:bg-slate-800/70 border-white/60 dark:border-slate-600/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
              )}
            >
              <Filter className="w-5 h-5" />
            </button>
          </header>

          {/* Horizontal Categories */}
          <nav className="shrink-0 py-4 px-5 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2 pt-1 -mx-2 px-2 snap-x">
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
                    aria-pressed={isActive}
                    className={twMerge(
                      "flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap snap-start transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 border",
                      isActive 
                        ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-md shadow-[var(--primary)]/30 border-transparent"
                        : "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white/90 dark:hover:bg-slate-800/90 shadow-sm"
                    )}
                  >
                    <span className="text-[14px] font-bold">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Scrollable Mobile Area */}
          <main className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar flex flex-col gap-6" onTouchStart={(e) => { e.stopPropagation(); }}>
            <section aria-label="Results" className="flex flex-col gap-4 pb-8">
              <div className="flex items-center justify-between sticky top-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl py-2 -mx-2 px-2 z-10 rounded-xl shadow-sm border border-white/40 dark:border-slate-700/50">
                <h3 className="text-[12px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                  {activeTab === 'places' ? (searchQuery ? 'Search Results' : 'Explore Places') : 'Pilgrimage Routes'}
                </h3>
                <span className="text-[11px] font-bold text-white bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-3 py-1 rounded-full shadow-sm">
                  {activeTab === 'places' ? filteredData.length : toursData.length}
                </span>
              </div>
              {renderResultsList()}
            </section>
          </main>
        </motion.div>
      )}
    </>
  );
}

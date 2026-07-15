'use client';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map as MapIcon, Route, Filter, Star, ArrowRight, ChevronDown, ChevronUp, History } from 'lucide-react';
import Fuse from 'fuse.js';
import { twMerge } from 'tailwind-merge';

import { useStore, HeritageFeature, Tour } from '@/store/useStore';
import { Z_INDEX } from '@/utils/zIndex';
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
              className="w-full text-left p-4 rounded-[24px] glass-card group flex gap-4 items-start focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 hover:shadow-[0_12px_32px_rgba(108,99,255,0.15)]"
              aria-label={`Select ${feature.name}`}
            >
              <div className="w-[88px] h-[88px] rounded-[20px] overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 shadow-inner relative">
                <img 
                  src={feature.image_url || `https://images.unsplash.com/photo-1542382156909-9240b97cb724?w=150&h=150&fit=crop`} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-start py-0.5">
                <h4 className="font-[800] text-slate-800 dark:text-slate-100 text-[17px] leading-snug group-hover:text-[var(--primary)] transition-colors truncate">
                  {feature.name}
                </h4>
                <div className="flex items-center text-[13px] text-slate-500 dark:text-slate-400 mt-1 mb-3 truncate font-medium">
                  <span className="capitalize">{feature.type || 'Location'}</span>
                  <span className="mx-2 opacity-50">•</span>
                  <span>{feature.district || 'Kangra'}</span>
                </div>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="flex items-center gap-1.5 bg-amber-400/10 px-2.5 py-1 rounded-[12px] border border-amber-400/20">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="text-[12px] font-bold text-amber-700 dark:text-amber-400 leading-none mt-px">4.8</span>
                  </div>
                  <span className="text-[12px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2.5 py-1 rounded-[12px] border border-[var(--primary)]/20 leading-none mt-px">
                    {((idx + 1) * 1.2).toFixed(1)} km
                  </span>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 glass-card rounded-[24px] border-dashed">
            <MapIcon className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm font-bold">No places found matching your criteria.</p>
          </div>
        )
      ) : (
        toursData.map(tour => {
          const isActive = activeTour?.id === tour.id;
          return (
            <div key={tour.id} className={twMerge(
              "w-full text-left p-5 rounded-[24px] transition-all duration-300 ease-out flex flex-col gap-4",
              isActive 
                ? "bg-white/80 dark:bg-slate-800/80 ring-2 ring-[var(--primary)] shadow-[0_10px_30px_-10px_var(--primary)] border border-transparent" 
                : "glass-card hover:-translate-y-1"
            )}>
              <div>
                <h4 className="font-[800] text-slate-800 dark:text-slate-100 text-[17px] mb-1.5">{tour.name}</h4>
                <p className="text-[14px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">{tour.description}</p>
              </div>
              <button 
                onClick={() => handleStartTour(tour)}
                className={twMerge(
                  "w-full py-3.5 px-4 rounded-[16px] text-[14px] font-bold flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]",
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
        <div style={{ zIndex: Z_INDEX.SIDEBAR }} className="absolute top-[140px] bottom-6 left-6 pointer-events-none flex">
          <motion.aside
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.8 }}
            className="pointer-events-auto w-[440px] h-full flex flex-col glass-panel rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.15)]"
          >
            {/* Header / Search - Fixed Top */}
            <header className="shrink-0 p-6 border-b border-black/5 dark:border-white/5 bg-white/20 dark:bg-slate-800/20 backdrop-blur-3xl z-20">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 group h-[56px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Explore Kangra..." 
                    className="w-full h-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl border border-white/60 dark:border-slate-600/50 rounded-[22px] pl-12 pr-5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-bold transition-all shadow-inner hover:bg-white/80 dark:hover:bg-slate-800/80"
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
                    "h-[56px] w-[56px] rounded-[20px] transition-all duration-300 ease-out flex items-center justify-center flex-shrink-0 border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50",
                    showFilters || filterReligion 
                      ? "bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white border-transparent shadow-[0_8px_24px_rgba(108,99,255,0.3)] hover:scale-105" 
                      : "bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl border-white/60 dark:border-slate-600/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:scale-105 shadow-sm"
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
                      <div className="grid grid-cols-2 gap-3 pt-2">
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
                                "flex items-center justify-between px-4 py-4 rounded-[20px] transition-all duration-300 ease-out w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50",
                                isActive 
                                  ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-[0_8px_24px_rgba(108,99,255,0.3)] border border-transparent scale-[1.02] -translate-y-[2px]"
                                  : "glass-card text-slate-700 dark:text-slate-300"
                              )}
                            >
                              <span className="text-[14px] font-[800] truncate">{cat.label}</span>
                              <span className={twMerge(
                                "text-[11px] font-extrabold px-2.5 py-1 rounded-full ml-2 transition-colors",
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
            <main aria-label="Explore Places" className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-5 z-0">
              {/* Floating Recent Places */}
              {recentFeatures.length > 0 && !searchQuery && (
                <section aria-label="Recent Highlights" className="flex flex-col gap-5">
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
                              className="flex flex-col items-center gap-2.5 snap-start group w-[84px] focus:outline-none"
                              aria-label={`Select recent ${feature.name}`}
                            >
                              <div className="w-[76px] h-[76px] rounded-full overflow-hidden border-2 border-white/60 shadow-md group-hover:shadow-[0_8px_24px_rgba(108,99,255,0.3)] group-hover:border-[var(--primary)] group-focus:ring-2 group-focus:ring-[var(--primary)] group-focus:ring-offset-2 transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105 relative shrink-0">
                                <img 
                                  src={feature.image_url || `https://images.unsplash.com/photo-1542382156909-9240b97cb724?w=150&h=150&fit=crop`} 
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                              </div>
                              <span className="text-[12px] font-bold text-slate-600 dark:text-slate-300 w-full truncate text-center group-hover:text-[var(--primary)] transition-colors">
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

              <section aria-label="Results" className="flex flex-col gap-5">
                <div className="flex items-center justify-between sticky top-0 glass-panel backdrop-blur-[32px] py-2.5 -mx-2 px-3 z-10 rounded-[18px]">
                  <h3 className="text-[12px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                    {activeTab === 'places' ? (searchQuery ? 'Search Results' : 'Explore Places') : 'Pilgrimage Routes'}
                  </h3>
                  <motion.span 
                    key={activeTab === 'places' ? filteredData.length : toursData.length}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[11px] font-[900] text-white bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-3.5 py-1 rounded-full shadow-sm"
                  >
                    {activeTab === 'places' ? filteredData.length : toursData.length}
                  </motion.span>
                </div>

                {renderResultsList()}
                
                <button className="w-full mt-1 py-4 text-[14px] font-[800] text-[var(--primary)] bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 dark:text-indigo-400 dark:bg-indigo-900/20 rounded-[18px] transition-colors flex items-center justify-center gap-2 group shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 hover:shadow-[0_8px_24px_rgba(108,99,255,0.15)]">
                  View all {activeTab === 'places' ? 'places' : 'routes'} 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-out" />
                </button>
              </section>
            </main>
          </motion.aside>
        </div>
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
          transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.8 }}
          className="fixed bottom-0 left-0 w-full h-[90vh] z-50 glass-panel backdrop-blur-3xl rounded-t-[32px] border-t border-white/50 dark:border-slate-700/50 shadow-[0_-20px_60px_rgba(0,0,0,0.2)] flex flex-col pt-2"
        >
          {/* Drag Handle */}
          <div className="w-full flex justify-center py-4 touch-none cursor-grab active:cursor-grabbing shrink-0" onClick={() => setSheetState(sheetState === 'collapsed' ? 'half' : 'collapsed')}>
            <div className="w-16 h-1.5 bg-slate-300/80 dark:bg-slate-600/80 rounded-full" />
          </div>

          {/* Mobile Search Bar */}
          <header className="px-5 pb-5 shrink-0 flex gap-3 border-b border-black/5 dark:border-white/5">
            <div className="relative flex-1 group h-[56px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors" />
              <input 
                type="text" 
                placeholder="Explore Kangra..." 
                className="w-full h-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl border border-white/60 dark:border-slate-600/50 rounded-[22px] pl-12 pr-5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-bold transition-all shadow-inner hover:bg-white/80 dark:hover:bg-slate-800/80"
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
                "h-[56px] w-[56px] rounded-[20px] transition-all duration-300 ease-out flex items-center justify-center flex-shrink-0 shadow-sm border focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50",
                showFilters || filterReligion 
                  ? "bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white border-transparent shadow-[0_8px_24px_rgba(108,99,255,0.3)] hover:scale-105" 
                  : "bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl border-white/60 dark:border-slate-600/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:scale-105"
              )}
            >
              <Filter className="w-5 h-5" />
            </button>
          </header>

          {/* Horizontal Categories */}
          <nav className="shrink-0 py-5 px-5 border-b border-black/5 dark:border-white/5">
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
                      "flex items-center gap-2 px-6 py-3.5 rounded-[20px] whitespace-nowrap snap-start transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50",
                      isActive 
                        ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-[0_8px_24px_rgba(108,99,255,0.3)] border border-transparent scale-[1.02] -translate-y-[2px]"
                        : "glass-card text-slate-700 dark:text-slate-300"
                    )}
                  >
                    <span className="text-[14px] font-[800]">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Scrollable Mobile Area */}
          <main className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar flex flex-col gap-6" onTouchStart={(e) => { e.stopPropagation(); }}>
            <section aria-label="Results" className="flex flex-col gap-5 pb-8">
              <div className="flex items-center justify-between sticky top-0 glass-panel backdrop-blur-[32px] py-2.5 -mx-2 px-3 z-10 rounded-[18px]">
                <h3 className="text-[12px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                  {activeTab === 'places' ? (searchQuery ? 'Search Results' : 'Explore Places') : 'Pilgrimage Routes'}
                </h3>
                <span className="text-[11px] font-[900] text-white bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-3.5 py-1 rounded-full shadow-sm">
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

'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Mountain, Heart, Share2, Star,
  Users, ShieldAlert, BookOpen, TrendingUp, Shield, Activity, Bookmark
} from 'lucide-react';
import { useStore, HeritageFeature, Trek } from '@/store/useStore';
import heritageDataRaw from '@/data/heritage.json';
import { twMerge } from 'tailwind-merge';

const heritageData = heritageDataRaw as HeritageFeature[];

const TABS = ['About', 'History', 'Architecture', 'Festivals', 'Gallery'];

export default function InfoPanel() {
  const { selectedFeature, setSelectedFeature, favorites, toggleFavorite } = useStore();
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('About');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderResearchInsights = (feature: HeritageFeature) => {
    const insights = [
      { id: 'community', label: 'Community', icon: Users, value: 'Very High', color: 'text-blue-500', bg: 'bg-blue-500/10' },
      { id: 'vulnerability', label: 'Vulnerability', icon: ShieldAlert, value: feature.vulnerability || 'Moderate', color: feature.vulnerability === 'High' ? 'text-red-500' : 'text-amber-500', bg: feature.vulnerability === 'High' ? 'bg-red-500/10' : 'bg-amber-500/10' },
      { id: 'knowledge', label: 'Knowledge', icon: BookOpen, value: 'High', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
      { id: 'tourism', label: 'Tourism', icon: TrendingUp, value: 'High', color: 'text-rose-500', bg: 'bg-rose-500/10' },
      { id: 'conservation', label: 'Conservation', icon: Shield, value: 'High', color: 'text-purple-500', bg: 'bg-purple-500/10' },
      { id: 'cultural', label: 'Cultural', icon: Activity, value: 'Very High', color: 'text-amber-600', bg: 'bg-amber-600/10' },
    ];

    return (
      <div className="mt-8 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[12px] font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
            Research Insights
          </h3>
          <InfoIcon className="w-4 h-4 text-slate-400" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div key={insight.id} className="p-3.5 rounded-[18px] bg-slate-50 dark:bg-slate-800/50 border border-black/5 dark:border-white/5 flex flex-col gap-3 group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={twMerge("w-8 h-8 rounded-full flex items-center justify-center shrink-0", insight.bg, insight.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-tight">
                    {insight.label}
                  </span>
                </div>
                <span className={twMerge("text-[14px] font-[800]", insight.color)}>
                  {insight.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {selectedFeature && (
        <motion.div
          drag={isMobile ? "y" : false}
          dragConstraints={{ top: 0, bottom: typeof window !== 'undefined' ? window.innerHeight * 0.8 : 800 }}
          dragElastic={0.2}
          onDragEnd={(e, info) => {
            if (isMobile && info.offset.y > 150) {
              setSelectedFeature(null);
            }
          }}
          initial={isMobile ? { y: '100%', opacity: 0 } : { x: 400, opacity: 0, scale: 0.95 }}
          animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1, scale: 1 }}
          exit={isMobile ? { y: '100%', opacity: 0 } : { x: 400, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350, mass: 0.8 }}
          className="absolute bottom-0 right-0 md:top-24 md:right-6 z-[60] w-full md:w-[460px] h-[92dvh] md:h-auto md:max-h-[calc(100dvh-120px)] flex flex-col pointer-events-none"
        >
          <div className="relative flex flex-col h-full bg-transparent rounded-t-[32px] md:rounded-[32px] overflow-hidden pointer-events-auto shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)] border-0 md:border border-white/20 dark:border-white/10">
            
            {/* Sticky Glass Header Overlay */}
            <div className="absolute top-0 left-0 right-0 z-50 flex justify-between p-5 bg-gradient-to-b from-black/60 via-black/30 to-transparent pointer-events-none">
              <div className="flex gap-2 pointer-events-auto">
                <span className="px-3.5 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-[11px] font-extrabold uppercase tracking-widest text-white shadow-md flex items-center justify-center">
                  {selectedFeature.type || 'Location'}
                </span>
                {'vulnerability' in selectedFeature && selectedFeature.vulnerability && (
                  <span className={twMerge(
                    "px-3.5 py-1.5 rounded-xl border border-white/30 text-[11px] font-extrabold uppercase tracking-widest text-white flex items-center gap-1.5 shadow-md",
                    selectedFeature.vulnerability === 'High' ? 'bg-red-500/80 backdrop-blur-md' : 'bg-amber-500/80 backdrop-blur-md'
                  )}>
                    {selectedFeature.vulnerability === 'High' && <ShieldAlert className="w-3.5 h-3.5" />}
                    {selectedFeature.vulnerability}
                  </span>
                )}
              </div>
              <div className="flex gap-2 pointer-events-auto">
                <button 
                  className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setSelectedFeature(null)} 
                  className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-white dark:bg-slate-900 pb-[88px] sm:pb-[96px]">
               
               {/* Sticky Parallax Image Background */}
               <div className="sticky top-0 w-full h-[340px] z-0">
                  <img 
                    src={selectedFeature.image_url || `https://images.unsplash.com/photo-1542382156909-9240b97cb724?w=800&q=80`} 
                    alt={selectedFeature.name} 
                    className="w-full h-full object-cover"
                  />
                  {/* Dark gradient for text readability if scrolled down */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
               </div>

               {/* Slidable Content Card */}
               <div className="relative z-10 bg-white dark:bg-slate-900 rounded-t-[32px] -mt-[40px] min-h-[500px] shadow-[0_-15px_40px_rgba(0,0,0,0.15)] flex flex-col border-t border-white/50 dark:border-white/5">
                  
                  {/* Mobile Drag Indicator */}
                  {isMobile && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full z-20" />
                  )}

                  {/* Title Area */}
                  <div className="px-6 pt-8 pb-6 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h2 className="text-[28px] md:text-[32px] font-[900] text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                        {selectedFeature.name}
                      </h2>
                      <button 
                        onClick={() => toggleFavorite(selectedFeature.id)}
                        className={twMerge("w-12 h-12 shrink-0 rounded-full flex items-center justify-center transition-all shadow-md border focus:outline-none focus:ring-2 focus:ring-rose-500/50", favorites.includes(selectedFeature.id) ? "bg-rose-50 border-rose-100 dark:bg-rose-900/30 dark:border-rose-900/50 text-rose-500" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500")}
                        aria-label="Toggle favorite"
                      >
                        <Heart className={twMerge("w-5 h-5 transition-transform", favorites.includes(selectedFeature.id) && "fill-current scale-110")} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center gap-1 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span className="text-[13px] font-bold text-amber-600 dark:text-amber-400">4.8</span>
                      </div>
                      <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 hover:text-[var(--primary)] transition-colors cursor-pointer underline decoration-slate-300 dark:decoration-slate-600 underline-offset-4">(128 community reviews)</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[16px] p-3 flex flex-col items-center justify-center text-center border border-black/5 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <Mountain className="w-5 h-5 text-[var(--primary)] mb-2 opacity-80" />
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Elevation</span>
                        <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{selectedFeature.elevation_m || '1000'}m</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[16px] p-3 flex flex-col items-center justify-center text-center border border-black/5 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <MapPin className="w-5 h-5 text-[var(--primary)] mb-2 opacity-80" />
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Latitude</span>
                        <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{('coordinates' in selectedFeature ? selectedFeature.coordinates[0][1] : selectedFeature.latitude).toFixed(4)}°</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[16px] p-3 flex flex-col items-center justify-center text-center border border-black/5 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <MapPin className="w-5 h-5 text-[var(--primary)] mb-2 opacity-80" />
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Longitude</span>
                        <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{('coordinates' in selectedFeature ? selectedFeature.coordinates[0][0] : selectedFeature.longitude).toFixed(4)}°</span>
                      </div>
                    </div>
                  </div>

                  {/* Sticky Tabs */}
                  <div className="sticky top-[76px] z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 px-4 shadow-sm transition-colors">
                    <div className="flex overflow-x-auto no-scrollbar gap-2 py-3">
                      {TABS.map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={twMerge(
                            "px-5 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50",
                            activeTab === tab 
                              ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/30" 
                              : "text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
                          )}
                          aria-pressed={activeTab === tab}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content Placeholder */}
                  <div className="p-6">
                    {activeTab === 'About' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="space-y-6 pt-2"
                      >
                        <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          {('long_description' in selectedFeature ? selectedFeature.long_description : selectedFeature.description)}
                        </p>

                        {!('coordinates' in selectedFeature) && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-[20px] border border-black/5 dark:border-white/5">
                              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Religion</span>
                              <span className="text-[14px] font-bold text-slate-800 dark:text-slate-200">{selectedFeature.religion || 'Not specified'}</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-[20px] border border-black/5 dark:border-white/5">
                              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Deity</span>
                              <span className="text-[14px] font-bold text-slate-800 dark:text-slate-200">{selectedFeature.deity || 'Not specified'}</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-[20px] border border-black/5 dark:border-white/5">
                              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Village</span>
                              <span className="text-[14px] font-bold text-slate-800 dark:text-slate-200">{selectedFeature.village || 'Not specified'}</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-[20px] border border-black/5 dark:border-white/5">
                              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">District</span>
                              <span className="text-[14px] font-bold text-slate-800 dark:text-slate-200">{selectedFeature.district || 'Kangra'}</span>
                            </div>
                          </div>
                        )}

                        {renderResearchInsights(selectedFeature as HeritageFeature)}
                      </motion.div>
                    )}
                  </div>
               </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 z-50 p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-black/5 dark:border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
               <button className="w-full py-4 rounded-[16px] bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-extrabold text-[15px] shadow-lg shadow-[var(--primary)]/30 hover:shadow-[var(--primary)]/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2">
                  <MapPin className="w-5 h-5" /> Start Navigation
               </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  );
}

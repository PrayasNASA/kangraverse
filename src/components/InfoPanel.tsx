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
      { id: 'community', label: 'Community Importance', icon: Users, value: 'Very High', color: 'text-indigo-600 dark:text-indigo-400' },
      { id: 'vulnerability', label: 'Vulnerability Level', icon: ShieldAlert, value: feature.vulnerability || 'Moderate', color: feature.vulnerability === 'High' ? 'text-red-500' : 'text-amber-500' },
      { id: 'knowledge', label: 'Traditional Knowledge', icon: BookOpen, value: 'High', color: 'text-emerald-600 dark:text-emerald-400' },
      { id: 'tourism', label: 'Tourism Pressure', icon: TrendingUp, value: 'High', color: 'text-rose-500 dark:text-rose-400' },
      { id: 'conservation', label: 'Conservation Priority', icon: Shield, value: 'High', color: 'text-purple-600 dark:text-purple-400' },
      { id: 'cultural', label: 'Cultural Significance', icon: Activity, value: 'Very High', color: 'text-amber-600 dark:text-amber-400' },
    ];

    return (
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Research Insights
          </h3>
          <InfoIcon className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div key={insight.id} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-3 rounded-xl flex flex-col justify-between h-24">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-tight pr-2">
                    {insight.label}
                  </span>
                  <Icon className={twMerge("w-4 h-4 shrink-0", insight.color)} />
                </div>
                <span className={twMerge("text-sm font-bold mt-2", insight.color)}>
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
          initial={isMobile ? { y: '100%', opacity: 0 } : { x: 400, opacity: 0 }}
          animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
          exit={isMobile ? { y: '100%', opacity: 0 } : { x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute bottom-0 right-0 md:top-24 md:right-6 md:bottom-auto z-50 md:z-20 w-full md:w-[480px] max-h-[85dvh] md:max-h-[calc(100dvh-120px)] flex flex-col pointer-events-none"
        >
          <div className="bg-white dark:bg-slate-900 border-t md:border border-slate-200/50 dark:border-slate-800/50 rounded-t-[32px] md:rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col h-full">

            {/* Close Button on Mobile (floating above image) */}
            {isMobile && (
              <button 
                onClick={() => setSelectedFeature(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/40 backdrop-blur-md text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            {/* Header Image Section */}
            <div className="relative h-64 w-full bg-slate-200 dark:bg-slate-800 shrink-0">
              <img 
                src={selectedFeature.image_url || `https://images.unsplash.com/photo-1542382156909-9240b97cb724?w=800&q=80`} 
                alt={selectedFeature.name} 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-md bg-indigo-600 text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
                  {selectedFeature.type || 'Location'}
                </span>
                {'vulnerability' in selectedFeature && selectedFeature.vulnerability && (
                  <span className={twMerge(
                    "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-1 shadow-md",
                    selectedFeature.vulnerability === 'High' ? 'bg-red-500' : 'bg-amber-500'
                  )}>
                    {selectedFeature.vulnerability === 'High' ? <ShieldAlert className="w-3 h-3" /> : null}
                    {selectedFeature.vulnerability} Risk
                  </span>
                )}
              </div>

              {!isMobile && (
                <button 
                  onClick={() => setSelectedFeature(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div className="absolute bottom-4 right-4 flex gap-2">
                <button 
                  onClick={() => toggleFavorite(selectedFeature.id)}
                  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-colors shadow-lg"
                >
                  <Bookmark className={twMerge("w-5 h-5", favorites.includes(selectedFeature.id) && "fill-current")} />
                </button>
                <button 
                  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-colors shadow-lg"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900 pb-6">
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-3">
                  {selectedFeature.name}
                </h2>
                
                <div className="flex items-center gap-2 text-sm mb-6 border-b border-slate-100 dark:border-slate-800 pb-6">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={twMerge("w-4 h-4", i < 4 ? "fill-current" : (i === 4 ? "fill-amber-400/50" : ""))} />
                    ))}
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">4.8</span>
                  <span className="text-slate-500 dark:text-slate-400">(128 reviews)</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <Mountain className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Elevation</span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedFeature.elevation_m || '1000'} m</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Latitude</span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{('coordinates' in selectedFeature ? selectedFeature.coordinates[0][1] : selectedFeature.latitude).toFixed(4)}° N</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Longitude</span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{('coordinates' in selectedFeature ? selectedFeature.coordinates[0][0] : selectedFeature.longitude).toFixed(4)}° E</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-1">
                  {('long_description' in selectedFeature ? selectedFeature.long_description : selectedFeature.description)?.substring(0, 150)}...
                </p>
                <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center mb-8">
                  Read more <span className="ml-1">→</span>
                </button>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto no-scrollbar">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={twMerge(
                        "px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors relative",
                        activeTab === tab 
                          ? "text-indigo-600 dark:text-indigo-400" 
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                      )}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div 
                          layoutId="activeTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content Placeholder */}
                {activeTab === 'About' && (
                  <div className="space-y-4">
                    {!('coordinates' in selectedFeature) && (
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Religion</span>
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{selectedFeature.religion || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Deity</span>
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{selectedFeature.deity || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Village</span>
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{selectedFeature.village || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">District</span>
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{selectedFeature.district || 'Kangra'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {renderResearchInsights(selectedFeature as HeritageFeature)}
              </div>

              {/* Footer */}
              <div className="p-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 mt-4">
                <span className="text-xs text-slate-500 font-medium">Data Source: Field Survey 2025</span>
                <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:text-indigo-700">
                  View Details <span className="ml-0.5">→</span>
                </button>
              </div>

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

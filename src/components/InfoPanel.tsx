'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Mountain, ExternalLink, PlaySquare, Heart, ChevronLeft, ChevronRight, Check, Play, Pause, Download, ShieldAlert, Camera } from 'lucide-react';
import { useStore, HeritageFeature, Trek } from '@/store/useStore';
import heritageDataRaw from '@/data/heritage.json';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { downloadGPX } from '@/utils/gpx';

const heritageData = heritageDataRaw as HeritageFeature[];

export default function InfoPanel() {
  const { selectedFeature, setSelectedFeature, favorites, toggleFavorite, activeTour, setActiveTour, currentTourStep, setCurrentTourStep, setFlyToLocation, isPlayingTour, toggleIsPlayingTour, setIsPlayingTour } = useStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTourStep = (direction: 'next' | 'prev') => {
    if (!activeTour) return;
    const nextStep = direction === 'next' ? currentTourStep + 1 : currentTourStep - 1;
    if (nextStep >= 0 && nextStep < activeTour.stops.length) {
      setCurrentTourStep(nextStep);
      const nextFeatureId = activeTour.stops[nextStep];
      const nextFeature = heritageData.find(f => f.id === nextFeatureId);
      if (nextFeature) {
        setSelectedFeature(nextFeature);
        setFlyToLocation({
          lng: nextFeature.longitude,
          lat: nextFeature.latitude,
          altitude: (nextFeature.elevation_m || 1500) + 1200, // Dynamic altitude
          pitch: -35,
          duration: 3, // Slightly longer duration for a more cinematic tour feel
        });
      }
    } else if (direction === 'next') {
      setActiveTour(null);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingTour && activeTour) {
      timer = setTimeout(() => {
        handleTourStep('next');
      }, 10000); // 10 seconds per stop
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayingTour, activeTour, currentTourStep]);

  // Pause if the user manually changes the step
  const handleManualTourStep = (direction: 'next' | 'prev') => {
    setIsPlayingTour(false);
    handleTourStep(direction);
  };

  return (
    <AnimatePresence>
      {selectedFeature && (
        <motion.div
          initial={isMobile ? { y: '100%', opacity: 0 } : { x: 400, opacity: 0 }}
          animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
          exit={isMobile ? { y: '100%', opacity: 0 } : { x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute bottom-0 left-0 right-0 md:top-4 md:right-4 md:bottom-auto md:left-auto z-50 md:z-20 w-full md:w-96 max-h-[85dvh] md:max-h-[calc(100dvh-2rem)] flex flex-col pointer-events-none"
        >
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t md:border border-white/40 dark:border-slate-800/60 rounded-t-3xl md:rounded-2xl shadow-[0_-16px_40px_rgba(0,0,0,0.2)] md:shadow-[0_16px_40px_rgba(0,0,0,0.2)] overflow-hidden pointer-events-auto flex flex-col max-h-full">

            
            {/* Hero Image Section */}
            <div className="relative h-48 w-full bg-slate-200 dark:bg-slate-800 shrink-0">
              {selectedFeature.image_url ? (
                <img 
                  src={selectedFeature.image_url} 
                  alt={selectedFeature.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Mountain className="w-12 h-12 opacity-50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              
              <button 
                onClick={() => setSelectedFeature(null)}
                className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <button 
                onClick={() => toggleFavorite(selectedFeature.id)}
                className="absolute top-3 right-12 p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full transition-colors"
              >
                <Heart className={favorites.includes(selectedFeature.id) ? "w-4 h-4 text-red-500 fill-current" : "w-4 h-4"} />
              </button>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white">
                    {selectedFeature.type || ('coordinates' in selectedFeature ? 'Trek' : 'Location')}
                  </span>
                  {'vulnerability' in selectedFeature && selectedFeature.vulnerability && (
                    <span className={`px-2.5 py-1 rounded-full backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1 ${
                      selectedFeature.vulnerability === 'High' ? 'bg-rose-500/80' : 
                      selectedFeature.vulnerability === 'Moderate' ? 'bg-amber-500/80' : 'bg-emerald-500/80'
                    }`}>
                      <ShieldAlert className="w-3 h-3" />
                      {selectedFeature.vulnerability} Risk
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold leading-tight drop-shadow-md">
                  {selectedFeature.name}
                </h2>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
              <div className="flex items-center gap-4 mb-6 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Mountain className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium">{selectedFeature.elevation_m || 'N/A '}m Elevation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium">
                    {('coordinates' in selectedFeature ? selectedFeature.coordinates[0][1] : selectedFeature.latitude).toFixed(4)}, {('coordinates' in selectedFeature ? selectedFeature.coordinates[0][0] : selectedFeature.longitude).toFixed(4)}
                  </span>
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                <p>{'long_description' in selectedFeature ? selectedFeature.long_description : selectedFeature.description}</p>
              </div>

              {/* Data fields matching the requirements conditionally */}
              {!('coordinates' in selectedFeature) ? (
                <div className="grid grid-cols-2 gap-3 mb-6 border-t border-slate-200 dark:border-slate-800 pt-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Religion</span>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {selectedFeature.religion || 'Not available'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deity</span>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {selectedFeature.deity || 'Not available'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Village</span>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {selectedFeature.village || 'Not available'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">District</span>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {selectedFeature.district || 'Kangra'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-6 border-t border-slate-200 dark:border-slate-800 pt-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Elevation Profile</h3>
                  <div className="h-32 w-full mb-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2 border border-slate-100 dark:border-slate-800">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedFeature.coordinates.map((c, i) => ({ dist: i, alt: c[2] || 2000 }))} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={selectedFeature.color || "#4f46e5"} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={selectedFeature.color || "#4f46e5"} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="dist" hide />
                        <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                          labelFormatter={() => ''}
                          formatter={(value) => [`${value}m`, 'Altitude']}
                        />
                        <Area type="monotone" dataKey="alt" stroke={selectedFeature.color || "#4f46e5"} strokeWidth={2} fillOpacity={1} fill="url(#colorAlt)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => downloadGPX(selectedFeature.name, selectedFeature.coordinates)}
                      className="flex-1 py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wide rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> GPX
                    </button>
                    <button 
                      onClick={() => toggleIsPlayingTour()}
                      className={`flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wide rounded-xl flex items-center justify-center gap-1.5 transition-colors ${isPlayingTour ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'}`}
                    >
                      {isPlayingTour ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Play Tour</>}
                    </button>
                  </div>
                </div>
              )}

              {/* Tour Navigation */}
              {activeTour && (
                <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider line-clamp-1 mr-2">
                      Tour: {activeTour.name}
                    </span>
                    <span className="text-xs text-indigo-500 font-mono font-medium shrink-0">
                      {currentTourStep + 1} / {activeTour.stops.length}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleManualTourStep('prev')}
                      disabled={currentTourStep === 0}
                      className="flex-1 py-2 bg-white dark:bg-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Prev
                    </button>
                    <button
                      onClick={toggleIsPlayingTour}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition-colors ${isPlayingTour ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
                    >
                      {isPlayingTour ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Auto</>}
                    </button>
                    <button 
                      onClick={() => handleManualTourStep('next')}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition-colors hover:bg-indigo-700"
                    >
                      {currentTourStep === activeTour.stops.length - 1 ? (
                        <>Finish <Check className="w-3.5 h-3.5" /></>
                      ) : (
                        <>Next <ChevronRight className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedFeature.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/25"
                >
                  <MapPin className="w-4 h-4" />
                  Navigate in Google Maps
                </a>
                
                {selectedFeature.video_url && (
                  <a 
                    href={selectedFeature.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <PlaySquare className="w-4 h-4" />
                    Watch Video
                  </a>
                )}
                
                <a 
                  href={`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(selectedFeature.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  More Details
                </a>
              </div>
              
              {selectedFeature.image_source && (
                 <div className="mt-6 text-[10px] text-slate-400 text-center">
                    Image: {selectedFeature.image_source}
                 </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

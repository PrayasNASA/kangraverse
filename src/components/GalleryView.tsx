'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ImageIcon, Camera, MapPin, Calendar, Heart, Share2, Download, X, 
  ChevronLeft, ChevronRight, SlidersHorizontal, ChevronDown, Flame, TreePine, 
  Droplets, Users, PartyPopper, PlusCircle, ArrowRight
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { galleryItems, GalleryItem } from '@/data/gallery';

const STATS = [
  { label: 'Photos', value: '850+', icon: Camera, color: 'text-purple-500', from: 'from-purple-500/20' },
  { label: 'Videos', value: '45+', icon: ImageIcon, color: 'text-blue-500', from: 'from-blue-500/20' },
  { label: 'Mapped Locations', value: '120+', icon: MapPin, color: 'text-emerald-500', from: 'from-emerald-500/20' },
  { label: 'Captured Years', value: '2026–27', icon: Calendar, color: 'text-orange-500', from: 'from-orange-500/20' }
];

const CATEGORIES = [
  { id: 'All Media', label: 'All Media', icon: ImageIcon },
  { id: 'Temple', label: 'Temples', icon: Flame },
  { id: 'Monastery', label: 'Monasteries', icon: Heart },
  { id: 'Sacred Landscape', label: 'Sacred Landscapes', icon: TreePine },
  { id: 'River', label: 'Rivers & Waterfalls', icon: Droplets },
  { id: 'Culture', label: 'People & Culture', icon: Users },
  { id: 'Festival', label: 'Festivals', icon: PartyPopper }
];

const FEATURED_COLLECTIONS = [
  { title: 'Temples', photos: '142 Photos', videos: '12 Videos', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80' },
  { title: 'Monasteries', photos: '89 Photos', videos: '5 Videos', image: 'https://plus.unsplash.com/premium_photo-1697730331645-5ca8244b708a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { title: 'Sacred Landscapes', photos: '210 Photos', videos: '18 Videos', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' },
  { title: 'Rivers', photos: '64 Photos', videos: '2 Videos', image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80' },
  { title: 'People & Culture', photos: '156 Photos', videos: '4 Videos', image: 'https://images.unsplash.com/photo-1552761814-7e3fd0b3aa86?q=80&w=1092&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { title: 'Festivals', photos: '78 Photos', videos: '8 Videos', image: 'https://images.unsplash.com/photo-1717049887318-9b80628d2cea?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

export default function GalleryView() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Media');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All Media') return galleryItems;
    return galleryItems.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev! + 1) % filteredItems.length);
      if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev! - 1 + filteredItems.length) % filteredItems.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  if (!mounted) return <div className="w-full min-h-screen px-8 pt-[140px] pb-8" />;

  return (
    <div className="w-full min-h-screen px-8 pt-[140px] pb-8 flex flex-col gap-6 max-w-[1800px] mx-auto">
      
      {/* SECTION 1: Hero Banner */}
      <div className="w-full shrink-0 flex flex-col md:flex-row gap-6 h-auto md:h-[500px]">
        {/* Left: 45% */}
        <div className="w-full md:w-[45%] h-full flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-extrabold uppercase tracking-wider mb-6 w-fit shadow-sm backdrop-blur-sm border border-black/5 dark:border-white/10">
            <ImageIcon className="w-3.5 h-3.5 text-[var(--primary)]" />
            Gallery
          </div>
          
          <h1 className="text-[40px] lg:text-[48px] font-[900] text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
            Visual Stories of Sacred Landscapes
          </h1>
          
          <p className="text-[15px] lg:text-[17px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-10 max-w-[90%]">
            A curated collection of temples, monasteries, sacred landscapes, rivers, festivals and living traditions across Kangra District.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-auto">
            {STATS.map((stat, idx) => (
              <div key={idx} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[20px] p-4 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-250 group">
                <div className={twMerge("w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br to-transparent transition-transform duration-300 group-hover:scale-110", stat.from)}>
                  <stat.icon className={twMerge("w-6 h-6", stat.color)} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[20px] font-[900] text-slate-900 dark:text-white leading-none tracking-tight mb-1">{stat.value}</span>
                  <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 55% */}
        <div className="w-full md:w-[55%] h-[400px] md:h-full relative overflow-hidden rounded-[32px] shrink-0 shadow-sm group">
          <img 
            src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Western Himalayas" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
          
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <div>
              <span className="block text-white/70 text-[12px] font-extrabold uppercase tracking-widest mb-1">Western Himalayas</span>
              <h2 className="text-white text-[24px] font-[900] tracking-tight drop-shadow-md">Living Heritage Archive</h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white cursor-pointer hover:bg-white/40 transition-colors duration-250 shadow-lg">
               <ArrowRight className="w-5 h-5 -rotate-45" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Gallery Categories */}
      <div className="w-full shrink-0 flex flex-col xl:flex-row items-center justify-between gap-4 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[24px] p-4">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={twMerge(
                  "relative px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-300 flex items-center gap-2",
                  isActive ? "text-white" : "text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeGalleryCategory"
                    className="absolute inset-0 bg-[var(--primary)] rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <cat.icon className={twMerge("w-4 h-4", isActive ? "opacity-100" : "opacity-70")} />
                {cat.label}
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-[16px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-white/10 text-[13px] font-bold text-slate-700 dark:text-slate-200 shadow-sm flex items-center gap-2 hover:bg-white dark:hover:bg-slate-800 transition-colors">
             Sort: Newest <ChevronDown className="w-4 h-4 opacity-50" />
          </button>
          <button className="px-4 py-2.5 rounded-[16px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-white/10 text-[13px] font-bold text-slate-700 dark:text-slate-200 shadow-sm flex items-center gap-2 hover:bg-white dark:hover:bg-slate-800 transition-colors">
             <SlidersHorizontal className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* SECTION 3: Featured Collections */}
      <div className="w-full shrink-0 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
        {FEATURED_COLLECTIONS.map((col, idx) => (
          <div key={idx} className="relative w-full h-[220px] rounded-[24px] overflow-hidden group cursor-pointer shadow-sm">
            <img src={col.image} alt={col.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <h3 className="text-white text-[15px] font-[900] tracking-tight mb-1">{col.title}</h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-white/70">
                <span className="flex items-center gap-1"><Camera className="w-3 h-3" /> {col.photos}</span>
                <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> {col.videos}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 4: Photo Gallery Grid (Masonry) */}
      <div className="columns-2 md:columns-3 xl:columns-5 gap-5 space-y-5">
        {filteredItems.map((item, idx) => (
          <div 
            key={item.id} 
            className="break-inside-avoid rounded-[24px] overflow-hidden relative group cursor-zoom-in shadow-sm border border-slate-200/50 dark:border-white/10"
            onClick={() => setLightboxIndex(idx)}
          >
            <img src={item.image} alt={item.title} className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <div className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm border border-white/20">
                 {item.category}
               </div>
               <button className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-rose-400 hover:bg-black/60 transition-colors border border-white/20">
                 <Heart className="w-4 h-4" />
               </button>
            </div>

            {/* Bottom Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <h4 className="text-white text-[14px] font-[900] leading-tight mb-1">{item.title}</h4>
              <div className="flex items-center gap-1 text-[11px] font-bold text-white/70">
                <MapPin className="w-3 h-3" /> {item.village}, {item.district}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 6: Contribute CTA */}
      <div className="w-full mt-4 shrink-0 bg-gradient-to-r from-[var(--primary)]/10 to-transparent dark:from-[var(--primary)]/20 border border-[var(--primary)]/20 shadow-sm rounded-[24px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
         <div className="relative z-10">
           <h3 className="text-[20px] font-[900] text-slate-900 dark:text-white tracking-tight mb-2">Share Your Moments</h3>
           <p className="text-[14px] font-medium text-slate-600 dark:text-slate-300">Help preserve Kangra's living heritage by contributing photographs and stories.</p>
         </div>
         <div className="flex items-center gap-3 relative z-10">
           <button className="px-6 py-3 rounded-[16px] bg-[var(--primary)] text-white font-extrabold text-[13px] hover:bg-[var(--primary-dark)] hover:-translate-y-1 hover:shadow-md transition-all duration-250 flex items-center gap-2">
             <PlusCircle className="w-4 h-4" /> Contribute
           </button>
           <button className="px-6 py-3 rounded-[16px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-white font-extrabold text-[13px] border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-slate-700 hover:-translate-y-1 transition-all duration-250 shadow-sm">
             Learn More
           </button>
         </div>
      </div>

      {/* SECTION 5: Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col"
          >
            {/* Top Navigation */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
              <div className="text-white/50 text-[12px] font-extrabold tracking-widest uppercase">
                {lightboxIndex + 1} / {filteredItems.length}
              </div>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><Share2 className="w-4 h-4" /></button>
                <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><Download className="w-4 h-4" /></button>
                <button onClick={() => setLightboxIndex(null)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-rose-500 hover:text-white transition-colors ml-2"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Main Content Area (Split) */}
            <div className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden pt-20 pb-24 px-6 lg:px-12 gap-8">
              
              {/* Image Container */}
              <div className="flex-1 h-full flex items-center justify-center relative group">
                 <img 
                   key={lightboxIndex}
                   src={filteredItems[lightboxIndex].image} 
                   alt={filteredItems[lightboxIndex].title}
                   className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-[12px] animate-in fade-in zoom-in-95 duration-300"
                 />
                 
                 {/* Prev/Next Arrows */}
                 <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev! - 1 + filteredItems.length) % filteredItems.length); }} className="absolute left-4 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100 border border-white/10">
                   <ChevronLeft className="w-6 h-6" />
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev! + 1) % filteredItems.length); }} className="absolute right-4 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100 border border-white/10">
                   <ChevronRight className="w-6 h-6" />
                 </button>
              </div>

              {/* Sidebar Info */}
              <div className="w-full lg:w-[350px] shrink-0 h-full flex flex-col justify-end lg:justify-center">
                 <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-[24px]">
                   <div className="px-2.5 py-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30 text-[10px] font-extrabold uppercase tracking-wider mb-4 w-fit">
                     {filteredItems[lightboxIndex].category}
                   </div>
                   <h2 className="text-white text-[24px] font-[900] tracking-tight leading-tight mb-2">
                     {filteredItems[lightboxIndex].title}
                   </h2>
                   <p className="text-white/60 text-[13px] font-medium leading-relaxed mb-6">
                     {filteredItems[lightboxIndex].description}
                   </p>
                   
                   <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                     <div>
                       <span className="block text-white/40 text-[10px] font-extrabold uppercase tracking-widest mb-1">Location</span>
                       <span className="text-white text-[13px] font-bold">{filteredItems[lightboxIndex].village}</span>
                     </div>
                     <div>
                       <span className="block text-white/40 text-[10px] font-extrabold uppercase tracking-widest mb-1">Year</span>
                       <span className="text-white text-[13px] font-bold">{filteredItems[lightboxIndex].year}</span>
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Bottom Thumbnail Strip */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 max-w-[80vw] overflow-x-auto px-4 py-2 bg-black/40 backdrop-blur-md rounded-[20px] border border-white/10">
               {filteredItems.map((item, idx) => (
                 <button 
                   key={item.id}
                   onClick={() => setLightboxIndex(idx)}
                   className={twMerge(
                     "w-12 h-12 rounded-[12px] overflow-hidden shrink-0 border-2 transition-all duration-200",
                     lightboxIndex === idx ? "border-[var(--primary)] scale-110 opacity-100" : "border-transparent opacity-40 hover:opacity-100"
                   )}
                 >
                   <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                 </button>
               ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

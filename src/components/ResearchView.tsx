'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FlaskConical, Users, MapPin, Calendar, ArrowRight, Map, Heart, Leaf, 
  ShieldCheck, Crosshair, ClipboardList, Lightbulb, Compass, Link as LinkIcon, Database, CheckCircle2,
  TreePine, Flame, Sprout, HandHeart, Home
} from 'lucide-react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

const STATS = [
  { label: 'Research Themes', value: '12+', icon: FlaskConical, color: 'text-purple-500', from: 'from-purple-500/20' },
  { label: 'Community Interviews', value: '250+', icon: Users, color: 'text-blue-500', from: 'from-blue-500/20' },
  { label: 'Survey Locations', value: '45+', icon: MapPin, color: 'text-emerald-500', from: 'from-emerald-500/20' },
  { label: 'Research Period', value: '2026–27', icon: Calendar, color: 'text-orange-500', from: 'from-orange-500/20' }
];

const FOCUS_ITEMS = [
  { title: 'Sacred Heritage', desc: 'Documenting temples, monasteries, sacred landscapes and cultural heritage.', icon: LandmarkIcon },
  { title: 'Community & Culture', desc: 'Understanding beliefs, rituals, traditions and indigenous knowledge.', icon: Heart },
  { title: 'Landscape & Ecology', desc: 'Studying ecological relationships with sacred landscapes.', icon: Leaf },
  { title: 'Conservation', desc: 'Assessing threats, vulnerabilities and sustainable preservation.', icon: ShieldCheck }
];

// Helper to provide a Landmark-like icon since Landmark was not imported from lucide-react in this block initially
function LandmarkIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>
    </svg>
  );
}

const METHODOLOGY = [
  { title: 'Primary Survey', desc: 'Field observations and interviews.', icon: ClipboardList, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { title: 'GIS Mapping', desc: 'Spatial mapping using QGIS and Cesium.', icon: Map, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { title: 'Community Participation', desc: 'Local knowledge and cultural documentation.', icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { title: 'Spatial Analysis', desc: 'Landscape interpretation and heritage assessment.', icon: Crosshair, color: 'text-rose-500', bg: 'bg-rose-500/10' }
];

const THEMES = [
  { title: 'Spiritual Practices', subtitle: 'Beliefs & Rituals', icon: Flame, color: 'text-amber-500' },
  { title: 'Cultural Landscapes', subtitle: 'Communities & Livelihoods', icon: TreePine, color: 'text-emerald-500' },
  { title: 'Vulnerability Assessment', subtitle: 'Current Challenges', icon: ShieldCheck, color: 'text-rose-500' },
  { title: 'Sustainable Conservation', subtitle: 'Future Preservation', icon: Sprout, color: 'text-teal-500' }
];

const OUTCOMES = [
  { title: 'Interactive GIS Platform', desc: 'A premium WebGIS platform for spatial exploration.', icon: Compass, color: 'text-blue-500' },
  { title: 'Sacred Heritage Database', desc: 'Comprehensive open-access geospatial dataset.', icon: Database, color: 'text-purple-500' },
  { title: 'Community Documentation', desc: 'Preserving intangible cultural heritage digitally.', icon: HandHeart, color: 'text-rose-500' },
  { title: 'Conservation Planning', desc: 'Actionable intelligence for sustainable preservation.', icon: CheckCircle2, color: 'text-emerald-500' }
];

export default function ResearchView() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full min-h-screen px-8 pt-[140px] pb-8" />;

  return (
    <div className="w-full min-h-screen px-8 pt-[140px] pb-8 flex flex-col gap-6 max-w-[1800px] mx-auto">
      
      {/* SECTION 1: Research Hero */}
      <div className="w-full shrink-0 flex flex-col md:flex-row gap-6 h-auto md:h-[500px]">
        {/* Left: 45% */}
        <div className="w-full md:w-[45%] h-full flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-extrabold uppercase tracking-wider mb-6 w-fit shadow-sm backdrop-blur-sm border border-black/5 dark:border-white/10">
            <FlaskConical className="w-3.5 h-3.5 text-[var(--primary)]" />
            Research Hub
          </div>
          
          <h1 className="text-[40px] lg:text-[48px] font-[900] text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
            Researching Sacred Landscapes
          </h1>
          
          <p className="text-[15px] lg:text-[17px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-10 max-w-[90%]">
            Exploring the living relationship between communities, sacred heritage, ecology, and culture across the Western Himalayas.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-auto">
            {STATS.map((stat, idx) => (
              <div key={idx} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[20px] p-4 flex flex-col hover:-translate-y-1 transition-transform duration-250 group">
                <div className={twMerge("w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br to-transparent mb-3 transition-transform duration-300 group-hover:scale-110", stat.from)}>
                  <stat.icon className={twMerge("w-5 h-5", stat.color)} />
                </div>
                <span className="text-[24px] font-[900] text-slate-900 dark:text-white leading-none tracking-tight mb-1">{stat.value}</span>
                <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 55% */}
        <div className="w-full md:w-[55%] h-[400px] md:h-full relative overflow-hidden rounded-[32px] shrink-0 border border-slate-200/50 dark:border-white/10 shadow-sm group">
          <img 
            src="https://images.pexels.com/photos/11752865/pexels-photo-11752865.jpeg?_gl=1*vdz9qx*_ga*MjA0MDQzMzM4Ny4xNzg0MTAxODMy*_ga_8JE65Q40S6*czE3ODQxNTk5NjkkbzIkZzEkdDE3ODQxNjAyNjgkajE2JGwwJGgw" 
            alt="Western Himalayas Morning Light" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/50 via-black/20 to-transparent opacity-90" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[32px]" />
        </div>
      </div>

      {/* SECTION 2: Research Focus */}
      <div className="w-full shrink-0 flex flex-col lg:flex-row gap-6 h-auto lg:h-[480px]">
        {/* Left: Focus List */}
        <div className="w-full lg:w-1/2 h-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[24px] p-8 flex flex-col">
          <h2 className="text-[20px] font-[900] text-slate-900 dark:text-white tracking-tight mb-6">Our Research Focus</h2>
          
          <div className="flex flex-col gap-3 flex-1">
            {FOCUS_ITEMS.map((item, idx) => (
              <div key={idx} className="group flex items-start gap-4 p-4 rounded-[20px] bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-white/5 hover:-translate-y-1 hover:shadow-md transition-all duration-250 cursor-default">
                <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[var(--primary)]/20 to-transparent flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-[13px] font-medium text-slate-600 dark:text-slate-400 leading-snug">{item.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[var(--primary)] transition-colors duration-250 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Study Area Overview */}
        <div className="w-full lg:w-1/2 h-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[24px] p-2 flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 overflow-hidden rounded-[22px] z-0">
             <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
             {/* Abstract Map Nodes */}
             <div className="absolute top-[30%] left-[40%] w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
             <div className="absolute top-[45%] left-[55%] w-4 h-4 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
             <div className="absolute top-[60%] left-[35%] w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
             <svg className="absolute inset-0 w-full h-full stroke-purple-500/20" fill="none" strokeWidth="2">
               <path d="M 40% 30% L 55% 45% L 35% 60% Z" />
             </svg>
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between p-6">
             <div>
               <h3 className="text-[16px] font-[900] text-slate-900 dark:text-white tracking-tight drop-shadow-sm">Study Area Overview</h3>
             </div>

             <div className="flex flex-col gap-4 mt-auto">
               <div className="flex flex-wrap gap-2">
                 <div className="px-3 py-1.5 rounded-[12px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-2">
                   <MapPin className="w-3.5 h-3.5 text-blue-500" />
                   <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">Upper Kangra Valley</span>
                 </div>
                 <div className="px-3 py-1.5 rounded-[12px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-2">
                   <Home className="w-3.5 h-3.5 text-emerald-500" />
                   <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">32+ Villages</span>
                 </div>
                 <div className="px-3 py-1.5 rounded-[12px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-2">
                   <LandmarkIcon className="w-3.5 h-3.5 text-purple-500" />
                   <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">120+ Sacred Sites</span>
                 </div>
                 <div className="px-3 py-1.5 rounded-[12px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-2">
                   <Compass className="w-3.5 h-3.5 text-orange-500" />
                   <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">15+ Field Surveys</span>
                 </div>
               </div>
               
               <Link href="/explorer" className="w-full px-6 py-3.5 rounded-[16px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-900 dark:text-white font-extrabold text-[14px] hover:bg-white dark:hover:bg-slate-700 hover:-translate-y-1 hover:shadow-md transition-all duration-250 flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 mt-2">
                 <Map className="w-4 h-4 text-[var(--primary)]" /> View Interactive Map
               </Link>
             </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Research Methodology */}
      <div className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {METHODOLOGY.map((item, idx) => (
          <div key={idx} className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[24px] p-6 flex flex-col hover:-translate-y-1 transition-transform duration-250 group">
            <div className={twMerge("w-12 h-12 rounded-[16px] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110", item.bg)}>
              <item.icon className={twMerge("w-6 h-6", item.color)} />
            </div>
            <h3 className="text-[15px] font-[900] text-slate-900 dark:text-white tracking-tight mb-2">{item.title}</h3>
            <p className="text-[13px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* SECTION 4: Research Themes */}
      <div className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {THEMES.map((theme, idx) => (
          <div key={idx} className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[24px] p-6 flex items-center justify-between hover:-translate-y-1 transition-transform duration-250 group">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-black/5 to-transparent dark:from-white/5 flex items-center justify-center">
                 <theme.icon className={twMerge("w-5 h-5", theme.color)} />
               </div>
               <div>
                 <h3 className="text-[14px] font-[900] text-slate-900 dark:text-white tracking-tight leading-tight">{theme.title}</h3>
                 <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{theme.subtitle}</span>
               </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all duration-250" />
          </div>
        ))}
      </div>

      {/* SECTION 5: Research Outcomes */}
      <div className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {OUTCOMES.map((outcome, idx) => (
          <div key={idx} className="bg-[var(--primary)]/5 dark:bg-[var(--primary)]/10 backdrop-blur-md border border-[var(--primary)]/20 shadow-sm rounded-[24px] p-6 flex flex-col hover:-translate-y-1 transition-transform duration-250">
            <div className="w-10 h-10 mb-4 flex items-center justify-center bg-[var(--primary)]/10 rounded-[12px]">
              <outcome.icon className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <h3 className="text-[16px] font-[900] text-[var(--primary)] tracking-tight mb-2">{outcome.title}</h3>
            <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{outcome.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

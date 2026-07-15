'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Landmark, Home, TreePine, Droplets, MapPin, Sparkles, 
  Compass, BookOpen, Activity, CheckCircle2, 
  Map, FileText, BrainCircuit, Users, Database, Clock, Download, FileJson, FileSpreadsheet, Map as MapIcon, Calendar, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import dynamic from 'next/dynamic';

// Custom Components
import StatCard from './dashboard/StatCard';
import HeroInfoChip from './dashboard/HeroInfoChip';

// Dynamically import ECharts to prevent SSR crashes
const CategoryDonutChart = dynamic(() => import('./dashboard/GISCharts').then(mod => mod.CategoryDonutChart), { ssr: false });
const DocumentationGrowthChart = dynamic(() => import('./dashboard/GISCharts').then(mod => mod.DocumentationGrowthChart), { ssr: false });
const ElevationDistributionChart = dynamic(() => import('./dashboard/GISCharts').then(mod => mod.ElevationDistributionChart), { ssr: false });

// --- MOCK DATA ---
const HERO_CHIPS = [
  { label: 'Study Area', value: 'Upper Kangra Valley', icon: MapPin, color: 'text-indigo-500' },
  { label: 'Heritage Sites', value: '345', icon: Landmark, color: 'text-purple-500' },
  { label: 'Dataset Version', value: 'v2.4', icon: Database, color: 'text-blue-500' },
  { label: 'AI Status', value: 'Online', icon: BrainCircuit, color: 'text-emerald-500' },
  { label: 'Research Status', value: 'Active', icon: Activity, color: 'text-rose-500' },
  { label: 'Last Updated', value: 'Today', icon: Clock, color: 'text-slate-500' },
];

const SUMMARY_STATS = [
  { title: 'Heritage Sites', value: 345, icon: MapPin, gradient: 'from-blue-500 to-indigo-500', iconColor: 'text-blue-500', trend: '+12% this month' },
  { title: 'Temples', value: 142, icon: Landmark, gradient: 'from-purple-500 to-fuchsia-500', iconColor: 'text-purple-500', trend: '+5 new' },
  { title: 'Monasteries', value: 38, icon: Home, gradient: 'from-amber-500 to-orange-500', iconColor: 'text-amber-500', trend: 'Mapped 100%' },
  { title: 'Sacred Landscapes', value: 89, icon: TreePine, gradient: 'from-emerald-500 to-teal-500', iconColor: 'text-emerald-500', trend: '+2 this week' },
];

const RESEARCH_HIGHLIGHTS = [
  { label: 'Most Visited Heritage', value: 'Masroor Rock Temple', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Recently Documented', value: 'Tatwani Hot Spring', icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Highest Elevation Site', value: 'Mani Mahesh Lake', icon: ArrowUpRight, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'Latest Interview', value: 'Elder at Jawalamukhi', icon: CheckCircle2, color: 'text-orange-500', bg: 'bg-orange-500/10' },
];

const QUICK_ACTIONS = [
  { label: 'Download Research Report', icon: FileText, color: 'text-blue-500' },
  { label: 'Export GIS Dataset', icon: MapIcon, color: 'text-purple-500' },
  { label: 'Generate AI Summary', icon: BrainCircuit, color: 'text-emerald-500' },
];

export default function DashboardView() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full min-h-screen px-8 pt-[140px] pb-8" />;

  return (
    <div className="w-full min-h-screen px-8 pt-[140px] pb-8 flex flex-col gap-6 max-w-[1800px] mx-auto">
      
      {/* SECTION 1: Compact Intelligence Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 w-full shrink-0 min-h-[100px] bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-slate-200/50 dark:border-white/10 rounded-[24px] p-6 shadow-sm">
        {HERO_CHIPS.map((chip, idx) => (
          <HeroInfoChip key={idx} {...chip} delay={idx * 0.05} />
        ))}
      </div>

      {/* SECTION 2: Featured Heritage Intelligence (55/45) */}
      <div className="w-full shrink-0 h-auto md:h-[420px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
          className="w-full h-full rounded-[24px] overflow-hidden bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm flex flex-col md:flex-row group"
        >
          {/* Left: 55% Image */}
          <div className="w-full md:w-[55%] h-64 md:h-full relative overflow-hidden shrink-0">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e6/Masrur_rockcut_temple.jpg" alt="Masroor Rock Cut Temple" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 to-transparent opacity-80" />
          </div>
          
          {/* Right: 45% Information */}
          <div className="w-full md:w-[45%] h-full p-8 flex flex-col justify-center relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-extrabold uppercase tracking-wider mb-4 w-fit shadow-sm">
              Featured Heritage
            </div>
            
            <h2 className="text-[28px] font-[900] text-slate-900 dark:text-white tracking-tight leading-tight mb-5">Masroor Rock Cut Temple</h2>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6">
              <div>
                <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Category</span>
                <span className="text-[13px] font-bold text-slate-800 dark:text-white flex items-center gap-1.5"><Landmark className="w-3.5 h-3.5 text-purple-500" /> Temple Complex</span>
              </div>
              <div>
                <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Village</span>
                <span className="text-[13px] font-bold text-slate-800 dark:text-white flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-500" /> Beas River Valley</span>
              </div>
              <div>
                <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Elevation</span>
                <span className="text-[13px] font-bold text-slate-800 dark:text-white flex items-center gap-1.5"><ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" /> 2,530 ft</span>
              </div>
              <div>
                <span className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Activity</span>
                <span className="text-[13px] font-bold text-orange-600 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> High Footfall</span>
              </div>
            </div>

            <div className="mb-6 p-4 rounded-[16px] bg-[var(--primary)]/5 border border-[var(--primary)]/10">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="text-[12px] font-[900] text-[var(--primary)] tracking-tight uppercase">AI Intelligence Summary</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[13px] font-medium leading-relaxed">
                Significant weathering identified on northern facade. Digital twin completed. High-priority conservation status confirmed for upcoming monsoon season.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mt-auto">
              <Link href="/explorer" className="px-6 py-3 rounded-[16px] bg-[var(--primary)] text-white font-extrabold text-[13px] hover:bg-[var(--primary-dark)] hover:-translate-y-1 hover:shadow-md transition-all duration-250 flex items-center gap-2">
                <Compass className="w-4 h-4" /> Open in Explore
              </Link>
              <a href="https://en.wikipedia.org/wiki/Masroor_Rock_Cut_Temple" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-[16px] bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-extrabold text-[13px] border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 hover:-translate-y-1 transition-all duration-250 flex items-center gap-2 shadow-sm">
                <BookOpen className="w-4 h-4" /> Read Story
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* SECTION 3: GIS Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 w-full shrink-0">
        {SUMMARY_STATS.map((stat, idx) => (
          <StatCard key={idx} {...stat} delay={idx * 0.05} />
        ))}
      </div>

      {/* SECTION 4: Spatial Intelligence (ECharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full shrink-0 h-[340px]">
        {/* Card 1: Category Donut */}
        <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[24px] p-6 flex flex-col h-full hover:-translate-y-1 transition-transform duration-250">
          <h3 className="text-[14px] font-[900] text-slate-900 dark:text-white uppercase tracking-wider mb-2">Heritage Categories</h3>
          <div className="flex-1 w-full min-h-[200px]">
             <CategoryDonutChart />
          </div>
        </div>

        {/* Card 2: Documentation Growth */}
        <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[24px] p-6 flex flex-col h-full hover:-translate-y-1 transition-transform duration-250">
          <h3 className="text-[14px] font-[900] text-slate-900 dark:text-white uppercase tracking-wider mb-2">Documentation Growth</h3>
          <div className="flex-1 w-full min-h-[200px]">
             <DocumentationGrowthChart />
          </div>
        </div>

        {/* Card 3: Elevation Distribution */}
        <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[24px] p-6 flex flex-col h-full hover:-translate-y-1 transition-transform duration-250">
          <h3 className="text-[14px] font-[900] text-slate-900 dark:text-white uppercase tracking-wider mb-2">Elevation Distribution</h3>
          <div className="flex-1 w-full min-h-[200px]">
             <ElevationDistributionChart />
          </div>
        </div>
      </div>

      {/* SECTION 5: Research Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full shrink-0">
        {RESEARCH_HIGHLIGHTS.map((item, idx) => (
          <div key={idx} className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[24px] p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-250">
            <div className={twMerge("w-12 h-12 rounded-full flex items-center justify-center shrink-0", item.bg, item.color)}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{item.label}</span>
              <span className="text-[14px] font-[900] text-slate-900 dark:text-white leading-tight mt-0.5">{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 6: Quick Actions */}
      <div className="w-full shrink-0 flex flex-wrap items-center justify-center gap-5 mt-2">
        {QUICK_ACTIONS.map((action, idx) => (
          <button 
            key={idx}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-[16px] border border-slate-200/50 dark:border-white/10 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-250 text-[13px] font-extrabold text-slate-700 dark:text-slate-200 group flex-1 md:flex-none min-w-[200px]"
          >
            <action.icon className={twMerge("w-4 h-4 group-hover:scale-110 transition-transform duration-250", action.color)} />
            {action.label}
          </button>
        ))}
      </div>

    </div>
  );
}

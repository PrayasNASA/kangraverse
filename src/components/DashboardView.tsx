'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  Landmark, Home, TreePine, Droplets, Route, MapPin, Sparkles, 
  Download, Compass, FlaskConical, Image as ImageIcon, BookOpen,
  TrendingUp, Activity, Mountain
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

// Mock Data
const CATEGORY_DATA = [
  { name: 'Temples', value: 142, color: '#8b5cf6' },
  { name: 'Monasteries', value: 38, color: '#f59e0b' },
  { name: 'Sacred Groves', value: 89, color: '#10b981' },
  { name: 'Water Sources', value: 64, color: '#0ea5e9' },
  { name: 'Pilgrimage Routes', value: 12, color: '#f97316' },
];

const ELEVATION_DATA = [
  { range: '0-500m', count: 45 },
  { range: '500-1000m', count: 120 },
  { range: '1000-2000m', count: 156 },
  { range: '2000-3000m', count: 82 },
  { range: '3000m+', count: 24 },
];

const TIMELINE_DATA = [
  { year: '2019', mapped: 10 },
  { year: '2020', mapped: 45 },
  { year: '2021', mapped: 110 },
  { year: '2022', mapped: 180 },
  { year: '2023', mapped: 260 },
  { year: '2024', mapped: 345 },
];

const RECENT_SITES = [
  { name: 'Baijnath Temple', type: 'Temple', district: 'Kangra' },
  { name: 'Bagsunag Waterfall', type: 'Water Source', district: 'Kangra' },
  { name: 'Masroor Rock Cut Temple', type: 'Temple', district: 'Kangra' },
  { name: 'Gyuto Monastery', type: 'Monastery', district: 'Kangra' },
  { name: 'Tatwani Hot Spring', type: 'Water Source', district: 'Kangra' },
];

const MOST_VISITED = [
  { name: 'Jawalamukhi Temple', count: '12.4k views', trend: '+14%' },
  { name: 'Chamunda Devi', count: '8.2k views', trend: '+5%' },
  { name: 'Kangra Fort', count: '7.9k views', trend: '+11%' },
];

const RECENT_SEARCHES = ['Shiv Temples', 'Dharamshala Monasteries', 'Hot Springs', 'Trekking Routes', 'Heritage Villages'];

const SUMMARY_CARDS = [
  { title: 'Total Heritage Sites', value: 345, icon: MapPin, gradient: 'from-blue-500/20 to-cyan-500/5', iconColor: 'text-blue-500', trend: '+12% this month' },
  { title: 'Temples', value: 142, icon: Landmark, gradient: 'from-purple-500/20 to-fuchsia-500/5', iconColor: 'text-purple-500', trend: '+5 new' },
  { title: 'Monasteries', value: 38, icon: Home, gradient: 'from-amber-500/20 to-orange-500/5', iconColor: 'text-amber-500', trend: 'Mapped 100%' },
  { title: 'Sacred Groves', value: 89, icon: TreePine, gradient: 'from-emerald-500/20 to-green-500/5', iconColor: 'text-emerald-500', trend: '+2 this week' },
  { title: 'Water Sources', value: 64, icon: Droplets, gradient: 'from-cyan-500/20 to-sky-500/5', iconColor: 'text-cyan-500', trend: 'Under review' },
  { title: 'Pilgrimage Routes', value: 12, icon: Route, gradient: 'from-orange-500/20 to-red-500/5', iconColor: 'text-orange-500', trend: '2 in progress' },
];

const QUICK_ACTIONS = [
  { label: 'Explore', icon: Compass, href: '/explorer', color: 'text-[var(--primary)]' },
  { label: 'Research', icon: FlaskConical, href: '#', color: 'text-rose-500' },
  { label: 'Gallery', icon: ImageIcon, href: '#', color: 'text-blue-500' },
  { label: 'Stories', icon: BookOpen, href: '#', color: 'text-emerald-500' },
  { label: 'Download Data', icon: Download, href: '#', color: 'text-slate-500' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function DashboardView() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen pt-[140px] px-6 lg:px-12 pb-12 bg-slate-50/50 dark:bg-slate-900/20">
      <div className="max-w-[1800px] mx-auto flex flex-col gap-8">
        
        {/* Header & Quick Actions */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-[900] text-slate-900 dark:text-white tracking-tight">
              Kangra<span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">Verse</span> Dashboard
            </h1>
            <p className="text-[15px] font-bold text-slate-500 dark:text-slate-400 mt-1">
              Sacred landscape dataset overview and research progress.
            </p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-3"
          >
            {QUICK_ACTIONS.map((action, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Link 
                  href={action.href}
                  className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-full shadow-sm hover:shadow-md border border-black/5 dark:border-white/5 transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <action.icon className={twMerge("w-4 h-4", action.color)} />
                  <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Top Summary Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5"
        >
          {SUMMARY_CARDS.map((card, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden glass-card rounded-[24px] p-5 border border-white/60 dark:border-white/5 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <div className={twMerge("absolute inset-0 bg-gradient-to-br opacity-50 dark:opacity-20", card.gradient)} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={twMerge("w-10 h-10 rounded-[14px] flex items-center justify-center bg-white/80 dark:bg-slate-800/80 shadow-sm backdrop-blur-sm border border-black/5 dark:border-white/5", card.iconColor)}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded-full backdrop-blur-sm">
                    <TrendingUp className="w-3 h-3" />
                    {card.trend}
                  </div>
                </div>
                <h3 className="text-[28px] font-[900] text-slate-800 dark:text-white leading-none tracking-tight">
                  {card.value}
                </h3>
                <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                  {card.title}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Research Progress */}
            <div className="glass-panel p-6 rounded-[32px] border border-white/60 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-[800] text-slate-800 dark:text-white">Research Progress</h2>
                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-[var(--primary)]" />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex justify-between text-[13px] font-bold mb-2">
                    <span className="text-slate-600 dark:text-slate-300">Phase 1: Database Mapping</span>
                    <span className="text-[var(--primary)]">85%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[13px] font-bold mb-2">
                    <span className="text-slate-600 dark:text-slate-300">Phase 2: Spatial Analysis</span>
                    <span className="text-[var(--primary)]">42%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '42%' }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.7 }}
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Heritage Sites */}
            <div className="glass-panel p-6 rounded-[32px] border border-white/60 dark:border-white/5 shadow-sm flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-[800] text-slate-800 dark:text-white">Recent Heritage Sites</h2>
                <Link href="/explorer" className="text-[13px] font-bold text-[var(--primary)] hover:underline">View All</Link>
              </div>
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar">
                {RECENT_SITES.map((site, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-[20px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-[14px] bg-white/80 dark:bg-slate-800/80 flex items-center justify-center shadow-sm border border-black/5 dark:border-white/5 group-hover:scale-105 transition-transform">
                      {site.type === 'Temple' ? <Landmark className="w-5 h-5 text-purple-500" /> : 
                       site.type === 'Water Source' ? <Droplets className="w-5 h-5 text-blue-500" /> : 
                       site.type === 'Monastery' ? <Home className="w-5 h-5 text-amber-500" /> :
                       <Mountain className="w-5 h-5 text-slate-500" />}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-[800] text-slate-800 dark:text-white leading-tight">{site.name}</h4>
                      <p className="text-[12px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">{site.type} • {site.district}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Visited Places */}
            <div className="glass-panel p-6 rounded-[32px] border border-white/60 dark:border-white/5 shadow-sm">
              <h2 className="text-[18px] font-[800] text-slate-800 dark:text-white mb-6">Most Visited Places</h2>
              <div className="flex flex-col gap-4">
                {MOST_VISITED.map((place, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center text-[11px] font-bold">
                        {idx + 1}
                      </div>
                      <span className="text-[14px] font-[800] text-slate-700 dark:text-slate-200 group-hover:text-[var(--primary)] transition-colors">{place.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-slate-500">{place.count}</span>
                      <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{place.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            <div className="glass-panel p-6 rounded-[32px] border border-white/60 dark:border-white/5 shadow-sm">
              <h2 className="text-[18px] font-[800] text-slate-800 dark:text-white mb-4">Recent Searches</h2>
              <div className="flex flex-wrap gap-2">
                {RECENT_SEARCHES.map((search, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-black/5 dark:border-white/5 rounded-full text-[12px] font-bold text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-white hover:shadow-sm transition-all hover:scale-105 active:scale-95">
                    {search}
                  </span>
                ))}
              </div>
            </div>

          </motion.div>

          {/* Right Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* AI Insights Premium Card */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden glass-panel rounded-[32px] p-8 border border-[var(--primary)]/30 shadow-[0_20px_40px_rgba(108,99,255,0.15)] group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-[var(--accent)]/10" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-[var(--primary)]/30 transition-colors duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-[18px] font-[900] text-slate-800 dark:text-white">AI Insights</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-4 rounded-[20px] border border-white/40 dark:border-white/5">
                    <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Most Visited Category</p>
                    <p className="text-[16px] font-[800] text-slate-800 dark:text-white">Sacred Groves (42%)</p>
                  </div>
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-4 rounded-[20px] border border-white/40 dark:border-white/5">
                    <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Highest Sacred Site</p>
                    <p className="text-[16px] font-[800] text-slate-800 dark:text-white">Mani Mahesh Lake</p>
                  </div>
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-4 rounded-[20px] border border-white/40 dark:border-white/5">
                    <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Community Interviews</p>
                    <p className="text-[16px] font-[800] text-slate-800 dark:text-white">124 Completed</p>
                  </div>
                  <div className="bg-[var(--primary)]/10 backdrop-blur-md p-4 rounded-[20px] border border-[var(--primary)]/20">
                    <p className="text-[11px] font-extrabold text-[var(--primary)] uppercase tracking-wider mb-1">Suggested Exploration</p>
                    <p className="text-[16px] font-[800] text-[var(--primary)] dark:text-[var(--primary)]">Map Upper Kangra Valley</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Distribution Donut Chart */}
              <div className="glass-panel p-6 rounded-[32px] border border-white/60 dark:border-white/5 shadow-sm h-[300px] flex flex-col">
                <h2 className="text-[16px] font-[800] text-slate-800 dark:text-white mb-2">Category Distribution</h2>
                <div className="flex-1 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CATEGORY_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {CATEGORY_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                        itemStyle={{ fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Elevation Distribution Bar Chart */}
              <div className="glass-panel p-6 rounded-[32px] border border-white/60 dark:border-white/5 shadow-sm h-[300px] flex flex-col">
                <h2 className="text-[16px] font-[800] text-slate-800 dark:text-white mb-2">Elevation Spread</h2>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ELEVATION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                      <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                      <RechartsTooltip 
                        cursor={{ fill: 'rgba(108,99,255,0.05)' }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Heritage Timeline Area Chart */}
            <div className="glass-panel p-6 rounded-[32px] border border-white/60 dark:border-white/5 shadow-sm h-[300px] flex flex-col">
              <h2 className="text-[16px] font-[800] text-slate-800 dark:text-white mb-2">Mapping Timeline</h2>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TIMELINE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMapped" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 'bold' }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="mapped" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorMapped)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </motion.div>
        </div>
        
      </div>
    </div>
  );
}

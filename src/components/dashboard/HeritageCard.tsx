import { motion } from 'framer-motion';
import { LucideIcon, MapPin, ArrowRight, BookOpen, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

interface HeritageCardProps {
  id: string;
  name: string;
  category: string;
  village: string;
  distance: string;
  status: string;
  image: string;
  icon: LucideIcon;
  delay?: number;
}

export default function HeritageCard({
  id,
  name,
  category,
  village,
  distance,
  status,
  image,
  icon: Icon,
  delay = 0
}: HeritageCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="group relative flex items-center gap-6 p-4 rounded-[24px] glass-card border border-white/60 dark:border-white/10 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] bg-white/40 dark:bg-slate-800/40 backdrop-blur-md transition-all duration-300"
    >
      <div className="relative w-32 h-24 rounded-[16px] overflow-hidden shrink-0 shadow-sm border border-black/5 dark:border-white/5">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white">
          <Icon className="w-3.5 h-3.5 drop-shadow-md" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0 py-1">
        <div className="flex items-center justify-between gap-4 mb-1">
          <h4 className="text-[16px] font-[800] text-slate-800 dark:text-white truncate">
            {name}
          </h4>
          <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm">
            {status}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-bold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
            {category}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 opacity-70" />
            {village}
          </span>
          <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            {distance}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0 pr-2">
        <Link href={`/explorer`} className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm hover:shadow-md hover:bg-[var(--primary)] hover:text-white transition-all text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/5">
          <ArrowRight className="w-4 h-4" />
        </Link>
        <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm hover:shadow-md transition-all text-slate-400 hover:text-emerald-500 border border-black/5 dark:border-white/5">
          <BookOpen className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm hover:shadow-md transition-all text-slate-400 hover:text-blue-500 border border-black/5 dark:border-white/5">
          <ImageIcon className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

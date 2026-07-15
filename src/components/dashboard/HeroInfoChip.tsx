import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface HeroInfoChipProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export default function HeroInfoChip({
  label,
  value,
  icon: Icon,
  color,
  delay = 0
}: HeroInfoChipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="flex items-center gap-3 px-4 py-2 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-[16px] shadow-sm hover:shadow-[0_10px_20px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] border border-slate-200/50 dark:border-white/10 transition-all group cursor-default"
    >
      <div className={twMerge("w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-white/5 group-hover:scale-110 transition-transform duration-300 shrink-0", color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex flex-col pr-1">
        <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-tight">{label}</span>
        <span className="text-[13px] font-[900] text-slate-800 dark:text-white tracking-wide leading-tight mt-0.5">{value}</span>
      </div>
    </motion.div>
  );
}

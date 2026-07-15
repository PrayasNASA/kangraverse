'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
  trend: string;
  isPositive?: boolean;
  delay?: number;
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  iconColor, 
  trend,
  isPositive = true,
  delay = 0 
}: StatCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const duration = 2000; // 2 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration) {
        // Easing function (easeOutExpo)
        const easeProgress = progress === duration ? 1 : 1 - Math.pow(2, -10 * progress / duration);
        setCount(Math.floor(easeProgress * value));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 300, damping: 24 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative overflow-hidden glass-card rounded-[24px] p-6 border border-white/60 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-300 group"
    >
      <div className={twMerge("absolute inset-0 bg-gradient-to-br opacity-50 dark:opacity-20 transition-opacity duration-500 group-hover:opacity-70 dark:group-hover:opacity-30", gradient)} />
      
      {/* Soft Glow */}
      <div className={twMerge("absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500", iconColor.replace('text-', 'bg-'))} />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-start justify-between mb-4">
          <div className={twMerge("w-12 h-12 rounded-[16px] flex items-center justify-center bg-white/90 dark:bg-slate-800/90 shadow-sm backdrop-blur-sm border border-black/5 dark:border-white/10 group-hover:scale-110 transition-transform duration-300", iconColor)}>
            <Icon className="w-6 h-6" />
          </div>
          <div className={twMerge(
            "flex items-center gap-1 text-[12px] font-extrabold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-sm",
            isPositive ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
          )}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend}
          </div>
        </div>
        
        <div>
          <h3 className="text-[36px] font-[900] text-slate-800 dark:text-white leading-none tracking-tighter drop-shadow-sm">
            {count}
          </h3>
          <p className="text-[14px] font-bold text-slate-500 dark:text-slate-400 mt-2 tracking-wide uppercase">
            {title}
          </p>
        </div>
        
        {/* Mini Sparkline (Visual only for aesthetics) */}
        <div className="mt-4 flex items-end gap-1 h-8 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
          {[40, 25, 60, 45, 80, 55, 90, 75, 100].map((height, i) => (
            <div 
              key={i} 
              className={twMerge("flex-1 rounded-t-sm", iconColor.replace('text-', 'bg-'))}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

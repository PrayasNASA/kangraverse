'use client';
import { useState } from 'react';
import { Landmark, Mountain, TreePine, Droplets, Route, Castle, Tent } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface PlaceImageProps {
  src?: string | null;
  alt?: string;
  type?: string;
  className?: string;
}

const CATEGORY_MAP: Record<string, { gradient: string, colorClass: string, Icon: any }> = {
  'Temple': {
    gradient: 'from-purple-500/30 to-fuchsia-500/5',
    colorClass: 'text-purple-600 dark:text-purple-400',
    Icon: Landmark,
  },
  'Monastery': {
    gradient: 'from-amber-500/30 to-orange-500/5',
    colorClass: 'text-amber-600 dark:text-amber-400',
    Icon: Tent, 
  },
  'Sacred Grove': {
    gradient: 'from-emerald-500/30 to-green-500/5',
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    Icon: TreePine,
  },
  'Water Source': {
    gradient: 'from-blue-500/30 to-cyan-500/5',
    colorClass: 'text-blue-600 dark:text-blue-400',
    Icon: Droplets,
  },
  'Pilgrimage Route': {
    gradient: 'from-orange-500/30 to-red-500/5',
    colorClass: 'text-orange-600 dark:text-orange-400',
    Icon: Route,
  },
  'Fort': {
    gradient: 'from-slate-500/30 to-zinc-500/5',
    colorClass: 'text-slate-600 dark:text-slate-400',
    Icon: Castle,
  },
  'default': {
    gradient: 'from-slate-400/30 to-slate-500/5',
    colorClass: 'text-slate-500 dark:text-slate-400',
    Icon: Mountain,
  }
};

export default function PlaceImage({ src, alt = '', type = 'default', className }: PlaceImageProps) {
  // If src contains "unsplash" and the user explicitly wants category placeholders for missing images,
  // we treat unsplash links as a valid src since the original codebase used them as fallbacks.
  // Wait, the prompt specifically said "Never display: Browser default image placeholder, Empty gray rectangle, Broken image icon". 
  // It didn't say to remove unsplash images. BUT if we want to replace the previous unsplash fallbacks with these, 
  // we'll remove the unsplash fallback string from where PlaceImage is called!
  
  const [hasError, setHasError] = useState(!src || src.trim() === '');
  const [isLoaded, setIsLoaded] = useState(false);

  const matchedCategory = Object.keys(CATEGORY_MAP).find(k => (type || '').toLowerCase().includes(k.toLowerCase()));
  const config = CATEGORY_MAP[matchedCategory || 'default'];
  const { Icon, gradient, colorClass } = config;

  if (hasError) {
    return (
      <div className={twMerge(
        "relative overflow-hidden flex items-center justify-center bg-white/40 dark:bg-slate-800/40 backdrop-blur-md shadow-inner transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-white/60 dark:border-white/5",
        className
      )}
      style={{ borderRadius: '20px' }}
      >
        <div className={twMerge("absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] opacity-80 dark:opacity-40", gradient)} />
        {/* Subtle noise texture for premium feel */}
        <div 
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] mix-blend-overlay pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
        <Icon className={twMerge("w-1/3 h-1/3 max-w-[48px] max-h-[48px] relative z-10 drop-shadow-sm opacity-90", colorClass)} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div 
      className={twMerge("relative overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] bg-slate-100 dark:bg-slate-800", className)}
      style={{ borderRadius: '20px' }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700 z-0" />
      )}
      <img
        src={src as string}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={twMerge(
          "w-full h-full object-cover transition-opacity duration-500 relative z-10",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}

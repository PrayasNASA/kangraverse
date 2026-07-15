'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const CesiumMap = dynamic(() => import('@/components/CesiumMap'), { ssr: false });
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';

export default function MiniMapContainer() {
  const router = useRouter();
  const selectedFeature = useStore(state => state.selectedFeature);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedFeature && mounted) {
      router.push('/explorer');
    }
  }, [selectedFeature, router, mounted]);

  if (!mounted) return <div className="w-full h-full bg-slate-900 rounded-[24px]" />;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-full rounded-[24px] overflow-hidden isolate border border-white/60 dark:border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.08)] group"
    >
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <CesiumMap />
      </div>
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-[11px] font-extrabold tracking-wider uppercase">
          Live Interactive GIS
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
        <span className="text-white text-[13px] font-bold tracking-wide flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
          Click any marker to explore in 3D
        </span>
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface HeroActionCardProps {
  label: string;
  icon: LucideIcon;
  href: string;
  color: string;
  delay?: number;
}

export default function HeroActionCard({
  label,
  icon: Icon,
  href,
  color,
  delay = 0
}: HeroActionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        href={href}
        className="flex items-center gap-3 px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.1)] border border-white/20 transition-all group"
      >
        <div className={twMerge("w-8 h-8 rounded-full flex items-center justify-center bg-white/90 shadow-inner group-hover:scale-110 transition-transform duration-300", color)}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-[14px] font-extrabold text-white tracking-wide">{label}</span>
      </Link>
    </motion.div>
  );
}

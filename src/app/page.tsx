'use client';

import Link from 'next/link';
import { 
  Landmark, Mountain, Trees, Droplets, Map, Play, BookOpen, 
  MapPin, Users, Calendar, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="relative min-h-[100dvh] flex flex-col font-sans bg-[#FAFBFC] text-[#111827] overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-[clamp(24px,5vw,72px)] pt-[clamp(88px,8vw,128px)] pb-[clamp(140px,12vw,180px)] min-h-[max(920px,100vh)]">
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-[70%_center] brightness-105 contrast-105 saturate-90"
          style={{ backgroundImage: "url('/images/hero_desktop.webp')" }}
        ></div>
        
        {/* Gradient Overlay for Text Readability */}
        <div 
          className="absolute inset-0 z-0"
          style={{ background: "linear-gradient(90deg, rgba(255,255,255,.88) 0%, rgba(255,255,255,.60) 28%, rgba(255,255,255,.22) 52%, rgba(255,255,255,0) 78%)" }}
        ></div>
        
        <div className="relative z-10 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-[clamp(56px,7vw,120px)]">
          
          {/* Left Content */}
          <motion.div 
            className="flex flex-col items-start max-w-[620px] lg:col-span-7"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
              hidden: {}
            }}
          >
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
              className="inline-flex items-center gap-[12px] px-6 py-1.5 mb-[30px] rounded-full bg-[#F4F1FF] text-[13px] font-[600] uppercase text-[#5B4CF0] tracking-wide"
            >
              <span>RESEARCH PROJECT</span>
              <span className="w-1 h-1 rounded-full bg-[#6B7280]"></span>
              <span className="flex items-center gap-[8px]">
                <span className="w-4 h-4 rounded-full bg-[#5B4CF0]/20 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#5B4CF0]"></span>
                </span>
                University of Delhi
              </span>
            </motion.div>
            
            <motion.h1 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
              className="font-serif font-[700] text-[#111827] leading-[0.92] text-[clamp(76px,6vw,108px)] tracking-[-0.05em] mb-[24px] m-0 max-w-[620px]"
            >
              Kangra<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B4CF0] to-[#7C6CF8]">Verse</span>
            </motion.h1>
            
            <motion.h2 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
              className="font-sans font-[600] text-[#374151] leading-[1.08] text-[clamp(34px,3vw,54px)] max-w-[620px] mb-[34px]"
            >
              Living Sacred Landscapes of Western Himachal Himalayas
            </motion.h2>
            
            <motion.p 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
              className="font-sans font-[400] text-[#6B7280] leading-[1.9] text-[18px] max-w-[560px] mb-[42px]"
            >
              Exploring the deep relationship between communities and sacred landscapes through 3D mapping, cultural documentation and participatory research.
            </motion.p>
            
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }}
              className="flex items-center gap-[16px]"
            >
              <Link 
                href="/explorer"
                className="group relative inline-flex items-center justify-center px-[32px] h-[58px] text-[16px] font-semibold text-white transition-all duration-200 bg-[#5B4CF0] rounded-[18px] hover:bg-[#4F46E5] shadow-[0_18px_36px_rgba(91,76,240,0.20)] hover:-translate-y-[2px]"
              >
                Enter Explorer
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              
              <button className="group inline-flex items-center justify-center px-[32px] h-[58px] text-[16px] font-semibold text-[#111827] transition-all duration-200 bg-white rounded-[18px] hover:-translate-y-[2px] shadow-[0_18px_36px_rgba(15,23,42,0.08)] border border-[#ECEEF5]">
                <Play className="w-5 h-5 mr-2 text-[#5B4CF0]" />
                Watch Overview
              </button>
            </motion.div>
          </motion.div>
          
        </div>
      </section>

      {/* Floating Bottom Stats Bar */}
      <div className="relative z-20 flex flex-col items-center justify-center -mt-[40px] mb-[64px]">
        <div className="bg-[rgba(255,255,255,0.90)] backdrop-blur-[22px] rounded-[32px] shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-[rgba(255,255,255,0.7)] px-[24px] md:px-[48px] py-[32px] md:py-0 md:h-[145px] flex items-center w-[calc(100%-48px)] max-w-[1600px]">
          
          <div className="w-full grid grid-cols-2 md:flex md:overflow-x-auto lg:grid lg:grid-cols-5 items-center gap-y-[32px] md:gap-y-0 md:divide-x divide-[#ECEEF5] no-scrollbar">
            
            {/* Item 1 */}
            <div className="flex items-center gap-[12px] group transition-all duration-200 hover:-translate-y-[4px] md:min-w-[260px] lg:min-w-0 md:px-[24px] first:pl-0 lg:justify-center">
              <div className="w-[58px] h-[58px] rounded-[18px] bg-[#F3E8FF] flex items-center justify-center text-[#9333EA] shrink-0 transition-transform duration-200 group-hover:scale-110">
                <Landmark className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[15px] font-[600] uppercase tracking-[0.08em] text-[#6B7280] leading-none mb-[4px]">TEMPLE</span>
                <span className="text-[44px] font-[700] text-[#111827] leading-none">20+</span>
                <span className="text-[13px] font-[400] text-[#94A3B8] mt-[6px] leading-none">Sacred Temples</span>
              </div>
            </div>
            
            {/* Item 2 */}
            <div className="flex items-center gap-[12px] group transition-all duration-200 hover:-translate-y-[4px] md:min-w-[260px] lg:min-w-0 md:px-[24px] lg:justify-center">
              <div className="w-[58px] h-[58px] rounded-[18px] bg-[#E0E7FF] flex items-center justify-center text-[#4F46E5] shrink-0 transition-transform duration-200 group-hover:scale-110">
                <Mountain className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[15px] font-[600] uppercase tracking-[0.08em] text-[#6B7280] leading-none mb-[4px]">MONASTERIES</span>
                <span className="text-[44px] font-[700] text-[#111827] leading-none">8+</span>
                <span className="text-[13px] font-[400] text-[#94A3B8] mt-[6px] leading-none">Buddhist Monasteries</span>
              </div>
            </div>
            
            {/* Item 3 */}
            <div className="flex items-center gap-[12px] group transition-all duration-200 hover:-translate-y-[4px] md:min-w-[260px] lg:min-w-0 md:px-[24px] lg:justify-center">
              <div className="w-[58px] h-[58px] rounded-[18px] bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] shrink-0 transition-transform duration-200 group-hover:scale-110">
                <Trees className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[15px] font-[600] uppercase tracking-[0.08em] text-[#6B7280] leading-none mb-[4px]">SACRED GROVES</span>
                <span className="text-[44px] font-[700] text-[#111827] leading-none">12+</span>
                <span className="text-[13px] font-[400] text-[#94A3B8] mt-[6px] leading-none">Protected Groves</span>
              </div>
            </div>
            
            {/* Item 4 */}
            <div className="flex items-center gap-[12px] group transition-all duration-200 hover:-translate-y-[4px] md:min-w-[260px] lg:min-w-0 md:px-[24px] lg:justify-center">
              <div className="w-[58px] h-[58px] rounded-[18px] bg-[#DBEAFE] flex items-center justify-center text-[#2563EB] shrink-0 transition-transform duration-200 group-hover:scale-110">
                <Droplets className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[15px] font-[600] uppercase tracking-[0.08em] text-[#6B7280] leading-none mb-[4px]">WATER SOURCES</span>
                <span className="text-[44px] font-[700] text-[#111827] leading-none">7+</span>
                <span className="text-[13px] font-[400] text-[#94A3B8] mt-[6px] leading-none">Springs & Lakes</span>
              </div>
            </div>
            
            {/* Item 5 */}
            <div className="flex items-center gap-[12px] group transition-all duration-200 hover:-translate-y-[4px] md:min-w-[260px] lg:min-w-0 md:px-[24px] last:pr-0 lg:justify-center col-span-2 md:col-span-1 justify-center md:justify-start">
              <div className="w-[58px] h-[58px] rounded-[18px] bg-[#FFEDD5] flex items-center justify-center text-[#EA580C] shrink-0 transition-transform duration-200 group-hover:scale-110">
                <Map className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[15px] font-[600] uppercase tracking-[0.08em] text-[#6B7280] leading-none mb-[4px]">PILGRIMAGE ROUTES</span>
                <span className="text-[44px] font-[700] text-[#111827] leading-none">8+</span>
                <span className="text-[13px] font-[400] text-[#94A3B8] mt-[6px] leading-none">Ancient Pathways</span>
              </div>
            </div>

          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="flex flex-col items-center mt-[40px] opacity-60">
          <div className="w-[28px] h-[48px] border-[1.5px] border-[#111827] rounded-full flex justify-center p-1.5 mb-[12px]">
            <motion.div 
              animate={{ y: [0, 16, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-[#111827] rounded-full"
            />
          </div>
          <span className="text-[11px] font-[600] uppercase tracking-[0.1em] text-[#111827]">Scroll to Explore</span>
        </div>
      </div>

    </div>
  );
}

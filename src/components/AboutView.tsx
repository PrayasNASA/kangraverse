'use client';

import { useState, useEffect } from 'react';
import { 
  Info, MapPin, Camera, Calendar, PlaySquare, Compass, ShieldCheck, 
  Map, Eye, Heart, Code2, Leaf, Globe, Database, Cpu, PlusCircle, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

// Helper to provide a Landmark-like icon since Landmark was not imported
function LandmarkIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>
    </svg>
  );
}

const STATS = [
  { label: 'Sacred Sites', value: '120+', icon: LandmarkIcon, color: 'text-purple-500', from: 'from-purple-500/20' },
  { label: 'Villages Covered', value: '32+', icon: MapPin, color: 'text-emerald-500', from: 'from-emerald-500/20' },
  { label: 'Media Archive', value: '850+', icon: Camera, color: 'text-blue-500', from: 'from-blue-500/20' },
  { label: 'Videos & Oral Histories', value: '45+', icon: PlaySquare, color: 'text-rose-500', from: 'from-rose-500/20' },
  { label: 'Research Period', value: '2025–26', icon: Calendar, color: 'text-orange-500', from: 'from-orange-500/20' }
];

const APPROACH = [
  { title: 'Research & Documentation', desc: 'Field surveys, local interviews, and traditional knowledge gathering.', icon: Compass, color: 'text-indigo-500' },
  { title: 'Community Collaboration', desc: 'Working with locals to preserve intangible cultural heritage.', icon: Heart, color: 'text-rose-500' },
  { title: 'Technology Integration', desc: 'GIS, Remote Sensing, 3D Visualization, and AI integration.', icon: Cpu, color: 'text-blue-500' },
  { title: 'Conservation & Awareness', desc: 'Digital preservation, education, and public participation.', icon: Leaf, color: 'text-emerald-500' }
];

const TEAM = [
  { name: 'Prof. B. W. Pandey', role: 'Supervisor', image: 'https://ibb.co/fzBr65h4' },
  { name: 'Ms Honiya  Dakpe', role: 'Mentor', image: 'https://ibb.co/TCyqTzP' },
  { name: 'Prayas', role: 'Project Supervisor', image: 'https://i.ibb.co/6RqCyQCj/Whats-App-Image-2026-07-16-at-7-14-19-AM.jpg' },
  { name: 'Rimpi Negi', role: 'GIS Developer', image: 'https://i.ibb.co/MDdj15HQ/Whats-App-Image-2026-07-16-at-7-19-36-AM.jpg' },
  { name: 'Prajval Verma', role: 'Field Researcher', image: 'https://i.ibb.co/kg6DD0hj/Whats-App-Image-2026-07-16-at-7-21-06-AM.jpg' },
  { name: 'Drishti Singh', role: 'Community Volunteer', image: 'https://i.ibb.co/rfk8kcJ6/Whats-App-Image-2026-07-16-at-7-22-30-AM.jpg' },
  { name: 'Kareena', role: 'Community Volunteer', image: 'https://i.ibb.co/R8hQ2Zj/Kareena.jpg' }
];

export default function AboutView() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full min-h-screen px-8 pt-[140px] pb-8" />;

  return (
    <div className="w-full min-h-screen px-8 pt-[140px] pb-8 flex flex-col gap-6 max-w-[1800px] mx-auto">
      
      {/* SECTION 1: Premium Hero */}
      <div className="w-full shrink-0 flex flex-col xl:flex-row gap-6 h-auto min-h-[500px]">
        {/* Left */}
        <div className="w-full xl:w-[45%] h-full flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-extrabold uppercase tracking-wider mb-6 w-fit shadow-sm backdrop-blur-sm border border-black/5 dark:border-white/10">
            <Info className="w-3.5 h-3.5 text-[var(--primary)]" />
            About KangraVerse
          </div>
          
          <h1 className="text-[40px] lg:text-[48px] font-[900] text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
            Preserving Sacred Heritage, Empowering Communities
          </h1>
          
          <p className="text-[15px] lg:text-[17px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-10 max-w-[90%]">
            KangraVerse is a digital heritage platform dedicated to documenting, preserving, and visualizing the sacred landscapes, cultural heritage, and living traditions of Kangra District using GIS, community knowledge, and modern geospatial technologies.
          </p>

          <div className="flex flex-wrap gap-4 mt-auto">
            {STATS.map((stat, idx) => (
              <div key={idx} className="flex-1 min-w-[140px] bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[20px] p-4 flex flex-col hover:-translate-y-1 transition-transform duration-250 group">
                <div className={twMerge("w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br to-transparent mb-3 transition-transform duration-300 group-hover:scale-110", stat.from)}>
                  <stat.icon className={twMerge("w-5 h-5", stat.color)} />
                </div>
                <span className="text-[24px] font-[900] text-slate-900 dark:text-white leading-none tracking-tight mb-1">{stat.value}</span>
                <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400 leading-tight">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="w-full xl:w-[55%] h-[400px] xl:h-auto relative overflow-hidden rounded-[32px] shrink-0 border border-slate-200/50 dark:border-white/10 shadow-sm group">
          <img 
            src="https://images.unsplash.com/photo-1503265192943-9d7eea6fc77a?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Western Himalayas Sunrise" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
          />
          <div className="absolute inset-0 bg-gradient-to-t xl:bg-gradient-to-r from-black/60 via-black/20 to-transparent opacity-90" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[32px]" />
          <div className="absolute bottom-8 left-8">
            <span className="block text-white/70 text-[12px] font-extrabold uppercase tracking-widest mb-1 drop-shadow-md">Study Region</span>
            <h2 className="text-white text-[28px] font-[900] tracking-tight drop-shadow-md">Kangra District<br/>Western Himalayas</h2>
          </div>
        </div>
      </div>

      {/* SECTION 2: Story • Mission • Vision */}
      <div className="w-full shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Story */}
        <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[24px] p-8 flex flex-col hover:-translate-y-1 transition-transform duration-250">
          <div className="w-12 h-12 rounded-[16px] bg-purple-500/10 flex items-center justify-center mb-6">
            <BookOpenIcon className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-[20px] font-[900] text-slate-900 dark:text-white tracking-tight mb-4">Our Story</h3>
          <p className="text-[14px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            KangraVerse combines geography, culture, GIS, and community knowledge into one digital heritage platform to ensure that the rich tapestry of the Western Himalayas is never lost.
          </p>
          <button className="mt-auto self-start text-[13px] font-extrabold text-[var(--primary)] flex items-center gap-1 hover:gap-2 transition-all duration-250">
            Learn More <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mission */}
        <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[24px] p-8 flex flex-col hover:-translate-y-1 transition-transform duration-250">
          <div className="w-12 h-12 rounded-[16px] bg-emerald-500/10 flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="text-[20px] font-[900] text-slate-900 dark:text-white tracking-tight mb-4">Mission</h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-6">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> <span className="text-[14px] font-bold text-slate-700 dark:text-slate-300">Protect</span></div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> <span className="text-[14px] font-bold text-slate-700 dark:text-slate-300">Document</span></div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> <span className="text-[14px] font-bold text-slate-700 dark:text-slate-300">Visualize</span></div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> <span className="text-[14px] font-bold text-slate-700 dark:text-slate-300">Promote</span></div>
          </div>
          <p className="text-[14px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed mt-auto">
            Sacred heritage using GIS and community collaboration.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[24px] p-8 flex flex-col hover:-translate-y-1 transition-transform duration-250">
          <div className="w-12 h-12 rounded-[16px] bg-blue-500/10 flex items-center justify-center mb-6">
            <Eye className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-[20px] font-[900] text-slate-900 dark:text-white tracking-tight mb-4">Vision</h3>
          <p className="text-[14px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
            Create a future where technology helps preserve cultural landscapes for future generations.
          </p>
        </div>
      </div>

      {/* SECTION 3: Our Approach */}
      <div className="w-full shrink-0 flex flex-col gap-6">
        <h2 className="text-[24px] font-[900] text-slate-900 dark:text-white tracking-tight px-2">Our Approach</h2>
        <div className="w-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[24px] overflow-hidden flex flex-col">
          {APPROACH.map((item, idx) => (
            <div key={idx} className={twMerge(
              "p-6 flex items-center justify-between group hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-default",
              idx !== APPROACH.length - 1 && "border-b border-slate-200/50 dark:border-white/5"
            )}>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-black/5 to-transparent dark:from-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className={twMerge("w-6 h-6", item.color)} />
                </div>
                <div>
                  <h3 className="text-[16px] font-[900] text-slate-900 dark:text-white tracking-tight mb-1">{item.title}</h3>
                  <p className="text-[14px] font-medium text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all duration-250 hidden md:block" />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Meet Our Team */}
      <div className="w-full shrink-0 flex flex-col gap-6 mt-4">
        <h2 className="text-[24px] font-[900] text-slate-900 dark:text-white tracking-tight px-2">Research Team</h2>
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6">
          {TEAM.map((member, idx) => (
            <div key={idx} className="flex flex-col items-center group">
              <div className="w-[120px] h-[120px] rounded-full overflow-hidden mb-4 border-[4px] border-white dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform duration-300">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-[16px] font-[900] text-slate-900 dark:text-white tracking-tight text-center">{member.name}</h3>
              <span className="text-[12px] font-extrabold text-[var(--primary)] uppercase tracking-wider text-center mt-1">{member.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Partners & Support */}
      <div className="w-full shrink-0 flex flex-col gap-6 mt-8">
        <h2 className="text-[24px] font-[900] text-slate-900 dark:text-white tracking-tight px-2 text-center">Partners & Support</h2>
        <div className="w-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm rounded-[24px] p-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
           <div className="text-[16px] font-[900] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">Centre for Himalayan Studies</div>
           <div className="text-[16px] font-[900] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">University of Delhi</div>
           <div className="text-[16px] font-[900] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">Digital India</div>
           <div className="text-[16px] font-[900] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-default flex items-center gap-2"><Globe className="w-5 h-5"/> OpenStreetMap</div>
           <div className="text-[16px] font-[900] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">Cesium</div>
           <div className="text-[16px] font-[900] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">QGIS</div>
           <div className="text-[16px] font-[900] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-default flex items-center gap-2"><Database className="w-5 h-5"/> PostGIS</div>
        </div>
      </div>

      {/* SECTION 6: Call To Action */}
      <div className="w-full mt-4 shrink-0 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary)]/5 dark:from-[var(--primary)]/20 dark:to-transparent border border-[var(--primary)]/20 shadow-sm rounded-[24px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
         {/* Subtle mountain graphic overlay */}
         <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M400 200H0L150 50L220 120L300 10L400 130V200Z" fill="currentColor" className="text-[var(--primary)]"/>
            </svg>
         </div>

         <div className="relative z-10">
           <h3 className="text-[28px] font-[900] text-slate-900 dark:text-white tracking-tight mb-2">Join Our Mission</h3>
           <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300 max-w-lg">Help preserve the sacred landscapes and living heritage of Kangra for future generations.</p>
         </div>
         <div className="flex items-center gap-3 relative z-10 w-full md:w-auto shrink-0">
           <Link href="/explorer" className="w-full md:w-auto px-6 py-3.5 rounded-[16px] bg-[var(--primary)] text-white font-extrabold text-[14px] hover:bg-[var(--primary-dark)] hover:-translate-y-1 hover:shadow-md transition-all duration-250 flex items-center justify-center gap-2">
             <Map className="w-4 h-4" /> Explore Heritage
           </Link>
           <Link href="/research" className="w-full md:w-auto px-6 py-3.5 rounded-[16px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-white font-extrabold text-[14px] border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-slate-700 hover:-translate-y-1 transition-all duration-250 shadow-sm text-center">
             View Research
           </Link>
         </div>
      </div>

    </div>
  );
}

// Icon helper since lucide-react doesn't have BookOpenIcon exported directly, using regular one
function BookOpenIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  );
}

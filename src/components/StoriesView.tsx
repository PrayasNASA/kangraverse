'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, Variants } from 'framer-motion';
import { Compass, BookOpen, Clock, MapPin, Volume2, ArrowRight, Image as ImageIcon, PlayCircle, Landmark, TreePine, Droplets, HeartHandshake, Sparkles } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

// --- MOCK DATA ---

const FEATURED_STORIES = [
  {
    id: 1,
    title: "The Architecture of the Gods",
    category: "Architecture",
    readTime: "8 min read",
    desc: "Discover the intricate Kath Kuni style of construction that allows Kangra's ancient temples to survive devastating earthquakes.",
    image: "https://plus.unsplash.com/premium_photo-1697730331645-5ca8244b708a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Guardians of the Sacred Grove",
    category: "Sacred Groves",
    readTime: "6 min read",
    desc: "How local village deities (Devtas) have inadvertently become the greatest conservationists of the Western Himalayas.",
    image: "https://images.unsplash.com/photo-1703323047375-7f07c3ec6142?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Following the Water",
    category: "Water Sources",
    readTime: "12 min read",
    desc: "Tracing the ancient Baolis and spiritual water springs that have nourished the Kangra valley for millennia.",
    image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&q=80",
  }
];

const TIMELINE_EVENTS = [
  { era: "Ancient Origins", year: "c. 1000 BCE", title: "The First Shrines", desc: "Early animistic worship centered around prominent rocks, ancient trees, and perennial water sources.", image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80" },
  { era: "Medieval Period", year: "8th - 12th Century CE", title: "The Rock Cut Temples", desc: "The construction of the magnificent Masroor Rock Cut Temple complex and the rise of classical architecture.", image: "https://images.unsplash.com/photo-1565499298418-8687ba1bd46e?w=800&q=80" },
  { era: "Colonial Era", year: "1850 - 1947", title: "Documentation & Change", desc: "British mapping efforts begin to catalog the sacred geography of the region while traditional routes adapt.", image: "https://images.unsplash.com/photo-1582650508535-cda225bd4122?w=800&q=80" },
  { era: "Modern Conservation", year: "1990 - Present", title: "Digital Preservation", desc: "The rise of GIS and digital archiving helps preserve fading oral histories and deteriorating physical structures.", image: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?w=800&q=80" }
];

const CATEGORIES = [
  { name: "Temple Stories", icon: Landmark, color: "from-purple-500 to-fuchsia-500", image: "https://images.unsplash.com/photo-1626242331562-b1d556a319f3?w=500&q=80" },
  { name: "Sacred Groves", icon: TreePine, color: "from-emerald-500 to-teal-500", image: "https://images.unsplash.com/photo-1542382156909-9240b97cb724?w=500&q=80" },
  { name: "Water Sources", icon: Droplets, color: "from-blue-500 to-cyan-500", image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=500&q=80" },
  { name: "Community Traditions", icon: HeartHandshake, color: "from-orange-500 to-red-500", image: "https://images.unsplash.com/photo-1560088941-8f52233f81e3?w=500&q=80" },
];

const VOICES = [
  { quote: "The Devta doesn't just reside in the temple. He lives in the forest, the water, and in the collective memory of our people.", author: "Rajendra Singh", role: "Village Elder, Dharamshala", date: "Recorded May 2024" },
  { quote: "Mapping these sites isn't just about preserving stones. It's about protecting the ecological balance they represent.", author: "Dr. Anjali Sharma", role: "Heritage Conservationist", date: "Recorded Jan 2024" },
  { quote: "We walk the same paths our ancestors walked. Every step on the pilgrimage route is a story remembered.", author: "Tenzin Dorjee", role: "Monk, Bir", date: "Recorded Oct 2023" },
];

const GALLERY = [
  "https://images.unsplash.com/photo-1642474606747-76312351789d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1572972875738-b1642a656d96?q=80&w=1137&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1652501836149-ab1b0f220a37?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1669304944449-4a1dc72cada4?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  
  
];

// --- ANIMATION VARIANTS ---

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function StoriesView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Parallax values for Hero
  const heroY = useTransform(scrollYProgress, [0, 0.2], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);



  return (
    <div ref={containerRef} className="bg-slate-50 dark:bg-[#0A0A0A] min-h-screen font-sans selection:bg-[var(--primary)] selection:text-white">
      
      {/* SECTION 1: Full-width Hero Banner */}
      <section className="relative h-[100svh] w-full overflow-hidden flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <img 
            src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2500&auto=format&fit=crop" 
            alt="Kangra Himalayas"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#0A0A0A] dark:to-[#0A0A0A] pointer-events-none" />
        </motion.div>

        <motion.div 
          className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20"
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-white text-xs font-bold tracking-widest uppercase">Digital Heritage Magazine</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] text-white tracking-tighter leading-[0.95] mb-6 drop-shadow-2xl font-serif">
            Living Sacred <br /> Landscapes
          </h1>
          <p className="text-lg md:text-xl text-slate-200/90 font-medium max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
            Explore the history, traditions, ecology, and spiritual heritage of the Western Himalayas through immersive interactive stories.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-900 font-extrabold text-sm tracking-wide hover:scale-105 transition-transform duration-300 shadow-[0_10px_40px_rgba(255,255,255,0.2)]">
              Start Exploring
            </button>
            <Link href="/explorer" className="w-full sm:w-auto px-8 py-4 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 font-extrabold text-sm tracking-wide hover:bg-white/10 transition-colors duration-300 flex items-center justify-center gap-2">
              <Compass className="w-4 h-4" /> Open Map
            </Link>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: Featured Stories */}
      <section className="relative z-20 -mt-20 px-6 lg:px-12 max-w-[1800px] mx-auto pb-32">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURED_STORIES.map((story) => (
            <motion.div 
              key={story.id}
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-[32px] glass-panel bg-white/80 dark:bg-slate-900/80 border border-white/60 dark:border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.08)] cursor-pointer"
            >
              <div className="h-64 w-full relative overflow-hidden">
                <img src={story.image} alt={story.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full border border-white/20 uppercase tracking-wider">
                  {story.category}
                </div>
              </div>
              <div className="p-8 relative">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold mb-3">
                  <Clock className="w-3.5 h-3.5" /> {story.readTime}
                </div>
                <h3 className="text-2xl font-[900] text-slate-900 dark:text-white leading-tight mb-3 group-hover:text-[var(--primary)] transition-colors font-serif">
                  {story.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3">
                  {story.desc}
                </p>
                <div className="flex items-center gap-2 text-[var(--primary)] font-extrabold text-sm group-hover:gap-4 transition-all">
                  Read Story <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SECTION 5: Deep Dive Featured Story Layout */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-extrabold text-[var(--primary)] tracking-[0.2em] uppercase mb-4">Deep Dive</h2>
            <h3 className="text-4xl md:text-6xl font-[900] text-slate-900 dark:text-white tracking-tight font-serif">
              The Legend of Masroor
            </h3>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="rounded-[40px] overflow-hidden mb-16 shadow-[0_30px_60px_rgba(0,0,0,0.15)] relative h-[60vh]"
          >
            <img src="https://plus.unsplash.com/premium_photo-1661964372197-876e0034f333?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="w-full h-full object-cover" alt="Masroor" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="md:col-span-8 prose prose-lg prose-slate dark:prose-invert max-w-none"
            >
              <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                Carved out of a single monolithic rock, the Masroor temples stand as a testament to the architectural brilliance of the 8th century. Local legends whisper that the Pandavas constructed this magnificent edifice during their exile, though historians place its creation during the Katyuri dynasty.
              </p>
              <p>
                The complexity of the shikhara (spires) and the detailed iconography of Shiva, Vishnu, and Devi reflect a period of intense artistic and spiritual synthesis in the Kangra valley.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="md:col-span-4"
            >
              <div className="p-6 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 border border-black/5 dark:border-white/5 shadow-inner">
                <h4 className="font-[800] text-slate-900 dark:text-white mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-[var(--primary)]" /> Location Focus</h4>
                <div className="h-48 rounded-xl bg-slate-200 dark:bg-slate-700 w-full mb-4 overflow-hidden relative group cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Map View" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                    <span className="px-4 py-2 bg-white/90 text-slate-900 text-xs font-bold rounded-full shadow-lg">Explore on Map</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <p><strong>District:</strong> Kangra</p>
                  <p><strong>Elevation:</strong> 765m</p>
                  <p><strong>Status:</strong> ASI Protected</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Community Voices */}
      <section className="py-24 bg-slate-100 dark:bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 dark:opacity-10 bg-[url('https://images.unsplash.com/photo-1626242331562-b1d556a319f3?w=2000&q=5')] bg-cover bg-center mix-blend-luminosity" />
        <div className="max-w-[1800px] mx-auto px-6 relative z-10">
          <div className="flex items-center gap-4 mb-16">
            <Volume2 className="w-8 h-8 text-[var(--primary)]" />
            <h2 className="text-3xl md:text-4xl font-[900] text-slate-900 dark:text-white tracking-tight">Community Voices</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VOICES.map((voice, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-8 rounded-[32px] glass-panel bg-white/70 dark:bg-slate-900/60 border border-white/60 dark:border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.05)] flex flex-col"
              >
                <div className="text-[var(--primary)]/20 mb-4">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                </div>
                <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-8 flex-1 italic">"{voice.quote}"</p>
                <div className="flex items-center justify-between border-t border-black/5 dark:border-white/10 pt-6">
                  <div>
                    <h5 className="font-[800] text-slate-900 dark:text-white text-sm">{voice.author}</h5>
                    <p className="text-xs text-slate-500 font-bold mt-1">{voice.role}</p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors">
                    <PlayCircle className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Interactive Story Timeline */}
      <section className="py-32 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-[900] text-slate-900 dark:text-white tracking-tight font-serif mb-4">A History in Stone</h2>
          <p className="text-slate-500 font-medium">Tracing the evolution of Kangra's sacred landscape.</p>
        </div>

        <div className="relative border-l-2 border-[var(--primary)]/20 ml-4 md:ml-1/2 md:translate-x-1/2 space-y-20">
          {TIMELINE_EVENTS.map((event, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={twMerge(
                "relative md:w-[calc(100%-40px)]",
                idx % 2 === 0 ? "md:-left-[100%] md:text-right md:pr-10 pl-10 md:pl-0" : "md:left-0 md:pl-10 pl-10"
              )}
            >
              {/* Node */}
              <div className={twMerge(
                "absolute top-0 w-6 h-6 rounded-full border-4 border-slate-50 dark:border-[#0A0A0A] bg-[var(--primary)] shadow-lg",
                idx % 2 === 0 ? "-left-[13px] md:left-auto md:-right-[13px]" : "-left-[13px] md:-left-[13px]"
              )} />
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-black/5 dark:border-white/5 group hover:-translate-y-2 transition-transform duration-300">
                <span className="text-[11px] font-extrabold text-[var(--primary)] tracking-widest uppercase mb-2 block">{event.era} • {event.year}</span>
                <h4 className="text-xl font-[800] text-slate-900 dark:text-white mb-3">{event.title}</h4>
                <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                  <img src={event.image} className="w-full h-full object-cover" alt={event.title} />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{event.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4 & 7: Categories & Gallery */}
      <section className="py-24 bg-white dark:bg-slate-900 px-6 lg:px-12 rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1800px] mx-auto">
          
          <div className="mb-20">
            <h2 className="text-2xl font-[900] text-slate-900 dark:text-white mb-8">Browse by Theme</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.map((cat, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  className="relative h-40 rounded-[24px] overflow-hidden group cursor-pointer"
                >
                  <img src={cat.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cat.name} />
                  <div className={twMerge("absolute inset-0 opacity-80 mix-blend-multiply bg-gradient-to-br", cat.color)} />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <cat.icon className="w-6 h-6 text-white mb-2" />
                    <h4 className="text-white font-[800] text-lg leading-tight">{cat.name}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-[900] text-slate-900 dark:text-white mb-8 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-[var(--primary)]" /> Visual Archive
            </h2>
            <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
              {GALLERY.map((img, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative rounded-[20px] overflow-hidden break-inside-avoid group cursor-pointer shadow-sm"
                >
                  <img src={img} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" alt="Gallery" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* SECTION 8: Suggested Stories */}
          <div className="mt-32 border-t border-black/5 dark:border-white/5 pt-16">
            <h2 className="text-2xl font-[900] text-slate-900 dark:text-white mb-8">Continue Reading</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURED_STORIES.map((story, idx) => (
                <motion.div 
                  key={`suggested-${idx}`}
                  whileHover={{ y: -4 }}
                  className="group relative rounded-[20px] overflow-hidden glass-panel border border-black/5 dark:border-white/5 cursor-pointer"
                >
                  <div className="h-32 w-full overflow-hidden">
                    <img src={story.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={story.title} />
                  </div>
                  <div className="p-4 bg-white/50 dark:bg-slate-800/50">
                    <span className="text-[10px] font-extrabold text-[var(--primary)] uppercase tracking-wider">{story.category}</span>
                    <h4 className="text-sm font-[800] text-slate-900 dark:text-white mt-1 group-hover:text-[var(--primary)] transition-colors">{story.title}</h4>
                  </div>
                </motion.div>
              ))}
              <motion.div 
                whileHover={{ y: -4 }}
                className="group relative rounded-[20px] overflow-hidden bg-[var(--primary)]/5 border border-[var(--primary)]/10 cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <span className="text-sm font-bold text-[var(--primary)]">View All Stories</span>
              </motion.div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, User, Compass, LayoutDashboard, BookOpen, FlaskConical, Image as ImageIcon, Info, Menu } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function TopNav() {
  const pathname = usePathname();
  const isExplorer = pathname?.includes('/explorer');
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark') || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !document.documentElement.classList.contains('light'));
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      setIsDark(false);
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const navLinks = [
    { href: '/explorer', label: 'Explore', icon: Compass },
    { href: '#', label: 'Dashboard', icon: LayoutDashboard },
    { href: '#', label: 'Stories', icon: BookOpen },
    { href: '#', label: 'Research', icon: FlaskConical },
    { href: '#', label: 'Gallery', icon: ImageIcon },
    ...(!isExplorer ? [{ href: '#', label: 'About Us', icon: Info }] : []),
  ];

  const isHome = pathname === '/';

  const headerContent = (
    <header className={twMerge(
      "flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-[100]",
      isHome 
        ? twMerge(
            "fixed top-0 left-0 w-full px-6 lg:px-12 transition-all duration-500",
            scrolled 
              ? "h-[80px] bg-white/70 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 shadow-sm" 
              : "h-[100px] bg-transparent border-b-0 shadow-none"
          )
        : "h-[76px] rounded-[28px] px-6 w-full shadow-[0_20px_80px_-15px_rgba(0,0,0,0.15)] border border-white/60 dark:border-white/10 backdrop-blur-[32px] bg-white/70 dark:bg-[#1C1C1E]/70"
    )}>
      {isHome && !scrolled && (
        <div 
          className="absolute inset-0 z-[-1] pointer-events-none transition-opacity duration-500"
          style={{
            background: isDark 
              ? "linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(0,0,0,0) 100%)" 
              : "linear-gradient(180deg, rgba(255,255,255,.8) 0%, rgba(255,255,255,0) 100%)"
          }}
        />
      )}
      
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-4 group transition-all duration-300 outline-none">
        <div className="w-[46px] h-[46px] rounded-[16px] bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-black/5 dark:border-white/10 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08] group-active:scale-[0.95] shadow-sm">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 256 256" 
            fill="currentColor"
            className="w-6 h-6 text-[var(--primary)] dark:text-white transition-colors"
          >
            <path d="M245.11,60.68c-7.65-13.19-27.85-16.16-58.5-8.66A96,96,0,0,0,32.81,140.3C5.09,169,5.49,186,10.9,195.32,16,204.16,26.64,208,40.64,208a124.11,124.11,0,0,0,28.79-4,96,96,0,0,0,153.78-88.25c12.51-13,20.83-25.35,23.66-35.92C248.83,72.51,248.24,66.07,245.11,60.68Zm-13.69,15c-6.11,22.78-48.65,57.31-87.52,79.64-67.81,39-113.62,41.52-119.16,32-1.46-2.51-.65-7.24,2.22-13a80.06,80.06,0,0,1,10.28-15.05,95.53,95.53,0,0,0,6.23,14.18,4,4,0,0,0,4,2.12,122.14,122.14,0,0,0,16.95-3.32c21.23-5.55,46.63-16.48,71.52-30.78s47-30.66,62.45-46.15A122.74,122.74,0,0,0,209.7,82.45a4,4,0,0,0,.17-4.52,96.26,96.26,0,0,0-9.1-12.46c14.21-2.35,27.37-2.17,30.5,3.24C232.19,70.28,232.24,72.63,231.42,75.69Z"></path>
          </svg>
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-[26px] font-[900] text-slate-900 dark:text-white font-sans tracking-tight leading-[1]">
            Kangra<span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">Verse</span>
          </span>
          <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 mt-[2px] tracking-[0.15em] uppercase">
            Living Heritage
          </span>
        </div>
      </Link>

      {/* Middle: Conditional based on page */}
      {isExplorer ? (
        <div className="hidden lg:block flex-1 max-w-xl mx-8">
          <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 text-center tracking-wide uppercase">
            Western Himachal Himalayas
          </p>
        </div>
      ) : (
        <nav className="hidden xl:flex items-center gap-2 flex-1 justify-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '#' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={twMerge(
                  "relative px-5 py-2.5 text-[15px] font-bold transition-all duration-300 rounded-full outline-none",
                  isActive 
                    ? "text-[var(--primary)] dark:text-white" 
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicatorHome"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-[var(--primary)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {isExplorer && (
          <nav className="hidden xl:flex items-center gap-1 mr-2 bg-black/5 dark:bg-white/5 p-1.5 rounded-[20px]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '#' && pathname?.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={twMerge(
                    "relative px-4 py-2.5 text-[13px] font-bold tracking-wide transition-all duration-300 rounded-[14px] flex items-center gap-2.5 z-10 outline-none",
                    isActive 
                      ? "text-[var(--primary)] dark:text-slate-900" 
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavCapsule"
                      className="absolute inset-0 bg-white dark:bg-white rounded-[14px] shadow-sm -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className={twMerge("w-4 h-4", isActive ? "opacity-100" : "opacity-70")} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        {isExplorer && <div className="h-8 w-px bg-black/10 dark:bg-white/10 hidden xl:block mx-2"></div>}

        <button 
          onClick={toggleTheme}
          className="w-11 h-11 rounded-full text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <button className="w-11 h-11 rounded-full bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] dark:text-white transition-all duration-300 hover:scale-105 hover:bg-[var(--primary)]/20 dark:hover:bg-[var(--primary)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 shadow-sm">
          <User className="w-5 h-5" />
        </button>

        {/* Mobile Menu Toggle (Visible only on smaller screens) */}
        <button className="xl:hidden w-11 h-11 rounded-full text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );

  if (isExplorer) {
    return (
      <div className="fixed top-4 left-4 right-4 lg:top-5 lg:left-1/2 lg:-translate-x-1/2 lg:w-[calc(100%-40px)] z-[100] max-w-[1800px] transition-all duration-500 pointer-events-auto">
        {headerContent}
      </div>
    );
  }

  return headerContent;
}

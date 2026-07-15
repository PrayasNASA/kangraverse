'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sun, Moon, User, Compass, LayoutDashboard, BookOpen, FlaskConical, Image as ImageIcon, Info } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function TopNav() {
  const pathname = usePathname();
  const isExplorer = pathname?.includes('/explorer');
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
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
      "flex items-center justify-between transition-all duration-300 ease-in-out z-[100]",
      isHome 
        ? twMerge(
            "fixed top-0 left-0 w-full h-[92px] px-[40px] lg:px-[clamp(40px,5vw,72px)]",
            scrolled ? "glass-nav" : "bg-transparent border-b-0 shadow-none"
          )
        : "h-[72px] glass-panel rounded-full px-6 w-[calc(100vw-48px)] max-w-[1600px] shadow-lg shadow-black/5"
    )}>
      {isHome && !scrolled && (
        <div 
          className="absolute inset-0 z-[-1] pointer-events-none transition-opacity duration-300"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,.82) 0%, rgba(255,255,255,.45) 45%, rgba(255,255,255,0) 100%)"
          }}
        />
      )}
      
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-[14px] group transition-all duration-200">
        <div className="w-[40px] md:w-[42px] lg:w-[44px] h-[40px] md:h-[42px] lg:h-[44px] rounded-[14px] bg-[rgba(255,255,255,0.88)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.65)] flex items-center justify-center transition-all duration-200 group-hover:scale-[1.05] shadow-[0_8px_24px_rgba(91,76,240,0.12)] group-hover:shadow-[0_12px_28px_rgba(91,76,240,0.15)]">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 256 256" 
            fill="currentColor"
            className="w-[22px] h-[22px] text-[#5B4CF0] transition-colors duration-200 group-hover:text-[#4F46E5]"
          >
            <path d="M245.11,60.68c-7.65-13.19-27.85-16.16-58.5-8.66A96,96,0,0,0,32.81,140.3C5.09,169,5.49,186,10.9,195.32,16,204.16,26.64,208,40.64,208a124.11,124.11,0,0,0,28.79-4,96,96,0,0,0,153.78-88.25c12.51-13,20.83-25.35,23.66-35.92C248.83,72.51,248.24,66.07,245.11,60.68Zm-13.69,15c-6.11,22.78-48.65,57.31-87.52,79.64-67.81,39-113.62,41.52-119.16,32-1.46-2.51-.65-7.24,2.22-13a80.06,80.06,0,0,1,10.28-15.05,95.53,95.53,0,0,0,6.23,14.18,4,4,0,0,0,4,2.12,122.14,122.14,0,0,0,16.95-3.32c21.23-5.55,46.63-16.48,71.52-30.78s47-30.66,62.45-46.15A122.74,122.74,0,0,0,209.7,82.45a4,4,0,0,0,.17-4.52,96.26,96.26,0,0,0-9.1-12.46c14.21-2.35,27.37-2.17,30.5,3.24C232.19,70.28,232.24,72.63,231.42,75.69Z"></path>
          </svg>
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-[30px] font-[700] text-[#111827] font-sans tracking-[-0.03em] leading-none">
            Kangra<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B4CF0] to-[#7C6CF8]">Verse</span>
          </span>
          <span className="text-[13px] font-[500] text-[#6B7280] mt-[3px] tracking-[0.04em]">
            Living Sacred Landscapes
          </span>
        </div>
      </Link>

      {/* Middle: Conditional based on page */}
      {isExplorer ? (
        <div className="hidden md:block flex-1 max-w-xl mx-[32px]">
          <p className="text-[14px] font-normal text-[#6B7280] text-center tracking-wide">
            Research on Living Heritage of Western Himachal Himalayas
          </p>
        </div>
      ) : (
        <nav className="hidden lg:flex items-center gap-[42px] mx-[32px] flex-1 justify-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '#' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={twMerge(
                  "relative py-2 text-[16px] font-[500] font-sans transition-all duration-200 flex items-center gap-2",
                  isActive 
                    ? "text-[#5B4CF0]" 
                    : "text-[#374151] hover:text-[#5B4CF0]"
                )}
              >
                {isActive && !isExplorer && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-[33px] left-0 w-full h-[2px] bg-[#5B4CF0]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-[24px]">
        {isExplorer && (
          <nav className="hidden lg:flex items-center gap-[16px] mr-[16px]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '#' && pathname?.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={twMerge(
                    "relative px-[16px] py-[10px] text-[13px] font-bold uppercase tracking-wider transition-all duration-300 rounded-full flex items-center gap-[8px] z-10",
                    isActive 
                      ? "text-[var(--primary)]" 
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavCapsule"
                      className="absolute inset-0 bg-[var(--primary)] opacity-10 dark:opacity-20 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className="w-[18px] h-[18px]" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="h-[32px] w-px bg-[#ECEEF5] hidden sm:block mx-[8px]"></div>

        <button 
          onClick={toggleTheme}
          className="p-[10px] rounded-full text-[#6B7280] hover:bg-[#FAFBFC] hover:text-[#111827] transition-all duration-200"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-[20px] h-[20px]" /> : <Moon className="w-[20px] h-[20px]" />}
        </button>
        
        <button className="w-[44px] h-[44px] rounded-full bg-[#5B4CF0]/10 flex items-center justify-center text-[#5B4CF0] transition-all duration-200 hover:-translate-y-[2px] hover:bg-[#5B4CF0]/20">
          <User className="w-[20px] h-[20px]" />
        </button>
      </div>
    </header>
  );

  if (isExplorer) {
    return (
      <div className="fixed top-4 left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-[calc(100%-2rem)] z-[100] max-w-[1600px]">
        {headerContent}
      </div>
    );
  }

  return headerContent;
}

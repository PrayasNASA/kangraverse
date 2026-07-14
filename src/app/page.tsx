import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center flex-1 px-6 py-24 text-center overflow-hidden">
        {/* CSS Background Gradient mimicking a dusky mountain/sky vibe */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-950"></div>
        
        {/* Subtle noise/texture overlay if desired (using CSS opacity tricks) */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] mix-blend-overlay pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wide uppercase text-indigo-200">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Version 1.0 Live
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400 drop-shadow-sm">
            KangraVerse
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-300 font-light max-w-2xl mb-12 leading-relaxed">
            A 3D Digital Heritage Explorer of Kangra District
          </p>
          
          <Link 
            href="/explorer"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-indigo-600 rounded-full hover:bg-indigo-500 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.7)] focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
          >
            Enter Explorer
            <svg 
              className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 bg-slate-900 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center sm:text-left">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center justify-center sm:justify-start gap-3">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About the Project
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed font-light">
            KangraVerse integrates terrain data, satellite imagery, and cultural heritage 
            documentation into an interactive 3D platform for exploring the sacred landscapes 
            of Kangra District, Himachal Pradesh.
          </p>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="relative z-10 bg-slate-950 py-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-500 font-medium">
            MSc Dissertation Project — [Your Name], [Year]
          </p>
        </div>
      </footer>

    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { 
  X, Send, Sparkles, Info
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const SUGGESTED_PROMPTS = [
  { text: "🏛 Tell me about Chamunda Temple", icon: "🏛" },
  { text: "🌳 Explain Sacred Groves", icon: "🌳" },
  { text: "🧭 Pilgrimage Routes", icon: "🧭" },
  { text: "🎤 Community Interviews", icon: "🎤" },
];

const BUTTON_SIZE = 64; 
const MARGIN = 24;

const getSafeArea = () => {
  if (typeof window === 'undefined') return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    return {
      minX: MARGIN,
      maxX: Math.max(MARGIN, window.innerWidth - BUTTON_SIZE - MARGIN),
      minY: MARGIN + 80,
      maxY: Math.max(MARGIN + 80, window.innerHeight - BUTTON_SIZE - MARGIN - 80)
    };
  } else {
    // Sidebar: 440px + 24px margin = 464px. Add MARGIN for gap.
    const minX = 464 + MARGIN;
    // Details: 460px + 24px margin = 484px.
    const maxX = Math.max(minX, window.innerWidth - 484 - BUTTON_SIZE - MARGIN);
    // Top Nav safe area: 140px.
    const minY = 140 + MARGIN;
    // Bottom Dock: approx 104px footprint.
    const maxY = Math.max(minY, window.innerHeight - 104 - BUTTON_SIZE - MARGIN);

    return { minX, maxX, minY, maxY };
  }
};

const snapToEdge = (currentX: number, currentY: number, safeArea: ReturnType<typeof getSafeArea>) => {
  let x = Math.max(safeArea.minX, Math.min(currentX, safeArea.maxX));
  let y = Math.max(safeArea.minY, Math.min(currentY, safeArea.maxY));

  const distLeft = x - safeArea.minX;
  const distRight = safeArea.maxX - x;
  const distTop = y - safeArea.minY;
  const distBottom = safeArea.maxY - y;

  const min = Math.min(distLeft, distRight, distTop, distBottom);

  if (min === distLeft) x = safeArea.minX;
  else if (min === distRight) x = safeArea.maxX;
  else if (min === distTop) y = safeArea.minY;
  else if (min === distBottom) y = safeArea.maxY;

  return { x, y };
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Welcome to KangraVerse.\n\nI can help you explore sacred landscapes, traditional ecological knowledge, and cultural heritage." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [chatPos, setChatPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const bounds = getSafeArea();
    const saved = localStorage.getItem('aiButtonPos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        let startX = Math.max(bounds.minX, Math.min(parsed.x, bounds.maxX));
        let startY = Math.max(bounds.minY, Math.min(parsed.y, bounds.maxY));
        const snapped = snapToEdge(startX, startY, bounds);
        x.set(snapped.x);
        y.set(snapped.y);
      } catch (e) {
        x.set(bounds.maxX);
        y.set(bounds.maxY);
      }
    } else {
      x.set(bounds.maxX);
      y.set(bounds.maxY);
    }
    
    setIsMounted(true);
    return () => window.removeEventListener('resize', checkMobile);
  }, [x, y]);

  // Recalculate snap on window resize if outside bounds
  useEffect(() => {
    if (!isMounted) return;
    const handleResizeSnap = () => {
      const bounds = getSafeArea();
      const currentX = x.get();
      const currentY = y.get();
      if (currentX < bounds.minX || currentX > bounds.maxX || currentY < bounds.minY || currentY > bounds.maxY) {
        const snapped = snapToEdge(currentX, currentY, bounds);
        x.set(snapped.x);
        y.set(snapped.y);
      }
    };
    window.addEventListener('resize', handleResizeSnap);
    return () => window.removeEventListener('resize', handleResizeSnap);
  }, [isMounted, x, y]);

  const handleDragEnd = () => {
    const bounds = getSafeArea();
    const snapped = snapToEdge(x.get(), y.get(), bounds);
    
    animate(x, snapped.x, { type: 'spring', damping: 25, stiffness: 300 });
    animate(y, snapped.y, { type: 'spring', damping: 25, stiffness: 300 });
    
    localStorage.setItem('aiButtonPos', JSON.stringify({ x: snapped.x, y: snapped.y }));
  };

  const handleOpen = () => {
    setChatPos({ x: x.get(), y: y.get() });
    setIsOpen(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to get response');

      setMessages((prev) => [...prev, { role: 'model', content: data.message }]);
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'model', content: 'Sorry, I encountered an error connecting to the intelligence module.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!isMounted) return null;

  const isLeftHalf = chatPos.x < window.innerWidth / 2;
  const isTopHalf = chatPos.y < window.innerHeight / 2;

  const chatOriginX = isLeftHalf ? '0%' : '100%';
  const chatOriginY = isTopHalf ? '0%' : '100%';

  const chatStyle: any = isMobile ? {
    left: 16,
    right: 16,
    bottom: 96,
    transformOrigin: 'bottom right'
  } : {
    left: isLeftHalf ? chatPos.x : undefined,
    right: !isLeftHalf ? window.innerWidth - chatPos.x - BUTTON_SIZE : undefined,
    top: isTopHalf ? chatPos.y : undefined,
    bottom: !isTopHalf ? window.innerHeight - chatPos.y - BUTTON_SIZE : undefined,
    transformOrigin: `${chatOriginX} ${chatOriginY}`
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            drag
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            style={{ x, y, position: 'fixed', top: 0, left: 0 }}
            whileHover={{ scale: 1.1, boxShadow: '0px 0px 40px rgba(108, 99, 255, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            whileDrag={{ scale: 0.95, cursor: 'grabbing', boxShadow: '0px 20px 50px rgba(0,0,0,0.4)' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={handleOpen}
            className="w-16 h-16 bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] text-white rounded-full shadow-2xl transition-shadow flex items-center justify-center group border border-white/30 z-[60] pointer-events-auto touch-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:ring-offset-2"
            aria-label="Open AI Assistant"
          >
            <Sparkles className="w-7 h-7 animate-pulse drop-shadow-md" />
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-800 shadow-md">AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.1, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.1, filter: "blur(10px)" }}
            transition={{ duration: 0.4, type: "spring", stiffness: 350, damping: 30 }}
            style={{ position: 'fixed', ...chatStyle }}
            className="z-[70] w-auto md:w-[420px] h-[700px] max-h-[80vh] flex flex-col glass-panel backdrop-blur-[32px] bg-white/90 dark:bg-slate-900/95 border border-white/60 dark:border-slate-700/50 rounded-t-[32px] md:rounded-[32px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 shrink-0 border-b border-white/30 dark:border-slate-700/30 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-[16px] bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20 border border-white/20">
                  <Sparkles className="w-5 h-5" />
                  <div className="absolute -bottom-1 -right-1 w-[12px] h-[12px] bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-[800] text-slate-800 dark:text-slate-100 text-[16px] leading-tight flex items-center gap-1.5">
                    Intelligence <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
                  </h3>
                  <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Always ready to assist</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 flex items-center justify-center bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 hover:scale-105 text-slate-500 dark:text-slate-300 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar flex flex-col gap-5">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div 
                    key={`msg-${idx}`}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={twMerge(
                        "max-w-[88%] p-4 text-[14px] leading-relaxed relative group font-medium",
                        msg.role === 'user' 
                          ? "bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white rounded-[24px] rounded-br-[8px] shadow-md shadow-[var(--primary)]/20 border border-white/10" 
                          : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-slate-100 rounded-[24px] rounded-bl-[8px] shadow-sm whitespace-pre-wrap border border-black/5 dark:border-white/5"
                      )}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading Indicator */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex justify-start items-center gap-2"
                  >
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-5 py-4 rounded-[24px] rounded-bl-[8px] shadow-sm border border-black/5 dark:border-white/5 flex items-center gap-2 h-[52px]">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <motion.div 
                          key={i}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
                          transition={{ duration: 1, delay, repeat: Infinity, ease: "easeInOut" }}
                          className="w-2 h-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Suggested Prompts */}
              {messages.length === 1 && !isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-2 flex flex-wrap gap-2"
                >
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <motion.button
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + (idx * 0.1) }}
                      key={idx}
                      onClick={() => sendMessage(prompt.text)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-white transition-all duration-300 shadow-sm border border-white/60 dark:border-slate-600/50 text-slate-700 dark:text-slate-300 group focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      <span className="text-sm drop-shadow-sm">{prompt.icon}</span>
                      <span className="text-[13px] font-bold">{prompt.text.replace(/^[^\w\s]+\s/, '')}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
              
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area */}
            <div className="px-5 pb-5 pt-4 shrink-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-t border-white/40 dark:border-slate-700/50 z-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative flex items-center group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-[18px] opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 blur-md"></div>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Intelligence..."
                    className="w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/60 dark:border-slate-600/50 rounded-[18px] pl-5 pr-14 h-[56px] text-[15px] focus:outline-none focus:border-[var(--primary)] text-slate-800 dark:text-slate-100 transition-all duration-300 placeholder:text-slate-400 font-semibold shadow-inner relative z-10"
                  />
                  <AnimatePresence>
                    {input.trim() ? (
                      <motion.button
                        initial={{ scale: 0, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0, rotate: 45 }}
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-2 bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] text-white rounded-[14px] transition-transform duration-200 hover:scale-105 shrink-0 flex items-center justify-center w-[40px] h-[40px] shadow-md z-20 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
                        aria-label="Send message"
                      >
                        <Send className="w-[18px] h-[18px] ml-[2px]" />
                      </motion.button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-5 z-20"
                      >
                        <Sparkles className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <Info className="w-3 h-3 text-slate-400" />
                  <p className="text-[11px] font-medium text-slate-400 leading-none">
                    AI responses are generated from Kangra heritage documentation
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

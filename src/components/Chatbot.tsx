'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, Sparkles, User, Info
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

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Welcome to KangraVerse.\n\nI can help you explore sacred landscapes, traditional ecological knowledge, and cultural heritage." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

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

  return (
    <div className="fixed bottom-4 right-4 md:bottom-[32px] md:right-[32px] z-[45] flex flex-col items-end justify-end pointer-events-none">
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setIsOpen(true)}
            className="p-4 bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] text-white rounded-[24px] shadow-2xl hover:shadow-[var(--primary)]/30 transition-all flex items-center justify-center group border border-white/20 relative z-[45] pointer-events-auto"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
            className="pointer-events-auto z-[70] w-[calc(100vw-48px)] md:w-[420px] h-full max-h-[650px] flex-1 min-h-[400px] flex flex-col glass-panel backdrop-blur-3xl bg-white/80 dark:bg-slate-900/80 border border-white/60 dark:border-slate-700/50 rounded-2xl md:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 shrink-0 border-b border-white/30 dark:border-slate-700/30 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-[14px] bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white shadow-lg shadow-[var(--primary)]/20 border border-white/20">
                  <Sparkles className="w-5 h-5" />
                  <div className="absolute -bottom-1 -right-1 w-[12px] h-[12px] bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-[800] text-slate-800 dark:text-slate-100 text-[15px] leading-tight flex items-center gap-1.5">
                    Intelligence <Sparkles className="w-3 h-3 text-[var(--primary)]" />
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">Always ready to assist</span>
                </div>
              </div>
              <div className="flex gap-[4px] shrink-0 self-start">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-500 dark:text-slate-300 rounded-full transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
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
                        "max-w-[88%] p-4 text-[14px] leading-relaxed relative group",
                        msg.role === 'user' 
                          ? "bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white rounded-[24px] rounded-br-[8px] shadow-md shadow-[var(--primary)]/20 border border-white/10" 
                          : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-slate-100 rounded-[24px] rounded-bl-[8px] shadow-sm whitespace-pre-wrap border border-white/50 dark:border-slate-600/50"
                      )}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading / Thinking Indicator */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex justify-start items-center gap-2"
                  >
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-4 rounded-[24px] rounded-bl-[8px] shadow-sm border border-white/50 dark:border-slate-600/50 flex items-center gap-1.5 h-[52px]">
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        className="w-2 h-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
                        transition={{ duration: 1, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-2 h-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
                        transition={{ duration: 1, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-2 h-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                      />
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
                      className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full hover:bg-[var(--primary)] hover:text-white transition-all duration-300 shadow-sm border border-white/60 dark:border-slate-600/50 text-slate-700 dark:text-slate-300 group"
                    >
                      <span className="text-sm">{prompt.icon}</span>
                      <span className="text-[12px] font-semibold">{prompt.text.replace(/^[^\w\s]+\s/, '')}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
              
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area */}
            <div className="px-5 pb-5 pt-3 shrink-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-t border-white/40 dark:border-slate-700/50 z-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div className="relative flex items-center group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-[24px] opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 blur-md"></div>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Intelligence..."
                    className="w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/60 dark:border-slate-600/50 rounded-[24px] pl-5 pr-14 h-[56px] text-[14px] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] text-slate-800 dark:text-slate-100 transition-all duration-300 placeholder:text-slate-400 font-medium shadow-inner relative z-10"
                  />
                  <AnimatePresence>
                    {input.trim() ? (
                      <motion.button
                        initial={{ scale: 0, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0, rotate: 45 }}
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-2 bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] text-white rounded-full transition-transform duration-200 hover:scale-105 shrink-0 flex items-center justify-center w-10 h-10 shadow-md z-20 disabled:opacity-50"
                      >
                        <Send className="w-[16px] h-[16px] ml-[2px]" />
                      </motion.button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-4 z-20"
                      >
                        <Sparkles className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <Info className="w-3 h-3 text-slate-400" />
                  <p className="text-[10px] font-medium text-slate-400 leading-none">
                    AI responses are generated from Kangra heritage documentation
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

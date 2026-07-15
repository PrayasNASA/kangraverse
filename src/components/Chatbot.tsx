'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, Compass, Sparkles, Settings
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const SUGGESTED_PROMPTS = [
  { text: "🏛 Tell me about Chamunda Temple" },
  { text: "🌳 Explain Sacred Groves" },
  { text: "📚 Research Findings" },
  { text: "🧭 Pilgrimage Routes" },
  { text: "🎤 Community Interviews" },
  { text: "🌱 Conservation Strategy" },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Welcome to KangraVerse.\n\nI can help you explore sacred landscapes, temples, monasteries, traditional ecological knowledge, community interviews, conservation research and cultural heritage." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
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
      setMessages((prev) => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please make sure the AI service is configured correctly.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-[20px] md:bottom-[48px] right-[16px] md:right-[48px] z-[9999] p-[16px] bg-[#5B4CF0] text-white rounded-full shadow-[0_20px_60px_rgba(15,23,42,0.08)] hover:bg-[#4F46E5] transition-colors flex items-center justify-center group"
          >
            <Sparkles className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-0 md:bottom-[96px] right-0 md:right-[48px] z-[9999] w-full md:w-[360px] h-[80vh] md:h-auto md:max-h-[700px] flex flex-col bg-[rgba(255,255,255,0.90)] backdrop-blur-[24px] rounded-t-[30px] md:rounded-[30px] shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-[rgba(255,255,255,0.7)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-[24px] shrink-0 border-b border-[#ECEEF5]/50">
              <div className="flex items-center gap-[16px]">
                <div className="relative w-[48px] h-[48px] rounded-full bg-gradient-to-tr from-[#5B4CF0] to-[#8B5CF6] flex items-center justify-center text-white shadow-md">
                  <Compass className="w-6 h-6" />
                  <div className="absolute bottom-0 right-0 w-[12px] h-[12px] bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-[700] text-[#111827] text-[18px] leading-tight">KangraVerse Research Assistant</h3>
                  <span className="text-[13px] text-[#6B7280] mt-[4px] leading-tight">Powered by Field Research & Heritage Knowledge</span>
                </div>
              </div>
              <div className="flex gap-[4px] shrink-0 self-start">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-[8px] hover:bg-[#FAFBFC] text-[#6B7280] rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-[24px] py-[24px] custom-scrollbar flex flex-col gap-[20px]">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={twMerge(
                      "max-w-[85%] p-[16px] text-[16px] leading-[1.7]",
                      msg.role === 'user' 
                        ? "bg-[#5B4CF0] text-white rounded-[20px] rounded-br-[4px] shadow-sm" 
                        : "bg-white text-[#111827] border border-[#ECEEF5] rounded-[20px] rounded-bl-[4px] shadow-sm whitespace-pre-wrap"
                    )}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {messages.length === 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-[4px]"
                >
                  <div className="grid grid-cols-2 gap-[8px]">
                    {SUGGESTED_PROMPTS.map((prompt, idx) => (
                      <motion.button
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 + (idx * 0.05) }}
                        key={idx}
                        onClick={() => sendMessage(prompt.text)}
                        className="flex items-center gap-[8px] px-[12px] py-[10px] bg-white border border-[#ECEEF5] rounded-full hover:bg-[#F5F3FF] hover:-translate-y-[2px] transition-all duration-200 shadow-sm text-left"
                      >
                        <span className="text-[12px] font-[500] text-[#111827] truncate leading-none">{prompt.text}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-[16px] rounded-[20px] rounded-bl-[4px] border border-[#ECEEF5] shadow-sm flex gap-[4px]">
                    <span className="w-2 h-2 bg-[#5B4CF0]/40 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-[#5B4CF0]/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-[#5B4CF0]/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-[24px] pb-[24px] pt-[16px] shrink-0 border-t border-[#ECEEF5]/50 bg-[rgba(255,255,255,0.5)]">
              <form onSubmit={handleSubmit} className="flex flex-col gap-[12px]">
                <div className="relative flex items-center">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about sacred landscapes..."
                    className="w-full bg-white border border-[#ECEEF5] rounded-[18px] pl-[20px] pr-[56px] h-[56px] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#5B4CF0]/20 focus:border-[#5B4CF0]/30 text-[#111827] transition-all duration-200 placeholder:text-[#94A3B8] shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-[8px] bg-[#5B4CF0] disabled:opacity-50 text-white rounded-full transition-transform duration-200 hover:scale-105 shrink-0 flex items-center justify-center w-[40px] h-[40px]"
                  >
                    <Send className="w-[18px] h-[18px] ml-[2px]" />
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-[12px] text-[#94A3B8] leading-snug">
                    AI responses are generated from field surveys, GIS data and heritage documentation.
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

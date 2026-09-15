"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  X, 
  RotateCcw, 
  Copy, 
  Check, 
  Plane, 
  Building2, 
  Tag, 
  Compass, 
  ArrowRight
} from 'lucide-react';
import { chatWithAgentStream, ChatMessage } from '../services/gemini';
import { useToast } from '../context/ToastContext';

// Quick starter prompt suggestions (constant hoisted)
const QUICK_PROMPTS = [
  {
    icon: <Plane className="w-4 h-4 text-[#E8A11A]" />,
    label: 'Cheapest Flights',
    prompt: 'Find cheapest flights to Goa this weekend with best fare guarantee.'
  },
  {
    icon: <Building2 className="w-4 h-4 text-emerald-400" />,
    label: 'Luxury Hotels',
    prompt: '5-star hotels in Dubai under ₹10,000 per night with free breakfast.'
  },
  {
    icon: <Tag className="w-4 h-4 text-orange-400" />,
    label: 'Offline Discounts',
    prompt: 'What are the exclusive offline promo codes and secret deals available today?'
  },
  {
    icon: <Compass className="w-4 h-4 text-sky-400" />,
    label: 'Itinerary Planner',
    prompt: 'Plan a 4-day budget-friendly itinerary for Bali with must-visit places.'
  }
];

// Contextual mini chips above input (constant hoisted)
const FOLLOW_UP_CHIPS = [
  '⚡ Non-stop flights only',
  '🏨 Free cancellation stays',
  '📞 Offline hotline booking',
  '🧳 Baggage allowance rule'
];

// Fast regex constants
const BOLD_REGEX = /(\*\*.*?\*\*)/g;
const NUM_LIST_REGEX = /^(\d+)\.\s+(.*)/;
const FLIGHT_ROUTE_REGEX = /(?:flight[s]?\s+(?:from|to|between)?\s*([A-Za-z\s]+?)\s+(?:to|->|—)\s+([A-Za-z\s]+))/i;

// Helper to render bold spans
const renderFormattedLine = (str: string) => {
  const parts = str.split(BOLD_REGEX);
  return parts.map((part, partIdx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={partIdx} className="font-bold text-slate-900 dark:text-[#F4B63A]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

/**
 * Memoized Message Formatter:
 * Prevents re-parsing markdown & regex for existing messages when new tokens stream in
 */
const FormattedMessage: React.FC<{ 
  content: string; 
  isStreaming?: boolean;
  onQuickSearch?: (query: string) => void;
}> = React.memo(({ content, isStreaming, onQuickSearch }) => {
  if (!content && isStreaming) {
    return (
      <span className="inline-flex items-center gap-2 py-1">
        <span className="w-2 h-2 rounded-full bg-[#E8A11A] animate-ping" />
        <span className="text-xs text-slate-400 font-medium">Checking live fares & availability...</span>
      </span>
    );
  }

  const flightRouteMatch = useMemo(() => {
    if (isStreaming || !content) return null;
    return content.match(FLIGHT_ROUTE_REGEX);
  }, [content, isStreaming]);

  const parsedLines = useMemo(() => {
    return content.split('\n');
  }, [content]);

  return (
    <div className="space-y-2 leading-relaxed">
      {parsedLines.map((line, lineIdx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        // Numbered list item (e.g. 1. or 2.)
        const numMatch = trimmed.match(NUM_LIST_REGEX);
        if (numMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 text-xs sm:text-sm pl-1">
              <span className="font-bold text-[#E8A11A] shrink-0 text-[11px] px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                {numMatch[1]}
              </span>
              <span className="flex-grow">{renderFormattedLine(numMatch[2])}</span>
            </div>
          );
        }

        // Bullet point (e.g. * or -)
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 text-xs sm:text-sm pl-2">
              <span className="text-[#E8A11A] shrink-0 font-bold">•</span>
              <span className="flex-grow">{renderFormattedLine(trimmed.slice(2))}</span>
            </div>
          );
        }

        return (
          <p key={lineIdx} className="text-xs sm:text-sm">
            {renderFormattedLine(trimmed)}
          </p>
        );
      })}

      {/* Interactive Mini Flight Card if route detected */}
      {flightRouteMatch && onQuickSearch && !isStreaming && (
        <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 text-white border border-[#E8A11A]/30 shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#E8A11A] bg-amber-500/10 px-2 py-0.5 rounded-full border border-[#E8A11A]/20">
              <Plane className="w-3 h-3" />
              <span>Live Fare Search</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">Best Price Guaranteed</span>
          </div>

          <div className="flex items-center justify-between text-xs font-bold mb-2.5">
            <span className="truncate max-w-[100px]">{flightRouteMatch[1].trim()}</span>
            <div className="flex items-center gap-1 text-[#E8A11A]">
              <div className="w-8 border-t border-dashed border-[#E8A11A]/40" />
              <Plane className="w-3 h-3 rotate-90" />
              <div className="w-8 border-t border-dashed border-[#E8A11A]/40" />
            </div>
            <span className="truncate max-w-[100px] text-right">{flightRouteMatch[2].trim()}</span>
          </div>

          <button
            onClick={() => onQuickSearch(`Search flights from ${flightRouteMatch[1].trim()} to ${flightRouteMatch[2].trim()}`)}
            className="w-full py-1.5 bg-gradient-to-r from-[#D8900A] to-[#F4B63A] hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Compare Live Fares</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Pulsing Streaming Cursor */}
      {isStreaming && (
        <span className="inline-block w-2 h-4 ml-1 bg-[#E8A11A] rounded-xs animate-pulse align-middle" />
      )}
    </div>
  );
});

FormattedMessage.displayName = 'FormattedMessage';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const sendQuery = useCallback(async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setQuery('');
    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    
    setMessages(prev => [...prev, userMsg, { role: 'model', text: '' }]);
    setIsLoading(true);

    try {
      await chatWithAgentStream(messages, textToSend, (_delta, accumulated) => {
        setMessages(prev => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'model', text: accumulated };
          return updated;
        });
      });
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'model',
          text: 'I had a moment of turbulence connecting to our travel engine. Please try asking again!'
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);

  const handleAsk = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(query);
  }, [query, sendQuery]);

  const clearChat = useCallback(() => {
    setMessages([]);
    showToast('Conversation cleared', 'info', 2000);
  }, [showToast]);

  const copyMessage = useCallback((text: string, idx: number) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      showToast('Copied to clipboard!', 'success', 2000);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  }, [showToast]);

  return (
    <div className="fixed bottom-6 right-6 z-[60] select-none">
      {/* Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="absolute bottom-20 right-0 w-[calc(100vw-2.5rem)] sm:w-96 md:w-[420px] bg-white dark:bg-slate-900 rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.35)] border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#0B132B] p-4 text-white flex items-center justify-between border-b border-[#E8A11A]/25 relative overflow-hidden">
              {/* Subtle Ambient Header Glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#E8A11A]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                {/* Glowing Orb Mini Avatar */}
                <div className="relative w-10 h-10 rounded-2xl p-[1.5px] bg-gradient-to-tr from-[#B27305] via-[#E8A11A] to-[#FDECC3] shadow-[0_0_16px_rgba(232,161,26,0.4)]">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#E8A11A] animate-pulse" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-white tracking-tight">Tour Concierge AI</span>
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#E8A11A]/20 text-[#E8A11A] border border-[#E8A11A]/30">
                      PRO MAX ⚡
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Real-time Flights & Hotel Intel</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 relative z-10">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    title="Clear conversation"
                    className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Clear Chat"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div
              ref={scrollRef}
              className="flex-grow p-4 max-h-[60vh] sm:max-h-[400px] overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950/70 space-y-4 transition-colors duration-300"
            >
              {messages.length === 0 ? (
                <div className="text-center py-4 px-1">
                  {/* Floating AI Welcome Orb */}
                  <div className="relative w-14 h-14 mx-auto mb-3">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#B27305] to-[#F4B63A] opacity-30 blur-md animate-pulse" />
                    <div className="relative w-full h-full rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-950 border border-[#E8A11A]/40 flex items-center justify-center text-[#E8A11A] shadow-md">
                      <Sparkles className="w-7 h-7 animate-bounce" />
                    </div>
                  </div>

                  <h4 className="font-black text-slate-900 dark:text-white text-base tracking-tight mb-1">
                    Your 24/7 Smart Travel Copilot
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-xs mx-auto mb-5 font-medium">
                    Ask me for instant flight fare comparisons, hotel recommendations, or secret offline promo codes.
                  </p>

                  {/* Interactive Quick Starter Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                    {QUICK_PROMPTS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendQuery(item.prompt)}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#E8A11A] dark:hover:border-[#E8A11A] hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-start gap-2.5 group cursor-pointer"
                      >
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 shrink-0 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-[#E8A11A] transition-colors truncate">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug font-medium">
                            {item.prompt}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  const isLastModel = !isUser && idx === messages.length - 1;

                  return (
                    <div
                      key={idx}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group/msg relative`}
                    >
                      <div
                        className={`max-w-[88%] p-3.5 rounded-2xl ${
                          isUser
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-br-xs shadow-md shadow-blue-500/20'
                            : 'bg-white dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 shadow-sm rounded-bl-xs'
                        }`}
                      >
                        {isUser ? (
                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                            {msg.text}
                          </p>
                        ) : (
                          <FormattedMessage
                            content={msg.text}
                            isStreaming={isLoading && isLastModel}
                            onQuickSearch={sendQuery}
                          />
                        )}

                        {/* Actions bar on model message */}
                        {!isUser && msg.text && !isLoading && (
                          <div className="mt-2.5 pt-1.5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between opacity-80 group-hover/msg:opacity-100 transition-opacity">
                            <span className="text-[10px] text-slate-400 font-medium">Tour Helpdesk AI</span>
                            <button
                              onClick={() => copyMessage(msg.text, idx)}
                              className="text-[10px] text-slate-400 hover:text-[#E8A11A] flex items-center gap-1 font-bold transition-colors cursor-pointer"
                            >
                              {copiedIdx === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Contextual Follow-up Chips Carousel */}
            {messages.length > 0 && !isLoading && (
              <div className="px-3 py-1.5 bg-slate-100/80 dark:bg-slate-900/90 border-t border-slate-200/50 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {FOLLOW_UP_CHIPS.map((chip, chipIdx) => (
                  <button
                    key={chipIdx}
                    onClick={() => sendQuery(chip)}
                    className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#E8A11A] hover:text-[#E8A11A] transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Footer Form Input */}
            <form
              onSubmit={handleAsk}
              className="p-3 border-t border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/95"
            >
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask about flights, hotels, promo codes..."
                  className="w-full pl-4 pr-11 py-2.5 bg-slate-100 dark:bg-slate-800/90 rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#E8A11A] transition-all text-slate-900 dark:text-white placeholder-slate-400 font-medium"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="absolute right-1.5 w-8 h-8 bg-gradient-to-tr from-[#D8900A] to-[#F4B63A] hover:brightness-110 text-slate-950 font-bold rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-md shadow-amber-500/25 cursor-pointer disabled:opacity-40 disabled:scale-100"
                  aria-label="Send Message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Glowing Pulse Glass Orb Avatar Button */}
      <div className="relative flex items-center gap-3">
        {/* Desktop Tooltip Pill */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/90 dark:bg-slate-900/90 text-white border border-[#E8A11A]/40 shadow-2xl backdrop-blur-xl"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-200">
                Ask <span className="text-[#E8A11A] font-black">Tour AI</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-15 h-15 rounded-full p-[2px] cursor-pointer group flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95"
          aria-label="Toggle Tour AI Concierge"
        >
          {/* Layer 1: Ambient Background Soft Glow Pulse */}
          <span className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[#E8A11A] to-[#F4B63A] opacity-40 blur-lg animate-pulse pointer-events-none group-hover:opacity-75 transition-opacity" />

          {/* Layer 2: Expanding Radar Ping Wave */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-[#E8A11A] opacity-30 animate-ping pointer-events-none duration-1000" />
          )}

          {/* Layer 3: Glass Orb Container with Luxury Gold Border */}
          <div className="relative w-full h-full rounded-full p-[2px] bg-gradient-to-tr from-[#B27305] via-[#E8A11A] to-[#FDECC3] shadow-[0_10px_35px_rgba(232,161,26,0.5)] overflow-hidden">
            {/* Inner Obsidian Dark Glass Surface */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-950 via-[#0B132B] to-slate-950 flex items-center justify-center relative overflow-hidden backdrop-blur-md">
              {/* 3D Specular Highlight Sheen */}
              <div className="absolute top-0 left-1/4 w-8 h-4 bg-white/20 rounded-full blur-[2px] transform -rotate-12 pointer-events-none" />

              {isOpen ? (
                <X className="w-6 h-6 text-[#E8A11A] transition-transform duration-200 group-hover:rotate-90" />
              ) : (
                <div className="relative flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-[#E8A11A] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />

                  {/* Online Live Indicator Dot */}
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full ring-2 ring-slate-950 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
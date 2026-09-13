"use client";

import React, { useState, useRef, useEffect } from 'react';
import { chatWithAgentStream, ChatMessage } from '../services/gemini';
import { useToast } from '../context/ToastContext';

// Helper component to render clean markdown with styled bold and lists
const FormattedMessage: React.FC<{ content: string; isStreaming?: boolean }> = ({ content, isStreaming }) => {
  if (!content && isStreaming) {
    return (
      <span className="inline-flex items-center gap-1.5 py-1">
        <span className="w-2 h-2 rounded-full bg-[#E8A11A] animate-ping"></span>
        <span className="text-xs text-slate-400">Thinking...</span>
      </span>
    );
  }

  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Parse bold text like **something**
        const renderFormattedLine = (str: string) => {
          const parts = str.split(/(\*\*.*?\*\*)/g);
          return parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} className="font-bold text-slate-900 dark:text-amber-300">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });
        };

        // Numbered list item (e.g. 1. or 2.)
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 text-xs sm:text-sm pl-1">
              <span className="font-bold text-[#E8A11A] shrink-0 text-xs px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
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
      {isStreaming && (
        <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#E8A11A] animate-pulse align-middle" />
      )}
    </div>
  );
};

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendQuery = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setQuery('');
    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    const nextHistory = [...messages, userMsg];
    
    // Add user message and temporary empty model message for streaming
    setMessages([...nextHistory, { role: 'model', text: '' }]);
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
    } catch (err: any) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'model',
          text: 'Sorry, I had trouble connecting. Please try again in a moment.'
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendQuery(query);
  };

  const clearChat = () => {
    setMessages([]);
    showToast('Conversation cleared', 'info', 2000);
  };

  const copyMessage = (text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!', 'success', 2000);
    }
  };

  const QUICK_QUESTIONS = [
    { icon: '✈️', label: 'Cheap Flights & Fares', prompt: 'Find me cheap flight deals and unpublished offline discounts for my journey.' },
    { icon: '🏨', label: 'Luxury & Budget Hotels', prompt: 'Recommend top luxury hotels and budget stays with free breakfast and best prices.' },
    { icon: '🚌', label: 'Bus & City Transfers', prompt: 'How do I book intercity bus tickets and airport transfers at lowest rates?' },
    { icon: '🏷️', label: 'Secret Offline Discounts', prompt: 'What are the exclusive offline promo codes and special deals available today?' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[60] select-none">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[calc(100vw-3rem)] sm:w-88 md:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 text-white flex items-center justify-between border-b border-[#E8A11A]/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B27305] via-[#E8A11A] to-[#FDECC3] p-[1.5px] shadow-[0_0_12px_rgba(232,161,26,0.4)]">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#E8A11A] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.2 7.8L20 10L14.2 12.2L12 18L9.8 12.2L4 10L9.8 7.8L12 2Z" />
                    <path d="M19 16L20.1 18.9L23 20L20.1 21.1L19 24L17.9 21.1L15 20L17.9 18.9L19 16Z" opacity="0.8" />
                    <path d="M5 4L5.8 6.2L8 7L5.8 7.8L5 10L4.2 7.8L2 7L4.2 6.2L5 4Z" opacity="0.8" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-white tracking-tight">Tour Helpdesk AI</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#E8A11A]/20 text-[#E8A11A] border border-[#E8A11A]/30">LIVE ⚡</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">ChatGPT-Powered Travel Copilot</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  title="Clear conversation"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Clear Chat"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div ref={scrollRef} className="flex-grow p-4 max-h-[60vh] sm:max-h-[380px] overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950/60 space-y-4 transition-colors duration-300">
            {messages.length === 0 ? (
              <div className="text-center py-4 px-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B27305]/20 via-[#E8A11A]/20 to-amber-200/20 border border-[#E8A11A]/30 flex items-center justify-center mx-auto text-[#E8A11A] mb-3 shadow-sm">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.2 7.8L20 10L14.2 12.2L12 18L9.8 12.2L4 10L9.8 7.8L12 2Z" />
                    <path d="M19 16L20.1 18.9L23 20L20.1 21.1L19 24L17.9 21.1L15 20L17.9 18.9L19 16Z" opacity="0.8" />
                  </svg>
                </div>
                <h4 className="font-extrabold text-slate-800 dark:text-white text-sm mb-1">Hi! Where would you like to travel?</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-xs mx-auto mb-4">
                  Select a quick topic or ask anything about flights, hotels, and discounts:
                </p>

                {/* Interactive Starter Question Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                  {QUICK_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendQuery(q.prompt)}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-[#E8A11A] dark:hover:border-[#E8A11A] hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center gap-2 group cursor-pointer"
                    >
                      <span className="text-base shrink-0 group-hover:scale-110 transition-transform">{q.icon}</span>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#E8A11A] transition-colors line-clamp-1 leading-snug">
                        {q.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                const isLastModel = !isUser && idx === messages.length - 1;

                return (
                  <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} group/msg relative`}>
                    <div className={`max-w-[88%] p-3.5 rounded-2xl ${
                      isUser 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none shadow-md shadow-blue-500/20' 
                        : 'bg-white dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 shadow-sm rounded-bl-none'
                    }`}>
                      {isUser ? (
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        <FormattedMessage content={msg.text} isStreaming={isLoading && isLastModel} />
                      )}

                      {/* Copy action on hover for model replies */}
                      {!isUser && msg.text && !isLoading && (
                        <div className="mt-2 pt-1 border-t border-slate-100 dark:border-slate-700/50 flex justify-end opacity-0 group-hover/msg:opacity-100 transition-opacity">
                          <button
                            onClick={() => copyMessage(msg.text)}
                            className="text-[10px] text-slate-400 hover:text-[#E8A11A] flex items-center gap-1 font-medium transition-colors cursor-pointer"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Input */}
          <form onSubmit={handleAsk} className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Type your message..."
                className="w-full pl-4 pr-11 py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-full text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#E8A11A] transition-all text-slate-900 dark:text-white placeholder-slate-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={isLoading || !query.trim()}
                className="absolute right-1.5 w-8 h-8 bg-gradient-to-tr from-[#D8900A] to-[#F4B63A] text-slate-950 font-bold rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-40 disabled:scale-100"
                aria-label="Send Message"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Animated Golden AI Button */}
      <div className="relative flex items-center gap-2.5">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/90 text-white border border-[#E8A11A]/40 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-right-2 duration-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold text-slate-100">Ask <span className="text-[#E8A11A]">Tour AI</span></span>
          </div>
        )}

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#B27305] via-[#E8A11A] to-[#FDECC3] shadow-[0_6px_24px_rgba(232,161,26,0.45)] hover:shadow-[0_8px_32px_rgba(232,161,26,0.7)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group flex items-center justify-center"
          aria-label="Toggle Tour Helpdesk AI Assistant"
        >
          {/* Ambient Glow Pulse Ring */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-[#E8A11A] animate-ping opacity-25 pointer-events-none"></span>
          )}

          {/* Inner Dark Surface with Golden Icon */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center relative overflow-hidden">
            {isOpen ? (
              <svg className="w-6 h-6 text-[#E8A11A] transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <div className="relative flex items-center justify-center">
                <svg className="w-7 h-7 text-[#E8A11A] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L14.2 7.8L20 10L14.2 12.2L12 18L9.8 12.2L4 10L9.8 7.8L12 2Z" />
                  <path d="M19 15L19.9 17.4L22.5 18.2L19.9 19.1L19 21.5L18.1 19.1L15.5 18.2L18.1 17.4L19 15Z" opacity="0.9" />
                  <path d="M5 3.5L5.7 5.3L7.5 6L5.7 6.7L5 8.5L4.3 6.7L2.5 6L4.3 5.3L5 3.5Z" opacity="0.9" />
                </svg>

                {/* Golden notification dot */}
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full ring-2 ring-slate-950 animate-pulse"></span>
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
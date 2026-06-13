import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askTravelAssistant } from '../services/ai';
import { useAuth } from '../context/AuthContext';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const AIAssistantBubble: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hey explorer! ✈️ I am your TravelVerse AI Assistant. Ask me for destination tips, packing lists, or budgeting advice!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(() => {
      const responseText = askTravelAssistant(textToSend);
      const botMsg: Message = {
        sender: 'bot',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickQuestion = (q: string) => {
    handleSendMessage(q);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: 'spring', damping: 20 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] rounded-2xl border border-white/10 dark:border-white/5 bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
          >
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-orange-500 to-sky-500 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 animate-bounce" />
                <div>
                  <h3 className="font-bold text-sm">TravelVerse Co-Pilot</h3>
                  <span className="text-[10px] text-white/80">AI Core Active</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close Assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 no-scrollbar">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`p-1.5 rounded-full shrink-0 ${msg.sender === 'user' ? 'bg-orange-500 text-white' : 'bg-sky-500 text-white'}`}>
                      {msg.sender === 'user' ? (
                        user ? (
                          <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full object-cover" />
                        ) : (
                          <User className="h-4 w-4" />
                        )
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-orange-500 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <div className="p-1.5 rounded-full shrink-0 bg-sky-500 text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-slate-100 dark:bg-white/5 rounded-xl px-3 py-2 text-xs rounded-tl-none flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Chips */}
            <div className="px-4 py-2 bg-slate-50/50 dark:bg-black/10 border-t border-slate-100 dark:border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <button
                onClick={() => handleQuickQuestion('Recommend Destinations')}
                className="px-2 py-1 rounded-full border border-slate-200 dark:border-white/5 text-[10px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-orange-500 dark:hover:border-orange-400 shrink-0"
              >
                🏝️ Suggest Spots
              </button>
              <button
                onClick={() => handleQuickQuestion('What should I pack?')}
                className="px-2 py-1 rounded-full border border-slate-200 dark:border-white/5 text-[10px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-orange-500 dark:hover:border-orange-400 shrink-0"
              >
                🎒 Packing List
              </button>
              <button
                onClick={() => handleQuickQuestion('How to save money?')}
                className="px-2 py-1 rounded-full border border-slate-200 dark:border-white/5 text-[10px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-orange-500 dark:hover:border-orange-400 shrink-0"
              >
                💰 Budget Tips
              </button>
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 border-t border-slate-100 dark:border-white/5 flex gap-2 items-center bg-white dark:bg-slate-900"
            >
              <input
                type="text"
                placeholder="Ask travel pilot..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-sky-500 rounded-lg px-3 py-2 text-xs focus:outline-none text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-orange-500 text-white hover:opacity-90 shrink-0"
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glow-effect flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-orange-500 to-sky-500 text-white shadow-xl hover:scale-105 transition-all"
        aria-label="Toggle Travel Copilot"
      >
        <Sparkles className="h-6 w-6 animate-pulse" />
      </button>
    </div>
  );
};

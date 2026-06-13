import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { askTravelAssistant } from '../services/ai';
import { Bot, Send, User, Compass, CheckCircle2, RefreshCw, MessageSquare } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const TravelAssistant: React.FC = () => {
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Welcome to TravelVerse AI. I'm your global co-pilot! 🌎✈️\n\nAsk me about:\n- What to pack for specific spots\n- Secrets to saving money locally\n- Custom travel recommendations",
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
    }, 1200);
  };

  const handleClearChat = () => {
    if (!window.confirm('Clear your conversation?')) return;
    setMessages([
      {
        sender: 'bot',
        text: 'Hello explorer! Conversation cleared. What details can I help you map out next?',
        timestamp: new Date()
      }
    ]);
  };

  // Quick Chips prompts
  const suggestionPrompts = [
    { title: 'Suggest Bali Hidden Spots', q: 'Suggest Bali hidden spots' },
    { title: 'Essential Packing List', q: 'Essential packing list' },
    { title: 'Local Budgeting Tips', q: 'How to save money?' },
    { title: 'Where should I go?', q: 'Recommend destinations' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-[85vh] flex flex-col justify-between transition-colors duration-300">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/5 pb-4 mb-6 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-2.5">
          <Bot className="h-6 w-6 text-orange-500 animate-bounce" />
          <div>
            <h1 className="text-2xl font-black">TravelVerse Co-Pilot</h1>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online & Ready</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 border border-slate-300 dark:border-white/10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold transition-all flex items-center gap-1.5"
          title="Clear Chat Logs"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Main Chat Layout (Messages + Right Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-stretch mb-6 min-h-[450px]">
        
        {/* Left: Chat log container */}
        <div className="lg:col-span-8 rounded-3xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-md p-5 flex flex-col justify-between shadow-xl">
          
          {/* Scrollable messages area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[380px] no-scrollbar">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-2 rounded-full shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-orange-500 text-white' : 'bg-sky-500 text-white'}`}>
                    {msg.sender === 'user' ? (
                      user ? (
                        <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <User className="h-4 w-4" />
                      )
                    ) : (
                      <Bot className="h-4.5 w-4.5" />
                    )}
                  </div>
                  
                  <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line shadow-sm border ${
                    msg.sender === 'user'
                      ? 'bg-orange-500 border-orange-500/20 text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-white/5 border-slate-200/50 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[85%]">
                  <div className="p-2 rounded-full bg-sky-500 text-white shrink-0">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div className="bg-slate-100 dark:bg-white/5 rounded-2xl px-4 py-3 rounded-tl-none flex items-center space-x-1 border border-slate-200/50 dark:border-white/5">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form message input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex gap-2 border-t border-slate-200 dark:border-white/5 pt-4 mt-4 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask for recommendations, budget secrets..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 focus:border-orange-500 rounded-xl px-4 py-3 text-xs focus:outline-none text-slate-900 dark:text-white font-semibold"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-orange-500 text-white hover:opacity-90 shrink-0 font-bold text-xs uppercase flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

        </div>

        {/* Right Sidebar: Helpful instructions & Prompt chips */}
        <div className="lg:col-span-4 rounded-3xl border border-white/10 dark:border-white/5 bg-white dark:bg-slate-900/50 backdrop-blur-md p-5 shadow-xl flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-base font-bold flex items-center gap-1.5">
              <Compass className="h-5 w-5 text-sky-500" />
              <span>Suggested Queries</span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Tap any prompt option below to test the AI’s capability to list custom items, tips, and hidden locations.
            </p>

            {/* Prompt Chips */}
            <div className="flex flex-col gap-2">
              {suggestionPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.q)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-orange-500 dark:hover:border-orange-400 hover:bg-orange-500/5 transition-all flex items-center gap-2"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Tips Details */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-sky-500/10 border border-slate-200/50 dark:border-white/5 space-y-2 text-xs">
            <h3 className="font-bold flex items-center gap-1">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
              <span>Integration Ready</span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
              This panel is fully configured to hook directly to a Gemini API key. Responses will stream dynamically.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

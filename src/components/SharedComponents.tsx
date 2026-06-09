import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, 
  LogOut, 
  MessageSquare, 
  X, 
  Send, 
  Star, 
  Globe, 
  Bell, 
  Moon, 
  Sun,
  ChevronDown
} from 'lucide-react';

// --- HEADER COMPONENT ---
export const Header: React.FC = () => {
  const { currentUser, logout, theme, toggleTheme, currentScreen, setCurrentScreen, language, setLanguage, notifications, markAllNotificationsRead } = useApp();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState('Home');

  const menuItems = [
    { label: 'Home', screen: 'home' },
    { label: 'Bookings', screen: 'bookings' }, // maps to bookings history
    { label: 'Services', screen: 'home' },
    { label: 'Routes', screen: 'routes' },
    { label: 'Offers', screen: 'offers' }
  ];

  // Synchronize active menu tab with screen transitions
  useEffect(() => {
    if (currentScreen === 'home') {
      if (activeMenuTab !== 'Services') {
        setActiveMenuTab('Home');
      }
    } else if (currentScreen === 'bookings') {
      setActiveMenuTab('Bookings');
    } else if (currentScreen === 'routes') {
      setActiveMenuTab('Routes');
    } else if (currentScreen === 'offers') {
      setActiveMenuTab('Offers');
    } else {
      setActiveMenuTab('');
    }
  }, [currentScreen]);

  return (
    <header className="sticky top-0 z-40 w-full px-6 py-4 flex items-center justify-between border-b border-slate-200/40 bg-white/70 dark:bg-[#11131c]/70 backdrop-blur-md dark:border-slate-800/40 shadow-sm transition-all">
      {/* Logo */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentScreen('home')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0056fb] to-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/25 transition-transform hover:scale-105">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <span className="font-extrabold text-xl text-slate-805 dark:text-slate-200 tracking-tight">
          TravelConnect
        </span>
      </div>

      {/* Center Navigation Menu */}
      <nav className="hidden lg:flex items-center gap-7">
        {menuItems.map((item, idx) => {
          const isActive = activeMenuTab === item.label;
          return (
            <button
              key={idx}
              onClick={() => {
                setActiveMenuTab(item.label);
                if (item.label === 'Services') {
                  setCurrentScreen('home');
                  setTimeout(() => {
                    const el = document.getElementById('services-grid-section');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 150);
                } else {
                  setCurrentScreen(item.screen);
                }
              }}
              className={`text-sm font-semibold transition-all cursor-pointer relative pb-1.5 ${
                isActive 
                  ? 'text-[#0056fb] font-bold' 
                  : 'text-slate-600 hover:text-[#0056fb] dark:text-slate-350 dark:hover:text-white'
              }`}
            >
              {item.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0056fb] rounded-full animate-in fade-in duration-200" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Control Actions */}
      <div className="flex items-center gap-5">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Light/Dark Mode"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Language select (Matches globe icon + English/Hindi/Spanish select) */}
        <div className="flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">
          <Globe size={18} className="text-slate-550 shrink-0" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as 'en' | 'es' | 'hi')}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-transparent border-none outline-none focus:ring-0 cursor-pointer py-1 pl-1 pr-6"
          >
            <option value="en" className="dark:bg-[#151824] dark:text-white">English</option>
            <option value="hi" className="dark:bg-[#151824] dark:text-white">हिन्दी</option>
            <option value="es" className="dark:bg-[#151824] dark:text-white">Español</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotificationsDropdown(!showNotificationsDropdown);
              setShowProfileDropdown(false);
              if (!showNotificationsDropdown) {
                markAllNotificationsRead();
              }
            }}
            className="relative cursor-pointer p-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell size={18} />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-[8px] font-bold text-white flex items-center justify-center border border-white">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>

          {showNotificationsDropdown && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-2xl bg-white dark:bg-[#151824] border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 text-xs text-left animate-in fade-in zoom-in-95 duration-100">
              <div className="flex justify-between items-center pb-2 border-b border-slate-105 dark:border-slate-800 mb-2">
                <span className="font-extrabold text-slate-800 dark:text-slate-200">Notifications</span>
                <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold">{notifications.length} message(s)</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all">
                      <div className="flex justify-between items-start">
                        <span className={`font-bold text-[11px] ${
                          notif.type === 'success' ? 'text-emerald-500' :
                          notif.type === 'warning' ? 'text-amber-500' :
                          'text-blue-500'
                        }`}>{notif.title}</span>
                        <span className="text-[9px] text-slate-400">{notif.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-550 dark:text-slate-400 mt-0.5 leading-normal">{notif.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-400 py-4 font-semibold">No notifications yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar / Session Details */}
        {currentUser ? (
          <div className="relative">
            <button 
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown);
                setShowNotificationsDropdown(false);
              }}
              className="flex items-center gap-2.5 px-1 py-0.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-855 transition-colors"
            >
              <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
                  alt="Traveler avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden md:flex items-center gap-0.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                Hi, Traveler
                <ChevronDown size={12} className="text-slate-450" />
              </span>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2.5 w-44 rounded-2xl bg-white dark:bg-[#151824] border border-slate-100 dark:border-slate-800 shadow-2xl p-1.5 z-50 text-xs text-left animate-in fade-in zoom-in-95 duration-100">
                <button 
                  onClick={() => { setCurrentScreen('profile'); setShowProfileDropdown(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
                >
                  My Profile Settings
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                <button 
                  onClick={() => { logout(); setShowProfileDropdown(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold flex items-center gap-1.5"
                >
                  <LogOut size={13} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => setCurrentScreen('login')}
            className="px-4.5 py-2 rounded-xl bg-[#0056fb] hover:bg-[#0046d5] text-xs font-bold text-white shadow-md shadow-blue-500/10 transition-all cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

// --- FOOTER COMPONENT ---
export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/60 dark:border-slate-800/60 py-6 px-6 text-center text-xs text-slate-500">
      <p>© 2026 TravelConnect. All rights reserved. Made in India.</p>
    </footer>
  );
};

// --- FLOATING ROLE SWITCHER ---
export const RoleSwitcher: React.FC = () => {
  const { login, activeRole, currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const rolesList = [
    { role: 'customer' as const, label: 'Customer Persona', desc: 'Book rides, checkout, live tracking map', email: 'john@gmail.com' },
    { role: 'bus_operator' as const, label: 'Bus Operator', desc: 'Add routes & schedules, see bookings', email: 'ramesh@bus.com' },
    { role: 'cab_driver' as const, label: 'Cab Driver', desc: 'Accept bookings, update ride statuses', email: 'david@cab.com' },
    { role: 'admin' as const, label: 'Admin Controller', desc: 'Approve operators, view audit tickets', email: 'admin@travelconnect.com' }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {isOpen ? (
        <div className="w-72 rounded-2xl bg-white dark:bg-[#151824] border border-slate-200 dark:border-slate-800 shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              Persona Switcher
            </span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-200">
              <X size={14} />
            </button>
          </div>
          <div className="space-y-1.5">
            {rolesList.map((item) => {
              const isActive = activeRole === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => {
                    login(item.email, item.role);
                  }}
                  className={`w-full text-left p-2 rounded-xl transition-all border text-xs flex flex-col ${
                    isActive 
                      ? 'bg-blue-50 border-blue-200 text-[#0056fb] dark:bg-blue-950/20 dark:border-blue-800' 
                      : 'bg-slate-50 dark:bg-slate-900 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350'
                  }`}
                >
                  <span className="font-bold flex items-center gap-1">
                    {item.label}
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-850 dark:bg-[#0056fb] dark:hover:bg-[#0046d5] text-xs font-bold text-white shadow-xl hover:scale-105 transition-all"
        >
          Active Persona: <span className="text-blue-400 dark:text-white capitalize">{activeRole}</span>
        </button>
      )}
    </div>
  );
};

// --- AI TRAVEL ASSISTANT CHATBOT ---
export const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Hello! I am your TravelConnect AI Assistant. Ask me anything about routes, bus schedules, or local fares!' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputValue('');

    setTimeout(() => {
      let reply = "I can help search routing paths. Please type locations like Metro Central or International Airport.";
      const query = userMsg.toLowerCase();
      if (query.includes('bus')) {
        reply = "HRTC Volvo Sleeper and Zingbus run regular schedules on key state routes starting at ₹350.";
      } else if (query.includes('cheap')) {
        reply = "Trains are the most budget-friendly option, with tickets starting at ₹250 onwards.";
      } else if (query.includes('airport')) {
        reply = "Delhi Indira Gandhi International and Mumbai Chhatrapati Shivaji airports are active in the grid. Eco Cabs are available 24/7.";
      } else if (query.includes('sos')) {
        reply = "If you trigger the SOS button, we instantly broadcast coordinates to local police dispatcher services.";
      }
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-96 rounded-2xl glass-chat shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-200 overflow-hidden">
          <div className="flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-slate-800 bg-[#0056fb] text-white">
            <span className="font-bold text-xs">AI Travel Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X size={15} />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0056fb] text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200/40 dark:border-transparent'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-white/40 flex items-center gap-1.5">
            <input 
              type="text"
              placeholder="Ask about buses, fares, safety..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0056fb]"
            />
            <button 
              onClick={handleSendMessage}
              className="p-2.5 rounded-xl bg-[#0056fb] hover:bg-[#0046d5] text-white transition-colors cursor-pointer"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-[#0056fb] hover:bg-[#0046d5] text-white shadow-xl hover:scale-105 transition-all cursor-pointer"
        >
          <MessageSquare size={18} />
        </button>
      )}
    </div>
  );
};

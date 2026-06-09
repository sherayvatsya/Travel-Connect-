import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp, RouteOption, Location, Booking } from '../context/AppContext';
import { 
  Search, 
  MapPin, 
  Calendar, 
  ArrowRightLeft, 
  Bus, 
  Car, 
  Bike, 
  Info, 
  Navigation, 
  Phone, 
  AlertTriangle, 
  Share2, 
  CheckCircle, 
  Star, 
  CreditCard, 
  Compass,
  ChevronRight,
  Shield,
  Clock,
  Check,
  TrendingUp,
  History,
  Plane,
  Train,
  ChevronDown,
  Eye,
  EyeOff,
  User,
  Settings as SettingsIcon,
  HelpCircle,
  ShieldAlert,
  Sliders,
  DollarSign,
  Copy,
  Tag,
  Percent,
  Mail,
  Lock,
  Briefcase,
  FileText,
  Globe,
  Moon,
  Sun
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import travelConnectAuthBg from '../assets/travel_connect_auth_bg.png';

// --- MAIN WRAPPER FOR CUSTOMER FLOW ---
export const CustomerFlow: React.FC = () => {
  const { currentScreen } = useApp();
  
  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {currentScreen === 'splash' && <SplashScreen key="splash" />}
        {currentScreen === 'welcome' && <WelcomeScreen key="welcome" />}
        {currentScreen === 'login' && <LoginScreen key="login" />}
        {currentScreen === 'home' && <SearchHomeScreen key="home" />}
        {currentScreen === 'options' && <OptionsListScreen key="options" />}
        {currentScreen === 'details' && <BookingDetailsScreen key="details" />}
        {currentScreen === 'tracking' && <LiveTrackingScreen key="tracking" />}
        {currentScreen === 'completed' && <TripCompletedScreen key="completed" />}
        {currentScreen === 'profile' && <ProfileScreen key="profile" />}
        {currentScreen === 'bookings' && <BookingHistoryScreen key="bookings" />}
        {currentScreen === 'routes' && <RoutesNetworkScreen key="routes" />}
        {currentScreen === 'offers' && <OffersScreen key="offers" />}
      </AnimatePresence>
    </div>
  );
};

// --- SPLASH SCREEN ---
const SplashScreen: React.FC = () => {
  const { setCurrentScreen, t } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('welcome');
    }, 2500);
    return () => clearTimeout(timer);
  }, [setCurrentScreen]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col items-center justify-center min-h-[75vh] text-center relative overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 blur-[80px] rounded-full pointer-events-none -z-10" />

      {/* Animated logo logo container */}
      <div className="relative">
        <motion.div 
          initial={{ scale: 0.3, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.1 }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#0056fb] to-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-500/35 relative z-10"
        >
          T+
        </motion.div>
        
        {/* Pulsing rings around logo */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.3, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
          className="absolute inset-0 rounded-3xl border-2 border-blue-500/30 -z-10"
        />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0.4 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.5 }}
          className="absolute inset-0 rounded-3xl border border-indigo-500/20 -z-10"
        />
      </div>

      <motion.h1 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#0056fb] via-blue-600 to-indigo-600 bg-clip-text text-transparent mt-6"
      >
        TravelConnect
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-[10px] mt-2 text-slate-450 dark:text-slate-500 font-bold uppercase tracking-[0.2em] max-w-xs"
      >
        {t('splash_subtitle')}
      </motion.p>

      {/* Modern Loader indicator */}
      <div className="w-40 h-1 bg-slate-205 dark:bg-slate-800 rounded-full mt-8 overflow-hidden relative">
        <motion.div 
          initial={{ left: "-100%" }}
          animate={{ left: "100%" }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-[#0056fb] to-indigo-500 rounded-full"
        />
      </div>
    </motion.div>
  );
};

// --- WELCOME SCREEN ---
const WelcomeScreen: React.FC = () => {
  const { setCurrentScreen, login, t } = useApp();

  const containerVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        staggerChildren: 0.08,
        delayChildren: 0.15
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.25 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 15 } }
  };

  return (
    <div className="relative w-full min-h-[75vh] flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* Background dynamic gradient blobs */}
      <motion.div 
        animate={{ 
          x: [0, 40, -20, 0],
          y: [0, -40, 20, 0],
        }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        className="absolute w-72 h-72 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[50px] top-10 left-10 pointer-events-none -z-10"
      />
      <motion.div 
        animate={{ 
          x: [0, -30, 40, 0],
          y: [0, 30, -30, 0],
        }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        className="absolute w-80 h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[60px] bottom-10 right-10 pointer-events-none -z-10"
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="max-w-md w-full bg-white dark:bg-[#151824] p-8 rounded-[32px] text-center shadow-2xl shadow-blue-500/5 border border-slate-200/80 dark:border-slate-800 relative backdrop-blur-md"
      >
        {/* Decorative branding symbol */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0056fb] to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/25">
          T+
        </div>

        <motion.h2 
          variants={itemVariants} 
          className="text-2xl font-extrabold text-slate-805 dark:text-slate-100 mt-6"
        >
          {t('welcome')}
        </motion.h2>
        
        <motion.p 
          variants={itemVariants} 
          className="text-xs text-slate-450 dark:text-slate-400 mt-3 mb-8 leading-relaxed max-w-sm mx-auto"
        >
          Connecting passenger routing options for Buses, Cabs, Trains, Flights, and Autos in rural and semi-urban transportation networks.
        </motion.p>

        <div className="space-y-4">
          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => login('john@gmail.com', 'customer')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0056fb] to-indigo-600 hover:from-[#0046d5] hover:to-indigo-750 font-bold text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
          >
            <span>Customer Demo Log In</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </motion.button>

          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setCurrentScreen('login')}
            className="w-full py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-202 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
          >
            <User size={13} />
            <span>Log In / Create Account</span>
          </motion.button>

          <motion.div variants={itemVariants} className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
            <span className="relative px-3 bg-white dark:bg-[#151824] text-[10px] text-slate-400 font-bold">OR</span>
          </motion.div>

          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setCurrentScreen('home')}
            className="w-full py-3.5 rounded-2xl bg-transparent border border-dashed border-slate-300 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0056fb] hover:border-[#0056fb] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Compass size={13} />
            <span>Continue as Guest Explorer</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// --- FLOATING INPUT HELPER COMPONENT ---
interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
}

const FloatingInput: React.FC<FloatingInputProps> = ({ 
  label, 
  icon, 
  isPassword, 
  value, 
  onChange, 
  type = 'text', 
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const hasValue = value !== undefined && value !== null && value.toString().length > 0;
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative w-full">
      {/* Background glow on focus */}
      <div 
        className={`absolute inset-0 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/5 blur-md transition-opacity duration-300 pointer-events-none -z-10 ${
          isFocused ? 'opacity-100' : 'opacity-0'
        }`} 
      />
      
      {/* Input container */}
      <div 
        className={`relative flex items-center w-full rounded-2xl border transition-all duration-300 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm ${
          isFocused 
            ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/5' 
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700'
        }`}
      >
        {icon && (
          <div 
            className={`pl-4 flex items-center justify-center transition-colors duration-300 ${
              isFocused ? 'text-indigo-550 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {icon}
          </div>
        )}

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 pt-5.5 pb-1.5 text-xs text-slate-800 dark:text-slate-100 bg-transparent border-none focus:outline-none focus:ring-0 ${
            icon ? 'pl-2' : ''
          } ${isPassword ? 'pr-10' : ''}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-300 cursor-pointer"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>

      {/* Floating Label */}
      <label 
        className={`absolute transition-all duration-300 pointer-events-none text-xs origin-left ${
          isFocused || hasValue
            ? 'left-4 top-1 text-[10px] scale-90 text-indigo-600 dark:text-indigo-400 font-extrabold translate-y-0'
            : `${icon ? 'left-10' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-semibold`
        }`}
      >
        {label}
      </label>
    </div>
  );
};

// --- SPLIT-SCREEN AUTHENTICATION MODAL (LOGIN & SIGN UP) ---
const LoginScreen: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage, login, registerCustomer, registerProvider, setCurrentScreen, t } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [accountType, setAccountType] = useState<'traveler' | 'provider' | 'hotel' | 'tour'>('traveler');
  const [isProvider, setIsProvider] = useState(false);
  
  // Basic Fields
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Provider Fields (Transport Provider, Hotel Partner, Tour Operator)
  const [businessName, setBusinessName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<'cab' | 'bus' | 'auto' | 'bike'>('cab');
  const [vehicleNumber, setVehicleNumber] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showAppleModal, setShowAppleModal] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegister) {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match');
        return;
      }
      if (accountType !== 'traveler') {
        if (!fullName || !email || !phone || !businessName || !licenseNumber) {
          setErrorMsg('Please fill all mandatory partner fields');
          return;
        }
        const ok = registerProvider(
          fullName, 
          email, 
          phone, 
          businessName, 
          accountType === 'provider' ? vehicleType : 'cab', 
          accountType === 'provider' ? vehicleNumber : 'N/A', 
          licenseNumber
        );
        if (ok) setCurrentScreen('operator_dashboard');
        else setErrorMsg('Registration failed. Email might already exist.');
      } else {
        if (!fullName || !email || !phone) {
          setErrorMsg('Please fill all fields');
          return;
        }
        const ok = registerCustomer(fullName, email, phone, password);
        if (ok) setCurrentScreen('home');
        else setErrorMsg('Registration failed. Email might already exist.');
      }
    } else {
      const ok = login(email, accountType !== 'traveler' ? 'bus_operator' : 'customer');
      if (!ok) {
        // Automatically create account for ease of testing
        login(email, accountType !== 'traveler' ? 'bus_operator' : 'customer');
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full flex flex-col md:grid md:grid-rows-[1fr_auto] bg-[#f8fafc] dark:bg-[#0b1220] transition-colors duration-300 relative text-slate-800 dark:text-white"
    >
      {/* 2-Column Split Section */}
      <div className="md:grid md:grid-cols-[52%_48%] min-h-0 flex-1 relative">
        
        {/* Left Immersive Hero Column */}
        <div className="relative hidden md:flex flex-col justify-between p-12 text-white overflow-hidden min-h-[600px]">
          {/* Background image with parallax scale effect */}
          <motion.img 
            src={travelConnectAuthBg} 
            alt="Travel Hero Background"
            animate={{ scale: [1, 1.05, 1], y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          
          {/* Dark blue overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1b33]/95 via-[#0b1220]/85 to-[#1a103c]/95 mix-blend-multiply z-10" />

          {/* Floating route marker and animated route line */}
          <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
            <svg className="absolute top-[20%] right-[10%] w-[380px] h-[300px] opacity-40" viewBox="0 0 300 200" fill="none">
              <motion.path 
                d="M 20,150 Q 120,60 180,110 T 260,30" 
                stroke="rgba(255,255,255,0.3)" 
                strokeWidth="2" 
                strokeDasharray="6 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              />
              <circle cx="20" cy="150" r="4" fill="#3b82f6" />
              <circle cx="180" cy="110" r="4" fill="#a855f7" />
            </svg>
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute top-[18%] right-[16%] text-white drop-shadow-[0_4px_12px_rgba(37,99,235,0.4)]"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                <MapPin size={16} className="text-white fill-white/20" />
              </div>
            </motion.div>
          </div>

          {/* Brand Logo Header */}
          <div className="flex items-center gap-2.5 z-20 cursor-pointer" onClick={() => setCurrentScreen('home')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#6366F1] flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight">TravelConnect</span>
          </div>

          {/* Center heading and feature cards */}
          <div className="my-auto space-y-8 max-w-lg z-20 pr-6">
            <div className="space-y-4">
              <h1 className="text-4.5xl lg:text-5xl font-black tracking-tight leading-tight">
                Your Journey,<br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Connected.</span>
              </h1>
              <p className="text-sm text-slate-350 leading-relaxed font-semibold">
                Book tickets, manage trips, and explore exclusive travel experiences with ease.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3.5">
              {[
                { 
                  title: "Smart Bookings", 
                  desc: "Book your tickets in just a few clicks.", 
                  icon: <Check className="text-blue-400" size={13} strokeWidth={3} /> 
                },
                { 
                  title: "Live Journey Updates", 
                  desc: "Stay informed with real-time updates.", 
                  icon: <Check className="text-purple-400" size={13} strokeWidth={3} /> 
                },
                { 
                  title: "Secure & Reliable", 
                  desc: "Your data and journeys are always safe with us.", 
                  icon: <Check className="text-indigo-400" size={13} strokeWidth={3} /> 
                }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i + 0.3 }}
                  className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:translate-x-1"
                >
                  <div className="w-6.5 h-6.5 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{item.title}</h3>
                    <p className="text-[11px] text-slate-355 mt-0.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Social Proof glassmorphism card */}
          <div className="z-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md max-w-sm flex items-center gap-4 hover:bg-white/15 transition-all duration-350"
            >
              {/* Stacked avatars */}
              <div className="flex -space-x-2.5 overflow-hidden shrink-0">
                {[1, 2, 3, 4, 5].map(n => (
                  <img 
                    key={n}
                    className="inline-block h-8.5 w-8.5 rounded-full ring-2 ring-blue-950 object-cover" 
                    src={`https://images.unsplash.com/photo-${[
                      "1534528741775-53994a69daeb",
                      "1507003211169-0a1dd7228f2d",
                      "1494790108377-be9c29b29330",
                      "1500648767791-00dcc994a43e",
                      "1438761681033-6461ffad8d80"
                    ][n-1]}?auto=format&fit=crop&q=80&w=80`}
                    alt="" 
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-white">4.8/5 Rating</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
                <p className="text-[10px] text-slate-300 font-semibold mt-0.5">
                  👥 2.5M+ Travelers • "Trusted by millions of travelers"
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Authentication Form Column */}
        <div className="flex flex-col justify-center items-center py-12 px-6 md:px-12 relative min-h-[600px] w-full bg-white dark:bg-[#111827]">
          
          {/* Header Controls (Theme Toggle and Language Dropdown) */}
          <div className="absolute top-6 right-6 flex items-center gap-3 z-30">
            {/* Theme Switcher */}
            <button 
              onClick={toggleTheme} 
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/8 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer animate-in fade-in duration-300"
              title="Toggle Light/Dark Mode"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Language dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/8 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 shadow-sm animate-in fade-in duration-300">
              <Globe size={15} className="shrink-0 text-slate-400 dark:text-slate-500" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as 'en' | 'es' | 'hi')}
                className="text-[11px] font-bold bg-transparent border-none outline-none focus:ring-0 cursor-pointer pl-0.5 pr-5 py-0.5"
              >
                <option value="en" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold">English</option>
                <option value="hi" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold">हिन्दी</option>
                <option value="es" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold">Español</option>
              </select>
            </div>
          </div>

          {/* Premium Center Authentication Card */}
          <div className="max-w-md w-full z-10">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
                {isRegister ? 'Create Account ✨' : 'Welcome Back! 👋'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-semibold">
                {isRegister ? 'Register your account to begin your journey' : 'Sign in to continue your journey'}
              </p>
            </div>

            {/* Form Toggle Slider Tab */}
            <div className="relative flex p-1 mb-7 bg-slate-105 dark:bg-slate-950 border border-slate-200/50 dark:border-white/5 rounded-2xl w-full z-10 shadow-inner">
              <motion.div 
                layoutId="activeTabPill"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="absolute top-1 bottom-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-500/20"
                style={{ 
                  width: 'calc(50% - 4px)',
                  left: isRegister ? 'calc(50% + 2px)' : '4px'
                }}
              />
              <button 
                type="button"
                onClick={() => { setIsRegister(false); setErrorMsg(''); }}
                className={`relative z-10 w-1/2 py-2.5 text-xs font-bold text-center transition-colors duration-300 cursor-pointer ${
                  !isRegister ? 'text-white font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => { setIsRegister(true); setErrorMsg(''); }}
                className={`relative z-10 w-1/2 py-2.5 text-xs font-bold text-center transition-colors duration-300 cursor-pointer ${
                  isRegister ? 'text-white font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message alert */}
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 mb-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2 font-medium"
              >
                <AlertTriangle size={14} className="shrink-0" />
                {errorMsg}
              </motion.div>
            )}

            {/* Actual Forms */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Account Type dropdown in Create Account mode */}
              {isRegister && (
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 pl-1 tracking-wider">Account Type</label>
                  <div className="relative flex items-center w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                    <div className="pl-4 flex items-center justify-center text-slate-400 dark:text-slate-500">
                      <User size={14} />
                    </div>
                    <select 
                      value={accountType} 
                      onChange={e => {
                        const val = e.target.value as any;
                        setAccountType(val);
                        setIsProvider(val !== 'traveler');
                      }}
                      className="w-full px-4 py-3.5 pr-8 text-xs text-slate-800 dark:text-slate-200 bg-transparent border-none focus:outline-none focus:ring-0 appearance-none cursor-pointer font-bold"
                    >
                      <option value="traveler" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold">Traveler</option>
                      <option value="provider" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold">Transport Provider</option>
                      <option value="hotel" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold">Hotel Partner</option>
                      <option value="tour" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-semibold">Tour Operator</option>
                    </select>
                    <div className="absolute right-4 pointer-events-none text-slate-400 dark:text-slate-500">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>
              )}

              {/* Full Name input in Register mode */}
              {isRegister && (
                <FloatingInput 
                  label="Full Name"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  icon={<User size={14} />}
                />
              )}

              {/* Mobile / Email Input */}
              <FloatingInput 
                label={isRegister ? 'Email Address' : 'Mobile Number or Email'}
                required
                type={isRegister ? 'email' : 'text'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<Mail size={14} />}
              />

              {/* Phone Input in Register mode */}
              {isRegister && (
                <FloatingInput 
                  label="Mobile Number"
                  required
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  icon={<Phone size={14} />}
                />
              )}

              {/* Password field */}
              <FloatingInput 
                label={isRegister ? 'Create Password' : 'Password'}
                required
                isPassword
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<Lock size={14} />}
              />

              {/* Confirm Password field in Register mode */}
              {isRegister && (
                <FloatingInput 
                  label="Confirm Password"
                  required
                  isPassword
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  icon={<Lock size={14} />}
                />
              )}

              {/* Partner Onboarding details conditional accordion */}
              <AnimatePresence>
                {isRegister && accountType !== 'traveler' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 pt-4 mt-2 border-t border-slate-200 dark:border-white/5 overflow-hidden text-left"
                  >
                    <h4 className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest pl-1">Partner Details</h4>
                    
                    <FloatingInput 
                      label="Business Name"
                      required
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      icon={<Briefcase size={14} />}
                    />

                    <FloatingInput 
                      label="License / Permit Number"
                      required
                      value={licenseNumber}
                      onChange={e => setLicenseNumber(e.target.value)}
                      icon={<FileText size={14} />}
                    />

                    {accountType === 'provider' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 pl-1">Vehicle Type</label>
                          <div className="relative flex items-center w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                            <div className="pl-4 flex items-center justify-center text-slate-400 dark:text-slate-500">
                              <Car size={14} />
                            </div>
                            <select 
                              value={vehicleType} 
                              onChange={e => setVehicleType(e.target.value as any)}
                              className="w-full px-4 py-3.5 pr-8 text-xs text-slate-800 dark:text-slate-200 bg-transparent border-none focus:outline-none focus:ring-0 appearance-none cursor-pointer font-semibold"
                            >
                              <option value="cab" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-250 font-semibold">Cab / Taxi</option>
                              <option value="bus" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-250 font-semibold">Bus / Coach</option>
                              <option value="auto" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-250 font-semibold">Auto Rickshaw</option>
                              <option value="bike" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-250 font-semibold">Bike Taxi</option>
                            </select>
                            <div className="absolute right-4 pointer-events-none text-slate-400 dark:text-slate-500">
                              <ChevronDown size={14} />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-end">
                          <FloatingInput 
                            label="Vehicle Number"
                            required
                            value={vehicleNumber}
                            onChange={e => setVehicleNumber(e.target.value)}
                            icon={<Car size={14} />}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Extra Form fields in Sign In Mode */}
              {!isRegister && (
                <div className="flex items-center justify-between text-[11px] font-bold px-1 pt-1 select-none">
                  <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-slate-350 dark:border-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                    />
                    Remember me
                  </label>
                  <a 
                    href="#forgot" 
                    onClick={e => { e.preventDefault(); alert("Password reset link has been dispatched to your registered address."); }} 
                    className="text-blue-600 dark:text-blue-400 hover:underline transition-all"
                  >
                    Forgot Password?
                  </a>
                </div>
              )}

              {/* Primary CTA Submit Button with Gradient and Glow effects */}
              <motion.button 
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 cursor-pointer mt-4 transition-all flex items-center justify-center gap-1.5"
              >
                <span>{isRegister ? 'Create Account →' : 'Sign In →'}</span>
              </motion.button>
            </form>

            {/* Social Authentication */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-white/8"></div>
              </div>
              <span className="relative px-3 bg-white dark:bg-[#111827] text-[10px] text-slate-455 dark:text-slate-500 font-extrabold uppercase tracking-widest transition-colors duration-300">
                or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <motion.button 
                type="button"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowGoogleModal(true)}
                className="py-3 rounded-2xl border border-slate-200 dark:border-white/8 text-[10px] font-extrabold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:border-slate-350 dark:hover:border-slate-700 transition-all cursor-pointer text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/40 shadow-sm"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Google
              </motion.button>
              <motion.button 
                type="button"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAppleModal(true)}
                className="py-3 rounded-2xl border border-slate-200 dark:border-white/8 text-[10px] font-extrabold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:border-slate-350 dark:hover:border-slate-700 transition-all cursor-pointer text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/40 shadow-sm"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
                </svg>
                Apple
              </motion.button>
            </div>

            {/* Form footer link */}
            <div className="mt-8 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
              {isRegister ? (
                <span>
                  Already have an account?{' '}
                  <button onClick={() => { setIsRegister(false); setErrorMsg(''); }} className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-bold">
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button onClick={() => { setIsRegister(true); setErrorMsg(''); }} className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-bold">
                    Create Account
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Social Oauth Chooser Modals (Google & Apple) */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-55 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-[32px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/8 p-6 shadow-2xl overflow-hidden"
            >
              {googleLoading ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-10 h-10 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-4" />
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Signing in with Google...</h4>
                  <p className="text-[9px] text-slate-450 dark:text-slate-500 mt-1">Establishing secure OAuth credentials connection.</p>
                </div>
              ) : (
                <div className="text-left space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <h3 className="text-sm font-extrabold text-slate-850 dark:text-slate-100">Sign in with Google</h3>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed border-b border-slate-100 dark:border-white/5 pb-2">
                    Choose a Google Account to sign in to TravelConnect:
                  </p>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {[
                      { name: 'John Doe', email: 'john@gmail.com', role: 'customer' as const, avatar: 'JD' },
                      { name: 'Ramesh Travels', email: 'ramesh@bus.com', role: 'bus_operator' as const, avatar: 'RT' },
                      { name: 'David Eco Cabs', email: 'david@cab.com', role: 'cab_driver' as const, avatar: 'DC' },
                      { name: 'Admin Controller', email: 'admin@travelconnect.com', role: 'admin' as const, avatar: 'AC' }
                    ].map((acc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setGoogleLoading(true);
                          setTimeout(() => {
                            login(acc.email, acc.role);
                            setGoogleLoading(false);
                            setShowGoogleModal(false);
                          }, 1200);
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/8 hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-3 transition-all cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-650 dark:text-slate-350 shrink-0">
                          {acc.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{acc.name}</p>
                          <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate">{acc.email} • <span className="capitalize">{acc.role.replace('_', ' ')}</span></p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button 
                      type="button"
                      onClick={() => setShowGoogleModal(false)}
                      className="px-4 py-2 border border-slate-200 dark:border-white/8 text-slate-500 dark:text-slate-405 text-[10px] font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAppleModal && (
          <div className="fixed inset-0 z-55 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-[32px] bg-slate-900 dark:bg-[#111827] text-white border border-slate-800 dark:border-white/8 p-6 shadow-2xl overflow-hidden"
            >
              {appleLoading ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-10 h-10 rounded-full border-2 border-white border-t-transparent animate-spin mb-4" />
                  <h4 className="text-xs font-bold text-white">Signing in with Apple ID...</h4>
                  <p className="text-[9px] text-slate-455 mt-1">Establishing secure iCloud key-chain credentials connection.</p>
                </div>
              ) : (
                <div className="text-left space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
                    </svg>
                    <h3 className="text-sm font-extrabold text-white">Sign in with Apple ID</h3>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed border-b border-slate-800 dark:border-white/5 pb-2">
                    Choose a mock Apple Account credentials to authorize:
                  </p>

                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {[
                      { name: 'John Doe', email: 'john@gmail.com', role: 'customer' as const, avatar: 'JD' },
                      { name: 'Ramesh Travels', email: 'ramesh@bus.com', role: 'bus_operator' as const, avatar: 'RT' },
                      { name: 'David Eco Cabs', email: 'david@cab.com', role: 'cab_driver' as const, avatar: 'DC' },
                      { name: 'Admin Controller', email: 'admin@travelconnect.com', role: 'admin' as const, avatar: 'AC' }
                    ].map((acc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAppleLoading(true);
                          setTimeout(() => {
                            login(acc.email, acc.role);
                            setAppleLoading(false);
                            setShowAppleModal(false);
                          }, 1200);
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-800 dark:border-white/8 hover:bg-slate-900 text-left flex items-center gap-3 transition-colors cursor-pointer text-white"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-350 shrink-0">
                          {acc.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-white">{acc.name}</p>
                          <p className="text-[9px] text-slate-400 truncate">{acc.email} • <span className="capitalize">{acc.role.replace('_', ' ')}</span></p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button 
                      type="button"
                      onClick={() => setShowAppleModal(false)}
                      className="px-4 py-2 border border-slate-800 dark:border-white/8 text-slate-400 text-[10px] font-bold rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Footer Bar */}
      <div className="col-span-2 w-full py-4 px-6 md:px-12 border-t border-slate-200/50 dark:border-white/5 bg-white dark:bg-[#0b1220] flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 z-20 gap-4 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-12">
          <div className="flex items-center gap-2">
            <Shield className="text-blue-600" size={14} />
            <div>
              <span className="font-extrabold text-slate-800 dark:text-white">100% Secure</span>
              <span className="ml-1 text-slate-500 dark:text-slate-400">Your data is protected</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="text-blue-600" size={14} />
            <div>
              <span className="font-extrabold text-slate-800 dark:text-white">24/7 Support</span>
              <span className="ml-1 text-slate-500 dark:text-slate-400">We're here to help</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="text-blue-600" size={14} />
            <div>
              <span className="font-extrabold text-slate-800 dark:text-white">Best Price Guarantee</span>
              <span className="ml-1 text-slate-500 dark:text-slate-400">Get the best deals</span>
            </div>
          </div>
        </div>
        <div className="font-bold">
          © 2025 TravelConnect. All rights reserved.
        </div>
      </div>
    </motion.div>
  );
};

// --- CUSTOMER DASHBOARD / SEARCH HOME (MATCHES IMAGE 8) ---
const SearchHomeScreen: React.FC = () => {
  const { locations, searchRoutes, searchParams, setSearchParams, addCustomLocation, t } = useApp();
  const [srcVal, setSrcVal] = useState<number | null>(searchParams.sourceId);
  const [destVal, setDestVal] = useState<number | null>(searchParams.destinationId);
  const [dateVal, setDateVal] = useState(searchParams.date || new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState(1);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState<'recommended' | 'cheapest' | 'fastest'>('recommended');
  const [searched, setSearched] = useState(searchParams.sourceId !== null && searchParams.destinationId !== null);
  
  const [filterType, setFilterType] = useState<'all' | 'bus' | 'cab' | 'bike' | 'train' | 'flight' | 'auto' | 'shared'>('all');

  // Nominatim Autocomplete Place Geocoding search states
  const [srcQuery, setSrcQuery] = useState(srcVal ? locations.find(l => l.id === srcVal)?.name || '' : '');
  const [destQuery, setDestQuery] = useState(destVal ? locations.find(l => l.id === destVal)?.name || '' : '');
  const [srcSuggestions, setSrcSuggestions] = useState<any[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<any[]>([]);
  const [srcLoading, setSrcLoading] = useState(false);
  const [destLoading, setDestLoading] = useState(false);
  const [srcFocused, setSrcFocused] = useState(false);
  const [destFocused, setDestFocused] = useState(false);

  // Keep search queries in sync with selected terminal IDs
  useEffect(() => {
    if (srcVal) {
      const name = locations.find(l => l.id === srcVal)?.name || '';
      setSrcQuery(name);
    } else {
      setSrcQuery('');
    }
  }, [srcVal, locations]);

  useEffect(() => {
    if (destVal) {
      const name = locations.find(l => l.id === destVal)?.name || '';
      setDestQuery(name);
    } else {
      setDestQuery('');
    }
  }, [destVal, locations]);

  // Fetch source suggestions from Nominatim API (polite debounce 550ms)
  useEffect(() => {
    if (!srcQuery || srcQuery.length < 3 || srcQuery === (srcVal ? locations.find(l => l.id === srcVal)?.name : '')) {
      setSrcSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSrcLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(srcQuery)}&format=json&limit=5&countrycodes=in&addressdetails=1`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'TravelConnectPlus-App/1.0 (contact@travelconnect.com)'
          }
        });
        const data = await res.json();
        setSrcSuggestions(data || []);
      } catch (err) {
        console.warn("Geocoding source query failed:", err);
      } finally {
        setSrcLoading(false);
      }
    }, 550);

    return () => clearTimeout(timer);
  }, [srcQuery, srcVal, locations]);

  // Fetch destination suggestions from Nominatim API (polite debounce 550ms)
  useEffect(() => {
    if (!destQuery || destQuery.length < 3 || destQuery === (destVal ? locations.find(l => l.id === destVal)?.name : '')) {
      setDestSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setDestLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destQuery)}&format=json&limit=5&countrycodes=in&addressdetails=1`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'TravelConnectPlus-App/1.0 (contact@travelconnect.com)'
          }
        });
        const data = await res.json();
        setDestSuggestions(data || []);
      } catch (err) {
        console.warn("Geocoding destination query failed:", err);
      } finally {
        setDestLoading(false);
      }
    }, 550);

    return () => clearTimeout(timer);
  }, [destQuery, destVal, locations]);

  const handleSelectSourceSuggestion = (item: any) => {
    const name = item.display_name;
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const resolvedLoc = addCustomLocation(name, lat, lng);
    setSrcVal(resolvedLoc.id);
    setSrcQuery(name);
    setSrcSuggestions([]);
    setSrcFocused(false);
    setSearched(false);
  };

  const handleSelectDestSuggestion = (item: any) => {
    const name = item.display_name;
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    const resolvedLoc = addCustomLocation(name, lat, lng);
    setDestVal(resolvedLoc.id);
    setDestQuery(name);
    setDestSuggestions([]);
    setDestFocused(false);
    setSearched(false);
  };

  const handleSourceInputChange = (text: string) => {
    setSrcQuery(text);
    if (!text) {
      setSrcVal(null);
      setSrcSuggestions([]);
      setSearched(false);
    }
  };

  const handleDestInputChange = (text: string) => {
    setDestQuery(text);
    if (!text) {
      setDestVal(null);
      setDestSuggestions([]);
      setSearched(false);
    }
  };

  const handleSearch = () => {
    setError('');
    
    if (searched) {
      setSearched(false);
      return;
    }

    if (!srcVal || !destVal) {
      setError('Select starting point and destination.');
      return;
    }
    if (srcVal === destVal) {
      setError('Source and Destination cannot be identical.');
      return;
    }

    // Save search details to global context
    setSearchParams({ sourceId: srcVal, destinationId: destVal, date: dateVal });
    setSearched(true);
  };

  const handleSwap = () => {
    const tempVal = srcVal;
    setSrcVal(destVal);
    setDestVal(tempVal);

    const tempQuery = srcQuery;
    setSrcQuery(destQuery);
    setDestQuery(tempQuery);

    setSearched(false);
  };

  const handleSourceChange = (val: number | null) => {
    setSrcVal(val);
    setSearched(false);
  };

  const handleDestinationChange = (val: number | null) => {
    setDestVal(val);
    setSearched(false);
  };

  // Mock available services list (matches Image 8)
  const serviceCards = [
    { type: 'bus' as const, title: 'Bus', desc: 'AC, Non-AC, Volvo, Sleeper and more', price: '₹350', count: '45 Services', bg: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400', tag: 'Most Popular' },
    { type: 'cab' as const, title: 'Cab', desc: 'Hatchback, Sedan, SUV and more', price: '₹899', count: '125 Providers', bg: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400', tag: 'Fastest' },
    { type: 'bike' as const, title: 'Bike', desc: 'Bike Taxi, Rentals and more', price: '₹199', count: '75 Riders', bg: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400', tag: 'Quick & Easy' },
    { type: 'train' as const, title: 'Train', desc: 'Express, Shatabdi, Rajdhani and more', price: '₹250', count: '32 Trains', bg: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=400', tag: 'Comfortable' },
    { type: 'flight' as const, title: 'Flight', desc: 'Domestic & International Flights', price: '₹2,199', count: '85 Flights', bg: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=400', tag: 'Best for Long Distance' },
    { type: 'auto' as const, title: 'Auto', desc: 'Auto Rickshaw services', price: '₹50', count: '50+ Autos', bg: 'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?auto=format&fit=crop&q=80&w=400', tag: 'Affordable' },
    { type: 'shared' as const, title: 'Shared', desc: 'Shared Cabs, Shuttle and more', price: '₹120', count: '40 Services', bg: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80&w=400', tag: 'Budget Friendly' },
    { type: 'cab' as const, title: 'Outstation', desc: 'Outstation Cabs and Packages', price: '₹1,999', count: '60 Providers', bg: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400', tag: 'Top Rated' }
  ];

  const filteredCards = filterType === 'all' 
    ? serviceCards 
    : serviceCards.filter(c => c.type === filterType);

  const getServiceCountLabel = (type: string) => {
    if (type === 'bus') return '45 Services';
    if (type === 'cab') return '125 Providers';
    if (type === 'bike') return '75 Riders';
    if (type === 'train') return '32 Trains';
    if (type === 'flight') return '85 Flights';
    return '50+ Available';
  };

  const getRouteDistance = () => {
    if (!srcVal || !destVal) return null;
    const src = locations.find(l => l.id === srcVal);
    const dest = locations.find(l => l.id === destVal);
    if (!src || !dest) return null;
    const dx = src.x - dest.x;
    const dy = src.y - dest.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return parseFloat((dist * 0.5).toFixed(1)); // scaled km
  };

  const routeDistance = getRouteDistance();

  const getDynamicPrice = (type: string, title: string) => {
    const lowerTitle = title.toLowerCase();
    
    // Default prices to match Delhi-Jaipur screenshot
    if (srcVal === 1 && destVal === 2) {
      if (lowerTitle === 'outstation') return '₹1,999';
      if (type === 'bus') return '₹350';
      if (type === 'cab') return '₹899';
      if (type === 'bike') return '₹199';
      if (type === 'train') return '₹250';
      if (type === 'flight') return '₹2,199';
      if (type === 'auto') return '₹50';
      if (type === 'shared') return '₹120';
    }

    if (!routeDistance) return '₹0';
    let baseFare = 50.0;
    let kmFare = 15.0;
    
    if (lowerTitle === 'outstation') { baseFare = 250.0; kmFare = 18.0; }
    else if (type === 'bus') { baseFare = 40.0; kmFare = 2.5; }
    else if (type === 'auto') { baseFare = 30.0; kmFare = 10.0; }
    else if (type === 'bike') { baseFare = 20.0; kmFare = 6.0; }
    else if (type === 'cab') { baseFare = 50.0; kmFare = 15.0; }
    else if (type === 'train') { baseFare = 80.0; kmFare = 1.5; }
    else if (type === 'flight') { baseFare = 1500.0; kmFare = 6.0; }
    else if (type === 'shared') { baseFare = 30.0; kmFare = 5.0; }
    else { baseFare = 50.0; kmFare = 15.0; }
    
    const totalPrice = parseFloat((baseFare + (routeDistance * kmFare)).toFixed(2));
    return `₹${Math.round(totalPrice).toLocaleString()}`;
  };

  const getServiceStyles = (type: string, title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle === 'outstation') {
      return {
        icon: <Car size={16} className="text-blue-500 shrink-0" />,
        badgeText: 'Top Rated',
        badgeColor: 'border-blue-200 text-blue-600 bg-white dark:bg-slate-900',
        btnBg: 'bg-blue-50 text-blue-600 hover:bg-[#0056fb] hover:text-white dark:bg-blue-950/20 dark:text-blue-400 dark:hover:bg-blue-550 dark:hover:text-white',
        colorClass: 'text-blue-600'
      };
    }
    switch(type) {
      case 'bus':
        return {
          icon: <Bus size={16} className="text-[#0056fb] shrink-0" />,
          badgeText: 'Most Popular',
          badgeColor: 'border-blue-200 text-blue-600 bg-white dark:bg-slate-900',
          btnBg: 'bg-blue-50 text-blue-600 hover:bg-[#0056fb] hover:text-white dark:bg-blue-950/20 dark:text-blue-400 dark:hover:bg-blue-550 dark:hover:text-white',
          colorClass: 'text-blue-600'
        };
      case 'cab':
        return {
          icon: <Car size={16} className="text-amber-550 shrink-0" />,
          badgeText: 'Fastest',
          badgeColor: 'border-amber-200 text-amber-600 bg-white dark:bg-slate-900',
          btnBg: 'bg-amber-50 text-amber-600 hover:bg-amber-550 hover:text-white dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-550 dark:hover:text-white',
          colorClass: 'text-amber-600'
        };
      case 'bike':
        return {
          icon: <Bike size={16} className="text-emerald-500 shrink-0" />,
          badgeText: 'Quick & Easy',
          badgeColor: 'border-emerald-200 text-emerald-600 bg-white dark:bg-slate-900',
          btnBg: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-550 hover:text-white dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-550 dark:hover:text-white',
          colorClass: 'text-emerald-600'
        };
      case 'train':
        return {
          icon: <Train size={16} className="text-purple-550 shrink-0" />,
          badgeText: 'Comfortable',
          badgeColor: 'border-purple-200 text-purple-600 bg-white dark:bg-slate-900',
          btnBg: 'bg-purple-50 text-purple-600 hover:bg-purple-550 hover:text-white dark:bg-purple-950/20 dark:text-purple-400 dark:hover:bg-purple-550 dark:hover:text-white',
          colorClass: 'text-purple-600'
        };
      case 'flight':
        return {
          icon: <Plane size={16} className="text-rose-500 shrink-0" />,
          badgeText: 'Best for Long Distance',
          badgeColor: 'border-red-200 text-red-650 bg-white dark:bg-slate-900',
          btnBg: 'bg-red-50 text-red-650 hover:bg-red-500 hover:text-white dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-550 dark:hover:text-white',
          colorClass: 'text-red-650'
        };
      case 'auto':
        return {
          icon: <Compass size={16} className="text-amber-600 shrink-0" />,
          badgeText: 'Affordable',
          badgeColor: 'border-amber-200 text-amber-650 bg-white dark:bg-slate-900',
          btnBg: 'bg-amber-50 text-amber-650 hover:bg-amber-550 hover:text-white dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-550 dark:hover:text-white',
          colorClass: 'text-amber-650'
        };
      case 'shared':
        return {
          icon: <User size={16} className="text-teal-650 shrink-0" />,
          badgeText: 'Budget Friendly',
          badgeColor: 'border-teal-200 text-teal-600 bg-white dark:bg-slate-900',
          btnBg: 'bg-teal-50 text-teal-600 hover:bg-teal-555 hover:text-white dark:bg-teal-950/20 dark:text-teal-400 dark:hover:bg-teal-550 dark:hover:text-white',
          colorClass: 'text-teal-655'
        };
      default:
        return {
          icon: <Car size={16} className="text-slate-500 shrink-0" />,
          badgeText: 'Verified',
          badgeColor: 'border-slate-200 text-slate-600 bg-white dark:bg-slate-900',
          btnBg: 'bg-slate-50 text-slate-650 hover:bg-slate-500 hover:text-white dark:bg-slate-900 dark:text-slate-400',
          colorClass: 'text-slate-600'
        };
    }
  };

  const getButtonLabel = (title: string) => {
    if (title.toLowerCase() === 'bus') return 'View Buses';
    if (title.toLowerCase() === 'outstation') return 'View Outstation';
    return `View ${title}s`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
    >
      {/* LEFT COLUMN: Plan Your Journey Sidebar */}
      <div className="lg:col-span-3 space-y-5">
        <div className="platform-card bg-white dark:bg-[#151824] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs uppercase font-extrabold text-slate-450 dark:text-slate-500 tracking-wider">{t('plan_journey')}</h3>
            {/* Elegant Path Icon */}
            <div className="text-[#0056fb] flex items-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="18" r="3" />
                <path d="M6 15v-6a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v6" />
                <circle cx="18" cy="18" r="3" />
              </svg>
            </div>
          </div>
          
          {error && (
            <div className="p-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-500 dark:text-red-400 rounded-xl text-[10px] font-bold flex items-center gap-1.5 mb-3">
              <AlertTriangle size={12} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative space-y-4">
              {/* Vertical connecting dotted path line */}
              <div className="absolute left-[17px] top-[26px] bottom-[26px] w-[2px] border-l-2 border-dashed border-slate-250 dark:border-slate-800 pointer-events-none" />
              
              {/* From (Source) Autocomplete Input */}
              <div className="relative flex items-center">
                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[#0056fb] shrink-0 z-10">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0056fb]" />
                </div>
                <div className="ml-3 flex-1 text-left relative">
                  <label className="block text-[8px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">From</label>
                  <input 
                    type="text"
                    value={srcQuery}
                    onChange={(e) => handleSourceInputChange(e.target.value)}
                    onFocus={() => setSrcFocused(true)}
                    onBlur={() => setTimeout(() => setSrcFocused(false), 200)}
                    placeholder="Search place, city, or address..."
                    className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none py-0.5 border-b border-transparent focus:border-blue-500/20"
                  />
                  
                  {/* Dropdown Overlay suggestions */}
                  {srcFocused && (srcSuggestions.length > 0 || srcLoading) && (
                    <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-[#151824] border border-slate-250 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 max-h-56 overflow-y-auto">
                      {srcLoading && (
                        <div className="px-4 py-2.5 text-[10px] font-bold text-slate-455 dark:text-slate-550 flex items-center gap-2">
                          <span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                          Searching across India...
                        </div>
                      )}
                      {!srcLoading && srcSuggestions.map((item, idx) => {
                        const parts = item.display_name.split(', ');
                        const title = parts[0];
                        const subtitle = parts.slice(1).join(', ');
                        return (
                          <button
                            key={idx}
                            type="button"
                            onMouseDown={() => handleSelectSourceSuggestion(item)}
                            className="w-full px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-start gap-2 transition-colors cursor-pointer"
                          >
                            <MapPin size={13} className="text-slate-404 shrink-0 mt-0.5" />
                            <div className="flex flex-col min-w-0">
                              <span className="font-extrabold text-slate-808 dark:text-slate-200 text-[11px] truncate">{title}</span>
                              <span className="text-[9px] text-slate-400 dark:text-slate-505 font-semibold truncate">{subtitle}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* To (Destination) Autocomplete Input */}
              <div className="relative flex items-center">
                <div className="w-9 h-9 rounded-full bg-red-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-red-500 shrink-0 z-10">
                  <MapPin size={14} className="text-red-500" />
                </div>
                <div className="ml-3 flex-1 text-left relative">
                  <label className="block text-[8px] font-extrabold text-slate-455 dark:text-slate-500 uppercase tracking-wider">To</label>
                  <input 
                    type="text"
                    value={destQuery}
                    onChange={(e) => handleDestInputChange(e.target.value)}
                    onFocus={() => setDestFocused(true)}
                    onBlur={() => setTimeout(() => setDestFocused(false), 200)}
                    placeholder="Search place, city, or address..."
                    className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none py-0.5 border-b border-transparent focus:border-blue-500/20"
                  />
                  
                  {/* Dropdown Overlay suggestions */}
                  {destFocused && (destSuggestions.length > 0 || destLoading) && (
                    <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-[#151824] border border-slate-250 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 max-h-56 overflow-y-auto">
                      {destLoading && (
                        <div className="px-4 py-2.5 text-[10px] font-bold text-slate-400 dark:text-slate-550 flex items-center gap-2">
                          <span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                          Searching across India...
                        </div>
                      )}
                      {!destLoading && destSuggestions.map((item, idx) => {
                        const parts = item.display_name.split(', ');
                        const title = parts[0];
                        const subtitle = parts.slice(1).join(', ');
                        return (
                          <button
                            key={idx}
                            type="button"
                            onMouseDown={() => handleSelectDestSuggestion(item)}
                            className="w-full px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-start gap-2 transition-colors cursor-pointer"
                          >
                            <MapPin size={13} className="text-slate-404 shrink-0 mt-0.5" />
                            <div className="flex flex-col min-w-0">
                              <span className="font-extrabold text-slate-808 dark:text-slate-200 text-[11px] truncate">{title}</span>
                              <span className="text-[9px] text-slate-400 dark:text-slate-505 font-semibold truncate">{subtitle}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Date Pick */}
            <div className="text-left">
              <label className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase mb-1.5 tracking-wider ml-1">{t('date')}</label>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-slate-50/55 dark:bg-slate-900/40">
                <Calendar size={13} className="text-slate-400 mr-2 shrink-0" />
                <input 
                  type="date" 
                  value={dateVal}
                  onChange={e => setDateVal(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Passengers Choice */}
            <div className="text-left">
              <label className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase mb-1.5 tracking-wider ml-1">{t('passengers')}</label>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-slate-50/55 dark:bg-slate-900/40">
                <User size={13} className="text-slate-405 mr-2 shrink-0" />
                <select 
                  value={passengers} 
                  onChange={e => setPassengers(Number(e.target.value))}
                  className="w-full bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  <option value="1" className="dark:bg-[#151824]">1 Guest</option>
                  <option value="2" className="dark:bg-[#151824]">2 Guests</option>
                  <option value="3" className="dark:bg-[#151824]">3 Guests</option>
                  <option value="4" className="dark:bg-[#151824]">4+ Guests</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleSearch}
                className="flex-1 py-3 bg-[#0056fb] hover:bg-[#0046d5] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
              >
                {searched ? 'Change Search' : t('search_options')}
              </button>
              {searched && (
                <button 
                  onClick={() => setSearched(false)}
                  className="px-3 py-3 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold text-xs rounded-xl cursor-pointer transition-all"
                  title="Back to Homepage"
                >
                  Home
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Filters panel - only show if searched */}
        {searched && (
          <div className="platform-card bg-white dark:bg-[#151824] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-md text-xs">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-slate-805 dark:text-slate-200">{t('filter_services')}</span>
              <button className="text-[10px] font-bold text-[#0056fb] hover:underline">Clear All</button>
            </div>
            <div className="space-y-4 text-xs">
              <div className="text-left">
                <span className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase mb-1.5 ml-1">Sort By</span>
                <select 
                  value={sortKey} 
                  onChange={e => setSortKey(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-705 dark:text-slate-350 focus:outline-none"
                >
                  <option value="recommended">Recommended</option>
                  <option value="cheapest">Cheapest</option>
                  <option value="fastest">Fastest</option>
                </select>
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-550 uppercase mb-2 ml-1">Price Range</span>
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  defaultValue="2500" 
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0056fb]" 
                />
                <div className="flex justify-between text-[10px] text-slate-450 dark:text-slate-500 font-bold mt-1.5">
                  <span>₹0</span>
                  <span>₹5,000+</span>
                </div>
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-extrabold text-slate-405 dark:text-slate-505 uppercase mb-2.5 ml-1">Provider Rating</span>
                <div className="space-y-2 font-bold text-slate-650 dark:text-slate-400 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 accent-[#0056fb]" />
                    <div className="flex items-center text-amber-500 gap-0.5">
                      {[1, 2, 3, 4, 5].map(e => <Star size={11} fill="#f59e0b" className="text-amber-500" key={e} />)}
                      <span className="ml-1.5 text-slate-500 text-[10px]">& up</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      {searched ? (
        <div className="lg:col-span-9 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-left">
            <div>
              <h2 className="text-xl font-extrabold text-slate-808 dark:text-slate-150">{t('all_avail_services')}</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                Available route options for {locations.find(l => l.id === srcVal)?.name.split(' (')[0]} → {locations.find(l => l.id === destVal)?.name.split(' (')[0]} ({routeDistance || 260} km)
              </p>
            </div>
          </div>

          {/* Filter Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {['all', 'bus', 'cab', 'bike', 'train', 'flight', 'auto', 'shared'].map(type => {
              const isSelected = filterType === type;
              let icon = <Compass size={14} />;
              let label = t('all_services');

              if (type === 'bus') { icon = <Bus size={14} />; label = t('bus'); }
              else if (type === 'cab') { icon = <Car size={14} />; label = t('cab'); }
              else if (type === 'bike') { icon = <Bike size={14} />; label = t('bike'); }
              else if (type === 'train') { icon = <Train size={14} />; label = t('train'); }
              else if (type === 'flight') { icon = <Plane size={14} />; label = t('flight'); }
              else if (type === 'auto') { icon = <Compass size={14} />; label = t('auto'); }
              else if (type === 'shared') { icon = <User size={14} />; label = t('shared'); }

              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold capitalize transition-all shrink-0 border cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0056fb] text-white border-transparent shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-slate-550 border-slate-200 dark:bg-[#11131c] dark:border-slate-800 dark:text-slate-400'
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Services Grid */}
          <div id="services-grid-section" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredCards.map((card, idx) => {
              const styles = getServiceStyles(card.type, card.title);
              return (
                <div key={idx} className="platform-card rounded-3xl overflow-hidden border border-slate-205 dark:border-slate-800 bg-white dark:bg-[#151824] flex flex-col hover:shadow-lg transition-all">
                  <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img src={card.bg} alt={card.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm ${styles.badgeColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {styles.badgeText}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between text-left">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-250 font-extrabold text-sm.5">
                        {styles.icon}
                        <span>{card.title}</span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 leading-tight mt-0.5">{card.desc}</p>
                      <div className="space-y-1 my-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-slate-400/80" />
                          <span>From <strong className="text-slate-800 dark:text-slate-200">{getDynamicPrice(card.type, card.title)}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-slate-400/80" />
                          <span>{getServiceCountLabel(card.type)} Available</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100/70 dark:border-slate-850">
                      <button
                        onClick={() => searchRoutes(srcVal!, destVal!, dateVal, card.type)}
                        className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer text-center ${styles.btnBg}`}
                      >
                        {getButtonLabel(card.title)}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Map */}
          <div className="h-[380px] rounded-3xl overflow-hidden border border-slate-202 dark:border-slate-800 relative shadow-inner">
            <SVGMapBackground sourceId={srcVal} destId={destVal} heightClass="h-full" />
          </div>
        </div>
      ) : (
        <div className="lg:col-span-9 space-y-6 flex flex-col h-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-805 dark:text-slate-150">TravelConnect+ Network Grid</h2>
              <p className="text-xs text-slate-450 dark:text-slate-400 font-semibold mt-0.5">Please select starting point and destination to find available route options.</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/20 text-[#0056fb] px-3 py-1.5 rounded-xl border border-blue-100/60 dark:border-blue-900/30 text-[10px] font-bold">
              <Compass className="animate-spin text-[#0056fb]" size={12} />
              <span>Interactive Live Map Grid</span>
            </div>
          </div>

          {/* Map Card */}
          <div className="flex-1 min-h-[520px] bg-slate-900 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden flex flex-col justify-between p-6">
            <div className="z-10 text-left">
              <span className="text-[10px] text-slate-405 uppercase tracking-widest font-black">Region Map Connectivity</span>
            </div>

            <div className="absolute inset-0 pt-16 pb-14 px-4">
              <SVGMapBackground sourceId={srcVal} destId={destVal} heightClass="h-full" />
            </div>

            <div className="z-10 flex flex-wrap gap-3.5 mt-auto pt-4 bg-slate-950/90 dark:bg-[#11131c]/95 backdrop-blur-sm border-t border-slate-800/50 -mx-6 -mb-6 p-6">
              <div className="flex items-center gap-2 text-[10px] text-slate-300 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white/20" />
                <span>Green: Departure Hub</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-300 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white/20" />
                <span>Red: Arrival Terminal</span>
              </div>
              <div className="ml-auto text-[10px] font-black text-slate-400 uppercase tracking-wide">
                {srcVal !== null || destVal !== null ? 'Selected Route active' : 'Choose source & dest'}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// --- ROUTE OPTIONS & LIST RESULTS SCREEN (MATCHES IMAGES 3, 4, 5, 6) ---
const OptionsListScreen: React.FC = () => {
  const { locations, searchParams, routeOptions, setSelectedOption, setCurrentScreen, t } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'bus' | 'cab' | 'bike' | 'train' | 'flight' | 'auto' | 'shared'>(
    (searchParams.category as any) || 'all'
  );
  const [busSubFilter, setBusSubFilter] = useState<'all' | 'roadways' | 'private'>('all');
  const [sortKey, setSortKey] = useState<'recommended' | 'cheapest' | 'fastest'>('recommended');

  const src = locations.find(l => l.id === searchParams.sourceId);
  const dest = locations.find(l => l.id === searchParams.destinationId);

  // Sorting/filtering
  const getProcessedOptions = () => {
    let list = [...routeOptions];
    if (filterType !== 'all') {
      list = list.filter(o => o.vehicleType === filterType);
    }
    
    // Apply bus sub-category filtering if active
    if (filterType === 'bus' && busSubFilter !== 'all') {
      list = list.filter(o => o.busCategory === busSubFilter);
    }

    if (sortKey === 'cheapest') {
      list.sort((a, b) => a.totalPrice - b.totalPrice);
    } else if (sortKey === 'fastest') {
      list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    }
    return list;
  };

  const processedOptions = getProcessedOptions();

  // Custom data generator for train, flight, bus visual styling (Images 3,4,5,6)
  const getOperatorDetails = (opt: RouteOption) => {
    if (opt.vehicleType === 'train') {
      return {
        code: '12050',
        subName: 'New Delhi NDLS → Hazrat Nizamuddin NZM',
        features: ['Wi-Fi', 'Catering', 'Pantry Car', 'Electric Sockets'],
        btnLabel: 'View Seats',
        detailLabel: 'Train Details',
        departureTime: '08:10 AM',
        arrivalTime: '12:20 AM',
        durationLabel: '16h 10m',
        priceLabel: `₹${Math.round(opt.totalPrice).toLocaleString()}`,
        logoColor: 'bg-blue-600'
      };
    }
    if (opt.vehicleType === 'flight') {
      return {
        code: '6E 2031',
        subName: 'DEL Indira Gandhi Intl. → BOM Chhatrapati Shivaji',
        features: ['Baggage: 15 kg', 'Meal Available', 'Free Cancellation'],
        btnLabel: 'View Flights',
        detailLabel: 'Flight Details',
        departureTime: '06:20 AM',
        arrivalTime: '08:35 AM',
        durationLabel: '2h 15m',
        priceLabel: `₹${Math.round(opt.totalPrice).toLocaleString()}`,
        logoColor: 'bg-sky-500'
      };
    }
    if (opt.vehicleType === 'bus') {
      const isRoadways = opt.busCategory === 'roadways';
      return {
        code: isRoadways ? 'RSRTC Express Ordinary' : 'Ramesh Travels Volvo AC',
        subName: isRoadways ? 'State Roadways Corporation' : 'Private Luxury Partner',
        features: isRoadways 
          ? ['Ordinary Fare', 'State Transport', 'Window Seats Available']
          : ['AC Sleeper', 'Wi-Fi', 'Charging Point', 'Live Tracking'],
        btnLabel: 'Select Seats',
        detailLabel: 'View Details',
        departureTime: isRoadways ? '07:30 AM' : '09:30 PM',
        arrivalTime: isRoadways ? '03:30 PM' : '05:30 AM',
        durationLabel: isRoadways ? '8h 00m' : '8h 00m',
        priceLabel: `₹${Math.round(opt.totalPrice).toLocaleString()}`,
        logoColor: isRoadways ? 'bg-blue-700' : 'bg-indigo-600'
      };
    }
    // Cabs
    return {
      code: 'Swift Dzire',
      subName: 'Hatchback • 4 Seater • AC • Driver • Music',
      features: ['Fuel: Petrol', 'Luggage: 2 Bags', 'Free Cancellation'],
      btnLabel: 'Book Now',
      detailLabel: 'View Details',
      departureTime: 'Flexible',
      arrivalTime: 'On Demand',
      durationLabel: 'Direct Trip',
      priceLabel: `₹${Math.round(opt.totalPrice).toLocaleString()}`,
      logoColor: 'bg-emerald-600'
    };
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6 text-left"
    >
      {/* Search Header Bar (Matches Image 3) */}
      <div className="platform-card bg-white px-5 py-4 rounded-3xl border border-slate-200/80 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-semibold">
          <div>
            <span className="block text-[9px] uppercase font-bold text-slate-400">{t('from')}</span>
            <span className="text-slate-800 font-bold">{src?.name}</span>
          </div>
          <div className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 text-slate-400">
            <ArrowRightLeft size={10} />
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold text-slate-400">{t('to')}</span>
            <span className="text-slate-800 font-bold">{dest?.name}</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="block text-[9px] uppercase font-bold text-slate-400">{t('date')}</span>
            <span className="text-slate-800 font-bold">{searchParams.date}</span>
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold text-slate-400">Class</span>
            <span className="text-slate-800 font-bold">All Classes</span>
          </div>
        </div>

        <button 
          onClick={() => setCurrentScreen('home')}
          className="px-4 py-2 text-xs font-bold text-[#0056fb] hover:bg-blue-50 border border-slate-200 rounded-xl transition-all cursor-pointer"
        >
          {t('modify_search')}
        </button>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sidebar Filters */}
        <div className="lg:col-span-3 space-y-4">
          <div className="platform-card bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md text-xs">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-800">Filters</span>
              <button className="text-[10px] font-bold text-[#0056fb] hover:underline">Reset All</button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Sort Results</span>
                <select 
                  value={sortKey} 
                  onChange={e => setSortKey(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                >
                  <option value="recommended">Recommended</option>
                  <option value="cheapest">Cheapest</option>
                  <option value="fastest">Fastest</option>
                </select>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Transit Type</span>
                <div className="space-y-1.5 font-semibold text-slate-600">
                  <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="rounded accent-[#0056fb]" /> All Options</label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="rounded accent-[#0056fb]" /> Express Schedules</label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="rounded accent-[#0056fb]" /> Local Operators</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Option cards */}
        <div className="lg:col-span-9 space-y-4">
          {/* Categories Tab selector bar for dynamic filtering on Results screen (hidden if a specific category like bus was searched) */}
          {(!searchParams.category || searchParams.category === 'all') && (
            <div className="flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-thin">
              {(['all', 'bus', 'cab', 'bike', 'train', 'flight', 'auto'] as const).map(type => {
                const isActive = filterType === type;
                let iconElement = <Compass size={14} />;
                let label = 'All Services';
                
                if (type === 'bus') { iconElement = <Bus size={14} />; label = 'Bus'; }
                else if (type === 'cab') { iconElement = <Car size={14} />; label = 'Cab'; }
                else if (type === 'bike') { iconElement = <Bike size={14} />; label = 'Bike'; }
                else if (type === 'train') { iconElement = <Train size={14} />; label = 'Train'; }
                else if (type === 'flight') { iconElement = <Plane size={14} />; label = 'Flight'; }
                else if (type === 'auto') { iconElement = <Compass size={14} />; label = 'Auto'; }

                return (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterType(type);
                      setBusSubFilter('all');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold capitalize transition-all shrink-0 border cursor-pointer flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-[#0056fb] text-white border-transparent' 
                        : 'bg-white hover:bg-slate-50 text-slate-550 border-slate-200 dark:bg-[#11131c] dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    {iconElement}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Bus Category Sub-filters (Roadways vs Private) */}
          {filterType === 'bus' && (
            <div className="flex gap-2 pb-3 mb-2 border-b border-slate-100 dark:border-slate-850">
              <button
                onClick={() => setBusSubFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer border ${
                  busSubFilter === 'all'
                    ? 'bg-blue-50 border-blue-250 text-[#0056fb] dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-400'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-[#11131c] dark:border-slate-800 dark:text-slate-450 dark:hover:bg-slate-850'
                }`}
              >
                All Buses
              </button>
              <button
                onClick={() => setBusSubFilter('roadways')}
                className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer border ${
                  busSubFilter === 'roadways'
                    ? 'bg-blue-50 border-blue-250 text-[#0056fb] dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-400'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-[#11131c] dark:border-slate-800 dark:text-slate-450 dark:hover:bg-slate-850'
                }`}
              >
                State Roadways (HRTC/RSRTC)
              </button>
              <button
                onClick={() => setBusSubFilter('private')}
                className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer border ${
                  busSubFilter === 'private'
                    ? 'bg-blue-50 border-blue-250 text-[#0056fb] dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-400'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-[#11131c] dark:border-slate-800 dark:text-slate-450 dark:hover:bg-slate-850'
                }`}
              >
                Private Operators (Volvo AC)
              </button>
            </div>
          )}

          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>
              {filterType === 'bus' 
                ? `Bus Services Found (${processedOptions.length})` 
                : filterType === 'all' 
                ? `All Services Found (${processedOptions.length})` 
                : `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Services Found (${processedOptions.length})`
              }
            </span>
            <span className="flex items-center gap-1 text-emerald-600">
              <Shield size={13} />
              IRCTC / Operator Certified Partner
            </span>
          </div>

          <div className="space-y-3.5">
            {processedOptions.map((opt, i) => {
              const details = getOperatorDetails(opt);
              return (
                <div 
                  key={i}
                  className="platform-card bg-white p-5 rounded-3xl border border-slate-200 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-5 text-xs text-left"
                >
                  {/* Left Column: Visual Icon & Title */}
                  <div className="flex items-center gap-4.5">
                    <div className={`w-12 h-12 rounded-2xl ${details.logoColor} flex items-center justify-center text-white shrink-0`}>
                      {opt.vehicleType === 'bus' && <Bus size={20} />}
                      {opt.vehicleType === 'cab' && <Car size={20} />}
                      {opt.vehicleType === 'train' && <Train size={20} />}
                      {opt.vehicleType === 'flight' && <Plane size={20} />}
                      {opt.vehicleType === 'auto' && <Compass size={20} />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">{details.code}</span>
                        {opt.vehicleType === 'train' && <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase">Superfast</span>}
                        {opt.vehicleType === 'flight' && <span className="text-[9px] bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded font-bold uppercase">AirConnect</span>}
                        {opt.vehicleType === 'bus' && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border ${
                            opt.busCategory === 'roadways'
                              ? 'bg-blue-550/10 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
                              : 'bg-indigo-550/10 text-indigo-600 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30'
                          }`}>
                            {opt.busCategory === 'roadways' ? 'State Roadways' : 'Private Operator'}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold">{details.subName}</p>
                      
                      <div className="flex flex-wrap gap-2 pt-1">
                        {details.features.map((feat, idx) => (
                          <span key={idx} className="text-[9px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Timing & Stop parameters */}
                  <div className="flex items-center gap-6 justify-between w-full md:w-auto text-left py-2 border-y md:border-y-0 border-slate-100">
                    <div>
                      <p className="font-bold text-slate-700">{details.departureTime}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">Start</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] text-slate-400 font-bold">{details.durationLabel}</span>
                      <div className="w-16 h-0.5 bg-slate-200 relative my-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <span className="text-[8px] text-emerald-600 font-bold">Non Stop</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">{details.arrivalTime}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">End</p>
                    </div>
                  </div>

                  {/* Right Column: Price & Book action */}
                  <div className="text-right w-full md:w-auto flex md:flex-col justify-between md:justify-start items-center md:items-end gap-2.5">
                    <div>
                      <p className="text-sm font-black text-slate-800">{details.priceLabel}</p>
                      <p className="text-[9px] text-slate-400 font-bold">onwards</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-[10px] font-bold text-slate-400 hover:underline">{details.detailLabel}</button>
                      <button 
                        onClick={() => {
                          setSelectedOption(opt);
                          setCurrentScreen('details');
                        }}
                        className="px-4 py-2 bg-[#0056fb] hover:bg-[#0046d5] text-white text-[10px] font-bold rounded-xl shadow-md shadow-blue-500/10 cursor-pointer"
                      >
                        {details.btnLabel}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

// --- PAYMENT CHECKOUT SCREEN (MATCHES IMAGE 1) ---
const BookingDetailsScreen: React.FC = () => {
  const { locations, searchParams, selectedOption, createBooking, setCurrentScreen, addNotification } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbank' | 'wallet' | 'emi' | 'later'>('upi');
  const [bookingLoading, setBookingLoading] = useState(false);

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!selectedOption) return null;

  const src = locations.find(l => l.id === searchParams.sourceId);
  const dest = locations.find(l => l.id === searchParams.destinationId);

  // Price calculations matching Image 1
  const ticketFare = Math.round(selectedOption.totalPrice);
  const seatCharges = Math.round(ticketFare * 0.05);
  const boardingCharges = 50;
  const serviceFee = 149;
  const convenienceFee = 100;
  
  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME100') {
      setDiscount(100);
      setAppliedCode(code);
      addNotification('Coupon Applied', 'flat ₹100 discount applied to your trip!', 'success');
    } else if (code === 'CONNECT250') {
      if (ticketFare >= 1000) {
        setDiscount(250);
        setAppliedCode(code);
        addNotification('Coupon Applied', 'flat ₹250 discount applied to your cab booking!', 'success');
      } else {
        setCouponError('Minimum booking value of ₹1,000 required for this coupon.');
      }
    } else if (code === 'T+PASS') {
      const passDiscount = Math.round(ticketFare * 0.1);
      setDiscount(passDiscount);
      setAppliedCode(code);
      addNotification('Coupon Applied', `10% pass discount (₹${passDiscount}) applied!`, 'success');
    } else {
      setCouponError('Invalid promo code. Please try another one.');
    }
  };

  const totalAmount = Math.max(0, ticketFare + seatCharges + boardingCharges + serviceFee + convenienceFee - discount);

  const handleConfirmBooking = () => {
    setBookingLoading(true);
    setTimeout(() => {
      setBookingLoading(false);
      
      // Compute mock booking info for confirmed page
      const bObj = createBooking(selectedOption, paymentMethod.toUpperCase());
      bObj.totalPrice = totalAmount; // align price with INR formatting
      
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6 text-left relative"
    >
      {bookingLoading && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#0056fb] border-t-transparent animate-spin mb-4" />
          <p className="text-xs font-bold text-white">Verifying Secure Payment Link...</p>
        </div>
      )}

      {/* Header Back button */}
      <button 
        onClick={() => setCurrentScreen('options')}
        className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
      >
        ← Back to Review
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Section: Choose Payment Method (Matches Image 1) */}
        <div className="flex-1 platform-card bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
          <h3 className="text-base font-extrabold text-slate-800 mb-6">Choose Payment Method</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Payment category vertical tabs */}
            <div className="md:col-span-5 flex flex-col gap-2">
              {(['upi', 'card', 'netbank', 'wallet', 'emi', 'later'] as const).map(method => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`w-full text-left px-3 py-3 rounded-xl border text-[10px] font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === method 
                      ? 'border-[#0056fb] bg-blue-50/50 text-[#0056fb]' 
                      : 'border-slate-200/80 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <CreditCard size={14} />
                  <span className="capitalize">
                    {method === 'upi' ? 'UPI / QR' : 
                     method === 'card' ? 'Credit / Debit Card' : 
                     method === 'netbank' ? 'Net Banking' : 
                     method === 'wallet' ? 'Wallets' : 
                     method === 'emi' ? 'EMI Options' : 'Pay Later'}
                  </span>
                </button>
              ))}
            </div>

            {/* Pay using selected method details */}
            <div className="md:col-span-7 space-y-5 border-l border-slate-100 pl-6">
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-extrabold text-slate-700 text-xs">Pay using UPI</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Scan the QR code using any UPI app</p>
                  </div>

                  {/* Logo grid */}
                  <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 justify-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">GPay</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">PhonePe</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Paytm</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">BHIM</span>
                  </div>

                  {/* QR Code Graphic box (matches Image 1) */}
                  <div className="border border-slate-200 rounded-2xl p-4 flex flex-col items-center max-w-xs mx-auto bg-white shadow-inner">
                    {/* Simulated QR Code grid */}
                    <div className="w-32 h-32 bg-slate-100 flex items-center justify-center border border-slate-200 border-dashed rounded-lg mb-3">
                      <div className="w-24 h-24 bg-slate-900 flex flex-wrap items-center justify-center p-2 rounded">
                        <div className="w-full h-full bg-white flex items-center justify-center font-black text-slate-900 text-sm">QR CODE</div>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 font-semibold">Amount to Pay</span>
                    <span className="text-base font-black text-slate-800">₹{totalAmount.toLocaleString()}</span>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Enter UPI ID</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="username@upi"
                        className="w-full platform-input rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                      <button 
                        onClick={handleConfirmBooking}
                        className="px-4 py-2 bg-[#0056fb] hover:bg-[#0046d5] text-white text-[10px] font-bold rounded-xl shadow-md shadow-blue-500/10 cursor-pointer shrink-0"
                      >
                        Verify & Pay
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod !== 'upi' && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-slate-700 text-xs capitalize">Pay via {paymentMethod}</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">Enter your credentials below to process settlement.</p>
                  
                  <div className="space-y-3">
                    <input type="text" placeholder="Card / Account Number" className="w-full platform-input rounded-xl px-3 py-2 text-xs focus:outline-none" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="MM / YY" className="w-full platform-input rounded-xl px-3 py-2 text-xs focus:outline-none" />
                      <input type="password" placeholder="CVV" className="w-full platform-input rounded-xl px-3 py-2 text-xs focus:outline-none" />
                    </div>
                  </div>

                  <button 
                    onClick={handleConfirmBooking}
                    className="w-full py-2.5 bg-[#0056fb] hover:bg-[#0046d5] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/10 cursor-pointer"
                  >
                    Confirm & Complete Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Trip Summary & Price Breakdown (Matches Image 1) */}
        <div className="w-full md:w-80 space-y-4">
          <div className="platform-card bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md">
            <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-4">Trip Summary</h3>

            {/* Operator Details */}
            <div className="flex gap-3 items-center border-b border-slate-100 pb-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-500 shrink-0">
                {selectedOption.vehicleType === 'bus' ? <Bus size={18} /> : <Car size={18} />}
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800">{selectedOption.providerName}</p>
                <p className="text-[10px] text-slate-400 font-semibold">{selectedOption.vehicleType === 'bus' ? 'AC Volvo Sleeper' : 'Sedan class'}</p>
              </div>
            </div>

            {/* Time schedule mapping */}
            <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100 mb-3">
              <div>
                <p className="font-bold text-slate-700">08:00 PM</p>
                <p className="text-[9px] text-slate-400 font-semibold">{src?.name}</p>
              </div>
              <div className="text-center">
                <span className="text-[9px] text-slate-400 font-bold">12h 30m</span>
                <div className="w-12 h-px bg-slate-200 my-0.5" />
                <span className="text-[8px] text-emerald-600 font-bold">Non Stop</span>
              </div>
              <div>
                <p className="font-bold text-slate-700">08:30 AM</p>
                <p className="text-[9px] text-slate-400 font-semibold">{dest?.name}</p>
              </div>
            </div>

            {/* Price Table Details */}
            <div className="space-y-2 text-[10px] text-slate-500 font-semibold pb-3 border-b border-slate-100 mb-3">
              <div className="flex justify-between"><span>Ticket Fare (1 Adult)</span><span>₹{ticketFare.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Seat Charges</span><span>₹{seatCharges.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Boarding Point Charges</span><span>₹{boardingCharges}</span></div>
              <div className="flex justify-between"><span>Service Fee</span><span>₹{serviceFee}</span></div>
              <div className="flex justify-between"><span>Convenience Fee</span><span>₹{convenienceFee}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount ({appliedCode})</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Promo Code Input */}
            <div className="mb-4 pt-1">
              <label className="block text-[9px] font-extrabold text-slate-450 dark:text-slate-500 uppercase mb-1.5 tracking-wider ml-1">Promo Code</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter code (e.g. WELCOME100)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-[10px] focus:outline-none"
                />
                <button 
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-xl cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[9px] text-red-500 font-semibold mt-1 ml-1">{couponError}</p>}
              {appliedCode && <p className="text-[9px] text-emerald-600 font-bold mt-1 ml-1">✓ Promo applied successfully!</p>}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">Total Amount</span>
              <span className="text-lg font-black text-[#0056fb]">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- LIVE VEHICLE TRACKING SCREEN ---
const LiveTrackingScreen: React.FC = () => {
  const { activeBooking, updateBookingStatus, setCurrentScreen, locations, t } = useApp();
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(activeBooking?.etaMinutes || 5);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const intervalRef = useRef<any>(null);

  const src = locations.find(l => l.id === activeBooking?.sourceId);
  const dest = locations.find(l => l.id === activeBooking?.destinationId);

  const getProgressCoords = () => {
    if (!src || !dest) return { x: 50, y: 50 };
    const dx = dest.x - src.x;
    const dy = dest.y - src.y;
    return {
      x: Math.round(src.x + dx * (progress / 100)),
      y: Math.round(src.y + dy * (progress / 100))
    };
  };

  const animCoords = getProgressCoords();

  useEffect(() => {
    if (!activeBooking) return;
    
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(intervalRef.current!);
          updateBookingStatus(activeBooking.id, 'completed');
          return 100;
        }
        return next;
      });
      setEta(prev => (prev > 1 ? prev - 0.25 : 1));
    }, 1200);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeBooking, updateBookingStatus]);

  if (!activeBooking) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left"
    >
      <div className="md:col-span-7">
        <SVGMapBackground 
          sourceId={activeBooking.sourceId} 
          destId={activeBooking.destinationId} 
          animatingBookingId={activeBooking.id}
          progress={progress}
          heightClass="h-[480px]"
        />
      </div>

      <div className="md:col-span-5 flex flex-col gap-4">
        <div className="platform-card bg-white p-5 rounded-3xl border border-slate-200 shadow-md flex flex-col gap-4">
          <div className="flex justify-between items-start border-b border-slate-100 pb-2">
            <div>
              <span className="text-[9px] bg-blue-50 border border-blue-100 text-[#0056fb] px-2 py-0.5 rounded font-extrabold uppercase">
                {t('live_tracking')}
              </span>
              <h3 className="text-sm font-bold text-slate-800 mt-1">En Route Destination</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold">{t('eta')}</span>
              <p className="text-lg font-black text-[#0056fb]">{Math.round(eta)} Min</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>Trip Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0056fb] flex items-center justify-center font-bold text-xs">
                {activeBooking.driverName?.[0]}
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-700">{activeBooking.driverName}</p>
                <p className="text-[10px] text-slate-400">{activeBooking.vehicleModel} • <strong className="text-[#0056fb]">{activeBooking.vehicleNumber}</strong></p>
              </div>
            </div>
            <a 
              href={`tel:${activeBooking.driverPhone}`}
              className="p-2 rounded-xl bg-white border border-slate-200 text-[#0056fb]"
            >
              <Phone size={13} />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button 
              onClick={() => setShowShareModal(true)}
              className="py-2.5 rounded-xl border border-slate-250 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              Share Trip
            </button>
            <button 
              onClick={() => {
                if (window.confirm("Cancel this ride?")) {
                  updateBookingStatus(activeBooking.id, 'cancelled');
                  setCurrentScreen('home');
                }
              }}
              className="py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100/50 text-red-500 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              Cancel Ride
            </button>
          </div>

          <button 
            onClick={() => setShowSOSModal(true)}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            SOS - PANIC ALARM
          </button>
        </div>
      </div>

      {/* SOS Alert Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#151824] border-2 border-red-500 p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">SOS Safety System Activated</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Security dispatch notified. Shared coordinates ({animCoords.x}, {animCoords.y}) and trip ID with local authorities.
            </p>
            <button 
              onClick={() => setShowSOSModal(false)}
              className="w-full py-3 rounded-2xl bg-red-500 text-white font-bold text-xs cursor-pointer"
            >
              Cancel Alarm
            </button>
          </div>
        </div>
      )}

      {/* Share Trip Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#151824] border border-slate-200 dark:border-slate-800 p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Share Live Tracking Link</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Send tracking link to friends or family.</p>
            <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] text-blue-600 dark:text-blue-400 break-all select-all mb-6">
              https://travelconnect.com/track/{activeBooking.id}
            </div>
            <button 
              onClick={() => setShowShareModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#0056fb] text-white font-bold text-xs cursor-pointer"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// --- BOOKING CONFIRMED SUCCESS DETAILS (MATCHES IMAGE 7) ---
const TripCompletedScreen: React.FC = () => {
  const { activeBooking, submitReview, locations, searchParams } = useApp();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!activeBooking) return null;

  const src = locations.find(l => l.id === activeBooking.sourceId);
  const dest = locations.find(l => l.id === activeBooking.destinationId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(activeBooking.id, rating, comment);
  };

  const ticketFare = Math.round(activeBooking.totalPrice * 0.9);
  const convenienceFee = 25;
  const gst = Math.round(activeBooking.totalPrice * 0.05);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 text-left"
    >
      {/* Booking Confirmed Header banner (Matches Image 7) */}
      <div className="relative bg-emerald-50 rounded-3xl p-6 border border-emerald-100 flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden shadow-sm">
        <div className="flex items-center gap-4.5">
          <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
            <Check size={28} strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-emerald-800">Booking Confirmed!</h2>
            <p className="text-xs text-emerald-700/80 font-semibold mt-1">Your booking has been confirmed successfully. Details sent to email and SMS.</p>
            <p className="text-[10px] text-slate-400 font-bold mt-2">Booking ID: <span className="text-[#0056fb] uppercase">{activeBooking.id}0A{activeBooking.vehicleId}F</span></p>
          </div>
        </div>

        {/* Bus / Vehicle graphic visual */}
        <div className="hidden lg:block w-36 h-20 opacity-90 shrink-0">
          <svg className="w-full h-full text-slate-400" viewBox="0 0 100 50" fill="currentColor">
            <rect x="5" y="10" width="85" height="30" rx="6" />
            <rect x="15" y="15" width="20" height="10" rx="1" fill="#fff" />
            <rect x="40" y="15" width="20" height="10" rx="1" fill="#fff" />
            <rect x="65" y="15" width="20" height="10" rx="1" fill="#fff" />
            <circle cx="25" cy="42" r="6" fill="#334155" />
            <circle cx="75" cy="42" r="6" fill="#334155" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column details grid */}
        <div className="md:col-span-8 space-y-4">
          
          {/* Trip Details card with embedded map drawing */}
          <div className="platform-card bg-white p-5 rounded-3xl border border-slate-200 shadow-md">
            <h3 className="text-xs uppercase font-extrabold text-slate-400 mb-3 flex items-center gap-1.5"><History size={13} /> Trip Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4 text-xs font-semibold text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="block text-[8px] uppercase text-slate-400 font-bold">Boarding Point</span>
                    <span className="text-slate-800 font-extrabold">{src?.name}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="block text-[8px] uppercase text-slate-400 font-bold">Dropping Point</span>
                    <span className="text-slate-800 font-extrabold">{dest?.name}</span>
                  </div>
                </div>
                <div className="flex gap-4 pt-1 border-t border-slate-100">
                  <div>
                    <span className="block text-[8px] uppercase text-slate-400 font-bold">Date</span>
                    <span className="text-slate-700 font-bold">{searchParams.date}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase text-slate-400 font-bold">Departure</span>
                    <span className="text-slate-700 font-bold">08:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Embedded static path image map */}
              <div className="h-80 bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden shadow-inner relative">
                <SVGMapBackground sourceId={activeBooking.sourceId} destId={activeBooking.destinationId} heightClass="h-full" />
              </div>
            </div>
          </div>

          {/* Vehicle & Operator details */}
          <div className="platform-card bg-white p-5 rounded-3xl border border-slate-200 shadow-md text-xs">
            <h3 className="text-xs uppercase font-extrabold text-slate-400 mb-3">Vehicle & Driver Details</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-850">{activeBooking.driverName}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{activeBooking.vehicleModel} • {activeBooking.vehicleNumber} • Seat A12</p>
              </div>
              <span className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-bold">
                Seat Number: A12
              </span>
            </div>
          </div>

          {/* Important Information instructions */}
          <div className="platform-card bg-white p-5 rounded-3xl border border-slate-200 shadow-md text-xs space-y-2">
            <h3 className="text-xs uppercase font-extrabold text-slate-400 mb-2">Important Information</h3>
            <div className="space-y-1 text-[11px] text-slate-500 font-semibold leading-relaxed">
              <p className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500 shrink-0" /> Please reach the boarding point 30 minutes before departure time.</p>
              <p className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500 shrink-0" /> Carry a valid photo ID proof for operator verification.</p>
              <p className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500 shrink-0" /> Cancellation is allowed up to 6 hours before departure to get full refund.</p>
            </div>
          </div>
        </div>

        {/* Right Column details grid */}
        <div className="md:col-span-4 space-y-4">
          
          {/* Payment Summary card (Matches Image 7) */}
          <div className="platform-card bg-white p-5 rounded-3xl border border-slate-200 shadow-md">
            <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-4">Payment Summary</h3>
            
            <div className="space-y-2 text-[10px] text-slate-500 font-semibold border-b border-slate-100 pb-3 mb-3">
              <div className="flex justify-between"><span>Ticket Fare</span><span>₹{ticketFare.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Convenience Fee</span><span>₹{convenienceFee}</span></div>
              <div className="flex justify-between"><span>GST (5%)</span><span>₹{gst}</span></div>
            </div>

            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
              <span className="text-xs font-bold text-slate-700">Total Amount</span>
              <span className="text-base font-black text-slate-800">₹{activeBooking.totalPrice.toLocaleString()}</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-center text-[10px] font-bold text-emerald-700 flex items-center justify-center gap-1">
              <CheckCircle size={12} /> Paid Successfully via UPI
            </div>
          </div>

          {/* Review form inline on confirmation screen */}
          <div className="platform-card bg-white p-5 rounded-3xl border border-slate-200 shadow-md">
            <h3 className="text-xs uppercase font-extrabold text-slate-400 mb-3">Leave a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-1 justify-center py-1">
                {[1,2,3,4,5].map(star => (
                  <button 
                    type="button" 
                    key={star} 
                    onClick={() => setRating(star)}
                    className="text-amber-500 text-lg hover:scale-105 transition-transform"
                  >
                    <Star size={18} fill={star <= rating ? '#f59e0b' : 'none'} />
                  </button>
                ))}
              </div>
              <input 
                type="text" 
                placeholder="Rate driver behavior..." 
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full platform-input rounded-xl px-2 py-1.5 text-xs focus:outline-none"
              />
              <button 
                type="submit"
                className="w-full py-2 bg-[#0056fb] hover:bg-[#0046d5] text-white text-[10px] font-bold rounded-lg shadow-sm"
              >
                Submit Star Review
              </button>
            </form>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

// --- SETTINGS / PROFILE SCREEN (MATCHES IMAGE 2) ---
const ProfileScreen: React.FC = () => {
  const { currentUser } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'preferences' | 'notifications' | 'settings'>('preferences');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 text-left grid grid-cols-1 md:grid-cols-12 gap-6"
    >
      {/* Sidebar Navigation */}
      <div className="md:col-span-3 flex flex-col gap-1 bg-white dark:bg-[#11131c] border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-sm h-fit">
        <div className="pb-3 mb-2 border-b border-slate-100 dark:border-slate-850">
          <span className="text-[10px] font-extrabold text-[#0056fb] uppercase tracking-wider">Account Panel</span>
          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mt-0.5 truncate">{currentUser?.fullName}</h4>
        </div>
        
        <button 
          onClick={() => setActiveSubTab('profile')}
          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'profile' 
              ? 'bg-blue-50 text-[#0056fb] dark:bg-blue-950/20' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-850'
          }`}
        >
          My Profile
        </button>
        <button 
          onClick={() => setActiveSubTab('preferences')}
          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'preferences' 
              ? 'bg-blue-50 text-[#0056fb] dark:bg-blue-950/20' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-850'
          }`}
        >
          Preferences
        </button>
        <button 
          onClick={() => setActiveSubTab('notifications')}
          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'notifications' 
              ? 'bg-blue-50 text-[#0056fb] dark:bg-blue-950/20' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-850'
          }`}
        >
          Notifications
        </button>
      </div>

      {/* Main Form Area (Matches Image 2) */}
      <div className="md:col-span-9 space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-150">Settings</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage your account settings and preferences.</p>
        </div>

        {activeSubTab === 'preferences' && (
          <div className="space-y-5">
            {/* Account settings card */}
            <div className="platform-card bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">Account Settings</span>
                <span className="text-[10px] text-slate-400">Manage credentials</span>
              </div>
              <div className="space-y-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-[8px] uppercase text-slate-400 font-bold">Email Address</span>
                    <span className="text-slate-800 font-bold">{currentUser?.email}</span>
                  </div>
                  <button className="px-3.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-[10px] font-bold text-[#0056fb] cursor-pointer">Change Email</button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-[8px] uppercase text-slate-400 font-bold">Phone Number</span>
                    <span className="text-slate-800 font-bold">{currentUser?.phone}</span>
                  </div>
                  <button className="px-3.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-[10px] font-bold text-[#0056fb] cursor-pointer">Change Phone</button>
                </div>
              </div>
            </div>

            {/* Custom Preferences */}
            <div className="platform-card bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">User Preferences</span>
                <span className="text-[10px] text-slate-400">Customize localization</span>
              </div>
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Currency</label>
                  <select className="w-full platform-input rounded-xl px-3 py-2 text-xs focus:outline-none font-semibold">
                    <option>Indian Rupee (INR)</option>
                    <option>US Dollar (USD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Date Format</label>
                  <select className="w-full platform-input rounded-xl px-3 py-2 text-xs focus:outline-none font-semibold">
                    <option>DD MMM YYYY (25 May 2024)</option>
                    <option>YYYY-MM-DD (2024-05-25)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'profile' && (
          <div className="platform-card bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-xs space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[9px] uppercase text-slate-400 font-bold">User Name</span>
                <span className="text-slate-800 font-bold text-sm">{currentUser?.fullName}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase text-slate-400 font-bold">Designated Role</span>
                <span className="text-slate-800 font-bold text-sm capitalize">{currentUser?.role.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'notifications' && (
          <div className="platform-card bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-xs space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Notification Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between font-bold text-slate-700">
                <span>Receive Email Notifications</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#0056fb] accent-[#0056fb]" />
              </label>
              <label className="flex items-center justify-between font-bold text-slate-700">
                <span>SMS Notifications</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#0056fb] accent-[#0056fb]" />
              </label>
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};

// --- INTERPOLATE PATH COORDINATES ---
const interpolatePath = (coords: [number, number][], progressPercentage: number): [number, number] => {
  if (coords.length === 0) return [0, 0];
  if (coords.length === 1) return coords[0];
  if (progressPercentage <= 0) return coords[0];
  if (progressPercentage >= 100) return coords[coords.length - 1];

  const distances: number[] = [0];
  let totalDistance = 0;
  for (let i = 1; i < coords.length; i++) {
    const lat1 = coords[i - 1][0];
    const lng1 = coords[i - 1][1];
    const lat2 = coords[i][0];
    const lng2 = coords[i][1];
    const d = Math.sqrt((lat2 - lat1) ** 2 + (lng2 - lng1) ** 2);
    totalDistance += d;
    distances.push(totalDistance);
  }

  if (totalDistance === 0) return coords[0];
  const targetDistance = totalDistance * (progressPercentage / 100);

  for (let i = 1; i < distances.length; i++) {
    if (targetDistance <= distances[i]) {
      const segStart = coords[i - 1];
      const segEnd = coords[i];
      const segDist = distances[i] - distances[i - 1];
      if (segDist === 0) return segStart;
      const ratio = (targetDistance - distances[i - 1]) / segDist;
      return [
        segStart[0] + (segEnd[0] - segStart[0]) * ratio,
        segStart[1] + (segEnd[1] - segStart[1]) * ratio
      ];
    }
  }

  return coords[coords.length - 1];
};

// --- INTERACTIVE LEAFLET INDIA MAP VIEW WITH REAL ROADS ---
export const SVGMapBackground: React.FC<{ 
  sourceId: number | null; 
  destId: number | null; 
  animatingBookingId?: number | null; 
  progress?: number;
  heightClass?: string;
}> = ({ sourceId, destId, animatingBookingId, progress = 0, heightClass = 'h-full min-h-[350px]' }) => {
  const { locations, theme } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);

  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  const srcLoc = locations.find(l => l.id === sourceId);
  const destLoc = locations.find(l => l.id === destId);

  // Fetch real road route geometry from OSRM
  useEffect(() => {
    if (!srcLoc || !destLoc) {
      setRouteCoords([]);
      return;
    }

    let active = true;
    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${srcLoc.lng},${srcLoc.lat};${destLoc.lng},${destLoc.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (active && data.code === 'Ok' && data.routes?.[0]?.geometry?.coordinates) {
          const points = data.routes[0].geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number]);
          setRouteCoords(points);
        } else if (active) {
          // Fail-safe direct connection fallback
          setRouteCoords([[srcLoc.lat, srcLoc.lng], [destLoc.lat, destLoc.lng]]);
        }
      } catch (err) {
        console.warn("OSRM Route fetch failed. Falling back to direct line connection:", err);
        if (active) {
          setRouteCoords([[srcLoc.lat, srcLoc.lng], [destLoc.lat, destLoc.lng]]);
        }
      }
    };

    fetchRoute();

    return () => {
      active = false;
    };
  }, [sourceId, destId, locations, srcLoc, destLoc]);

  // Leaflet map setup and updating effect
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false
      }).setView([20.5937, 78.9629], 4.5);
      
      // Force resize recalculation shortly after render
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 150);
    }

    const map = mapRef.current;

    // Watch container size changes dynamically
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    });
    resizeObserver.observe(mapContainerRef.current);

    // Set up CartoDB tile layer based on active theme (Voyager for light, Dark Matter for dark)
    const isDark = theme === 'dark';
    const tileUrl = isDark 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

    if (!tileLayerRef.current) {
      tileLayerRef.current = L.tileLayer(tileUrl, { attribution }).addTo(map);
    } else {
      tileLayerRef.current.setUrl(tileUrl);
    }

    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Clear previous polyline
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    // Clear previous vehicle marker
    if (vehicleMarkerRef.current) {
      vehicleMarkerRef.current.remove();
      vehicleMarkerRef.current = null;
    }

    // Plot only the selected departure and arrival terminal markers, hiding all other unselected nodes/dots
    locations.forEach(loc => {
      const isSrc = loc.id === sourceId;
      const isDest = loc.id === destId;
      const isSelected = isSrc || isDest;

      if (!isSelected) {
        return; // skip non-selected nodes
      }

      let iconHtml = '';
      let iconSize: [number, number] = [16, 16];
      let iconAnchor: [number, number] = [8, 8];

      if (isSrc) {
        iconHtml = `<div class="w-6 h-6 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50"><div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute"></div><div class="w-2.5 h-2.5 rounded-full bg-emerald-500 z-10"></div></div>`;
        iconSize = [24, 24];
        iconAnchor = [12, 12];
      } else if (isDest) {
        iconHtml = `<div class="w-6 h-6 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center shadow-lg shadow-red-500/50"><div class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping absolute"></div><div class="w-2.5 h-2.5 rounded-full bg-red-500 z-10"></div></div>`;
        iconSize = [24, 24];
        iconAnchor = [12, 12];
      }

      const icon = L.divIcon({
        className: `custom-marker-div ${isSrc ? 'src' : 'dest'}`,
        html: iconHtml,
        iconSize,
        iconAnchor
      });

      const marker = L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .bindTooltip(loc.name.split(' (')[0], {
          permanent: isSelected,
          direction: 'top',
          offset: [0, -10],
          className: `custom-tooltip ${isSelected ? 'tooltip-selected font-black' : 'tooltip-normal opacity-70'}`
        });

      markersRef.current.push(marker);
    });

    // Draw active routing path
    if (srcLoc && destLoc) {
      const latlngs = routeCoords.length > 0 
        ? routeCoords 
        : [[srcLoc.lat, srcLoc.lng], [destLoc.lat, destLoc.lng]] as [number, number][];

      polylineRef.current = L.polyline(latlngs, {
        color: '#0056fb',
        weight: 4.5,
        opacity: 0.85,
        dashArray: '8, 6'
      }).addTo(map);

      // Render pulsing vehicle marker during tracking animation
      if (animatingBookingId && progress > 0) {
        const [currentLat, currentLng] = interpolatePath(latlngs, progress);

        const vIconHtml = `<div class="w-9 h-9 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/50"><div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-xs shadow-sm animate-pulse z-10">🚗</div></div>`;
        
        const vehicleIcon = L.divIcon({
          className: 'custom-vehicle-div',
          html: vIconHtml,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        vehicleMarkerRef.current = L.marker([currentLat, currentLng], { icon: vehicleIcon })
          .addTo(map)
          .bindTooltip("Your Ride", {
            permanent: true,
            direction: 'bottom',
            offset: [0, 10],
            className: 'tooltip-vehicle font-bold text-[#0056fb] px-2 py-0.5 rounded shadow'
          });
      }

      // Adjust map focus area
      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 9,
        animate: true,
        duration: 1
      });
    } else {
      // Zoom out to fit all nodes of India
      if (locations.length > 0) {
        const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng]));
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 6,
          animate: true,
          duration: 1
        });
      } else {
        map.setView([20.5937, 78.9629], 4.5);
      }
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [sourceId, destId, progress, theme, locations, animatingBookingId, routeCoords]);

  // Map cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      tileLayerRef.current = null;
    };
  }, []);

  return (
    <div className={`relative w-full ${heightClass} bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden shadow-inner z-0 border border-slate-200 dark:border-slate-800`}>
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />
    </div>
  );
};

// --- BOOKINGS HISTORY SCREEN ---
const BookingHistoryScreen: React.FC = () => {
  const { bookings, locations, setCurrentScreen, setActiveBooking, t } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  const getFilteredBookings = () => {
    switch (activeTab) {
      case 'active':
        return bookings.filter(b => b.status === 'pending' || b.status === 'accepted' || b.status === 'ongoing');
      case 'completed':
        return bookings.filter(b => b.status === 'completed');
      case 'cancelled':
        return bookings.filter(b => b.status === 'cancelled');
      default:
        return bookings;
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'ongoing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            En Route
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 border border-blue-200 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400">
            Accepted
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 border border-amber-200 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400">
            Pending
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-50 border border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 border border-red-200 text-red-500 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
            Cancelled
          </span>
        );
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bus': return <Bus size={18} className="text-blue-500" />;
      case 'cab': return <Car size={18} className="text-amber-500" />;
      case 'bike': return <Bike size={18} className="text-emerald-500" />;
      case 'train': return <Train size={18} className="text-purple-500" />;
      case 'flight': return <Plane size={18} className="text-rose-500" />;
      default: return <Compass size={18} className="text-slate-500" />;
    }
  };

  const filtered = getFilteredBookings();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto space-y-6 text-left"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-150">My Bookings History</h2>
          <p className="text-xs text-slate-450 dark:text-slate-500 font-semibold mt-0.5">Track your active trips and view receipt summaries for past travels.</p>
        </div>
        <button 
          onClick={() => setCurrentScreen('home')}
          className="px-4 py-2 bg-[#0056fb] hover:bg-[#0046d5] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          Book New Ride
        </button>
      </div>

      {/* Booking Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-px">
        {(['all', 'active', 'completed', 'cancelled'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-extrabold capitalize transition-all border-b-2 cursor-pointer ${
              activeTab === tab 
                ? 'border-[#0056fb] text-[#0056fb]' 
                : 'border-transparent text-slate-505 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {tab === 'active' ? 'Active / En Route' : tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map(booking => {
            const src = locations.find(l => l.id === booking.sourceId);
            const dest = locations.find(l => l.id === booking.destinationId);
            const isTrackable = booking.status === 'ongoing' || booking.status === 'accepted';
            const formattedDate = new Date(booking.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div 
                key={booking.id}
                className="platform-card bg-white dark:bg-[#151824] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:shadow-md transition-all"
              >
                {/* Left: Route and vehicle details */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 flex items-center justify-center shrink-0">
                    {getVehicleIcon(booking.vehicleModel?.split(' ')?.[0] || 'cab')}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-850 dark:text-slate-200 text-sm">
                        {src?.name.split(',')[0]} → {dest?.name.split(',')[0]}
                      </span>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      {booking.vehicleModel} • {booking.vehicleNumber} • {formattedDate}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold">
                      Driver: <strong className="text-slate-700 dark:text-slate-300">{booking.driverName}</strong> ({booking.driverPhone})
                    </p>
                  </div>
                </div>

                {/* Right: Pricing and Action Button */}
                <div className="text-right w-full md:w-auto flex md:flex-col justify-between md:justify-end items-center md:items-end gap-3.5 border-t md:border-t-0 pt-3.5 md:pt-0 border-slate-100 dark:border-slate-850">
                  <div>
                    <span className="text-[9px] text-slate-405 block uppercase font-bold">Amount Paid</span>
                    <span className="text-base font-black text-slate-800 dark:text-slate-200">₹{booking.totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isTrackable && (
                      <button
                        onClick={() => {
                          setActiveBooking(booking);
                          setCurrentScreen('tracking');
                        }}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-xl shadow-md shadow-emerald-500/15 cursor-pointer animate-pulse"
                      >
                        Track Ride
                      </button>
                    )}
                    {booking.status === 'completed' && (
                      <button
                        onClick={() => {
                          setCurrentScreen('home');
                        }}
                        className="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-900/30 text-[#0056fb] text-[10px] font-bold rounded-xl cursor-pointer"
                      >
                        Book Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="platform-card bg-white dark:bg-[#151824] border border-slate-205 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
            <History size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="font-extrabold text-sm text-slate-705 dark:text-slate-200">No Bookings Found</h3>
            <p className="text-[10px] text-slate-400 mt-1 mb-5">You have no bookings under this status tab.</p>
            <button 
              onClick={() => setCurrentScreen('home')}
              className="px-4 py-2 bg-[#0056fb] hover:bg-[#0046d5] text-white text-[10px] font-bold rounded-xl cursor-pointer"
            >
              Plan a Journey Now
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- ROUTES NETWORK SCREEN ---
const RoutesNetworkScreen: React.FC = () => {
  const { locations, searchRoutes, setSearchParams } = useApp();

  const networkConnections = [
    { id: 1, sourceId: 1, destinationId: 2, distance: '260 km', duration: '4h 45m', minPrice: '₹350', name: 'Delhi ↔ Jaipur Corridor', desc: 'Active private Volvo coaches, state roadways express, and flight services daily.', bg: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400' },
    { id: 2, sourceId: 3, destinationId: 4, distance: '980 km', duration: '14h 30m', minPrice: '₹1,250', name: 'Mumbai ↔ Bangalore Route', desc: 'Overnight premium sleeper buses, national express rail line, and AirConnect flights.', bg: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=400' },
    { id: 3, sourceId: 1, destinationId: 6, distance: '40 km', duration: '1h 10m', minPrice: '₹50', name: 'Delhi ↔ Suburban Commuter Link', desc: 'Frequent auto rickshaws, metro extensions, bike taxis and rapid transit shuttles.', bg: 'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?auto=format&fit=crop&q=80&w=400' },
    { id: 4, sourceId: 2, destinationId: 5, distance: '95 km', duration: '2h 20m', minPrice: '₹120', name: 'Jaipur ↔ Rural Valley Interlink', desc: 'Semi-urban state shuttle buses, local shared cabs, and auto rickshaw networks.', bg: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80&w=400' }
  ];

  const handleTriggerSearch = (sourceId: number, destId: number) => {
    const today = new Date().toISOString().split('T')[0];
    setSearchParams({ sourceId, destinationId: destId, date: today });
    searchRoutes(sourceId, destId, today);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto space-y-6 text-left"
    >
      <div>
        <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-150">Active Transportation Routes</h2>
        <p className="text-xs text-slate-450 dark:text-slate-550 font-semibold mt-0.5">Explore popular intercity connections. Click "Search Fares" to directly inspect live operator prices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {networkConnections.map(route => {
          const srcNode = locations.find(l => l.id === route.sourceId);
          const destNode = locations.find(l => l.id === route.destinationId);

          return (
            <div 
              key={route.id}
              className="platform-card rounded-3xl overflow-hidden border border-slate-205 dark:border-slate-800 bg-white dark:bg-[#151824] hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img 
                  src={route.bg} 
                  alt={route.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-[9px] uppercase font-black tracking-widest text-blue-400">High Capacity Interchange</span>
                  <h3 className="text-sm font-bold mt-0.5">{route.name}</h3>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">{route.desc}</p>
                  
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-2.5 rounded-2xl text-[10px] font-bold text-slate-550 text-center">
                    <div>
                      <span className="block text-[8px] text-slate-400 uppercase">Distance</span>
                      <span className="text-slate-805 dark:text-slate-200">{route.distance}</span>
                    </div>
                    <div className="border-x border-slate-200 dark:border-slate-850">
                      <span className="block text-[8px] text-slate-400 uppercase">Avg Time</span>
                      <span className="text-slate-805 dark:text-slate-200">{route.duration}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-400 uppercase">Min Fare</span>
                      <span className="text-[#0056fb] font-extrabold">{route.minPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-850 mt-4 flex items-center justify-between">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-slate-400 font-bold">100% Operational</span>
                  </div>
                  <button
                    onClick={() => handleTriggerSearch(route.sourceId, route.destinationId)}
                    className="px-4 py-2 bg-[#0056fb] hover:bg-[#0046d5] text-white text-[10px] font-bold rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition-all"
                  >
                    Search Fares
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// --- OFFERS SCREEN ---
const OffersScreen: React.FC = () => {
  const { addNotification } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const promoOffers = [
    { code: 'WELCOME100', title: 'New Traveler Offer', desc: 'Flat ₹100 discount applied to your very first booking across any private or public transport services.', discount: '₹100 Off', terms: 'No minimum booking amount. Valid for new accounts only.', bg: 'from-blue-600 via-[#0056fb] to-indigo-600' },
    { code: 'CONNECT250', title: 'Outstation Cab Special', desc: 'Save flat ₹250 on premium Hatchback, Sedan, or SUV cab bookings. Perfect for weekend intercity getaways.', discount: '₹250 Off', terms: 'Minimum booking amount of ₹1,000 required.', bg: 'from-amber-500 to-orange-600' },
    { code: 'T+PASS', title: 'Commuter Daily Pass', desc: 'Flat 10% discount on regular local Train tickets or Auto Rickshaw rides. Travel daily and save big.', discount: '10% Off', terms: 'Maximum discount of ₹150. Valid on Trains & Autos.', bg: 'from-purple-500 to-indigo-700' },
    { code: 'FESTIVE500', title: 'Flight Saver Promotion', desc: 'Planning a longer flight path? Copy this promo to claim flat ₹500 off on any domestic flight bookings.', discount: '₹500 Off', terms: 'Minimum booking amount of ₹4,000 required.', bg: 'from-rose-500 to-red-600' }
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    addNotification('Promo Copied', `Promo code '${code}' copied! Apply it during checkout to save.`, 'success');
    
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto space-y-6 text-left"
    >
      <div>
        <h2 className="text-xl font-extrabold text-slate-850 dark:text-slate-150">Offers & Promo Center</h2>
        <p className="text-xs text-slate-450 dark:text-slate-550 font-semibold mt-0.5">Copy active travel discount codes and apply them during payment checkout for instant fare deductions.</p>
      </div>

      {copiedCode && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle size={14} />
          Promo code <strong>{copiedCode}</strong> copied to clipboard! Paste it during checkout.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {promoOffers.map(offer => {
          const isCopied = copiedCode === offer.code;

          return (
            <div 
              key={offer.code}
              className="platform-card rounded-3xl overflow-hidden border border-slate-205 dark:border-slate-800 bg-white dark:bg-[#151824] hover:shadow-lg transition-all flex flex-col justify-between"
            >
              {/* Top gradient display */}
              <div className={`bg-gradient-to-r ${offer.bg} p-5 text-white flex justify-between items-center`}>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/75 bg-white/10 px-2 py-0.5 rounded-full">Limited Season</span>
                  <h3 className="font-extrabold text-sm">{offer.title}</h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-black">{offer.discount}</span>
                </div>
              </div>

              {/* Bottom details card */}
              <div className="p-5 flex-1 flex flex-col justify-between text-xs">
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-550 dark:text-slate-400 font-semibold leading-relaxed">{offer.desc}</p>
                  
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 px-3.5 py-2.5 rounded-2xl">
                    <span className="font-mono font-black text-slate-700 dark:text-slate-300 tracking-wide text-xs select-all">{offer.code}</span>
                    <button 
                      onClick={() => handleCopyCode(offer.code)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer flex items-center gap-1.5 transition-all ${
                        isCopied
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                          : 'bg-[#0056fb] hover:bg-[#0046d5] text-white shadow-md shadow-blue-500/10'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check size={11} strokeWidth={3} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          Copy Code
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-850 pt-3 mt-4 text-[9px] text-slate-400 dark:text-slate-550 font-semibold">
                  Terms: {offer.terms}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

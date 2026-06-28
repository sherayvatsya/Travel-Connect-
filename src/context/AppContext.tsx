import React, { createContext, useContext, useState, useEffect } from 'react';

const AUTH_SESSION_STORAGE_KEY = 'travelconnect.auth.session';
const AUTH_SESSION_FALLBACK_KEY = 'travelconnect.auth.session.temp';

// --- TYPES ---

export type Role = 'customer' | 'cab_driver' | 'bus_operator' | 'auto_driver' | 'bike_driver' | 'train_provider' | 'flight_provider' | 'admin';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  profileImage?: string;
  createdAt: string;
}

export interface Provider {
  id: number;
  userId: number;
  businessName: string;
  licenseNumber: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rating: number;
}

export interface Vehicle {
  id: number;
  providerId: number;
  vehicleType: 'cab' | 'bus' | 'auto' | 'bike' | 'train' | 'flight';
  vehicleNumber: string;
  modelName: string;
  capacity: number;
  status: 'available' | 'busy' | 'inactive';
}

export interface Location {
  id: number;
  name: string;
  x: number; // 0-100 for SVG coordinate system
  y: number; // 0-100 for SVG coordinate system
  lat: number;
  lng: number;
}

export interface Route {
  id: number;
  providerId: number | null; // null for public standard routes
  sourceId: number;
  destinationId: number;
  distanceKm: number;
  durationMinutes: number;
}

export interface Pricing {
  id: number;
  routeId: number;
  vehicleId: number;
  baseFare: number;
  pricePerKm: number;
  surgeMultiplier: number;
}

export interface Booking {
  id: number;
  customerId: number;
  providerId: number;
  vehicleId: number;
  sourceId: number;
  destinationId: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  etaMinutes?: number;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  vehicleModel?: string;
}

export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'success' | 'failed';
  transactionId: string;
  createdAt: string;
}

export interface Review {
  id: number;
  bookingId: number;
  customerId: number;
  providerId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface SupportTicket {
  id: number;
  userId: number;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning';
}

interface SearchParams {
  sourceId: number | null;
  destinationId: number | null;
  date: string;
  category?: string;
}

export interface RouteOption {
  vehicleType: 'cab' | 'bus' | 'auto' | 'bike' | 'train' | 'flight';
  providerName: string;
  providerId: number;
  vehicleId: number;
  routeId: number;
  distanceKm: number;
  durationMinutes: number;
  totalPrice: number;
  rating: number;
  availableCount: number;
  busCategory?: 'roadways' | 'private';
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  providers: Provider[];
  vehicles: Vehicle[];
  locations: Location[];
  routes: Route[];
  pricing: Pricing[];
  bookings: Booking[];
  payments: Payment[];
  reviews: Review[];
  tickets: SupportTicket[];
  notifications: AppNotification[];
  addNotification: (title: string, message: string, type?: AppNotification['type']) => void;
  markAllNotificationsRead: () => void;
  theme: 'dark' | 'light';
  language: 'en' | 'es' | 'hi';
  activeRole: Role | 'guest';
  
  // Navigation & States
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  searchParams: SearchParams;
  setSearchParams: (params: SearchParams) => void;
  routeOptions: RouteOption[];
  selectedOption: RouteOption | null;
  setSelectedOption: (option: RouteOption | null) => void;
  activeBooking: Booking | null;
  setActiveBooking: (booking: Booking | null) => void;
  
  // Actions
  login: (email: string, role: Role) => boolean;
  logout: () => void;
  registerCustomer: (name: string, email: string, phone: string, pass: string) => boolean;
  registerProvider: (name: string, email: string, phone: string, businessName: string, vehicleType: 'cab' | 'bus' | 'auto' | 'bike', vehicleNumber: string, licenseNumber: string) => boolean;
  searchRoutes: (sourceId: number, destinationId: number, date: string, category?: string) => void;
  createBooking: (option: RouteOption, paymentMethod: string) => Booking;
  updateBookingStatus: (bookingId: number, status: Booking['status']) => void;
  submitReview: (bookingId: number, rating: number, comment: string) => void;
  toggleTheme: () => void;
  setLanguage: (lang: 'en' | 'es' | 'hi') => void;
  setActiveRole: (role: Role | 'guest') => void;
  createSupportTicket: (subject: string, message: string) => void;
  addCustomLocation: (name: string, lat: number, lng: number) => Location;
  t: (key: string) => string;
  
  // Operator Actions
  addVehicle: (type: 'cab' | 'bus' | 'auto' | 'bike', model: string, number: string, capacity: number) => void;
  addRoute: (sourceId: number, destId: number, distance: number, duration: number, pricePerKm: number) => void;
  approveOperator: (providerId: number) => void;
}

// --- INITIAL MOCK DATA ---

const initialLocations: Location[] = [
  { id: 1, name: 'Delhi (New Delhi, India)', x: 50, y: 50, lat: 28.6139, lng: 77.2090 },
  { id: 2, name: 'Jaipur (Rajasthan, India)', x: 28, y: 72, lat: 26.9124, lng: 75.7873 },
  { id: 3, name: 'Mumbai (Maharashtra, India)', x: 82, y: 18, lat: 19.0760, lng: 72.8777 },
  { id: 4, name: 'Bangalore (Whitefield Hub)', x: 74, y: 64, lat: 12.9716, lng: 77.5946 },
  { id: 5, name: 'Rural Valley Village', x: 18, y: 22, lat: 27.5656, lng: 76.6324 },
  { id: 6, name: 'Suburban Commuter Hub', x: 44, y: 16, lat: 28.4089, lng: 77.3178 }
];

const initialUsers: User[] = [
  { id: 1, fullName: 'Admin User', email: 'admin@travelconnect.com', phone: '9999999999', role: 'admin', createdAt: '2026-01-01' },
  { id: 2, fullName: 'John Doe', email: 'john@gmail.com', phone: '9876543210', role: 'customer', createdAt: '2026-05-15' },
  { id: 3, fullName: 'Ramesh Kumar', email: 'ramesh@bus.com', phone: '9123456789', role: 'bus_operator', createdAt: '2026-05-10' },
  { id: 4, fullName: 'David Cabby', email: 'david@cab.com', phone: '9234567890', role: 'cab_driver', createdAt: '2026-05-12' },
  { id: 5, fullName: 'Ravi Auto', email: 'ravi@auto.com', phone: '9345678901', role: 'auto_driver', createdAt: '2026-05-14' }
];

const initialProviders: Provider[] = [
  { id: 1, userId: 3, businessName: 'Ramesh Royal Travels', licenseNumber: 'BUS-LIC-5544', verificationStatus: 'approved', rating: 4.5 },
  { id: 2, userId: 4, businessName: 'David Eco Cabs', licenseNumber: 'CAB-LIC-1122', verificationStatus: 'approved', rating: 4.8 },
  { id: 3, userId: 5, businessName: 'Ravi City Autos', licenseNumber: 'AUT-LIC-9900', verificationStatus: 'approved', rating: 4.3 }
];

const initialVehicles: Vehicle[] = [
  { id: 1, providerId: 1, vehicleType: 'bus', vehicleNumber: 'KA-01-F-1234', modelName: 'Volvo Multi-Axle B11R', capacity: 45, status: 'available' },
  { id: 2, providerId: 1, vehicleType: 'bus', vehicleNumber: 'KA-01-F-5678', modelName: 'Scania Touring HD', capacity: 48, status: 'available' },
  { id: 3, providerId: 2, vehicleType: 'cab', vehicleNumber: 'KA-03-M-9999', modelName: 'Toyota Prius Hybrid', capacity: 4, status: 'available' },
  { id: 4, providerId: 2, vehicleType: 'cab', vehicleNumber: 'KA-03-M-8888', modelName: 'Hyundai Ioniq 5', capacity: 4, status: 'available' },
  { id: 5, providerId: 3, vehicleType: 'auto', vehicleNumber: 'KA-05-E-7777', modelName: 'Bajaj RE EV Auto', capacity: 3, status: 'available' }
];

// Pre-fill routes connecting various locations
const initialRoutes: Route[] = [
  // Metro Central (1) <=> Tech District (2)
  { id: 1, providerId: null, sourceId: 1, destinationId: 2, distanceKm: 12.5, durationMinutes: 28 },
  { id: 2, providerId: null, sourceId: 2, destinationId: 1, distanceKm: 12.5, durationMinutes: 30 },
  // Metro Central (1) <=> Airport (3)
  { id: 3, providerId: null, sourceId: 1, destinationId: 3, distanceKm: 34.0, durationMinutes: 48 },
  { id: 4, providerId: null, sourceId: 3, destinationId: 1, distanceKm: 34.0, durationMinutes: 45 },
  // Metro Central (1) <=> Whitefield (4)
  { id: 5, providerId: null, sourceId: 1, destinationId: 4, distanceKm: 18.2, durationMinutes: 38 },
  // Rural Valley (5) <=> Suburban Hub (6)
  { id: 6, providerId: null, sourceId: 5, destinationId: 6, distanceKm: 15.0, durationMinutes: 35 },
  // Metro Central (1) <=> Suburban Hub (6)
  { id: 7, providerId: null, sourceId: 1, destinationId: 6, distanceKm: 14.0, durationMinutes: 25 },
  // Suburban Hub (6) <=> Airport (3)
  { id: 8, providerId: null, sourceId: 6, destinationId: 3, distanceKm: 28.0, durationMinutes: 38 },
  // Rural Valley (5) <=> Metro Central (1)
  { id: 9, providerId: null, sourceId: 5, destinationId: 1, distanceKm: 26.5, durationMinutes: 52 },
  { id: 10, providerId: null, sourceId: 1, destinationId: 5, distanceKm: 26.5, durationMinutes: 50 },
  // Tech District (2) <=> Rural Valley (5)
  { id: 11, providerId: null, sourceId: 2, destinationId: 5, distanceKm: 16.0, durationMinutes: 32 }
];

// Pre-fill pricing guidelines
const initialPricing: Pricing[] = [
  // Cab pricing (base $4, $1.2/km, surge 1.0)
  { id: 1, routeId: 1, vehicleId: 3, baseFare: 5.0, pricePerKm: 1.2, surgeMultiplier: 1.0 },
  { id: 2, routeId: 3, vehicleId: 3, baseFare: 8.0, pricePerKm: 1.2, surgeMultiplier: 1.05 },
  { id: 3, routeId: 5, vehicleId: 4, baseFare: 6.0, pricePerKm: 1.3, surgeMultiplier: 1.1 },
  // Bus pricing (base $1.5, $0.2/km)
  { id: 4, routeId: 1, vehicleId: 1, baseFare: 2.0, pricePerKm: 0.25, surgeMultiplier: 1.0 },
  { id: 5, routeId: 3, vehicleId: 1, baseFare: 3.5, pricePerKm: 0.3, surgeMultiplier: 1.0 },
  // Auto pricing (base $2.5, $0.6/km)
  { id: 6, routeId: 1, vehicleId: 5, baseFare: 2.5, pricePerKm: 0.6, surgeMultiplier: 1.0 },
  { id: 7, routeId: 9, vehicleId: 5, baseFare: 3.0, pricePerKm: 0.65, surgeMultiplier: 1.0 }
];

const translations = {
  en: {
    plan_journey: "Plan Your Journey",
    from: "From",
    to: "To",
    date: "Date",
    passengers: "Passengers",
    guest: "Guest",
    guests: "Guests",
    search_routes: "Search Routes",
    search_options: "Search Options",
    change_search: "Change Search",
    search_placeholder: "Search place, city, or address...",
    searching_india: "Searching across India...",
    all_services: "All Services",
    bus: "Bus",
    cab: "Cab",
    bike: "Bike",
    train: "Train",
    flight: "Flight",
    auto: "Auto",
    shared: "Shared",
    filter_services: "Filter Services",
    clear_all: "Clear All",
    sort_by: "Sort By",
    recommended: "Recommended",
    cheapest: "Cheapest",
    fastest: "Fastest",
    price_range: "Price Range",
    provider_rating: "Provider Rating",
    and_up: "& up",
    all_avail_services: "All Available Services",
    available_route_options: "Available route options for",
    modify_search: "Modify Search",
    connecting_point: "Connecting Point Selected...",
    awaiting_route: "Awaiting route selection...",
    book_now: "Book Now",
    select_seats: "Select Seats",
    view_details: "View Details",
    certified_partner: "IRCTC / Operator Certified Partner",
    trip_completed: "Trip Completed!",
    live_tracking: "Live Tracking",
    sos_warning: "SOS Warning Triggered!",
    driver: "Driver",
    vehicle_no: "Vehicle No",
    eta: "ETA",
    rating: "Rating",
    welcome: "Welcome to TravelConnect",
    splash_subtitle: "Your Journey, Our Connection",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    verify_operator: "Verify Operators",
    support_tickets: "Support Tickets",
    wallet: "Wallet Balance",
    history: "Booking History",
    home: "Home",
    bookings: "Bookings",
    services: "Services",
    routes: "Routes",
    offers: "Offers"
  },
  hi: {
    plan_journey: "अपनी यात्रा की योजना बनाएं",
    from: "कहाँ से",
    to: "कहाँ तक",
    date: "तारीख",
    passengers: "यात्री",
    guest: "यात्री",
    guests: "यात्री",
    search_routes: "मार्ग खोजें",
    search_options: "विकल्प खोजें",
    change_search: "खोज बदलें",
    search_placeholder: "स्थान, शहर या पता खोजें...",
    searching_india: "भारत में खोज रहे हैं...",
    all_services: "सभी सेवाएँ",
    bus: "बस",
    cab: "कैब",
    bike: "बाइक",
    train: "ट्रेन",
    flight: "उड़ान",
    auto: "ऑटो",
    shared: "साझा कैब",
    filter_services: "सेवाएं फ़िल्टर करें",
    clear_all: "सभी हटाएं",
    sort_by: "क्रमबद्ध करें",
    recommended: "अनुशंसित",
    cheapest: "सबसे सस्ता",
    fastest: "सबसे तेज़",
    price_range: "मूल्य सीमा",
    provider_rating: "प्रदाता रेटिंग",
    and_up: "और ऊपर",
    all_avail_services: "सभी उपलब्ध सेवाएँ",
    available_route_options: "इसके लिए उपलब्ध मार्ग विकल्प",
    modify_search: "खोज में संशोधन करें",
    connecting_point: "कनेक्टिंग पॉइंट चुना गया...",
    awaiting_route: "मार्ग चयन की प्रतीक्षा है...",
    book_now: "अभी बुक करें",
    select_seats: "सीटें चुनें",
    view_details: "विवरण देखें",
    certified_partner: "IRCTC / ऑपरेटर प्रमाणित भागीदार",
    trip_completed: "यात्रा पूरी हुई!",
    live_tracking: "लाइव ट्रैकिंग",
    sos_warning: "SOS चेतावनी सक्रिय!",
    driver: "चालक",
    vehicle_no: "वाहन संख्या",
    eta: "पहुंचने का समय",
    rating: "रेटिंग",
    welcome: "TravelConnect में आपका स्वागत है",
    splash_subtitle: "आपकी यात्रा, हमारा संपर्क",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    logout: "लॉगआउट",
    verify_operator: "ऑपरेटरों को सत्यापित करें",
    support_tickets: "सहायता टिकट",
    wallet: "बटुआ शेष",
    history: "बुकिंग इतिहास",
    home: "होम",
    bookings: "बुकिंग",
    services: "सेवाएँ",
    routes: "मार्ग",
    offers: "ऑफर"
  },
  es: {
    plan_journey: "Planifique su Viaje",
    from: "Desde",
    to: "Hasta",
    date: "Fecha",
    passengers: "Pasajeros",
    guest: "Viajero",
    guests: "Viajeros",
    search_routes: "Buscar Rutas",
    search_options: "Buscar Opciones",
    change_search: "Cambiar Búsqueda",
    search_placeholder: "Buscar lugar, ciudad o dirección...",
    searching_india: "Buscando en India...",
    all_services: "Todos los Servicios",
    bus: "Autobús",
    cab: "Taxi",
    bike: "Moto",
    train: "Tren",
    flight: "Vuelo",
    auto: "Tuk Tuk",
    shared: "Compartido",
    filter_services: "Filtrar Servicios",
    clear_all: "Limpiar Todo",
    sort_by: "Ordenar Por",
    recommended: "Recomendado",
    cheapest: "Más Barato",
    fastest: "Más Rápido",
    price_range: "Rango de Precio",
    provider_rating: "Valoración del Proveedor",
    and_up: "y más",
    all_avail_services: "Servicios Disponibles",
    available_route_options: "Opciones de ruta disponibles para",
    modify_search: "Modificar Búsqueda",
    connecting_point: "Punto de conexión seleccionado...",
    awaiting_route: "Esperando selección de ruta...",
    book_now: "Reservar Ahora",
    select_seats: "Seleccionar Asientos",
    view_details: "Ver Detalles",
    certified_partner: "Socio Certificado por IRCTC",
    trip_completed: "¡Viaje Completado!",
    live_tracking: "Seguimiento en Vivo",
    sos_warning: "¡Alerta SOS Activada!",
    driver: "Conductor",
    vehicle_no: "Nº de Vehículo",
    eta: "Tiempo Estimado",
    rating: "Valoración",
    welcome: "Bienvenido a TravelConnect",
    splash_subtitle: "Su viaje, nuestra conexión",
    profile: "Perfil",
    settings: "Ajustes",
    logout: "Cerrar Sesión",
    verify_operator: "Verificar Operadores",
    support_tickets: "Tickets de Soporte",
    wallet: "Saldo de Cartera",
    history: "Historial de Reservas",
    home: "Inicio",
    bookings: "Reservas",
    services: "Servicios",
    routes: "Rutas",
    offers: "Ofertas"
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Start with no logged in user
  const [language, setLanguage] = useState<'en' | 'es' | 'hi'>('en');

  const t = (key: string): string => {
    const langDict = translations[language] || translations.en;
    return langDict[key as keyof typeof langDict] || key;
  };
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [pricing, setPricing] = useState<Pricing[]>(initialPricing);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: 1, title: 'Welcome to TravelConnect', message: 'Explore dynamic routes and native Rupee pricing across India!', time: '1 hour ago', isRead: false, type: 'info' }
  ]);
  
  // App Configs
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeRole, setActiveRole] = useState<Role | 'guest'>('customer');
  const [currentScreen, setCurrentScreen] = useState('login'); // Start directly on login/signup page
  
  // Search & Navigation States
  const [searchParams, setSearchParams] = useState<SearchParams>({ sourceId: null, destinationId: null, date: '' });
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<RouteOption | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const rawSession =
      window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY) ??
      window.sessionStorage.getItem(AUTH_SESSION_FALLBACK_KEY);

    if (!rawSession) return;

    try {
      const session = JSON.parse(rawSession) as {
        email?: string;
        role?: Role;
        expiresAt?: string;
      };

      if (!session.email || !session.role) return;

      if (session.expiresAt && new Date(session.expiresAt).getTime() < Date.now()) {
        window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        window.sessionStorage.removeItem(AUTH_SESSION_FALLBACK_KEY);
        return;
      }

      const existingUser = users.find(
        (user) =>
          user.email.toLowerCase() === session.email?.toLowerCase() &&
          user.role === session.role
      );

      if (existingUser) {
        setCurrentUser(existingUser);
      }
    } catch {
      window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      window.sessionStorage.removeItem(AUTH_SESSION_FALLBACK_KEY);
    }
  }, [users]);

  // Sync roles with logged in user
  useEffect(() => {
    if (currentUser) {
      setActiveRole(currentUser.role);
      if (currentUser.role === 'admin') {
        setCurrentScreen('admin_dashboard');
      } else if (currentUser.role.endsWith('driver') || currentUser.role.endsWith('operator') || currentUser.role.endsWith('provider')) {
        setCurrentScreen('operator_dashboard');
      } else {
        setCurrentScreen('home');
      }
    } else {
      setActiveRole('guest');
      setCurrentScreen('login'); // Open directly to login page if logged out
    }
  }, [currentUser]);

  // --- BUSINESS LOGIC ACTIONS ---

  const login = (email: string, role: Role) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (foundUser) {
      setCurrentUser(foundUser);
      addNotification('Session Start', `Logged in successfully as ${foundUser.fullName} (${foundUser.role.replace('_', ' ')})`, 'info');
      return true;
    }
    // Auto-create user for testing convenience if email is not admin
    if (email.includes('@')) {
      const newUser: User = {
        id: users.length + 1,
        fullName: email.split('@')[0].toUpperCase(),
        email,
        phone: '987654' + Math.floor(Math.random() * 10000),
        role,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      addNotification('Welcome Traveler', `Account auto-created for ${newUser.fullName} (${newUser.role.replace('_', ' ')})`, 'success');
      
      // If operator, create their provider entry automatically
      if (role !== 'customer' && role !== 'admin') {
        const newProvider: Provider = {
          id: providers.length + 1,
          userId: newUser.id,
          businessName: `${newUser.fullName} Transit`,
          licenseNumber: `${role.substring(0, 3).toUpperCase()}-LIC-${Math.floor(Math.random() * 9000 + 1000)}`,
          verificationStatus: 'approved',
          rating: 4.5
        };
        setProviders(prev => [...prev, newProvider]);
        
        // Add a default vehicle for them
        const vType = role.split('_')[0] as any;
        const newVehicle: Vehicle = {
          id: vehicles.length + 1,
          providerId: newProvider.id,
          vehicleType: vType === 'cab' || vType === 'bus' || vType === 'auto' || vType === 'bike' ? vType : 'cab',
          vehicleNumber: `KA-0${Math.floor(Math.random() * 9)}-D-${Math.floor(Math.random() * 9000 + 1000)}`,
          modelName: `Standard ${vType} model`,
          capacity: vType === 'bus' ? 40 : vType === 'cab' ? 4 : vType === 'auto' ? 3 : 1,
          status: 'available'
        };
        setVehicles(prev => [...prev, newVehicle]);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      window.sessionStorage.removeItem(AUTH_SESSION_FALLBACK_KEY);
    }
    setCurrentUser(null);
    setActiveRole('guest');
    setCurrentScreen('welcome');
  };

  const registerCustomer = (name: string, email: string, phone: string, _pass: string) => {
    if (users.some(u => u.email === email)) return false;
    const newUser: User = {
      id: users.length + 1,
      fullName: name,
      email,
      phone,
      role: 'customer',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const registerProvider = (name: string, email: string, phone: string, businessName: string, vehicleType: 'cab' | 'bus' | 'auto' | 'bike', vehicleNumber: string, licenseNumber: string) => {
    if (users.some(u => u.email === email)) return false;
    
    let pRole: Role = 'cab_driver';
    if (vehicleType === 'bus') pRole = 'bus_operator';
    else if (vehicleType === 'auto') pRole = 'auto_driver';
    else if (vehicleType === 'bike') pRole = 'bike_driver';
    
    const newUser: User = {
      id: users.length + 1,
      fullName: name,
      email,
      phone,
      role: pRole,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    const newProvider: Provider = {
      id: providers.length + 1,
      userId: newUser.id,
      businessName,
      licenseNumber,
      verificationStatus: 'pending', // Starts pending for Admin approval
      rating: 5.0
    };
    
    const newVehicle: Vehicle = {
      id: vehicles.length + 1,
      providerId: newProvider.id,
      vehicleType,
      vehicleNumber,
      modelName: `Operator Custom ${vehicleType.toUpperCase()}`,
      capacity: vehicleType === 'bus' ? 40 : vehicleType === 'cab' ? 4 : vehicleType === 'auto' ? 3 : 1,
      status: 'available'
    };
    
    setUsers(prev => [...prev, newUser]);
    setProviders(prev => [...prev, newProvider]);
    setVehicles(prev => [...prev, newVehicle]);
    
    // Auto login as the registered provider
    setCurrentUser(newUser);
    return true;
  };

  const getHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };

  const addCustomLocation = (name: string, lat: number, lng: number): Location => {
    const threshold = 0.001; // roughly 100m tolerance for matching existing location
    const existing = locations.find(l => 
      Math.abs(l.lat - lat) < threshold && Math.abs(l.lng - lng) < threshold
    );
    if (existing) {
      return existing;
    }

    const newLoc: Location = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name,
      x: 50,
      y: 50,
      lat,
      lng
    };

    setLocations(prev => [...prev, newLoc]);
    return newLoc;
  };

  const searchRoutes = (sourceId: number, destinationId: number, date: string, category?: string) => {
    setSearchParams({ sourceId, destinationId, date, category });
    
    // Find path or simulate intermediate legs if direct route doesn't exist
    const directRoute = routes.find(r => 
      (r.sourceId === sourceId && r.destinationId === destinationId) ||
      (r.sourceId === destinationId && r.destinationId === sourceId)
    );

    let routeDistance = 20;
    let routeDuration = 35;
    let matchingRouteId = 0;

    if (directRoute) {
      routeDistance = directRoute.distanceKm;
      routeDuration = directRoute.durationMinutes;
      matchingRouteId = directRoute.id;
    } else {
      // Find a path connecting via another node, or create virtual values based on coordinates
      const src = locations.find(l => l.id === sourceId);
      const dest = locations.find(l => l.id === destinationId);
      if (src && dest) {
        if (src.lat !== undefined && dest.lat !== undefined) {
          // Calculate using real-world Haversine distance formula
          routeDistance = getHaversineDistance(src.lat, src.lng, dest.lat, dest.lng);
          // Scale base duration: assume average speed is ~45 km/h for baseline routing
          routeDuration = Math.round(routeDistance * 1.33);
        } else {
          // Euclidean distance calculation scaled
          const dx = src.x - dest.x;
          const dy = src.y - dest.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          routeDistance = parseFloat((dist * 0.5).toFixed(1)); // scaled km
          routeDuration = Math.round(routeDistance * 2.2); // ~25km/h speed
        }
      }
    }

    // Generate option for each available provider & vehicle type
    const options: RouteOption[] = [];

    // Find custom operator routes registered for this exact source/destination
    const customOperatorRoutes = routes.filter(r => 
      r.providerId !== null && 
      ((r.sourceId === sourceId && r.destinationId === destinationId) ||
       (r.sourceId === destinationId && r.destinationId === sourceId))
    );

    if (customOperatorRoutes.length > 0) {
      customOperatorRoutes.forEach(r => {
        const prov = providers.find(p => p.id === r.providerId && p.verificationStatus === 'approved');
        if (!prov) return;

        const provVehicles = vehicles.filter(v => v.providerId === prov.id);
        provVehicles.forEach(veh => {
          // Find custom pricing for this route and vehicle
          const priceObj = pricing.find(pr => pr.routeId === r.id && pr.vehicleId === veh.id);
          
          let baseFare = 50.0;
          let pricePerKm = 15.0;
          
          if (veh.vehicleType === 'bus') { baseFare = 40.0; pricePerKm = 2.5; }
          else if (veh.vehicleType === 'auto') { baseFare = 30.0; pricePerKm = 10.0; }
          else if (veh.vehicleType === 'bike') { baseFare = 20.0; pricePerKm = 6.0; }
          else if (veh.vehicleType === 'cab') { baseFare = 50.0; pricePerKm = 15.0; }

          if (priceObj) {
            baseFare = priceObj.baseFare === 4.0 ? baseFare : priceObj.baseFare;
            pricePerKm = priceObj.pricePerKm;
          }

          const totalPrice = parseFloat((baseFare + (r.distanceKm * pricePerKm)).toFixed(2));

          options.push({
            vehicleType: veh.vehicleType,
            providerName: prov.businessName,
            providerId: prov.id,
            vehicleId: veh.id,
            routeId: r.id,
            distanceKm: r.distanceKm,
            durationMinutes: r.durationMinutes,
            totalPrice,
            rating: prov.rating,
            availableCount: Math.floor(Math.random() * 4) + 1,
            busCategory: veh.vehicleType === 'bus' ? 'private' : undefined
          });
        });
      });
    } else {
      // Simulate realistic options using standard baseline coefficients in native Rupees
      const activeProviders = providers.filter(p => p.verificationStatus === 'approved');

      activeProviders.forEach(prov => {
        const provVehicles = vehicles.filter(v => v.providerId === prov.id);
        provVehicles.forEach(veh => {
          let baseFare = 50.0;
          let pricePerKm = 15.0;
          
          if (veh.vehicleType === 'bus') { baseFare = 40.0; pricePerKm = 2.5; }
          else if (veh.vehicleType === 'auto') { baseFare = 30.0; pricePerKm = 10.0; }
          else if (veh.vehicleType === 'bike') { baseFare = 20.0; pricePerKm = 6.0; }
          else if (veh.vehicleType === 'cab') { baseFare = 50.0; pricePerKm = 15.0; }

          const totalPrice = parseFloat((baseFare + (routeDistance * pricePerKm)).toFixed(2));
          
          options.push({
            vehicleType: veh.vehicleType,
            providerName: prov.businessName,
            providerId: prov.id,
            vehicleId: veh.id,
            routeId: matchingRouteId || 999, // 999 for virtual route
            distanceKm: routeDistance,
            durationMinutes: routeDuration,
            totalPrice,
            rating: prov.rating,
            availableCount: Math.floor(Math.random() * 4) + 1,
            busCategory: veh.vehicleType === 'bus' ? 'private' : undefined
          });
        });
      });
    }

    // Add public state roadways bus option for regional route connectivity
    options.push({
      vehicleType: 'bus',
      providerName: 'State Roadways (HRTC/RSRTC)',
      providerId: 997,
      vehicleId: 997,
      routeId: matchingRouteId || 999,
      distanceKm: routeDistance,
      durationMinutes: Math.round(routeDuration * 1.15), // State buses are slightly slower
      totalPrice: parseFloat((40.0 + (routeDistance * 2.0)).toFixed(2)), // State transport is cheaper
      rating: 3.8,
      availableCount: 5,
      busCategory: 'roadways'
    });

    // Add public train option
    options.push({
      vehicleType: 'train',
      providerName: 'National Rail System',
      providerId: 998,
      vehicleId: 998,
      routeId: matchingRouteId || 999,
      distanceKm: routeDistance,
      durationMinutes: Math.round(routeDuration * 0.8), // Trains are faster
      totalPrice: parseFloat((80.0 + (routeDistance * 1.5)).toFixed(2)),
      rating: 4.2,
      availableCount: 3
    });

    // Add flight option if it's a long distance or connected to the Airport (3)
    if (sourceId === 3 || destinationId === 3 || routeDistance > 300) {
      options.push({
        vehicleType: 'flight',
        providerName: 'AirConnect Express',
        providerId: 999,
        vehicleId: 999,
        routeId: matchingRouteId || 999,
        distanceKm: routeDistance,
        durationMinutes: routeDistance > 300 ? Math.round(routeDistance * 0.15) : 15,
        totalPrice: parseFloat((1500.0 + (routeDistance * 6.0)).toFixed(2)),
        rating: 4.7,
        availableCount: 2
      });
    }

    setRouteOptions(options);
    setCurrentScreen('options');
  };

  const createBooking = (option: RouteOption, paymentMethod: string) => {
    if (!currentUser) throw new Error('Not logged in');
    
    // Generate driver metadata
    const drivers = [
      { name: 'Rajesh Nair', phone: '+91 98765 43210' },
      { name: 'Amit Sharma', phone: '+91 91234 56789' },
      { name: 'Vikram Singh', phone: '+91 95432 10987' },
      { name: 'Michael D\'Souza', phone: '+91 96543 21098' }
    ];
    const selDriver = drivers[Math.floor(Math.random() * drivers.length)];

    const newBooking: Booking = {
      id: bookings.length + 1,
      customerId: currentUser.id,
      providerId: option.providerId,
      vehicleId: option.vehicleId,
      sourceId: searchParams.sourceId!,
      destinationId: searchParams.destinationId!,
      totalPrice: option.totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
      etaMinutes: Math.round(option.durationMinutes * 0.1) || 5,
      driverName: selDriver.name,
      driverPhone: selDriver.phone,
      vehicleNumber: `KA-0${Math.floor(Math.random() * 9)}-XY-${Math.floor(Math.random() * 9000 + 1000)}`,
      vehicleModel: `${option.vehicleType.toUpperCase()} Carrier`
    };

    const newPayment: Payment = {
      id: payments.length + 1,
      bookingId: newBooking.id,
      amount: option.totalPrice,
      paymentMethod,
      paymentStatus: 'success', // Auto success for prototype simulation
      transactionId: 'TXN-' + Math.floor(Math.random() * 1000000000),
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    setPayments(prev => [newPayment, ...prev]);
    setActiveBooking(newBooking);
    addNotification('Booking Confirmed', `Trip booked with ${option.providerName} for ₹${option.totalPrice.toLocaleString()}.`, 'success');
    
    // Automatically transition customer screen to live tracking
    setCurrentScreen('tracking');
    
    return newBooking;
  };

  const updateBookingStatus = (bookingId: number, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    if (activeBooking && activeBooking.id === bookingId) {
      setActiveBooking(prev => prev ? { ...prev, status } : null);
      if (status === 'completed') {
        setCurrentScreen('completed');
      }
    }
    addNotification('Trip Update', `Booking #${bookingId} status is now: ${status.toUpperCase()}`, status === 'completed' ? 'success' : status === 'cancelled' ? 'warning' : 'info');
  };

  const submitReview = (bookingId: number, rating: number, comment: string) => {
    if (!currentUser) return;
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const newReview: Review = {
      id: reviews.length + 1,
      bookingId,
      customerId: currentUser.id,
      providerId: booking.providerId,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    setReviews(prev => [newReview, ...prev]);

    // Recalculate provider rating
    setProviders(prev => prev.map(p => {
      if (p.id === booking.providerId) {
        const provReviews = [...reviews, newReview].filter(r => r.providerId === p.id);
        const avgRating = provReviews.reduce((sum, r) => sum + r.rating, 0) / provReviews.length;
        return { ...p, rating: parseFloat(avgRating.toFixed(2)) };
      }
      return p;
    }));

    setCurrentScreen('home');
    setActiveBooking(null);
    setSelectedOption(null);
  };

  const createSupportTicket = (subject: string, message: string) => {
    if (!currentUser) return;
    const newTicket: SupportTicket = {
      id: tickets.length + 1,
      userId: currentUser.id,
      subject,
      message,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    setTickets(prev => [newTicket, ...prev]);
    addNotification('Support Ticket Opened', `Ticket opened: "${subject}". We will reply shortly.`, 'info');
  };

  const addNotification = (title: string, message: string, type: AppNotification['type'] = 'info') => {
    const newNotif: AppNotification = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      title,
      message,
      time: 'Just now',
      isRead: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Operator Actions
  const addVehicle = (type: 'cab' | 'bus' | 'auto' | 'bike', model: string, number: string, capacity: number) => {
    const prov = providers.find(p => p.userId === currentUser?.id);
    if (!prov) return;
    const newVehicle: Vehicle = {
      id: vehicles.length + 1,
      providerId: prov.id,
      vehicleType: type,
      vehicleNumber: number,
      modelName: model,
      capacity,
      status: 'available'
    };
    setVehicles(prev => [...prev, newVehicle]);
  };

  const addRoute = (sourceId: number, destId: number, distance: number, duration: number, pricePerKm: number) => {
    const prov = providers.find(p => p.userId === currentUser?.id);
    if (!prov) return;
    
    // Add custom operator route
    const newRoute: Route = {
      id: routes.length + 1,
      providerId: prov.id,
      sourceId,
      destinationId: destId,
      distanceKm: distance,
      durationMinutes: duration
    };
    setRoutes(prev => [...prev, newRoute]);
    addNotification('Route Configured', `New route configured for your fleet: ${locations.find(l => l.id === sourceId)?.name.split(' (')[0]} → ${locations.find(l => l.id === destId)?.name.split(' (')[0]} for ₹${pricePerKm}/km`, 'success');

    // Find custom vehicle
    const vehicle = vehicles.find(v => v.providerId === prov.id);
    if (vehicle) {
      let baseFare = 50.0;
      if (vehicle.vehicleType === 'bus') baseFare = 40.0;
      else if (vehicle.vehicleType === 'auto') baseFare = 30.0;
      else if (vehicle.vehicleType === 'bike') baseFare = 20.0;
      else if (vehicle.vehicleType === 'cab') baseFare = 50.0;

      const newPricing: Pricing = {
        id: pricing.length + Math.random(),
        routeId: newRoute.id,
        vehicleId: vehicle.id,
        baseFare,
        pricePerKm: pricePerKm,
        surgeMultiplier: 1.0
      };
      setPricing(prev => [...prev, newPricing]);
    }
  };

  const approveOperator = (providerId: number) => {
    setProviders(prev => prev.map(p => p.id === providerId ? { ...p, verificationStatus: 'approved' } : p));
    const prov = providers.find(p => p.id === providerId);
    addNotification('Operator Approved', `Transit operator license for "${prov?.businessName || 'Custom Partner'}" has been approved.`, 'success');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      providers,
      vehicles,
      locations,
      routes,
      pricing,
      bookings,
      payments,
      reviews,
      tickets,
      notifications,
      theme,
      language,
      activeRole,
      currentScreen,
      setCurrentScreen,
      searchParams,
      setSearchParams,
      routeOptions,
      selectedOption,
      setSelectedOption,
      activeBooking,
      setActiveBooking,
      login,
      logout,
      registerCustomer,
      registerProvider,
      searchRoutes,
      createBooking,
      updateBookingStatus,
      submitReview,
      toggleTheme,
      setLanguage,
      setActiveRole,
      createSupportTicket,
      addCustomLocation,
      addNotification,
      markAllNotificationsRead,
      t,
      addVehicle,
      addRoute,
      approveOperator
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

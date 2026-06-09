import React, { useState } from 'react';
import { useApp, Vehicle, Route, Booking } from '../context/AppContext';
import { 
  Plus, 
  DollarSign, 
  Truck, 
  MapPin, 
  Calendar, 
  Check, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  PlusCircle, 
  Navigation,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

export const OperatorPortal: React.FC = () => {
  const { currentUser, providers, vehicles, routes, bookings, tickets, addVehicle, addRoute, createSupportTicket, updateBookingStatus, locations } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fleet' | 'routes' | 'bookings' | 'verification' | 'support'>('dashboard');

  // Fetch operator specific profile
  const provider = providers.find(p => p.userId === currentUser?.id);
  const operatorVehicles = provider ? vehicles.filter(v => v.providerId === provider.id) : [];
  const operatorRoutes = provider ? routes.filter(r => r.providerId === provider.id) : [];
  const operatorBookings = provider ? bookings.filter(b => b.providerId === provider.id) : [];

  // Form states
  const [vType, setVType] = useState<'cab' | 'bus' | 'auto' | 'bike'>('cab');
  const [vModel, setVModel] = useState('');
  const [vNumber, setVNumber] = useState('');
  const [vCapacity, setVCapacity] = useState(4);
  const [fleetSuccess, setFleetSuccess] = useState(false);

  const [rSource, setRSource] = useState(1);
  const [rDest, setRDest] = useState(2);
  const [rDist, setRDist] = useState(15);
  const [rDur, setRDur] = useState(30);
  const [rPrice, setRPrice] = useState(12.0);
  const [routeSuccess, setRouteSuccess] = useState(false);

  const [tSubject, setTSubject] = useState('');
  const [tMessage, setTMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  if (!provider) {
    return (
      <div className="max-w-md mx-auto glass-panel p-8 rounded-3xl text-center shadow-xl mt-8">
        <h2 className="text-xl font-bold text-slate-100">Verification Pending</h2>
        <p className="text-xs text-slate-400 mt-2 mb-6">
          Your business registration is currently undergoing administrative review. We will notify you once verified.
        </p>
        <span className="inline-block px-3 py-1 rounded bg-amber-950/40 text-amber-400 font-bold border border-amber-900/30 text-xs animate-pulse">
          PENDING APPROVAL
        </span>
      </div>
    );
  }

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vModel || !vNumber) return;
    addVehicle(vType, vModel, vNumber, vCapacity);
    setVModel('');
    setVNumber('');
    setFleetSuccess(true);
    setTimeout(() => setFleetSuccess(false), 3000);
  };

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (rSource === rDest) return;
    addRoute(rSource, rDest, rDist, rDur, rPrice);
    setRouteSuccess(true);
    setTimeout(() => setRouteSuccess(false), 3000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tSubject || !tMessage) return;
    createSupportTicket(tSubject, tMessage);
    setTSubject('');
    setTMessage('');
    setTicketSuccess(true);
    setTimeout(() => setTicketSuccess(false), 3000);
  };

  // Helper to compute analytics metrics
  const totalEarnings = operatorBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const getLocName = (id: number) => {
    return locations.find(l => l.id === id)?.name || 'Unknown Location';
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 text-left grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* Sidebar Navigation */}
      <div className="md:col-span-3 flex flex-col gap-1 bg-slate-900 p-3 rounded-2xl border border-slate-850 h-fit">
        <div className="pb-3 mb-2 border-b border-slate-800">
          <h4 className="font-bold text-xs text-slate-100 truncate">{provider.businessName}</h4>
          <span className="inline-block mt-1 text-[9px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30 uppercase">
            Approved Operator
          </span>
        </div>

        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'dashboard' ? 'bg-primary-650 text-white' : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'}`}
        >
          Overview Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('fleet')}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'fleet' ? 'bg-primary-650 text-white' : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'}`}
        >
          Fleet Vehicles ({operatorVehicles.length})
        </button>
        <button 
          onClick={() => setActiveTab('routes')}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'routes' ? 'bg-primary-650 text-white' : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'}`}
        >
          Route & Pricing
        </button>
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'bookings' ? 'bg-primary-650 text-white' : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'}`}
        >
          Live Bookings ({operatorBookings.length})
        </button>
        <button 
          onClick={() => setActiveTab('verification')}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'verification' ? 'bg-primary-650 text-white' : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'}`}
        >
          Documents & Verification
        </button>
        <button 
          onClick={() => setActiveTab('support')}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${activeTab === 'support' ? 'bg-primary-650 text-white' : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'}`}
        >
          Support Desk
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="md:col-span-9 space-y-6">
        
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* Stat row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl shadow-md">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Earnings</span>
                <p className="text-xl font-black text-white mt-1 flex items-center">
                  <span className="text-[#10b981] font-extrabold mr-1 text-lg">₹</span>
                  {totalEarnings.toLocaleString()}
                </p>
                <span className="text-[9px] text-emerald-400 flex items-center mt-1"><TrendingUp size={10} className="mr-0.5" /> +12.4% this week</span>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl shadow-md">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fleet Strength</span>
                <p className="text-xl font-black text-white mt-1 flex items-center">
                  <Truck size={16} className="text-primary-400 mr-1" />
                  {operatorVehicles.length} Vehicles
                </p>
                <span className="text-[9px] text-slate-400 mt-1 block">Active state available</span>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl shadow-md">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Bookings</span>
                <p className="text-xl font-black text-white mt-1 flex items-center">
                  <Clock size={16} className="text-accent-blue mr-1" />
                  {operatorBookings.length} Trips
                </p>
                <span className="text-[9px] text-slate-400 mt-1 block">Includes completed/active</span>
              </div>
            </div>

            {/* Custom SVG Earnings Line Chart */}
            <div className="p-5 bg-slate-900 border border-slate-850 rounded-3xl shadow-xl">
              <h3 className="text-xs uppercase font-extrabold text-slate-300 tracking-wider mb-4 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-primary-400" />
                Earnings Statistics (Monthly Trend)
              </h3>
              
              <div className="relative w-full h-40 bg-slate-950/60 rounded-xl p-2 border border-slate-850 flex items-end">
                {/* SVG path chart */}
                <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 40" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="10" x2="100" y2="10" stroke="#1e293b" strokeWidth="0.2" strokeDasharray="2" />
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#1e293b" strokeWidth="0.2" strokeDasharray="2" />
                  <line x1="0" y1="30" x2="100" y2="30" stroke="#1e293b" strokeWidth="0.2" strokeDasharray="2" />
                  
                  {/* Chart Line path */}
                  <path
                    d="M 0 35 Q 20 28 40 22 T 80 12 T 100 8"
                    fill="none"
                    stroke="#8c10ff"
                    strokeWidth="1.2"
                  />
                  {/* Glow shadow */}
                  <path
                    d="M 0 35 Q 20 28 40 22 T 80 12 T 100 8 L 100 40 L 0 40 Z"
                    fill="url(#chart-glow)"
                    opacity="0.1"
                  />
                  <defs>
                    <linearGradient id="chart-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8c10ff" />
                      <stop offset="100%" stopColor="#8c10ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* X Axis Labels */}
                <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[8px] text-slate-500 font-extrabold uppercase">
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>May</span>
                  <span>Jul</span>
                  <span>Sep</span>
                  <span>Nov</span>
                </div>
              </div>
            </div>

            {/* Operator Active Orders Summary */}
            <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl">
              <h3 className="text-xs font-bold text-slate-200 mb-3">Operator Live Status</h3>
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span className="text-slate-300">All driver safety permits fully verified</span>
                </div>
                <span className="text-[10px] text-slate-500">Auto renewal: Dec 2026</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* FLEET MANAGEMENT */}
        {activeTab === 'fleet' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="glass-panel p-5 rounded-3xl border border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-1.5">
                <PlusCircle size={15} className="text-primary-400" />
                Register New Vehicle to Fleet
              </h3>

              {fleetSuccess && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-xs text-emerald-400 flex items-center gap-2 mb-4">
                  <CheckCircle size={14} />
                  Vehicle added to fleet successfully!
                </div>
              )}

              <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Vehicle Type</label>
                  <select 
                    value={vType} 
                    onChange={e => setVType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  >
                    <option value="cab">Cab / Taxi</option>
                    <option value="bus">Bus / Coach</option>
                    <option value="auto">Auto Rickshaw</option>
                    <option value="bike">Bike Taxi</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Model / Specification</label>
                  <input 
                    type="text" 
                    required
                    value={vModel}
                    onChange={e => setVModel(e.target.value)}
                    placeholder="e.g. Volvo Coach B11R"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Registration Number</label>
                  <input 
                    type="text" 
                    required
                    value={vNumber}
                    onChange={e => setVNumber(e.target.value)}
                    placeholder="e.g. KA-01-XY-5566"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Passenger Capacity</label>
                  <input 
                    type="number" 
                    required
                    value={vCapacity}
                    onChange={e => setVCapacity(Number(e.target.value))}
                    placeholder="e.g. 40"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <button 
                  type="submit"
                  className="md:col-span-2 py-3 bg-primary-650 hover:bg-primary-600 text-xs font-bold text-white rounded-2xl shadow-md transition-all cursor-pointer mt-2"
                >
                  Register Vehicle
                </button>
              </form>
            </div>

            {/* List Active Fleet */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Registered Fleet List ({operatorVehicles.length})</h3>
              {operatorVehicles.map((v) => (
                <div key={v.id} className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center font-bold capitalize text-primary-400">
                      {v.vehicleType[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-200">{v.modelName}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{v.vehicleType} • {v.vehicleNumber} • Cap: {v.capacity}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 text-[10px] border border-emerald-900/30 uppercase font-bold">
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ROUTE MANAGEMENT */}
        {activeTab === 'routes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="glass-panel p-5 rounded-3xl border border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-1.5">
                <Navigation size={15} className="text-primary-400" />
                Configure Custom Route & Fares
              </h3>

              {routeSuccess && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-xs text-emerald-400 flex items-center gap-2 mb-4">
                  <CheckCircle size={14} />
                  New Route Added! Fares will now reflect in passenger search results.
                </div>
              )}

              <form onSubmit={handleAddRoute} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Source Node</label>
                  <select 
                    value={rSource}
                    onChange={e => setRSource(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  >
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Destination Node</label>
                  <select 
                    value={rDest}
                    onChange={e => setRDest(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  >
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Distance (km)</label>
                  <input 
                    type="number"
                    required
                    value={rDist}
                    onChange={e => setRDist(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Travel Duration (minutes)</label>
                  <input 
                    type="number"
                    required
                    value={rDur}
                    onChange={e => setRDur(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Price Rate Per Kilometer (₹)</label>
                  <input 
                    type="number"
                    step="0.1"
                    required
                    value={rPrice}
                    onChange={e => setRPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <button 
                  type="submit"
                  className="md:col-span-2 py-3 bg-primary-650 hover:bg-primary-600 text-xs font-bold text-white rounded-2xl shadow-md transition-all cursor-pointer mt-2"
                >
                  Configure Route
                </button>
              </form>
            </div>

            {/* List Active Routes */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Operator Routes ({operatorRoutes.length})</h3>
              {operatorRoutes.map((r) => (
                <div key={r.id} className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-200">{getLocName(r.sourceId)} → {getLocName(r.destinationId)}</p>
                    <p className="text-[10px] text-slate-400">{r.distanceKm} km • {r.durationMinutes} minutes duration</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                    Custom Route
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* BOOKINGS LIST */}
        {activeTab === 'bookings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Customer Bookings Pipeline</h3>
            
            <div className="space-y-3">
              {operatorBookings.length > 0 ? (
                operatorBookings.map((b) => (
                  <div key={b.id} className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex justify-between items-center text-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-200">
                        <span>{getLocName(b.sourceId)}</span>
                        <span className="text-slate-600">→</span>
                        <span>{getLocName(b.destinationId)}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">Customer ID: {b.customerId} • Fare: ₹{b.totalPrice} • Status: <strong className="capitalize">{b.status}</strong></p>
                    </div>

                    <div className="flex gap-2">
                      {b.status === 'pending' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'accepted')}
                          className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                        >
                          Accept Ride
                        </button>
                      )}
                      {b.status === 'accepted' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'completed')}
                          className="px-3.5 py-1.5 bg-emerald-650 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px] cursor-pointer animate-pulse"
                        >
                          Mark Completed
                        </button>
                      )}
                      {(b.status === 'completed' || b.status === 'cancelled') && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${b.status === 'completed' ? 'bg-emerald-950/40 text-emerald-400' : 'bg-red-950/40 text-red-400'}`}>
                          {b.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-850 rounded-2xl">
                  No bookings received yet. Fares will show up once passengers register orders.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* VERIFICATION & DOCUMENTS */}
        {activeTab === 'verification' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <CheckCircle size={15} className="text-emerald-500" />
                Upload Documents Verification Status
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200">Commercial Carriage Permit</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">File size: 1.2 MB • Updated: 2026-05-18</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-950/40 text-emerald-400 rounded text-[9px] font-bold border border-emerald-900/30 uppercase">
                    Verified
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200">Operator Driver Identity Card</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">File size: 850 KB • Updated: 2026-05-18</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-950/40 text-emerald-400 rounded text-[9px] font-bold border border-emerald-900/30 uppercase">
                    Verified
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200">Bank Details & Cancelled Cheque</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">For weekly earnings settlement</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-950/40 text-emerald-400 rounded text-[9px] font-bold border border-emerald-900/30 uppercase">
                    Configured
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUPPORT DESK */}
        {activeTab === 'support' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="glass-panel p-5 rounded-3xl border border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-1.5">
                <HelpCircle size={15} className="text-primary-400" />
                Open Support Ticket to Admin
              </h3>

              {ticketSuccess && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-xs text-emerald-400 flex items-center gap-2 mb-4">
                  <CheckCircle size={14} />
                  Ticket opened successfully. Administrators will contact you inside 24 hours.
                </div>
              )}

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Subject Topic</label>
                  <input 
                    type="text" 
                    required
                    value={tSubject}
                    onChange={e => setTSubject(e.target.value)}
                    placeholder="e.g. Delay in weekly payout settlement"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Detailed Message</label>
                  <textarea 
                    required
                    value={tMessage}
                    onChange={e => setTMessage(e.target.value)}
                    rows={4}
                    placeholder="Provide detailed description of complaint or clearance issues..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-primary-650 hover:bg-primary-600 text-xs font-bold text-white rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  Raise Support Request
                </button>
              </form>
            </div>

            {/* List Raised Tickets */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Opened Ticket History ({tickets.length})</h3>
              {tickets.map((t) => (
                <div key={t.id} className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-200">{t.subject}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-md">{t.message}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${
                    t.status === 'open' ? 'bg-red-950/40 text-red-400 border-red-900/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

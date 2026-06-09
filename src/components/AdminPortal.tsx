import React, { useState } from 'react';
import { useApp, Provider, SupportTicket, User } from '../context/AppContext';
import { 
  Users, 
  Check, 
  X, 
  Map, 
  HelpCircle, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  CheckCircle,
  FileText,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminPortal: React.FC = () => {
  const { providers, users, routes, tickets, approveOperator, locations } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'approvals' | 'tickets' | 'users' | 'routes'>('approvals');

  // Filter pending approvals
  const pendingOperators = providers.filter(p => p.verificationStatus === 'pending');
  const activeOperators = providers.filter(p => p.verificationStatus === 'approved');

  // Calculations for Admin Analytics
  const totalRevenue = activeOperators.reduce((sum, p) => sum + (p.rating * 15), 148.5); // Mock total marketplace revenue
  const pendingTickets = tickets.filter(t => t.status === 'open');

  const getLocName = (id: number) => {
    return locations.find(l => l.id === id)?.name || 'Unknown Location';
  };

  const getOperatorNameByUserId = (uId: number) => {
    return users.find(u => u.id === uId)?.fullName || 'Unknown Operator';
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 text-left space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-850 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="text-primary-400" size={22} />
            TravelConnect+ Admin Controller
          </h2>
          <p className="text-xs text-slate-400 mt-1">Configure global routes, approve transit licenses, and review complaints.</p>
        </div>
      </div>

      {/* Analytics stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Marketplace Revenue</span>
          <p className="text-xl font-black text-white mt-1 flex items-center">
            <span className="text-[#10b981] font-extrabold mr-1 text-lg">₹</span>
            {totalRevenue.toLocaleString()}
          </p>
          <span className="text-[9px] text-emerald-400 mt-1 block">8.5% Commission Collected</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total Registered Users</span>
          <p className="text-xl font-black text-white mt-1 flex items-center">
            <Users size={16} className="text-primary-400 mr-1.5" />
            {users.length} Users
          </p>
          <span className="text-[9px] text-slate-400 mt-1 block">Customers: {users.filter(u => u.role === 'customer').length} • Drivers: {users.length - users.filter(u => u.role === 'customer').length}</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Pending Operators</span>
          <p className="text-xl font-black text-white mt-1 flex items-center">
            <AlertCircle size={16} className="text-amber-500 mr-1.5" />
            {pendingOperators.length} Queue
          </p>
          <span className="text-[9px] text-amber-500 mt-1 block">Requires manual document checks</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Active Complaints</span>
          <p className="text-xl font-black text-white mt-1 flex items-center">
            <HelpCircle size={16} className="text-indigo-400 mr-1.5" />
            {pendingTickets.length} Tickets
          </p>
          <span className="text-[9px] text-slate-400 mt-1 block">Open queries in mailbox</span>
        </div>
      </div>

      {/* Selector Subtabs */}
      <div className="flex bg-slate-900 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveSubTab('approvals')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeSubTab === 'approvals' ? 'bg-primary-650 text-white' : 'text-slate-400'}`}
        >
          Operator Approvals ({pendingOperators.length})
        </button>
        <button 
          onClick={() => setActiveSubTab('tickets')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeSubTab === 'tickets' ? 'bg-primary-650 text-white' : 'text-slate-400'}`}
        >
          Complaint Tickets ({pendingTickets.length})
        </button>
        <button 
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeSubTab === 'users' ? 'bg-primary-650 text-white' : 'text-slate-400'}`}
        >
          Inspect Users
        </button>
        <button 
          onClick={() => setActiveSubTab('routes')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeSubTab === 'routes' ? 'bg-primary-650 text-white' : 'text-slate-400'}`}
        >
          Inspect Routes
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 shadow-xl min-h-[40vh]">
        
        {/* OPERATOR APPROVAL QUEUE */}
        {activeSubTab === 'approvals' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 mb-2">Operator Onboarding Review</h3>
            
            {pendingOperators.length > 0 ? (
              <div className="space-y-3">
                {pendingOperators.map((op) => (
                  <div key={op.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-200">{op.businessName}</span>
                        <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-bold">Pending Review</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Owner: {getOperatorNameByUserId(op.userId)} • License permit: <strong className="text-slate-300">{op.licenseNumber}</strong>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => approveOperator(op.id)}
                        className="px-3.5 py-1.5 bg-emerald-650 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px] cursor-pointer flex items-center gap-1"
                      >
                        <Check size={11} /> Approve Verify
                      </button>
                      <button
                        className="px-3.5 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-400 rounded-lg font-bold text-[10px] cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 border border-dashed border-slate-850 rounded-2xl">
                No operators currently waiting in the approval queue.
              </div>
            )}
          </motion.div>
        )}

        {/* SUPPORT TICKETS / COMPLAINTS */}
        {activeSubTab === 'tickets' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 mb-2">Customer Complaint inbox</h3>

            {pendingTickets.length > 0 ? (
              <div className="space-y-3">
                {pendingTickets.map((t) => (
                  <div key={t.id} className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                    <div className="space-y-1 max-w-xl">
                      <span className="font-bold text-slate-200">{t.subject}</span>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{t.message}</p>
                      <p className="text-[9px] text-slate-500">Opened by User ID: {t.userId} • {t.createdAt.split('T')[0]}</p>
                    </div>

                    <button
                      onClick={() => {
                        alert("Ticket marked resolved.");
                        t.status = 'resolved';
                      }}
                      className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg font-bold text-[10px] cursor-pointer shrink-0"
                    >
                      Resolve ticket
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 border border-dashed border-slate-850 rounded-2xl">
                No active complaints. Mailbox is completely clean!
              </div>
            )}
          </motion.div>
        )}

        {/* USER LIST INSPECTION */}
        {activeSubTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 mb-2">Registered User Directories</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-500 text-left font-bold uppercase tracking-wider">
                    <th className="py-2.5">User ID</th>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Designated Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="py-2.5 font-mono text-slate-500">#{u.id}</td>
                      <td className="font-bold text-slate-200">{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td className="capitalize text-primary-400 font-semibold">{u.role.replace('_', ' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ROUTE LIST INSPECTION */}
        {activeSubTab === 'routes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 mb-2">Active Transport Network Channels</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-500 text-left font-bold uppercase tracking-wider">
                    <th className="py-2.5">Route ID</th>
                    <th>Origin Point</th>
                    <th>Destination Point</th>
                    <th>Distance (km)</th>
                    <th>Avg Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {routes.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2.5 font-mono text-slate-500">#{r.id}</td>
                      <td className="font-bold text-slate-200">{getLocName(r.sourceId)}</td>
                      <td className="font-bold text-slate-200">{getLocName(r.destinationId)}</td>
                      <td>{r.distanceKm} km</td>
                      <td>{r.durationMinutes} mins</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

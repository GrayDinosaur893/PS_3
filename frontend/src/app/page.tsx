'use client';
import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [actionLogs, setActionLogs] = useState<string[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    socket.on('factory_pulse', (payload) => {
      setData(payload);
      setHistory(prev => {
        const newHist = [...prev, { 
          time: new Date().toLocaleTimeString(), 
          production: payload.analytics.productionTotal,
          defectRate: payload.analytics.defectRate 
        }];
        return newHist.slice(-15);
      });
    });

    socket.on('new_action', (action: string) => {
      setActionLogs(prev => [action, ...prev].slice(0, 7));
      setToast(action);
      setTimeout(() => setToast(null), 4000);
    });

    return () => {
      socket.off('factory_pulse');
      socket.off('new_action');
    };
  }, []);

  if (!data) {
    return <div className="flex h-full items-center justify-center text-cyan-500 font-bold animate-pulse">Initializing AI Kernels...</div>
  }

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Executive Overview</h1>
        <p className="text-slate-400">Live systems pulse updated every 2.5s</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card rounded-2xl p-6">
          <p className="text-slate-400 font-medium text-sm mb-1">Total Production</p>
          <p className="text-4xl font-bold text-white">{data.analytics.productionTotal}</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
          <p className="text-slate-400 font-medium text-sm mb-1">Defect Rate</p>
          <p className="text-4xl font-bold text-cyan-400">{data.analytics.defectRate}%</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
          <p className="text-slate-400 font-medium text-sm mb-1">Active Shipments</p>
          <p className="text-4xl font-bold text-blue-400">{data.shipments.length}</p>
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6 border-green-500/30">
          <p className="text-green-200/70 font-medium text-sm mb-1">Est. Monthly Savings</p>
          <p className="text-4xl font-bold text-green-400">${data.analytics.monthlySavings.toLocaleString()}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 h-[400px]">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            Live Production Trajectory
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
              <Area type="monotone" dataKey="production" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Action Logs */}
        <div className="glass-card rounded-2xl p-6 flex flex-col h-[400px]">
          <h2 className="text-lg font-semibold mb-4 text-cyan-300">Autonomous Actions Log</h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            <AnimatePresence>
              {actionLogs.length === 0 ? (
                <div className="text-slate-500 text-sm italic">Waiting for anomalies...</div>
              ) : (
                actionLogs.map((log, i) => (
                  <motion.div
                    key={log + i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                    className="p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200"
                  >
                    {log}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 glass-card bg-cyan-900/80 border-cyan-500/50 p-4 rounded-xl shadow-2xl z-50 max-w-sm"
          >
            <p className="text-sm font-semibold text-cyan-100 flex gap-2 items-start">
              <span className="w-2 h-2 mt-1 rounded-full bg-cyan-400 animate-pulse shrink-0" />
              {toast}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

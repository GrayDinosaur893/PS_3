'use client';
import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Rocket, Cpu, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function ComponentTracker() {
  const [categories, setCategories] = useState<string[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Satellite');
  const [selectedPartId, setSelectedPartId] = useState<string>('gyroscope');
  const [componentsData, setComponentsData] = useState<any[]>([]);

  // Initial Fetch for Dropdowns
  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetch(`http://localhost:4000/api/products/${selectedCategory}/parts`)
        .then(res => res.json())
        .then(data => {
          setParts(data);
          if (data.length > 0 && !data.find((p:any) => p.id === selectedPartId)) {
            setSelectedPartId(data[0].id);
          }
        });
    }
  }, [selectedCategory]);

  // Real-time Data Sync
  useEffect(() => {
    socket.on('components:update', (payload) => {
      setComponentsData(payload);
    });
    return () => { socket.off('components:update'); };
  }, []);

  const activePart = componentsData.find(c => c.id === selectedPartId);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {selectedCategory === 'Satellite' ? <Rocket className="text-cyan-400" size={32} /> : <Cpu className="text-blue-400" size={32} />}
          <h1 className="text-3xl font-bold text-white">Precision Component Tracker</h1>
        </div>
        <p className="text-slate-400">Advanced telemetry & isolated part variance tracking.</p>
      </header>

      {/* Control Surface (Dropdowns) */}
      <div className="glass-card p-6 rounded-2xl flex gap-6 items-end">
        <div className="space-y-2 flex-1">
          <label className="text-sm font-semibold text-cyan-500 uppercase tracking-wider">Product Category</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 outline-none focus:border-cyan-500 transition-colors cursor-pointer appearance-none"
          >
            {categories.map(c => <option key={c} value={c}>{c} Systems</option>)}
          </select>
        </div>

        <div className="space-y-2 flex-1">
          <label className="text-sm font-semibold text-blue-500 uppercase tracking-wider">Active Component</label>
          <select 
            value={selectedPartId} 
            onChange={(e) => setSelectedPartId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none"
          >
            {parts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {!activePart ? (
        <div className="flex-1 flex items-center justify-center text-cyan-500 animate-pulse">Syncing Telemetry...</div>
      ) : (
        <>
          {/* Dynamic Component KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <AnimatePresence mode="popLayout">
               {activePart.metrics.map((m: any, i: number) => (
                 <motion.div 
                   key={m.label}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   transition={{ delay: i * 0.1 }}
                   className="glass-card p-6 rounded-xl border border-white/5 relative overflow-hidden group hover:border-cyan-500/50"
                 >
                   <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="flex justify-between items-start mb-2 relative z-10">
                     <p className="text-sm text-slate-400 font-medium">{m.label}</p>
                     {m.trend === 'up' && <TrendingUp size={16} className="text-green-400" />}
                     {m.trend === 'down' && <TrendingDown size={16} className="text-red-400" />}
                     {m.trend === 'stable' && <Minus size={16} className="text-slate-500" />}
                   </div>
                   <div className="text-3xl font-bold text-white relative z-10 flex items-baseline gap-1">
                     {m.value} <span className="text-sm text-slate-500 font-normal">{m.unit}</span>
                   </div>
                 </motion.div>
               ))}
             </AnimatePresence>
          </div>

          {/* Telemetry Chart */}
          <motion.div 
            key={activePart.id} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex-1 glass-card rounded-2xl p-6 min-h-[400px] flex flex-col"
          >
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-cyan-200">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Live Variance Telemetry ({activePart.name})
            </h2>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activePart.telemetryLog}>
                  <defs>
                    <linearGradient id="colorVal1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorVal2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" tick={{fontSize: 12}} />
                  <YAxis stroke="#64748b" domain={['auto', 'auto']} tick={{fontSize: 12}} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="val1" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorVal1)" name="Sensor A" />
                  <Area type="monotone" dataKey="val2" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVal2)" name="Sensor B" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

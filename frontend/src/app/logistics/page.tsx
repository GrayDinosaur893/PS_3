'use client';
import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { motion } from 'framer-motion';
import { MapPin, Truck, AlertOctagon } from 'lucide-react';

export default function LogisticsTracker() {
  const [shipments, setShipments] = useState<any[]>([]);

  useEffect(() => {
    socket.on('factory_pulse', (payload) => {
      setShipments(payload.shipments);
    });
    return () => { socket.off('factory_pulse'); };
  }, []);

  return (
    <div className="space-y-6 flex flex-col h-full">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Fleet Logistics</h1>
        <p className="text-slate-400">Autonomous Routing & Transit Tracking</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* SVG Route Map Mock */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center gap-2">
            <MapPin size={20}/> Live Routing Matrix
          </h2>
          <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden relative min-h-[400px]">
             {/* Map Grid Background */}
             <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(6,182,212,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.2)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

             {/* SVG Glowing Routes */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
               <defs>
                 <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                   <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                 </linearGradient>
               </defs>
               {/* Abstract geometric transit lanes */}
               <path d="M 20% 30% C 30% 10%, 40% 50%, 50% 50%" fill="none" stroke="url(#routeGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-[pulse_2s_ease-in-out_infinite]" />
               <path d="M 50% 50% L 80% 25%" fill="none" stroke="url(#routeGrad)" strokeWidth="3" />
               <path d="M 50% 50% L 40% 75% L 80% 75%" fill="none" stroke="url(#routeGrad)" strokeWidth="2" strokeDasharray="6 6" />
             </svg>
             
             {/* Infrastructure Nodes (Hubs) */}
             <div className="absolute top-[30%] left-[20%] w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_#06b6d4] -translate-x-1/2 -translate-y-1/2 z-0">
               <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-cyan-200 whitespace-nowrap bg-slate-900/80 px-2 py-1 rounded border border-cyan-500/30">Testing Lab</span>
             </div>
             <div className="absolute top-[50%] left-[50%] w-6 h-6 bg-blue-500 rounded-full shadow-[0_0_30px_#3b82f6] -translate-x-1/2 -translate-y-1/2 z-0 animate-pulse border-2 border-cyan-300">
               <span className="absolute top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-blue-200 whitespace-nowrap bg-slate-900/80 px-2 py-1 rounded border border-blue-500/30">Primary Factory Hub</span>
             </div>
             <div className="absolute top-[25%] left-[80%] w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_#06b6d4] -translate-x-1/2 -translate-y-1/2 z-0">
               <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-cyan-200 whitespace-nowrap bg-slate-900/80 px-2 py-1 rounded border border-cyan-500/30">Launch Pad A</span>
             </div>
             <div className="absolute top-[75%] left-[40%] w-4 h-4 bg-indigo-400 rounded-full shadow-[0_0_20px_#818cf8] -translate-x-1/2 -translate-y-1/2 z-0">
               <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-indigo-200 whitespace-nowrap bg-slate-900/80 px-2 py-1 rounded border border-indigo-500/30">Assembly Dock</span>
             </div>
             <div className="absolute top-[75%] left-[80%] w-4 h-4 bg-indigo-400 rounded-full shadow-[0_0_20px_#818cf8] -translate-x-1/2 -translate-y-1/2 z-0">
               <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-indigo-200 whitespace-nowrap bg-slate-900/80 px-2 py-1 rounded border border-indigo-500/30">Export Vault</span>
             </div>
             
             {/* Live Moving Assets */}
             {shipments.map((s, i) => {
               const startLat = 18;
               const endLat = 29;
               const startLng = 72;
               const endLng = 78;

               const top = Math.max(10, Math.min(90, ((s.lat - startLat) / (endLat - startLat)) * 100));
               const left = Math.max(10, Math.min(90, ((s.lng - startLng) / (endLng - startLng)) * 100));

               return (
                 <motion.div
                   key={s.id}
                   className="absolute group z-20 cursor-pointer"
                   animate={{ top: `${top}%`, left: `${left}%` }}
                   transition={{ duration: 2.5, ease: 'linear' }}
                 >
                   <div className="relative -ml-4 -mt-4 p-2 bg-blue-600 rounded-full shadow-[0_0_25px_rgba(59,130,246,0.9)] border-2 border-cyan-200 hover:scale-125 transition-transform">
                      <Truck size={16} className="text-white" />
                   </div>
                   
                   {/* HUD Hover Detail */}
                   <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur shadow-xl text-left p-3 rounded-lg border border-cyan-500/50 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                     <div className="font-bold text-cyan-300 border-b border-white/10 pb-1 mb-2">{s.id}</div>
                     <div className="text-xs text-slate-300"><b>ETA:</b> {s.eta}</div>
                     <div className="text-xs text-slate-300"><b>Status:</b> {s.status === 'DELAYED' ? <span className="text-amber-500">Delay Risk</span> : <span className="text-green-400">Optimal Transit</span>}</div>
                   </div>
                 </motion.div>
               )
             })}
          </div>
        </div>

        {/* Fleet Table */}
        <div className="glass-card rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-white">Active Consignments</h2>
          <div className="space-y-4 flex-1 overflow-y-auto">
            {shipments.map(s => (
              <div key={s.id} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-cyan-300">{s.id}</span>
                  {s.status === 'DELAYED' ? (
                    <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-amber-500/20 text-amber-500 rounded"><AlertOctagon size={14}/> DELAY RISK</span>
                  ) : (
                    <span className="text-xs font-bold px-2 py-1 bg-blue-500/20 text-blue-400 rounded">{s.status}</span>
                  )}
                </div>
                <div className="text-sm text-slate-300 mb-2">Route: {s.route}</div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>ETA</span>
                  <span className="font-mono text-white">{s.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

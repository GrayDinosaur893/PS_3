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
             <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
             
             {shipments.map((s, i) => {
               // Map lat/long constraints roughly to 0-100% for SVG positioning
               const startLat = 18;
               const endLat = 29;
               const startLng = 72;
               const endLng = 78;

               const top = Math.max(10, Math.min(90, ((s.lat - startLat) / (endLat - startLat)) * 100));
               const left = Math.max(10, Math.min(90, ((s.lng - startLng) / (endLng - startLng)) * 100));

               return (
                 <motion.div
                   key={s.id}
                   className="absolute group"
                   animate={{ top: `${top}%`, left: `${left}%` }}
                   transition={{ duration: 2.5, ease: 'linear' }}
                 >
                   <div className="relative -ml-4 -mt-4 z-10 p-2 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)] border-2 border-white">
                      <Truck size={16} className="text-white" />
                   </div>
                   <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded border border-slate-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                     {s.id}
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

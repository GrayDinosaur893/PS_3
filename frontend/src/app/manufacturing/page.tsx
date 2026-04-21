'use client';
import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ManufacturingTracker() {
  const [machines, setMachines] = useState<any[]>([]);

  useEffect(() => {
    socket.on('factory_pulse', (payload) => {
      setMachines(payload.machines);
    });
    return () => { socket.off('factory_pulse'); };
  }, []);

  return (
    <div className="space-y-6">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manufacturing Floor</h1>
          <p className="text-slate-400">Live Machine Telemetry & Autonomous Scaling</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {[...machines]
            .sort((a, b) => a.health - b.health)
            .map((m) => {
            const isWarning = m.status === 'WARNING';
            return (
              <motion.div
                key={m.id}
                layout
                className={`rounded-2xl p-6 transition-all duration-300 backdrop-blur-md border ${
                  isWarning 
                    ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:shadow-[0_0_40px_rgba(239,68,68,0.4)]' 
                    : 'bg-white/5 border-white/10 hover:border-cyan-500/50'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white">{m.name}</h3>
                  {isWarning ? <AlertTriangle className="text-red-500 animate-pulse" /> : <CheckCircle2 className="text-green-500" />}
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Status</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${isWarning ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {m.status}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Core Temp</span>
                      <span className={m.temp > 80 ? 'text-red-400 font-bold' : 'text-white'}>{m.temp.toFixed(1)}°C</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <motion.div 
                        className={`h-full ${m.temp > 80 ? 'bg-red-500' : 'bg-cyan-500'}`}
                        animate={{ width: `${Math.min((m.temp / 100) * 100, 100)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Spindle RPM</span>
                      <span className="text-white font-mono">{Math.round(m.rpm)}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <motion.div 
                        className="h-full bg-blue-500"
                        animate={{ width: `${Math.min((m.rpm / 4000) * 100, 100)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2 mt-2 border-t border-white/10 flex justify-between items-center">
                    <span className="text-sm text-slate-400">Health Score</span>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
                      {m.health}%
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

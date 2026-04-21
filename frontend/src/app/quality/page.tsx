'use client';
import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ScanLine } from 'lucide-react';

export default function QualityInspection() {
  const [logs, setLogs] = useState<any[]>([]);
  const [passRate, setPassRate] = useState(100);

  useEffect(() => {
    socket.on('factory_pulse', (payload) => {
      setLogs(payload.quality.reverse());
      setPassRate(100 - payload.analytics.defectRate);
    });
    return () => { socket.off('factory_pulse'); };
  }, []);

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">AI Visual Inspection</h1>
        <p className="text-slate-400">Computer Vision Automated Defect Detection</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPI Area */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6 text-center">
             <h2 className="text-slate-400 mb-2">Overall Pass Rate</h2>
             <div className="text-5xl font-bold text-white flex justify-center items-baseline gap-1">
               {passRate.toFixed(1)}<span className="text-2xl text-slate-500">%</span>
             </div>
          </div>
          
          <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-900/20 translate-y-full group-hover:translate-y-0 transition-transform duration-1000"/>
            <ScanLine size={48} className="text-cyan-400 mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-white text-center">Scanner Active</h3>
            <p className="text-sm text-slate-400 mt-2 text-center">Processing 420 frames/sec on assembly line B.</p>
          </div>
        </div>

        {/* Live Stream */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 h-[500px] flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-white">Live Inspection Stream</h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  layout
                  className={`p-4 rounded-xl flex items-center justify-between border ${
                    log.status === 'PASS' 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {log.status === 'PASS' ? <ShieldCheck className="text-green-400" /> : <ShieldAlert className="text-red-400" />}
                    <div>
                      <div className="font-bold text-white">{log.id}</div>
                      <div className="text-xs text-slate-400">Confidence: {log.confidence}</div>
                    </div>
                  </div>
                  
                  <div className={`font-bold px-3 py-1 rounded-full text-xs ${
                    log.status === 'PASS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {log.status}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Clock, Truck, HardHat } from 'lucide-react';

export default function Analytics() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    socket.on('factory_pulse', (payload) => {
      setAnalytics(payload.analytics);
    });
    return () => { socket.off('factory_pulse'); };
  }, []);

  if (!analytics) return <div className="text-cyan-500 animate-pulse text-center mt-20">Calculating Metrics...</div>;

  const chartData = [
    { name: 'Week 1', savings: 2000, preventions: 4 },
    { name: 'Week 2', savings: 4500, preventions: 9 },
    { name: 'Week 3', savings: 3200, preventions: 6 },
    { name: 'Current', savings: analytics.monthlySavings / 2, preventions: 12 },
  ];

  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric,Value\n";
    csvContent += `Downtime Prevented (hrs),${chartData[3].preventions * 6}\n`;
    csvContent += `Est Monthly Savings ($),${analytics.monthlySavings}\n`;
    csvContent += `Current Defect Rate (%),${analytics.defectRate}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "factory_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">ROI & Business Impact</h1>
          <p className="text-slate-400">Real-time quantification of AI autonomous actions.</p>
        </div>
        <button 
          onClick={downloadCSV}
          className="glass-card px-4 py-2 rounded-lg text-cyan-300 hover:text-white hover:bg-cyan-900/50 flex items-center gap-2 transition-all font-medium text-sm"
        >
          Export CSV
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">Downtime Prevented</p>
            <p className="text-3xl font-bold text-white">42<span className="text-lg text-slate-500">hrs</span></p>
          </div>
          <Clock className="text-cyan-500 opacity-50" size={40} />
        </div>
        
        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">Logistics Delays Avoided</p>
            <p className="text-3xl font-bold text-white">18<span className="text-lg text-slate-500">%</span></p>
          </div>
          <Truck className="text-blue-500 opacity-50" size={40} />
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">Labor Hours Saved</p>
            <p className="text-3xl font-bold text-white">1,240<span className="text-lg text-slate-500">hrs</span></p>
          </div>
          <HardHat className="text-amber-500 opacity-50" size={40} />
        </div>

        <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-green-900/30 to-transparent border-green-500/30 border">
          <p className="text-sm text-green-300/80 uppercase tracking-wider font-semibold mb-1">Est. Monthly Savings</p>
          <div className="text-4xl font-bold text-green-400 flex items-center gap-1">
            <DollarSign size={32} />
            {analytics.monthlySavings.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 h-[400px]">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          Weekly Savings Trajectory
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
            <Bar dataKey="savings" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

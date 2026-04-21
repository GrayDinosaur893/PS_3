import { Activity, LayoutDashboard, Truck, Settings, Drill, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  const routes = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Manufacturing', path: '/manufacturing', icon: Drill },
    { name: 'Quality', path: '/quality', icon: CheckCircle },
    { name: 'Logistics', path: '/logistics', icon: Truck },
    { name: 'Analytics', path: '/analytics', icon: Activity },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-white/10 glass-card flex flex-col p-4 mr-0 z-50">
      <div className="flex items-center gap-3 mb-10 px-2 mt-4">
        <div className="w-8 h-8 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-300">
          FactoryMind AI
        </h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {routes.map((route) => (
          <Link href={route.path} key={route.name} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors text-slate-300 hover:text-white">
            <route.icon size={20} />
            <span className="font-medium">{route.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto p-4 glass-card rounded-xl text-center border-cyan-500/30 border">
        <p className="text-xs text-cyan-200 uppercase tracking-widest font-semibold mb-1">Status</p>
        <p className="text-sm font-bold text-green-400 flex items-center justify-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          System Online
        </p>
      </div>
    </aside>
  );
}

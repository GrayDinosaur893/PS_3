import fs from 'fs';
import path from 'path';

// For a hackathon, we keep the DB objects in memory as singletons.
// This is ultra-fast and avoids disk read/write locks when doing setInterval updates.

export const db = {
  machines: [
    { id: 'M-01', name: 'CNC Lathe Alpha', status: 'RUNNING', temp: 65, rpm: 1200, output: 45, health: 98 },
    { id: 'M-02', name: 'Laser Cutter Beta', status: 'RUNNING', temp: 70, rpm: 3000, output: 120, health: 90 },
    { id: 'M-03', name: 'Assembly Arm X', status: 'RUNNING', temp: 55, rpm: 800, output: 300, health: 99 },
    { id: 'M-04', name: 'Packaging Unit', status: 'RUNNING', temp: 60, rpm: 1500, output: 400, health: 95 }
  ],
  shipments: [
    { id: 'TRK-101', route: 'Bhopal -> Indore', status: 'IN_TRANSIT', eta: '3h 15m', lat: 23.2599, lng: 77.4126 },
    { id: 'TRK-205', route: 'Mumbai -> Pune', status: 'IN_TRANSIT', eta: '2h 45m', lat: 18.95, lng: 72.82 },
    { id: 'TRK-308', route: 'Delhi -> Jaipur', status: 'IN_TRANSIT', eta: '5h 10m', lat: 28.6139, lng: 77.2090 }
  ],
  qualityLogs: [] as any[],
  actions: [] as string[],
  analytics: {
    productionTotal: 4200,
    defectRate: 1.2,
    monthlySavings: 15400
  }
};

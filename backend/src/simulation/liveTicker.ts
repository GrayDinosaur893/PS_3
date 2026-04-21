import { Server } from 'socket.io';
import { db } from '../data/db';

export function startSimulation(io: Server) {
   setInterval(() => {
     let triggerAction = false;
     
     // 1. Manufacturing Tick
     db.machines.forEach(m => {
       m.temp += (Math.random() * 4) - 1.5;
       m.rpm += (Math.random() * 100) - 50;
       
       // Force anomalies bounds
       if (m.temp > 95) m.temp = 80;
       if (m.rpm > 4000) m.rpm = 2500;
       
       if (m.temp > 85) {
         // Autonomous AI Reaction
         m.rpm = m.rpm * 0.8; 
         m.temp -= 10;
         m.status = 'WARNING';
         db.actions.push(`[${new Date().toLocaleTimeString()}] AI lowered RPM on ${m.name}. [REASON: Temperature crossed 85C threshold]`);
         db.analytics.monthlySavings += 250;
         triggerAction = true;
       } else if (m.temp < 75) {
         m.status = 'RUNNING';
         m.health = 98 + Math.floor(Math.random() * 3) - 1; // minor fluctuations
       }
     });

     // 2. Logistics Tick
     db.shipments.forEach(s => {
       // Interpolate truck position
       s.lat += (Math.random() * 0.05) - 0.02;
       s.lng += (Math.random() * 0.05) - 0.02;
       
       if (Math.random() > 0.90) { // 10% chance
           db.actions.push(`[${new Date().toLocaleTimeString()}] Route optimization for ${s.id}. [REASON: Predicted traffic density ahead]`);
           triggerAction = true;
           db.analytics.monthlySavings += 100;
       }
     });

     // 3. Quality Tick
     if (Math.random() > 0.5) {
        db.analytics.productionTotal += Math.floor(Math.random()*10);
        const passed = Math.random() > 0.1; // 10% fail rate
        db.qualityLogs.push({ id: `CHK-${Math.floor(Math.random()*1000)}`, status: passed ? 'PASS' : 'FAIL', confidence: (Math.random() * 15 + 85).toFixed(1) + '%' });
        if (!passed) {
            db.actions.push(`[${new Date().toLocaleTimeString()}] Batch rejected. [REASON: Computer vision detected micro-fissure]`);
            triggerAction = true;
        }
     }

     // Build broadcast payload
     const payload = {
        machines: db.machines,
        shipments: db.shipments,
        analytics: db.analytics,
        quality: db.qualityLogs.slice(-10) // latest 10
     };
     
     io.emit('factory_pulse', payload);
     
     if (triggerAction) {
        io.emit('new_action', db.actions[db.actions.length - 1]); // Send latest action string
     }

   }, 2500); // 2.5s pulse for visible demo speed
}

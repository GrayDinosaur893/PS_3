import { db } from '../data/db';
import { liveConfig } from '../config';

export const tickManufacturing = (): boolean => {
  let actionsTriggered = false;

  db.machines.forEach(m => {
    m.temp += (Math.random() * 4) - 1.5;
    m.rpm += (Math.random() * 100) - 50;
    
    // Bounds check
    if (m.temp > liveConfig.max_temp + 10) m.temp = 80;
    if (m.rpm > 4000) m.rpm = 2500;
    
    // AI Rules Engine
    if (m.temp > liveConfig.max_temp) {
      m.rpm = m.rpm * 0.8; 
      m.temp -= 10;
      m.status = 'WARNING';
      db.actions.push(`[${new Date().toLocaleTimeString()}] AI lowered RPM on ${m.name}. [REASON: Temperature crossed ${liveConfig.max_temp}C threshold]`);
      db.analytics.monthlySavings += 250;
      actionsTriggered = true;
    } else if (m.temp < 75) {
      m.status = 'RUNNING';
      m.health = Math.min(100, Math.max(0, 98 + Math.floor(Math.random() * 3) - 1));
    }
  });

  return actionsTriggered;
};

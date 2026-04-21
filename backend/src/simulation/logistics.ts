import { db } from '../data/db';
import { liveConfig } from '../config';

export const tickLogistics = (): boolean => {
  let actionsTriggered = false;

  db.shipments.forEach(s => {
    s.lat += (Math.random() * 0.05) - 0.02;
    s.lng += (Math.random() * 0.05) - 0.02;
    
    // Delay Rule Engine
    if (Math.random() > 0.90) {
        db.actions.push(`[${new Date().toLocaleTimeString()}] Route optimization for ${s.id}. [REASON: Predicted traffic density crossing ${liveConfig.max_delay_minutes}min threshold]`);
        actionsTriggered = true;
        db.analytics.monthlySavings += 100;
    }
  });

  return actionsTriggered;
};

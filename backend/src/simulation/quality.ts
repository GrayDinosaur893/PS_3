import { db } from '../data/db';
import { liveConfig } from '../config';

export const tickQuality = (): boolean => {
  let actionsTriggered = false;

  if (Math.random() > 0.5) {
    db.analytics.productionTotal += Math.floor(Math.random() * 10);
    const passed = Math.random() > (liveConfig.defect_threshold_percent / 100); 
    
    db.qualityLogs.push({ 
      id: `CHK-${Math.floor(Math.random() * 1000)}`, 
      status: passed ? 'PASS' : 'FAIL', 
      confidence: (Math.random() * 15 + 85).toFixed(1) + '%' 
    });
    
    if (!passed) {
        db.actions.push(`[${new Date().toLocaleTimeString()}] Batch rejected. [REASON: Computer vision detected Thermal Shield surface defect]`);
        actionsTriggered = true;
    }
  }

  return actionsTriggered;
};

import { db } from '../data/db';

export const tickComponents = (): boolean => {
  let actionsTriggered = false;

  db.components.forEach(comp => {
    // Determine random jitter for active telemetry lines (simulating precision tuning)
    const baseVal = 99.0;
    const jitter = (Math.random() * 0.4) - 0.2; // +/- 0.2
    
    // Add point to history
    comp.telemetryLog.push({
      time: new Date().toLocaleTimeString(),
      val1: +(baseVal + jitter).toFixed(3),
      val2: +(baseVal + jitter * 1.5).toFixed(3)
    });
    
    // Keep array size down to trailing 25 points
    if (comp.telemetryLog.length > 25) {
      comp.telemetryLog.shift();
    }

    // Occasionally perturb numerical metric values to look "alive"
    comp.metrics.forEach(metric => {
       if (typeof metric.value === 'number' && Math.random() > 0.6) {
           const delta = (Math.random() * metric.value * 0.01) - (metric.value * 0.005);
           metric.value = +(metric.value + delta).toFixed(2);
       }
    });

    // Random advanced aerospace alert
    if (Math.random() > 0.95 && comp.category === 'Satellite') {
        db.actions.push(`[${new Date().toLocaleTimeString()}] Autonomous recalibration on ${comp.name}. [REASON: Micro-vibration variance detected in high-gravity stress test]`);
        actionsTriggered = true;
    }
  });

  return actionsTriggered;
};

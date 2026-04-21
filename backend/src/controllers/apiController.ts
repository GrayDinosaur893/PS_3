import { Request, Response } from 'express';
import { db } from '../data/db';

export const getUptime = () => process.uptime();

export const getCategories = (req: Request, res: Response) => {
  const categories = Array.from(new Set(db.components.map(c => c.category)));
  res.json(categories);
};

export const getPartsByCategory = (req: Request, res: Response) => {
  const { category } = req.params;
  const parts = db.components.filter(c => c.category.toLowerCase() === String(category).toLowerCase());
  res.json(parts);
};

export const healthCheck = (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(getUptime()),
    connected_clients: 0, // Injected via socket instance later if tracking is needed globally
    last_tick: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
};

export const getMetrics = (req: Request, res: Response) => {
  res.json({
    total_units_produced: db.analytics.productionTotal,
    defects_detected: db.qualityLogs.filter(l => l.status === 'FAIL').length,
    reroutes_triggered: db.actions.filter(a => a.includes('reroute')).length,
    alerts_generated: db.actions.length,
    machine_warnings: db.machines.filter(m => m.status === 'WARNING').length
  });
};

export const explainMachine = (req: Request, res: Response) => {
  const { id } = req.params;
  const machine = db.machines.find(m => m.id === id);
  if (!machine) {
    return res.status(404).json({ success: false, message: 'Machine not found' });
  }

  const reasons = [];
  if (machine.temp > 80) reasons.push('Core temperature exceeded mission-critical continuous operating limits.');
  if (machine.rpm < 2000 && machine.temp > 80) reasons.push('AI autonomous thermal shielding lowered RPM to preserve integrity.');
  if (machine.health < 95) reasons.push('Space-grade vibration sensors detected assembly drift.');

  res.json({
    machine_id: machine.id,
    risk: machine.status === 'WARNING' ? 'HIGH' : machine.health < 90 ? 'MEDIUM' : 'LOW',
    reasons: reasons.length ? reasons : ['Machine is operating nominally within stable parameters.']
  });
};

export const explainShipment = (req: Request, res: Response) => {
  const { id } = req.params;
  const shipment = db.shipments.find(s => s.id === id);
  if (!shipment) {
    return res.status(404).json({ success: false, message: 'Shipment not found' });
  }

  const reasons = [];
  if (shipment.status === 'DELAYED') reasons.push('Export Vault transfer clearance delayed by inspection.');
  if (shipment.route.includes('Clean Room')) reasons.push('Clean Room depressurization protocols slowing transit.');

  res.json({
    shipment_id: shipment.id,
    delay_risk: shipment.status === 'DELAYED' ? 'HIGH' : shipment.status === 'PENDING' ? 'MEDIUM' : 'LOW',
    reasons: reasons.length ? reasons : ['Route perfectly clear, operating at optimal transit speed.']
  });
};

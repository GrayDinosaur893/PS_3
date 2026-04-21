import { Server } from 'socket.io';
import { db } from '../data/db';
import { liveConfig } from '../config';
import { tickManufacturing } from './manufacturing';
import { tickLogistics } from './logistics';
import { tickQuality } from './quality';
import { tickComponents } from './components';

let intervalId: NodeJS.Timeout | null = null;

export const tickLoop = (io: Server) => {
  if (liveConfig.isPaused) return;

  const mfAction = tickManufacturing();
  const logAction = tickLogistics();
  const qAction = tickQuality();
  const compAction = tickComponents();

  const anyActionThisTick = mfAction || logAction || qAction || compAction;

  // New requested Dual-Emit System
  // 1. Granular channels
  io.emit('machine:update', db.machines);
  io.emit('shipment:update', db.shipments);
  io.emit('quality:update', db.qualityLogs.slice(-10));
  io.emit('metrics:update', db.analytics);
  io.emit('components:update', db.components);
  
  if (anyActionThisTick) {
    const latestAction = db.actions[db.actions.length - 1];
    io.emit('action:new', latestAction);
    io.emit('alert:new', { message: latestAction, severity: 'warn' });
  }

  // 2. Legacy unified channel (Prevents frontend crash)
  io.emit('factory_pulse', {
    machines: db.machines,
    shipments: db.shipments,
    analytics: db.analytics,
    quality: db.qualityLogs.slice(-10)
  });

  // 3. Current action payload for legacy
  if (anyActionThisTick) {
    io.emit('new_action', db.actions[db.actions.length - 1]);
  }
};

export const startSimulationEngine = (io: Server) => {
  if (intervalId) clearInterval(intervalId);
  
  intervalId = setInterval(() => tickLoop(io), liveConfig.simulation_speed_ms);

  // Watch for speed changes dynamically
  let currentSpeed = liveConfig.simulation_speed_ms;
  setInterval(() => {
    if (liveConfig.simulation_speed_ms !== currentSpeed) {
      currentSpeed = liveConfig.simulation_speed_ms;
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => tickLoop(io), currentSpeed);
    }
  }, 1000);
};

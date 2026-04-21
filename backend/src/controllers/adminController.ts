import { Request, Response } from 'express';
import { liveConfig } from '../config';
import { resetDb } from '../data/db';
import { configUpdateSchema, demoControlSchema } from '../validators/schemas';

export const patchConfig = (req: Request, res: Response) => {
  const result = configUpdateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, message: 'Invalid configuration data' });
  }
  Object.assign(liveConfig, result.data);
  res.json({ success: true, config: liveConfig });
};

export const getConfig = (req: Request, res: Response) => {
  res.json({ success: true, config: liveConfig });
};

export const toggleDemoState = (req: Request, res: Response) => {
  const result = demoControlSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ success: false, message: 'Invalid action command' });
  }

  const { action } = result.data;
  
  if (action === 'pause') liveConfig.isPaused = true;
  if (action === 'resume') liveConfig.isPaused = false;
  if (action === 'reset') resetDb();
  
  res.json({ success: true, message: `System state changed via ${action}` });
};

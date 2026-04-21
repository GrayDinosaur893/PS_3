import express, { Request, Response } from 'express';
import { db } from '../data/db';
import { healthCheck, getMetrics, explainMachine, explainShipment, getCategories, getPartsByCategory } from '../controllers/apiController';
import { patchConfig, getConfig, toggleDemoState } from '../controllers/adminController';
import { apiLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Apply generous rate limiter to all API routes
router.use(apiLimiter);

// Component Dropdown Endpoints
router.get('/products', getCategories);
router.get('/products/:category/parts', getPartsByCategory);

// Existing Polling Routes
router.get('/machines', (req: Request, res: Response) => res.json(db.machines));
router.get('/shipments', (req: Request, res: Response) => res.json(db.shipments));
router.get('/analytics', (req: Request, res: Response) => res.json(db.analytics));
router.get('/actions', (req: Request, res: Response) => res.json(db.actions.slice(-20).reverse()));
router.get('/quality', (req: Request, res: Response) => res.json(db.qualityLogs.slice(-20).reverse()));

// Enterprise API Additions
router.get('/health', healthCheck);
router.get('/metrics', getMetrics);
router.get('/explain/machine/:id', explainMachine);
router.get('/explain/shipment/:id', explainShipment);

// Admin Control Routes
router.get('/config', getConfig);
router.patch('/config', patchConfig);
router.post('/admin/:action', (req: Request, res: Response) => {
    req.body = { action: req.params.action };
    toggleDemoState(req, res);
});

export default router;

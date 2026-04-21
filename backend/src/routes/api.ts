import express from 'express';
import { db } from '../data/db';

const router = express.Router();

router.get('/machines', (req, res) => res.json(db.machines));

router.get('/shipments', (req, res) => res.json(db.shipments));

router.get('/analytics', (req, res) => res.json(db.analytics));

router.get('/actions', (req, res) => {
    // Return last 20 actions
    res.json(db.actions.slice(-20).reverse());
});

router.get('/quality', (req, res) => {
    res.json(db.qualityLogs.slice(-20).reverse());
});

export default router;

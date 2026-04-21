import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/api';
import { startSimulationEngine } from './simulation/engine';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '5mb' }));

// Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log(`[Socket] Frontend Connected: ${socket.id}`);
});

// Start the enterprise simulation orchestrator
startSimulationEngine(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`[Backend] FactoryMind AI Engine running on port ${PORT}`);
});

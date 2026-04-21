import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import apiRoutes from './routes/api';
import { startSimulation } from './simulation/liveTicker';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // Allow any origin for hackathon local testing
});

io.on('connection', (socket) => {
    console.log(`Frontend Connected: ${socket.id}`);
});

// Start the internal pulse that updates state and blasts it to UI
startSimulation(io);

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`[Backend] FactoryMind AI Engine running on port ${PORT}`);
});

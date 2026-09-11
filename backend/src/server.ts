import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';

import { connectDB } from './config/db.js';
import { seedDatabase } from './config/seed.js';
import { initSocketHandler } from './socket/socketHandler.js';

import authRoutes from './routes/authRoutes.js';
import crossingRoutes from './routes/crossingRoutes.js';
import trafficRoutes from './routes/trafficRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/crossings', crossingRoutes);
app.use('/api/traffic', trafficRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/health', healthRoutes);

// Socket.IO Setup
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

initSocketHandler(io);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    server.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 OmniCross Command Centre Server running on port ${PORT}`);
      console.log(`📡 Socket.IO & Telemetry Simulator Active`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { getSimulatorInstance } from '../socket/socketHandler.js';
import { CrossingModel } from '../models/Crossing.js';

const router = Router();

// GET /api/health
router.get('/', async (req: Request, res: Response) => {
  try {
    const dbState = mongoose.connection.readyState; // 1 = connected
    const simulator = getSimulatorInstance();
    const isSimulatorRunning = simulator ? simulator.getStatus().isRunning : false;
    const activeCrossings = await CrossingModel.countDocuments();

    let healthStatus: 'HEALTHY' | 'DEGRADED' | 'OFFLINE' = 'HEALTHY';
    if (dbState !== 1) {
      healthStatus = 'OFFLINE';
    } else if (!isSimulatorRunning) {
      healthStatus = 'DEGRADED';
    }

    res.json({
      status: healthStatus,
      backendConnected: true,
      databaseState: dbState === 1 ? 'CONNECTED' : 'DISCONNECTED',
      telemetrySimulatorRunning: isSimulatorRunning,
      activeCrossings,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'OFFLINE',
      backendConnected: false,
      error: err.message,
    });
  }
});

export default router;

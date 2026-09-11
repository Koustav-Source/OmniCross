import { Router, Request, Response } from 'express';
import { TelemetryModel } from '../models/Telemetry.js';
import { CrossingModel } from '../models/Crossing.js';

const router = Router();

// GET /api/traffic/live - Get latest telemetry for all crossings
router.get('/live', async (req: Request, res: Response) => {
  try {
    const crossings = await CrossingModel.find({});
    const liveSnapshot = await Promise.all(
      crossings.map(async (crossing) => {
        const latestTelemetry = await TelemetryModel.findOne({ crossingId: crossing.crossingId })
          .sort({ timestamp: -1 })
          .lean();

        return {
          crossingId: crossing.crossingId,
          name: crossing.name,
          type: crossing.type,
          status: crossing.status,
          telemetry: latestTelemetry || {
            vehicleCount: crossing.activeVehiclesCount,
            averageSpeed: crossing.status === 'heavy_congestion' ? 15 : 45,
            occupancy: crossing.congestionIndex,
            queueLength: Math.round(crossing.averageWaitTimeSeconds * 3),
            congestionLevel: crossing.status === 'heavy_congestion' ? 'HEAVY' : 'NORMAL',
            timestamp: new Date(),
          },
        };
      })
    );

    res.json(liveSnapshot);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching live traffic telemetry.' });
  }
});

// GET /api/traffic/history - Get overall telemetry history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const history = await TelemetryModel.find({}).sort({ timestamp: -1 }).limit(limit);
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching traffic history.' });
  }
});

// GET /api/traffic/crossing/:id - Get telemetry history for specific crossing
router.get('/crossing/:id', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const history = await TelemetryModel.find({ crossingId: req.params.id })
      .sort({ timestamp: -1 })
      .limit(limit);
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching crossing telemetry.' });
  }
});

export default router;

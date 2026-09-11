import { Router, Request, Response } from 'express';
import { CrossingModel } from '../models/Crossing.js';
import { authenticateJWT, authorizeRoles, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/crossings - List all crossings
router.get('/', async (req: Request, res: Response) => {
  try {
    const crossings = await CrossingModel.find({}).sort({ crossingId: 1 });
    res.json(crossings);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching crossings.' });
  }
});

// GET /api/crossings/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const crossing = await CrossingModel.findOne({ crossingId: req.params.id });
    if (!crossing) {
      res.status(404).json({ error: 'Crossing not found.' });
      return;
    }
    res.json(crossing);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching crossing.' });
  }
});

// POST /api/crossings - Register/Deploy new crossing (CITY_ADMIN or SUPER_ADMIN)
router.post('/', authenticateJWT, authorizeRoles('CITY_ADMIN', 'SUPER_ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = req.body;
    if (!data.name) {
      res.status(400).json({ error: 'Crossing name is required.' });
      return;
    }

    const crossingId = data.crossingId || `crs-custom-${Date.now().toString().slice(-4)}`;
    const newCrossing = await CrossingModel.create({
      ...data,
      crossingId,
    });

    res.status(201).json(newCrossing);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error creating crossing.' });
  }
});

// PUT /api/crossings/:id - Update crossing config/state (TRAFFIC_OPERATOR, CITY_ADMIN, SUPER_ADMIN)
router.put('/:id', authenticateJWT, authorizeRoles('TRAFFIC_OPERATOR', 'CITY_ADMIN', 'SUPER_ADMIN', 'EMERGENCY_OPERATOR'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await CrossingModel.findOneAndUpdate(
      { crossingId: req.params.id },
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ error: 'Crossing not found.' });
      return;
    }

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating crossing.' });
  }
});

// DELETE /api/crossings/:id
router.delete('/:id', authenticateJWT, authorizeRoles('CITY_ADMIN', 'SUPER_ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deleted = await CrossingModel.findOneAndDelete({ crossingId: req.params.id });
    if (!deleted) {
      res.status(404).json({ error: 'Crossing not found.' });
      return;
    }

    res.json({ message: 'Crossing deleted successfully.', crossingId: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error deleting crossing.' });
  }
});

export default router;

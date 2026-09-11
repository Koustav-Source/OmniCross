import { Router, Request, Response } from 'express';
import { IncidentModel } from '../models/Incident.js';
import { CrossingModel } from '../models/Crossing.js';
import { authenticateJWT, authorizeRoles, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/incidents - Fetch all incidents
router.get('/', async (req: Request, res: Response) => {
  try {
    const statusFilter = req.query.status as string;
    const query = statusFilter ? { status: statusFilter } : {};
    const incidents = await IncidentModel.find(query).sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching incidents.' });
  }
});

// POST /api/incidents - Report/Create incident
router.post('/', authenticateJWT, authorizeRoles('TRAFFIC_OPERATOR', 'EMERGENCY_OPERATOR', 'CITY_ADMIN', 'SUPER_ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { crossingId, title, severity, description, type, assignedTeam } = req.body;
    if (!crossingId || !title) {
      res.status(400).json({ error: 'crossingId and title are required.' });
      return;
    }

    const crossing = await CrossingModel.findOne({ crossingId });
    const crossingName = crossing ? crossing.name : 'Unknown Crossing';

    const incidentId = `inc-${Date.now().toString().slice(-6)}`;
    const newIncident = await IncidentModel.create({
      incidentId,
      crossingId,
      crossingName,
      title,
      type: type || 'OPERATOR_REPORTED',
      severity: severity || 'medium',
      description: description || `Reported incident at ${crossingName}`,
      detectionSource: 'MANUAL_OPERATOR',
      status: assignedTeam ? 'dispatching' : 'active',
      assignedTeam,
    });

    // Increment incident count on crossing
    if (crossing) {
      crossing.incidentsCount += 1;
      crossing.status = 'heavy_congestion';
      await crossing.save();
    }

    res.status(201).json(newIncident);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error creating incident.' });
  }
});

// PUT /api/incidents/:id - Update lifecycle status or assign team
router.put('/:id', authenticateJWT, authorizeRoles('TRAFFIC_OPERATOR', 'EMERGENCY_OPERATOR', 'CITY_ADMIN', 'SUPER_ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updates = req.body;
    if (updates.status === 'resolved' || updates.status === 'closed') {
      updates.resolvedAt = new Date();
    }

    const updatedIncident = await IncidentModel.findOneAndUpdate(
      { incidentId: req.params.id },
      { $set: updates },
      { new: true }
    );

    if (!updatedIncident) {
      res.status(404).json({ error: 'Incident not found.' });
      return;
    }

    res.json(updatedIncident);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating incident.' });
  }
});

// DELETE /api/incidents/:id
router.delete('/:id', authenticateJWT, authorizeRoles('CITY_ADMIN', 'SUPER_ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deleted = await IncidentModel.findOneAndDelete({ incidentId: req.params.id });
    if (!deleted) {
      res.status(404).json({ error: 'Incident not found.' });
      return;
    }
    res.json({ message: 'Incident removed successfully.', incidentId: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error deleting incident.' });
  }
});

export default router;

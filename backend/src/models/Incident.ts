import { Schema, model, Document } from 'mongoose';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'active' | 'dispatching' | 'resolving' | 'resolved' | 'closed';

export interface IIncident extends Document {
  incidentId: string;
  crossingId: string;
  crossingName: string;
  title: string;
  type: string;
  severity: IncidentSeverity;
  description: string;
  detectionSource: 'AUTOMATED_TELEMETRY_ENGINE' | 'CAMERA_ALPR_AI' | 'CITIZEN_CALL' | 'MANUAL_OPERATOR';
  status: IncidentStatus;
  assignedTeam?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

const IncidentSchema = new Schema<IIncident>(
  {
    incidentId: { type: String, required: true, unique: true },
    crossingId: { type: String, required: true },
    crossingName: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, default: 'ANOMALY_TRAFFIC' },
    severity: { type: String, required: true, default: 'medium' },
    description: { type: String, required: true },
    detectionSource: { type: String, default: 'AUTOMATED_TELEMETRY_ENGINE' },
    status: { type: String, default: 'active' },
    assignedTeam: { type: String },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export const IncidentModel = model<IIncident>('Incident', IncidentSchema);

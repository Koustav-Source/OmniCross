import { Schema, model, Document } from 'mongoose';

export interface ITelemetry extends Document {
  crossingId: string;
  vehicleCount: number;
  averageSpeed: number; // km/h
  occupancy: number; // % (0-100)
  queueLength: number; // meters
  congestionLevel: 'NORMAL' | 'MODERATE' | 'HEAVY' | 'CRITICAL';
  weatherImpactFactor: number;
  timestamp: Date;
}

const TelemetrySchema = new Schema<ITelemetry>(
  {
    crossingId: { type: String, required: true, index: true },
    vehicleCount: { type: Number, required: true },
    averageSpeed: { type: Number, required: true },
    occupancy: { type: Number, required: true },
    queueLength: { type: Number, required: true },
    congestionLevel: { type: String, required: true },
    weatherImpactFactor: { type: Number, default: 1.0 },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export const TelemetryModel = model<ITelemetry>('Telemetry', TelemetrySchema);

import { Schema, model, Document } from 'mongoose';

export type SignalState = 'red' | 'yellow' | 'green' | 'flash_red' | 'flash_yellow';
export type CrossingType = 'urban' | 'railway' | 'highway_toll' | 'border' | 'drawbridge' | 'logistics' | 'school' | 'airport';
export type AIMode = 'adaptive' | 'fixed' | 'surge_mitigation' | 'green_wave' | 'manual';
export type CrossingStatus = 'optimal' | 'moderate' | 'heavy_congestion' | 'maintenance' | 'emergency_override';

export interface ICrossing extends Document {
  crossingId: string;
  name: string;
  type: CrossingType;
  location: string;
  coordinates?: { lat: number; lng: number };
  status: CrossingStatus;
  congestionIndex: number;
  activeVehiclesCount: number;
  throughputPerHour: number;
  averageWaitTimeSeconds: number;
  aiMode: AIMode;
  signalPhases: {
    northSouth: SignalState;
    eastWest: SignalState;
    special?: SignalState;
    timer: number;
  };
  numberOfRoads: number;
  lanesPerDirection: number;
  hasRailwayGate?: boolean;
  isRailwayGateClosed?: boolean;
  hasDrawbridge?: boolean;
  isDrawbridgeUp?: boolean;
  hasBorderGate?: boolean;
  isBorderGateOpen?: boolean;
  incidentsCount: number;
  weather: 'clear' | 'rain' | 'fog' | 'snow';
  cameraFeedUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CrossingSchema = new Schema<ICrossing>(
  {
    crossingId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true, default: 'urban' },
    location: { type: String, required: true },
    coordinates: {
      lat: { type: Number, default: 40.7128 },
      lng: { type: Number, default: -74.006 },
    },
    status: { type: String, default: 'optimal' },
    congestionIndex: { type: Number, default: 30 },
    activeVehiclesCount: { type: Number, default: 20 },
    throughputPerHour: { type: Number, default: 3000 },
    averageWaitTimeSeconds: { type: Number, default: 25 },
    aiMode: { type: String, default: 'adaptive' },
    signalPhases: {
      northSouth: { type: String, default: 'green' },
      eastWest: { type: String, default: 'red' },
      special: { type: String, default: 'green' },
      timer: { type: Number, default: 45 },
    },
    numberOfRoads: { type: Number, default: 4 },
    lanesPerDirection: { type: Number, default: 3 },
    hasRailwayGate: { type: Boolean, default: false },
    isRailwayGateClosed: { type: Boolean, default: false },
    hasDrawbridge: { type: Boolean, default: false },
    isDrawbridgeUp: { type: Boolean, default: false },
    hasBorderGate: { type: Boolean, default: false },
    isBorderGateOpen: { type: Boolean, default: true },
    incidentsCount: { type: Number, default: 0 },
    weather: { type: String, default: 'clear' },
    cameraFeedUrl: { type: String },
  },
  { timestamps: true }
);

export const CrossingModel = model<ICrossing>('Crossing', CrossingSchema);

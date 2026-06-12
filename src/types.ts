export type SignalState = 'red' | 'yellow' | 'green' | 'flash_red' | 'flash_yellow';
export type CrossingType = 'urban' | 'railway' | 'highway_toll' | 'border' | 'drawbridge' | 'logistics' | 'school' | 'airport';

export interface Vehicle {
  id: string;
  type: 'car' | 'truck' | 'bus' | 'emergency' | 'motorcycle' | 'train' | 'ship';
  direction: 'north' | 'south' | 'east' | 'west' | 'rail' | 'marine';
  speed: number;
  position: { x: number; y: number };
  targetPosition: { x: number; y: number };
  status: 'moving' | 'waiting' | 'crossing' | 'cleared' | 'stalled';
  plate?: string;
  isPriority?: boolean;
}

export interface SignalPhase {
  direction: 'north_south' | 'east_west' | 'pedestrian' | 'rail' | 'marine';
  state: SignalState;
  remainingSeconds: number;
}

export interface Crossing {
  id: string;
  name: string;
  type: CrossingType;
  location: string;
  status: 'optimal' | 'moderate' | 'heavy_congestion' | 'maintenance' | 'emergency_override';
  congestionIndex: number; // 0 to 100
  activeVehiclesCount: number;
  throughputPerHour: number;
  averageWaitTimeSeconds: number;
  aiMode: 'adaptive' | 'fixed' | 'surge_mitigation' | 'green_wave' | 'manual';
  signalPhases: {
    northSouth: SignalState;
    eastWest: SignalState;
    special?: SignalState; // For rail barrier, drawbridge, or border gate
    timer: number;
  };
  hasRailwayGate?: boolean;
  isRailwayGateClosed?: boolean;
  hasDrawbridge?: boolean;
  isDrawbridgeUp?: boolean;
  hasBorderGate?: boolean;
  isBorderGateOpen?: boolean;
  incidentsCount: number;
  weather: 'clear' | 'rain' | 'fog' | 'snow';
  lanesPerDirection: number;
  cameraFeedUrl?: string;
}

export interface Incident {
  id: string;
  crossingId: string;
  crossingName: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  status: 'active' | 'dispatching' | 'resolving' | 'resolved';
  description: string;
  responderAssigned?: string;
}

export interface InfrastructureNode {
  id: string;
  region: string;
  nodeName: string;
  status: 'healthy' | 'high_load' | 'scaling' | 'degraded';
  cpuUsage: number; // %
  memoryUsage: number; // %
  requestsPerSecond: number;
  websocketConnections: number;
  edgeLatencyMs: number;
  activeWorkers: number;
}

export interface AlprRecord {
  id: string;
  timestamp: string;
  crossingName: string;
  plate: string;
  vehicleType: string;
  speed: number;
  flagged: boolean;
  flagReason?: string;
}

export interface ThroughputDataPoint {
  time: string;
  actualThroughput: number;
  aiPredictedCapacity: number;
  congestionLevel: number;
}

export interface CategoryDataPoint {
  name: string;
  value: number;
  color: string;
}

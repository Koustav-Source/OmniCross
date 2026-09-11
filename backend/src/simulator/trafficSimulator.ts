import { Server as SocketIOServer } from 'socket.io';
import { CrossingModel, ICrossing } from '../models/Crossing.js';
import { TelemetryModel } from '../models/Telemetry.js';
import { IncidentModel } from '../models/Incident.js';
import { TrafficIntelligenceEngine } from '../intelligence/trafficIntelligenceService.js';

export interface TelemetryProvider {
  getLatestTelemetry(crossingId: string): Promise<any>;
}

export class SyntheticTrafficSimulator implements TelemetryProvider {
  private io: SocketIOServer;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private previousSpeeds: Map<string, number> = new Map();

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  public start(intervalMs: number = 3000): void {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`[Simulator] Synthetic Traffic Simulator started (Interval: ${intervalMs}ms)`);

    this.intervalId = setInterval(async () => {
      try {
        await this.simulateTick();
      } catch (err) {
        console.error('[Simulator] Error in simulation tick:', err);
      }
    }, intervalMs);
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('[Simulator] Synthetic Traffic Simulator stopped.');
  }

  public getStatus(): { isRunning: boolean } {
    return { isRunning: this.isRunning };
  }

  public async getLatestTelemetry(crossingId: string): Promise<any> {
    return TelemetryModel.findOne({ crossingId }).sort({ timestamp: -1 }).lean();
  }

  private async simulateTick(): Promise<void> {
    const crossings = await CrossingModel.find({});
    if (!crossings.length) return;

    for (const crossing of crossings) {
      // 1. Generate dynamic realistic telemetry changes based on status
      let deltaVehicles = Math.floor(Math.random() * 9) - 4; // -4 to +4
      let baseSpeed = 45;

      if (crossing.status === 'heavy_congestion') {
        baseSpeed = 15;
        deltaVehicles += Math.floor(Math.random() * 3);
      } else if (crossing.status === 'optimal') {
        baseSpeed = 52;
      }

      const newVehicleCount = Math.max(5, Math.min(150, crossing.activeVehiclesCount + deltaVehicles));
      const speedVariation = (Math.random() * 8 - 4);
      const newSpeed = Math.max(8, Math.round(baseSpeed + speedVariation));

      // Calculate occupancy & queue based on vehicle density
      const laneCapacity = crossing.lanesPerDirection * 20;
      const newOccupancy = Math.min(100, Math.max(10, Math.round((newVehicleCount / laneCapacity) * 80)));
      const newQueueLength = Math.max(0, Math.round((newOccupancy / 100) * 220 + (Math.random() * 20 - 10)));

      // 2. Evaluate using Traffic Intelligence Engine
      const assessment = TrafficIntelligenceEngine.calculateCongestion(
        newOccupancy,
        newSpeed,
        newQueueLength,
        newVehicleCount,
        crossing.lanesPerDirection
      );

      // 3. Signal timing simulation decrement
      let timer = crossing.signalPhases.timer - 3;
      let nsSignal = crossing.signalPhases.northSouth;
      let ewSignal = crossing.signalPhases.eastWest;

      if (timer <= 0) {
        timer = 45;
        if (nsSignal === 'green') {
          nsSignal = 'red';
          ewSignal = 'green';
        } else {
          nsSignal = 'green';
          ewSignal = 'red';
        }
      }

      // Update Crossing DB document
      crossing.activeVehiclesCount = newVehicleCount;
      crossing.congestionIndex = assessment.congestionScore;
      crossing.averageWaitTimeSeconds = Math.round(newQueueLength / 3.5);
      crossing.signalPhases.timer = timer;
      crossing.signalPhases.northSouth = nsSignal;
      crossing.signalPhases.eastWest = ewSignal;

      // Update status if emergency override is not present
      if (crossing.status !== 'emergency_override') {
        if (assessment.congestionLevel === 'CRITICAL' || assessment.congestionLevel === 'HEAVY') {
          crossing.status = 'heavy_congestion';
        } else if (assessment.congestionLevel === 'MODERATE') {
          crossing.status = 'moderate';
        } else {
          crossing.status = 'optimal';
        }
      }

      await crossing.save();

      // 4. Record Telemetry Document
      const telemetryDoc = await TelemetryModel.create({
        crossingId: crossing.crossingId,
        vehicleCount: newVehicleCount,
        averageSpeed: newSpeed,
        occupancy: newOccupancy,
        queueLength: newQueueLength,
        congestionLevel: assessment.congestionLevel,
        weatherImpactFactor: crossing.weather === 'rain' ? 1.2 : crossing.weather === 'snow' ? 1.5 : 1.0,
        timestamp: new Date(),
      });

      // 5. Generate Adaptive Signal Recommendation
      const nsCount = Math.round(newVehicleCount * (0.4 + Math.random() * 0.3));
      const ewCount = newVehicleCount - nsCount;
      const recommendation = TrafficIntelligenceEngine.generateSignalRecommendation(
        crossing.crossingId,
        crossing.name,
        nsCount,
        ewCount,
        crossing.signalPhases.timer,
        45
      );

      // 6. Check for auto-detected anomalies
      const prevSpeed = this.previousSpeeds.get(crossing.crossingId);
      const anomaly = TrafficIntelligenceEngine.detectAnomalies(
        crossing.crossingId,
        crossing.name,
        { vehicleCount: newVehicleCount, averageSpeed: newSpeed, occupancy: newOccupancy, queueLength: newQueueLength },
        prevSpeed ? { averageSpeed: prevSpeed, occupancy: newOccupancy } : undefined
      );

      this.previousSpeeds.set(crossing.crossingId, newSpeed);

      if (anomaly) {
        // Log incident if not already exists recently
        const existingActive = await IncidentModel.findOne({
          crossingId: crossing.crossingId,
          title: anomaly.title,
          status: { $in: ['active', 'dispatching'] },
        });

        if (!existingActive) {
          const newInc = await IncidentModel.create({
            incidentId: `inc-auto-${Date.now().toString().slice(-5)}`,
            crossingId: crossing.crossingId,
            crossingName: crossing.name,
            title: anomaly.title,
            type: anomaly.type,
            severity: anomaly.severity,
            description: anomaly.description,
            detectionSource: anomaly.detectionSource,
            status: 'active',
          });

          this.io.emit('incident:new', newInc);
        }
      }

      // 7. Emit updates via Socket.IO
      const telemetryUpdate = {
        crossingId: crossing.crossingId,
        crossingName: crossing.name,
        telemetry: telemetryDoc,
        assessment,
        recommendation,
        crossingState: crossing,
      };

      this.io.emit('telemetry:update', telemetryUpdate);
    }
  }
}

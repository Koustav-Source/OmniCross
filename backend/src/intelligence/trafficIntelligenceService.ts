export interface CongestionAssessment {
  congestionScore: number; // 0 to 100
  congestionLevel: 'NORMAL' | 'MODERATE' | 'HEAVY' | 'CRITICAL';
  explanation: string;
}

export interface SignalRecommendation {
  crossingId: string;
  currentTiming: { northSouth: number; eastWest: number };
  recommendedTiming: { northSouth: number; eastWest: number };
  recommendation: string;
  reason: string;
  expectedBenefit: string;
  estimatedDelayReductionPercent: number;
}

export interface DetectedAnomaly {
  crossingId: string;
  crossingName: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  detectionSource: 'AUTOMATED_TELEMETRY_ENGINE';
}

export class TrafficIntelligenceEngine {
  /**
   * Explainable Congestion Score Calculation
   * Formula incorporates occupancy (40%), average speed ratio (30%), queue length (20%), vehicle density (10%).
   */
  public static calculateCongestion(
    occupancy: number, // 0 - 100%
    averageSpeed: number, // km/h
    queueLength: number, // meters
    vehicleCount: number,
    lanesCount: number = 3
  ): CongestionAssessment {
    const freeFlowSpeed = 60; // km/h baseline
    const maxQueueMeters = 300; // threshold for maximum queue weighting

    // 1. Occupancy score (0-100)
    const occScore = Math.min(100, Math.max(0, occupancy));

    // 2. Speed deficit score (0-100)
    const speedRatio = Math.min(1.0, Math.max(0, averageSpeed / freeFlowSpeed));
    const speedScore = (1 - speedRatio) * 100;

    // 3. Queue score (0-100)
    const queueScore = Math.min(100, (queueLength / maxQueueMeters) * 100);

    // 4. Density score (vehicles per lane)
    const densityPerLane = vehicleCount / Math.max(1, lanesCount);
    const densityScore = Math.min(100, (densityPerLane / 25) * 100);

    // Weighted combination
    const rawScore = occScore * 0.4 + speedScore * 0.3 + queueScore * 0.2 + densityScore * 0.1;
    const congestionScore = Math.round(Math.min(100, Math.max(0, rawScore)));

    let congestionLevel: 'NORMAL' | 'MODERATE' | 'HEAVY' | 'CRITICAL';
    let explanation = '';

    if (congestionScore >= 80) {
      congestionLevel = 'CRITICAL';
      explanation = `CRITICAL GRIDLOCK: Road occupancy is at ${occupancy}% with severe speed degradation (${averageSpeed} km/h) and a ${queueLength}m queue. Urgent traffic management required.`;
    } else if (congestionScore >= 60) {
      congestionLevel = 'HEAVY';
      explanation = `HEAVY CONGESTION: High vehicle density (${vehicleCount} active units) combined with low average speed (${averageSpeed} km/h) and accumulating queue length of ${queueLength}m.`;
    } else if (congestionScore >= 35) {
      congestionLevel = 'MODERATE';
      explanation = `MODERATE TRAFFIC: Steady vehicle flow (${vehicleCount} vehicles) with minor speed slowdown (${averageSpeed} km/h) and occupancy at ${occupancy}%.`;
    } else {
      congestionLevel = 'NORMAL';
      explanation = `NORMAL OPTIMAL FLOW: High average speed (${averageSpeed} km/h), minimal queue accumulation (${queueLength}m), and healthy road occupancy (${occupancy}%).`;
    }

    return {
      congestionScore,
      congestionLevel,
      explanation,
    };
  }

  /**
   * Explainable Adaptive Signal Recommendation Engine
   * Evaluates approach imbalances and calculates optimized signal splits.
   */
  public static generateSignalRecommendation(
    crossingId: string,
    crossingName: string,
    northSouthCount: number,
    eastWestCount: number,
    currentNsGreen: number = 40,
    currentEwGreen: number = 40
  ): SignalRecommendation {
    const totalVehicles = Math.max(1, northSouthCount + eastWestCount);
    const nsRatio = northSouthCount / totalVehicles;
    const ewRatio = eastWestCount / totalVehicles;

    const baseCycle = 90; // seconds
    const recNsGreen = Math.round(Math.min(70, Math.max(20, baseCycle * nsRatio)));
    const recEwGreen = Math.round(Math.min(70, Math.max(20, baseCycle * ewRatio)));

    let recommendation = '';
    let reason = '';
    let expectedBenefit = '';
    let delayReduction = 0;

    if (northSouthCount > eastWestCount * 1.5) {
      const ratio = (northSouthCount / Math.max(1, eastWestCount)).toFixed(1);
      recommendation = `Increase North-South green duration from ${currentNsGreen}s to ${recNsGreen}s`;
      reason = `North-South vehicle density is ${ratio}x higher than East-West traffic flow (${northSouthCount} vs ${eastWestCount} vehicles).`;
      delayReduction = Math.round(Math.min(45, (nsRatio - 0.5) * 80));
      expectedBenefit = `Reduce queue accumulation at North-South approach by ~${delayReduction}% and optimize throughput.`;
    } else if (eastWestCount > northSouthCount * 1.5) {
      const ratio = (eastWestCount / Math.max(1, northSouthCount)).toFixed(1);
      recommendation = `Increase East-West green duration from ${currentEwGreen}s to ${recEwGreen}s`;
      reason = `East-West vehicle density is ${ratio}x higher than North-South traffic flow (${eastWestCount} vs ${northSouthCount} vehicles).`;
      delayReduction = Math.round(Math.min(45, (ewRatio - 0.5) * 80));
      expectedBenefit = `Clear East-West bottleneck faster, reducing average intersection wait time by ~${delayReduction}%.`;
    } else {
      recommendation = `Maintain balanced signal split (${recNsGreen}s NS / ${recEwGreen}s EW)`;
      reason = `Traffic distribution across approaches is balanced (NS: ${northSouthCount}, EW: ${eastWestCount}).`;
      expectedBenefit = `Sustain uniform flow rate with minimal queue growth across all approaches.`;
      delayReduction = 5;
    }

    return {
      crossingId,
      currentTiming: { northSouth: currentNsGreen, eastWest: currentEwGreen },
      recommendedTiming: { northSouth: recNsGreen, eastWest: recEwGreen },
      recommendation,
      reason,
      expectedBenefit,
      estimatedDelayReductionPercent: delayReduction,
    };
  }

  /**
   * Rule-Based Abnormal Traffic Condition & Incident Auto-Detection
   */
  public static detectAnomalies(
    crossingId: string,
    crossingName: string,
    currentTelemetry: { vehicleCount: number; averageSpeed: number; occupancy: number; queueLength: number },
    previousTelemetry?: { averageSpeed: number; occupancy: number }
  ): DetectedAnomaly | null {
    // 1. Sudden speed drop detection
    if (previousTelemetry && previousTelemetry.averageSpeed > 40 && currentTelemetry.averageSpeed < 15) {
      return {
        crossingId,
        crossingName,
        type: 'SUDDEN_SPEED_DROP',
        severity: 'high',
        title: `Sudden Speed Drop Detected at ${crossingName}`,
        description: `Average vehicle speed sharply dropped from ${previousTelemetry.averageSpeed} km/h to ${currentTelemetry.averageSpeed} km/h within 5 seconds. Possible sudden obstruction or accident.`,
        detectionSource: 'AUTOMATED_TELEMETRY_ENGINE',
      };
    }

    // 2. Critical Occupancy & Queue buildup
    if (currentTelemetry.occupancy > 90 && currentTelemetry.queueLength > 200) {
      return {
        crossingId,
        crossingName,
        type: 'CRITICAL_GRIDLOCK',
        severity: 'critical',
        title: `Critical Gridlock Alert at ${crossingName}`,
        description: `Occupancy reached ${currentTelemetry.occupancy}% with a ${currentTelemetry.queueLength}m queue buildup. Intersection capacity exceeded.`,
        detectionSource: 'AUTOMATED_TELEMETRY_ENGINE',
      };
    }

    return null;
  }
}

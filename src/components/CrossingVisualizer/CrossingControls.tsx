import React from 'react';
import { Crossing } from '../../types';
import { TrafficIntelligenceEngine } from '../../../backend/src/intelligence/trafficIntelligenceService';
import { Cpu, CheckCircle, Zap, ShieldAlert, Sparkles, Navigation } from 'lucide-react';

interface CrossingControlsProps {
  crossing: Crossing;
  onUpdateCrossing: (updated: Crossing) => void;
  onInjectGlobalIncident: (
    crossingId: string,
    title: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description?: string
  ) => void;
  latestTelemetryUpdate?: any;
}

export const CrossingControls: React.FC<CrossingControlsProps> = ({
  crossing,
  onUpdateCrossing,
  onInjectGlobalIncident,
  latestTelemetryUpdate,
}) => {

  // Calculate explainable metrics
  const assessment = latestTelemetryUpdate?.assessment || TrafficIntelligenceEngine.calculateCongestion(
    crossing.congestionIndex,
    crossing.status === 'heavy_congestion' ? 18 : 48,
    Math.round(crossing.averageWaitTimeSeconds * 3),
    crossing.activeVehiclesCount,
    crossing.lanesPerDirection
  );

  const nsCount = Math.round(crossing.activeVehiclesCount * 0.6);
  const ewCount = crossing.activeVehiclesCount - nsCount;
  const recommendation = latestTelemetryUpdate?.recommendation || TrafficIntelligenceEngine.generateSignalRecommendation(
    crossing.id,
    crossing.name,
    nsCount,
    ewCount,
    crossing.signalPhases.timer,
    45
  );

  const handleApplyRecommendation = () => {
    onUpdateCrossing({
      ...crossing,
      status: 'optimal',
      congestionIndex: Math.max(15, crossing.congestionIndex - 25),
      aiMode: 'adaptive',
      signalPhases: {
        ...crossing.signalPhases,
        timer: recommendation.recommendedTiming.northSouth,
      },
    });
  };

  const handleToggleGate = () => {
    onUpdateCrossing({
      ...crossing,
      isRailwayGateClosed: !crossing.isRailwayGateClosed,
    });
  };

  const handleToggleDrawbridge = () => {
    onUpdateCrossing({
      ...crossing,
      isDrawbridgeUp: !crossing.isDrawbridgeUp,
    });
  };

  return (
    <div className="space-y-4">
      
      {/* Explainable Intelligence Panel */}
      <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-indigo-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white">Traffic Intelligence Engine</h3>
          </div>
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase border ${
            assessment.congestionLevel === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
            assessment.congestionLevel === 'HEAVY' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            {assessment.congestionLevel} ({assessment.congestionScore}/100)
          </span>
        </div>

        <p className="mt-3 text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <strong>Assessment:</strong> {assessment.explanation}
        </p>

        {/* Explainable Adaptive Signal Recommendation */}
        <div className="mt-3 rounded-xl bg-indigo-950/40 p-3.5 border border-indigo-500/30">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            Adaptive Signal Recommendation
          </div>
          <div className="mt-2 text-xs text-white font-semibold">
            {recommendation.recommendation}
          </div>
          <p className="mt-1 text-[11px] text-slate-300">
            <strong>Reason:</strong> {recommendation.reason}
          </p>
          <p className="mt-1 text-[11px] text-emerald-400 font-medium">
            <strong>Expected Benefit:</strong> {recommendation.expectedBenefit}
          </p>

          <button
            onClick={handleApplyRecommendation}
            className="mt-3 w-full rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-3.5 w-3.5" /> Accept & Apply Recommended Timing
          </button>
        </div>
      </div>

      {/* Manual & Override Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          Junction Operational Overrides
        </h4>

        <div className="space-y-2">
          {crossing.hasRailwayGate && (
            <button
              onClick={handleToggleGate}
              className={`w-full rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-between border transition-all ${
                crossing.isRailwayGateClosed
                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}
            >
              <span>Railway Barrier Gate</span>
              <span>{crossing.isRailwayGateClosed ? 'CLOSED (Stop Traffic)' : 'OPEN (Normal)'}</span>
            </button>
          )}

          {crossing.hasDrawbridge && (
            <button
              onClick={handleToggleDrawbridge}
              className={`w-full rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-between border transition-all ${
                crossing.isDrawbridgeUp
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
              }`}
            >
              <span>Drawbridge Deck State</span>
              <span>{crossing.isDrawbridgeUp ? 'RAISED (Marine Vessel)' : 'LOWERED (Road Traffic)'}</span>
            </button>
          )}

          <button
            onClick={() => onInjectGlobalIncident(crossing.id, 'Stalled Heavy Vehicle', 'high', 'Manual breakdown reported by operator.')}
            className="w-full rounded-xl bg-red-600/20 py-2 px-3 text-xs font-bold text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <ShieldAlert className="h-3.5 w-3.5" /> Inject Simulated Incident Anomaly
          </button>
        </div>
      </div>

    </div>
  );
};

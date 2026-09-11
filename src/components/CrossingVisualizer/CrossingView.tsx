import React from 'react';
import { Crossing } from '../../types';
import { CrossingCanvas } from './CrossingCanvas';
import { CrossingControls } from './CrossingControls';
import { Sliders, Cpu, Activity } from 'lucide-react';

interface CrossingViewProps {
  crossings: Crossing[];
  selectedCrossingId: string;
  onSelectCrossing: (id: string) => void;
  onUpdateCrossing: (updated: Crossing) => void;
  onInjectGlobalIncident: (
    crossingId: string,
    title: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description?: string
  ) => void;
  latestTelemetryUpdate?: any;
}

export const CrossingView: React.FC<CrossingViewProps> = ({
  crossings,
  selectedCrossingId,
  onSelectCrossing,
  onUpdateCrossing,
  onInjectGlobalIncident,
  latestTelemetryUpdate,
}) => {
  const selectedCrossing = crossings.find((c) => c.id === selectedCrossingId) || crossings[0];

  if (!selectedCrossing) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-400">
        No active crossing selected.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header & Junction Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Junction Digital Twin & Live Simulator
            <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Activity className="h-3 w-3 animate-pulse" /> 60 FPS Real-time Canvas
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Interactive 2D Digital Twin renderer with real-time signal phase timing & adaptive intelligence
          </p>
        </div>

        {/* Crossing Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400">Select Node:</label>
          <select
            value={selectedCrossing.id}
            onChange={(e) => onSelectCrossing(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold text-white focus:border-indigo-500 focus:outline-none"
          >
            {crossings.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Visualizer Canvas on Left, Explainable Controls on Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Canvas Render Area (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h2 className="font-bold text-white text-base">{selectedCrossing.name}</h2>
                <p className="text-xs text-slate-400">{selectedCrossing.location}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                  <Cpu className="h-3.5 w-3.5" /> Mode: {selectedCrossing.aiMode.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Canvas Component */}
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              <CrossingCanvas crossing={selectedCrossing} />
            </div>

            {/* Junction Live Telemetry Bar */}
            <div className="mt-4 grid grid-cols-3 gap-3 text-center border-t border-slate-800 pt-3">
              <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
                <div className="text-[10px] text-slate-400">Active Vehicles</div>
                <div className="text-lg font-bold text-white">{selectedCrossing.activeVehiclesCount}</div>
              </div>

              <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
                <div className="text-[10px] text-slate-400">Congestion Level</div>
                <div className={`text-lg font-bold ${selectedCrossing.congestionIndex > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {selectedCrossing.congestionIndex}%
                </div>
              </div>

              <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800">
                <div className="text-[10px] text-slate-400">Lanes per Direction</div>
                <div className="text-lg font-bold text-white">{selectedCrossing.lanesPerDirection}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Explainable Intelligence & Controls Deck (1 column) */}
        <div className="lg:col-span-1">
          <CrossingControls
            crossing={selectedCrossing}
            onUpdateCrossing={onUpdateCrossing}
            onInjectGlobalIncident={onInjectGlobalIncident}
            latestTelemetryUpdate={latestTelemetryUpdate}
          />
        </div>

      </div>

    </div>
  );
};

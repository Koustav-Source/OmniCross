import React from 'react';
import { Crossing, Incident } from '../types';
import { Activity, ShieldAlert, ArrowUpRight, Zap, CheckCircle2, Sliders, AlertTriangle, Radio } from 'lucide-react';

interface DashboardOverviewProps {
  crossings: Crossing[];
  incidents: Incident[];
  onSelectCrossing: (id: string) => void;
  onOptimizeAll: () => void;
  isOptimizing: boolean;
  latestTelemetryUpdate?: any;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  crossings,
  incidents,
  onSelectCrossing,
  onOptimizeAll,
  isOptimizing,
  latestTelemetryUpdate,
}) => {
  const activeIncidents = incidents.filter(i => i.status !== 'resolved');
  const criticalCount = crossings.filter(c => c.status === 'heavy_congestion' || c.congestionIndex > 75).length;
  const avgWaitTime = Math.round(crossings.reduce((acc, c) => acc + c.averageWaitTimeSeconds, 0) / Math.max(1, crossings.length));
  const totalThroughput = crossings.reduce((acc, c) => acc + c.throughputPerHour, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Network KPI Stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            City Traffic Operations Deck
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time telemetry stream, Traffic Intelligence Engine assessment & incident dispatching
          </p>
        </div>

        <button
          onClick={onOptimizeAll}
          disabled={isOptimizing}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
        >
          <Zap className={`h-4 w-4 ${isOptimizing ? 'animate-spin' : ''}`} />
          {isOptimizing ? 'Executing Global Optimization...' : 'Run Global Network Signal Optimization'}
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Monitored Crossings</span>
            <Activity className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{crossings.length} Active</div>
          <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> 100% Telemetry Online
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Critical Congestion Nodes</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{criticalCount}</div>
          <div className="mt-1 text-[11px] text-amber-400">Requires signal retiming</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active Incidents</span>
            <ShieldAlert className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{activeIncidents.length}</div>
          <div className="mt-1 text-[11px] text-rose-400">Operational response active</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Network Throughput / Hr</span>
            <Sliders className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{totalThroughput.toLocaleString()}</div>
          <div className="mt-1 text-[11px] text-slate-400">Avg delay: {avgWaitTime}s</div>
        </div>
      </div>

      {/* Real-time Telemetry Live Assessment Alert Banner */}
      {latestTelemetryUpdate && (
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 to-slate-900 p-4 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-indigo-600/20 p-2 border border-indigo-500/30 text-indigo-400 mt-0.5">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Telemetry Stream Update: {latestTelemetryUpdate.crossingName}
                </span>
                <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
                  {latestTelemetryUpdate.assessment?.congestionLevel || 'NORMAL'}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                {latestTelemetryUpdate.assessment?.explanation || 'Processing explainable traffic metrics...'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectCrossing(latestTelemetryUpdate.crossingId)}
            className="shrink-0 flex items-center gap-1.5 rounded-xl bg-indigo-600/30 px-3.5 py-2 text-xs font-bold text-indigo-200 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-500/40"
          >
            Inspect Digital Twin <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Grid of Monitored Crossings */}
      <div>
        <h2 className="text-base font-bold text-white mb-3">Live Monitored Crossings Grid</h2>

        {crossings.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-400">
            No crossings registered in system database.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {crossings.map((crossing) => {
              const isHeavy = crossing.status === 'heavy_congestion' || crossing.congestionIndex > 75;

              return (
                <div
                  key={crossing.id}
                  onClick={() => onSelectCrossing(crossing.id)}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-4 transition-all hover:scale-[1.02] ${
                    isHeavy
                      ? 'border-red-500/50 bg-gradient-to-b from-red-950/20 to-slate-900 hover:border-red-400'
                      : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {crossing.type.replace('_', ' ')}
                      </span>
                      <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors text-sm line-clamp-1">
                        {crossing.name}
                      </h3>
                    </div>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase border ${
                        crossing.status === 'optimal'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : crossing.status === 'heavy_congestion'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {crossing.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-400 line-clamp-1">{crossing.location}</p>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Congestion Index</span>
                      <span className={`font-bold ${isHeavy ? 'text-red-400' : 'text-slate-200'}`}>
                        {crossing.congestionIndex}%
                      </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full transition-all duration-500 ${
                          crossing.congestionIndex > 75
                            ? 'bg-red-500'
                            : crossing.congestionIndex > 45
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${crossing.congestionIndex}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
                    <span>Vehicles: <strong className="text-white">{crossing.activeVehiclesCount}</strong></span>
                    <span>Wait: <strong className="text-white">{crossing.averageWaitTimeSeconds}s</strong></span>
                    <span className="text-indigo-400 font-semibold group-hover:underline flex items-center gap-0.5">
                      View <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

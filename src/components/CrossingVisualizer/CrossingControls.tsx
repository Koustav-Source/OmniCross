import React from 'react';
import { Crossing, SignalState } from '../../types';
import { 
  Sliders, 
  Car, 
  Siren, 
  Settings, 
  AlertOctagon, 
  Sun, 
  CloudRain, 
  CloudFog, 
  Snowflake,
  Zap,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

interface CrossingControlsProps {
  crossings: Crossing[];
  selectedCrossingId: string;
  onSelectCrossing: (id: string) => void;
  onUpdateAiMode: (mode: Crossing['aiMode']) => void;
  onManualPhaseChange: (ns: SignalState, ew: SignalState, special?: SignalState) => void;
  onToggleRailwayGate?: () => void;
  onToggleDrawbridge?: () => void;
  onToggleBorderGate?: () => void;
  onInjectTrafficSurge: (count: number, surgeType: 'normal' | 'heavy' | 'gridlock' | 'vip') => void;
  onInjectIncident: (title: string, severity: 'low' | 'medium' | 'high' | 'critical') => void;
  onUpdateWeather: (weather: Crossing['weather']) => void;
}

export const CrossingControls: React.FC<CrossingControlsProps> = ({
  crossings,
  selectedCrossingId,
  onSelectCrossing,
  onUpdateAiMode,
  onManualPhaseChange,
  onToggleRailwayGate,
  onToggleDrawbridge,
  onToggleBorderGate,
  onInjectTrafficSurge,
  onInjectIncident,
  onUpdateWeather,
}) => {
  const currentCrossing = crossings.find(c => c.id === selectedCrossingId) || crossings[0];

  return (
    <div className="space-y-6">
      
      {/* 1. Selector Deck */}
      <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800 shadow-xl">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
          Select Active Crossing Link
        </label>
        <select
          value={selectedCrossingId}
          onChange={(e) => onSelectCrossing(e.target.value)}
          className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white border border-slate-700/80 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {crossings.map(c => (
            <option key={c.id} value={c.id}>
              [{c.type.toUpperCase()}] {c.name} — Congestion: {c.congestionIndex}%
            </option>
          ))}
        </select>
      </div>

      {/* 2. Manual Lights & Boom Barrier Override Hub */}
      <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-indigo-400" /> Signal & Boom Gate Manual State Deck
          </h3>
          <span className="text-[10px] uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded text-slate-300">
            Override Panel
          </span>
        </div>

        {/* Manual Light State Switches */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onManualPhaseChange('green', 'red', 'red')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
              currentCrossing.signalPhases.northSouth === 'green'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="h-3 w-3 rounded-full bg-emerald-500 mb-1 animate-pulse" />
            North/South Flow Green
          </button>

          <button
            onClick={() => onManualPhaseChange('red', 'green', 'red')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
              currentCrossing.signalPhases.eastWest === 'green'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="h-3 w-3 rounded-full bg-emerald-500 mb-1 animate-pulse" />
            East/West Flow Green
          </button>
        </div>

        {/* Special Phase Overrides (Railway, Drawbridge, Border Gate) */}
        {(currentCrossing.hasRailwayGate || currentCrossing.hasDrawbridge || currentCrossing.hasBorderGate) && (
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-xs font-semibold text-slate-400 mb-2">Special Infrastructure Portals:</div>
            
            {currentCrossing.hasRailwayGate && (
              <button
                onClick={onToggleRailwayGate}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                  currentCrossing.isRailwayGateClosed
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-purple-500/20 border-purple-500 text-purple-300'
                }`}
              >
                <span>Railway Boom Gate State</span>
                <span className="px-2 py-1 rounded bg-slate-950">
                  {currentCrossing.isRailwayGateClosed ? '🔴 CLOSED (Train Crossing)' : '🟢 OPEN (Vehicles Action)'}
                </span>
              </button>
            )}

            {currentCrossing.hasDrawbridge && (
              <button
                onClick={onToggleDrawbridge}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                  currentCrossing.isDrawbridgeUp
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                }`}
              >
                <span>Bay-Bridge Span State</span>
                <span className="px-2 py-1 rounded bg-slate-950">
                  {currentCrossing.isDrawbridgeUp ? '⚠️ SPAN RAISED (Naval Channel)' : '🌉 SPAN LOWERED (Road Open)'}
                </span>
              </button>
            )}

            {currentCrossing.hasBorderGate && (
              <button
                onClick={onToggleBorderGate}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                  currentCrossing.isBorderGateOpen
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-rose-500/20 border-rose-500 text-rose-300'
                }`}
              >
                <span>International Customs Portal</span>
                <span className="px-2 py-1 rounded bg-slate-950">
                  {currentCrossing.isBorderGateOpen ? '🛂 PORTAL OPEN' : '🛑 SECURE LOCKDOWN'}
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. Neural AI Operating Modes */}
      <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Settings className="h-4 w-4 text-indigo-400" /> Target AI Signal Routing Core
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {(['adaptive', 'fixed', 'surge_mitigation', 'green_wave'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onUpdateAiMode(mode)}
              className={`p-2.5 rounded-xl border text-xs font-bold capitalize transition-all flex items-center justify-center gap-1.5 ${
                currentCrossing.aiMode === mode
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{mode.replace('_', ' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Top Notch Heavy Traffic Stress & Incident Simulations */}
      <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-rose-400" /> Inject Heavy Traffic Surges & Incidents
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
            Stress Testing
          </span>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onInjectTrafficSurge(15, 'heavy')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/30 text-xs font-bold text-amber-300 transition-all active:scale-98"
          >
            <span className="flex items-center gap-2">
              <Car className="h-4 w-4 text-amber-400" /> Trigger Heavy Peak Surge (+15 Vehicles)
            </span>
            <span className="font-mono text-[10px] bg-slate-950 px-2 py-1 rounded">500+ veh/hr Load</span>
          </button>

          <button
            onClick={() => onInjectTrafficSurge(30, 'gridlock')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-rose-600/20 to-red-600/20 hover:from-rose-600/30 hover:to-red-600/30 border border-rose-500/30 text-xs font-bold text-rose-300 transition-all active:scale-98"
          >
            <span className="flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-rose-400 animate-bounce" /> Trigger Extreme Holiday Convoy Gridlock (+30 Veh)
            </span>
            <span className="font-mono text-[10px] bg-slate-950 px-2 py-1 rounded">1200+ veh/hr Stress</span>
          </button>

          <button
            onClick={() => onInjectTrafficSurge(3, 'vip')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 border border-indigo-500/30 text-xs font-bold text-indigo-300 transition-all active:scale-98"
          >
            <span className="flex items-center gap-2">
              <Siren className="h-4 w-4 text-indigo-400 animate-spin" /> Inject Armored VIP State Convoy
            </span>
            <span className="font-mono text-[10px] bg-slate-950 px-2 py-1 rounded">Green Wave Override</span>
          </button>

          <button
            onClick={() => onInjectIncident('Vehicle Air-Brake Failure Incident near Stop Line', 'critical')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-red-600/30 to-slate-900 border border-red-500/40 text-xs font-bold text-red-300 transition-all hover:bg-red-600/40 active:scale-98"
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-400" /> Simulate Severe Air-Brake Failure Stall
            </span>
            <span className="font-mono text-[10px] bg-slate-950 px-2 py-1 rounded">Triggers Alert</span>
          </button>
        </div>

        {/* Weather Simulator Override */}
        <div className="pt-3 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-400 mb-2 block">
            Inject Weather & Road Grip Impact:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {([
              { w: 'clear', label: 'Clear', icon: <Sun className="h-3.5 w-3.5 text-amber-400" /> },
              { w: 'rain', label: 'Rain', icon: <CloudRain className="h-3.5 w-3.5 text-blue-400" /> },
              { w: 'fog', label: 'Fog', icon: <CloudFog className="h-3.5 w-3.5 text-purple-400" /> },
              { w: 'snow', label: 'Snow', icon: <Snowflake className="h-3.5 w-3.5 text-teal-300" /> },
            ] as const).map(item => (
              <button
                key={item.w}
                onClick={() => onUpdateWeather(item.w)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[11px] font-bold transition-all gap-1 ${
                  currentCrossing.weather === item.w
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

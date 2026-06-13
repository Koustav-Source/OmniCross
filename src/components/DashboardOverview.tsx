import React from 'react';
import { Crossing, Incident } from '../types';
import { 
  Activity, 
  AlertTriangle, 
  Car, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  MapPin, 
  Camera, 
  ArrowRight,
  RefreshCw,
  Sun,
  CloudRain,
  CloudFog,
  Snowflake
} from 'lucide-react';

interface DashboardOverviewProps {
  crossings: Crossing[];
  incidents: Incident[];
  onSelectCrossing: (crossingId: string) => void;
  onOptimizeAll: () => void;
  isOptimizing: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  crossings,
  incidents,
  onSelectCrossing,
  onOptimizeAll,
  isOptimizing,
}) => {
  // Aggregate KPIs
  const totalVehicles = crossings.reduce((acc, c) => acc + c.activeVehiclesCount, 0);
  const totalThroughput = crossings.reduce((acc, c) => acc + c.throughputPerHour, 0);
  const avgCongestion = Math.round(crossings.reduce((acc, c) => acc + c.congestionIndex, 0) / crossings.length);
  const totalIncidents = incidents.filter(i => i.status !== 'resolved').length;

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'rain': return <CloudRain className="h-4 w-4 text-blue-400" />;
      case 'fog': return <CloudFog className="h-4 w-4 text-purple-400" />;
      case 'snow': return <Snowflake className="h-4 w-4 text-teal-300" />;
      default: return <Sun className="h-4 w-4 text-amber-400" />;
    }
  };

  const getStatusBadge = (status: Crossing['status']) => {
    switch (status) {
      case 'optimal':
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Optimal Flow
          </span>
        );
      case 'moderate':
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Moderate Load
          </span>
        );
      case 'heavy_congestion':
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            Heavy Gridlock
          </span>
        );
      case 'emergency_override':
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" />
            Green Corridor
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-400 border border-slate-500/20">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            Maintenance
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Telemetry Ticker */}
      <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl bg-slate-900/90 px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-800 shadow-lg shadow-slate-950/40 min-h-[2.5rem] sm:min-h-auto">
        <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
          <Activity className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-pulse" />
        </div>
        <div className="hidden sm:block text-xs font-semibold text-slate-300 shrink-0">Live Grid News:</div>
        <div className="flex-1 overflow-hidden min-w-0">
          <div className="inline-flex animate-marquee items-center gap-4 sm:gap-8 whitespace-nowrap text-[11px] sm:text-xs text-slate-400">
            <span>🔴 <strong className="text-rose-400">ALERT:</strong> High traffic surge detected at Cyber-Express Highway Toll Plaza. Automated ETC open.</span>
            <span>⚡ <strong className="text-amber-400">CAUTION:</strong> Fog active near Bay-Bridge Drawbridge. Speed limits reduced to 35 MPH.</span>
            <span>🟢 <strong className="text-emerald-400">AI REPORT:</strong> Active Nexa AI signal syncing improved downtown travel time by 28.4% today.</span>
            <span>🛡️ <strong className="text-indigo-400">BORDER SECURE:</strong> Apex International Portal processed 950 cargo transport shipments smoothly.</span>
          </div>
        </div>
      </div>

      {/* Hero Welcome & Network AI Action */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-4 sm:p-6 border border-slate-800 shadow-xl">
        <div className="absolute -right-16 sm:-right-12 -top-16 sm:-top-12 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col gap-4 sm:gap-6 relative z-10">
          <div className="space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[11px] sm:text-xs font-semibold border border-indigo-500/20 w-fit">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Fully Industry Ready Infrastructure</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
              Urban, Highway & Border Crossings Network Deck
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              Monitored and dynamically controlled by OmniCross Neural Distributed Engine. Capable of handling high traffic surges, emergency wave overrides, and live multi-modal simulations.
            </p>
          </div>

          <div className="flex items-center">
            <button
              onClick={onOptimizeAll}
              disabled={isOptimizing}
              className="flex items-center gap-1.5 sm:gap-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3 sm:px-5 py-2 sm:py-3 text-[11px] sm:text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-600/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 w-full sm:w-auto justify-center sm:justify-start"
            >
              <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isOptimizing ? 'Running Network AI Optimization...' : 'Optimize Global Grid Flows'}</span>
              <span className="sm:hidden">{isOptimizing ? 'Optimizing...' : 'Optimize Grid'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Summary Cards Deck */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Total Live Vehicles */}
        <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Live Active Units</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Car className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalVehicles}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <CheckCircle2 className="h-3 w-3" /> System Synchronized
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Across {crossings.length} Active Crossings</p>
        </div>

        {/* Card 2: Total Network Throughput */}
        <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Network Live Throughput</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{(totalThroughput / 1000).toFixed(1)}k</span>
            <span className="text-xs font-medium text-slate-400">veh / hour</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">+14.2% increased capacity vs yesterday</p>
        </div>

        {/* Card 3: Network Congestion Matrix */}
        <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Grid Congestion Matrix</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{avgCongestion}%</span>
            <span className="text-xs font-medium text-amber-400">
              {avgCongestion < 50 ? 'Stable Flow' : 'High Traffic Stress'}
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${avgCongestion < 50 ? 'bg-emerald-500' : avgCongestion < 75 ? 'bg-amber-500' : 'bg-rose-500'}`}
              style={{ width: `${avgCongestion}%` }}
            />
          </div>
        </div>

        {/* Card 4: Active Network Incidents */}
        <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-br from-rose-500/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Active Urgent Incidents</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalIncidents}</span>
            <span className={`text-xs font-semibold ${totalIncidents > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {totalIncidents > 0 ? 'Responders active' : 'All Clear'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Automated dispatch enabled</p>
        </div>

      </div>

      {/* Crossings Grid Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-indigo-400" />
            Active Crossing Hubs & Nodes ({crossings.length})
          </h2>
          <p className="text-xs text-slate-400">Select any crossing to launch the real-time heavy traffic simulation visualizer & camera telemetry feed.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Filter Status:</span>
          <div className="flex items-center gap-1 rounded-lg bg-slate-900 p-1 border border-slate-800">
            <div className="h-2 w-2 rounded-full bg-emerald-500 mx-1" />
            <span className="text-xs text-slate-300 pr-2">Optimal</span>
            <div className="h-2 w-2 rounded-full bg-rose-500 mx-1" />
            <span className="text-xs text-slate-300 pr-1">Heavy</span>
          </div>
        </div>
      </div>

      {/* Dynamic Interactive Crossings Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {crossings.map((crossing) => (
          <div
            key={crossing.id}
            className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/70 p-6 border border-slate-800/90 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:bg-slate-900 hover:shadow-2xl hover:shadow-indigo-500/10"
          >
            <div>
              {/* Header inside card */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      {crossing.type.replace('_', ' ')} node
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/60">
                      {getWeatherIcon(crossing.weather)}
                      <span className="capitalize">{crossing.weather}</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {crossing.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                    <span className="truncate">{crossing.location}</span>
                  </p>
                </div>

                <div className="shrink-0">
                  {getStatusBadge(crossing.status)}
                </div>
              </div>

              {/* Status Metas inside card */}
              <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl bg-slate-950/60 p-3 border border-slate-800/70">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-500">Live Active</div>
                  <div className="mt-1 flex items-center gap-1 text-sm font-bold text-slate-200">
                    <Car className="h-3.5 w-3.5 text-indigo-400" />
                    {crossing.activeVehiclesCount} <span className="text-[10px] font-normal text-slate-400">veh</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-500">Throughput</div>
                  <div className="mt-1 text-sm font-bold text-slate-200">
                    {(crossing.throughputPerHour / 1000).toFixed(1)}k <span className="text-[10px] font-normal text-slate-400">/hr</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-500">Avg Wait</div>
                  <div className="mt-1 flex items-center gap-1 text-sm font-bold text-slate-200">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    {crossing.averageWaitTimeSeconds}s
                  </div>
                </div>
              </div>

              {/* Congestion Meter & Lights breakdown */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Congestion Index</span>
                  <span className={crossing.congestionIndex > 75 ? 'text-rose-400' : crossing.congestionIndex > 50 ? 'text-amber-400' : 'text-emerald-400'}>
                    {crossing.congestionIndex}/100
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div 
                    className={`h-full rounded-full ${crossing.congestionIndex > 75 ? 'bg-rose-500' : crossing.congestionIndex > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${crossing.congestionIndex}%` }}
                  />
                </div>

                {/* Specific Node features */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px]">
                  <span className="rounded-md bg-slate-800/80 px-2 py-1 text-slate-300 font-medium border border-slate-700/60">
                    Lanes: <strong className="text-white">{crossing.lanesPerDirection}x{crossing.lanesPerDirection}</strong>
                  </span>
                  
                  <span className="rounded-md bg-slate-800/80 px-2 py-1 text-slate-300 font-medium border border-slate-700/60">
                    AI State: <strong className="text-indigo-400 capitalize">{crossing.aiMode}</strong>
                  </span>

                  {crossing.hasRailwayGate && (
                    <span className="rounded-md bg-purple-500/10 px-2 py-1 text-purple-300 font-semibold border border-purple-500/20">
                      🚂 Rail Gate Ready
                    </span>
                  )}

                  {crossing.hasDrawbridge && (
                    <span className="rounded-md bg-cyan-500/10 px-2 py-1 text-cyan-300 font-semibold border border-cyan-500/20">
                      🚢 Bridge Link Sync
                    </span>
                  )}

                  {crossing.hasBorderGate && (
                    <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-emerald-300 font-semibold border border-emerald-500/20">
                      🛂 Border Checkpoint
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Bar inside card */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Camera className="h-3.5 w-3.5 text-indigo-400" />
                <span>2 AI Cams Stream</span>
              </div>

              <button
                onClick={() => onSelectCrossing(crossing.id)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600/20 px-4 py-2 text-xs font-bold text-indigo-300 border border-indigo-500/30 transition-all hover:bg-indigo-600 hover:text-white group-hover:shadow-md group-hover:shadow-indigo-600/30"
              >
                <span>Live Control Visualizer</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

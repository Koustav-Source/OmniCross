import React, { useState } from 'react';
import { Crossing, CrossingType } from '../../types';
import { 
  Settings2, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  PlusCircle, 
  Zap, 
  Sliders, 
  Radio, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CustomCrossingBuilderProps {
  onDeployCrossing: (crossing: Crossing) => void;
  onJumpToCrossing: (crossingId: string) => void;
}

export const CustomCrossingBuilder: React.FC<CustomCrossingBuilderProps> = ({
  onDeployCrossing,
  onJumpToCrossing,
}) => {
  const [name, setName] = useState('Titan Freight Multi-Modal Crossing #9');
  const [type, setType] = useState<CrossingType>('highway_toll');
  const [location, setLocation] = useState('Sector 4 Industrial Connector Link Alpha');
  const [lanes, setLanes] = useState<number>(6);
  const [aiMode, setAiMode] = useState<Crossing['aiMode']>('adaptive');
  
  const [hasRail, setHasRail] = useState(false);
  const [hasDrawbridge, setHasDrawbridge] = useState(false);
  const [hasBorder, setHasBorder] = useState(false);

  const [lastDeployedId, setLastDeployedId] = useState<string | null>(null);

  const handleTypeChange = (newType: CrossingType) => {
    setType(newType);
    if (newType === 'railway') { setHasRail(true); setHasDrawbridge(false); setHasBorder(false); }
    else if (newType === 'drawbridge') { setHasDrawbridge(true); setHasRail(false); setHasBorder(false); }
    else if (newType === 'border') { setHasBorder(true); setHasRail(false); setHasDrawbridge(false); }
  };

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `crs-custom-${Date.now().toString().substr(-4)}`;
    const newCrossing: Crossing = {
      id: newId,
      name,
      type,
      location,
      status: 'optimal',
      congestionIndex: Math.floor(Math.random() * 25 + 15), // Initial clean flow
      activeVehiclesCount: Math.floor(Math.random() * 20 + 10),
      throughputPerHour: lanes * 1150,
      averageWaitTimeSeconds: 18,
      aiMode,
      lanesPerDirection: lanes,
      hasRailwayGate: hasRail,
      isRailwayGateClosed: false,
      hasDrawbridge,
      isDrawbridgeUp: false,
      hasBorderGate: hasBorder,
      isBorderGateOpen: true,
      incidentsCount: 0,
      weather: 'clear',
      signalPhases: {
        northSouth: 'green',
        eastWest: 'red',
        special: (hasRail || hasDrawbridge || hasBorder) ? 'green' : undefined,
        timer: 60,
      },
    };

    onDeployCrossing(newCrossing);
    setLastDeployedId(newId);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5" /> Fully Customizable Live Engineering
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Nexa Crossing Studio & Node Architect Deck
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Design and deploy high-capacity infrastructure nodes in real-time. Created nodes immediately initialize within our neural grid for telemetry streaming and traffic stress simulations.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <Radio className="h-5 w-5 text-emerald-400 animate-pulse" />
            <div className="text-xs font-bold text-slate-200">System Core Ready to Ingest Custom Portals</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Form Studio */}
        <div className="rounded-2xl bg-slate-900/80 p-6 border border-slate-800 shadow-xl lg:col-span-2 space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-indigo-400" /> Infrastructure Node Parameters
            </h2>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              Dynamic Live Schema
            </span>
          </div>

          <form onSubmit={handleDeploy} className="space-y-5">
            
            {/* Row 1: Name & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Infrastructure Portal Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aerotropolis Express Link Alpha"
                  className="w-full rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white border border-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Crossing Domain Classification
                </label>
                <select
                  value={type}
                  onChange={(e) => handleTypeChange(e.target.value as CrossingType)}
                  className="w-full rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white border border-slate-700 focus:border-indigo-500 focus:outline-none capitalize"
                >
                  <option value="urban">Urban Downtown Junction</option>
                  <option value="railway">Heavy Railway Crossing</option>
                  <option value="highway_toll">Highway Toll Plaza</option>
                  <option value="border">International Border Gate</option>
                  <option value="drawbridge">Maritime Drawbridge Span</option>
                  <option value="logistics">Industrial Port Logistics</option>
                  <option value="school">School Safety Zone Corridor</option>
                  <option value="airport">Airport Terminal Flyover</option>
                </select>
              </div>
            </div>

            {/* Row 2: Location string */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Geographic Location / Landmark Vector
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Nexa Core Outer Orbit Milestone 84.2"
                  className="w-full rounded-xl bg-slate-950 pl-10 pr-4 py-3 text-xs font-medium text-white border border-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Row 3: Lanes Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-indigo-400" /> Infrastructure Scale (Lanes Per Direction)
                </label>
                <span className="text-sm font-extrabold text-indigo-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  {lanes} x {lanes} Lanes ({lanes * 2} Total Intersecting)
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={12}
                value={lanes}
                onChange={(e) => setLanes(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>2x2 (Urban Standard)</span>
                <span>6x6 (Expressway Toll)</span>
                <span>12x12 (Mega Port Plaza)</span>
              </div>
            </div>

            {/* Row 4: Initial AI Signal State */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                Neural AI Light Operating Routine
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['adaptive', 'fixed', 'surge_mitigation', 'green_wave'] as const).map(mode => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setAiMode(mode)}
                    className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all flex items-center justify-center gap-1.5 ${
                      aiMode === mode
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>{mode.replace('_', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 5: Hardware & Gate Toggles */}
            <div className="pt-3 border-t border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                Integrated Hardware Assemblies
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  hasRail ? 'bg-purple-500/10 border-purple-500/50 text-purple-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  <input
                    type="checkbox"
                    checked={hasRail}
                    onChange={(e) => setHasRail(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500/20 h-4 w-4"
                  />
                  <span className="text-xs font-semibold">🚂 Railway Tracks & Boom Gates</span>
                </label>

                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  hasDrawbridge ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  <input
                    type="checkbox"
                    checked={hasDrawbridge}
                    onChange={(e) => setHasDrawbridge(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-cyan-500/20 h-4 w-4"
                  />
                  <span className="text-xs font-semibold">🚢 Marine Drawbridge Linking</span>
                </label>

                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  hasBorder ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  <input
                    type="checkbox"
                    checked={hasBorder}
                    onChange={(e) => setHasBorder(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-emerald-500/20 h-4 w-4"
                  />
                  <span className="text-xs font-semibold">🛂 Biometric Border Checkpoint</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 px-6 py-4 text-sm font-extrabold text-white shadow-xl shadow-indigo-600/30 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-600/50 active:scale-98"
            >
              <PlusCircle className="h-5 w-5" /> Instantly Deploy Infrastructure Portal into Global Grid
            </button>
          </form>
        </div>

        {/* Right 1 Col: Blueprint Preview Deck */}
        <div className="rounded-2xl bg-slate-900/80 p-6 border border-slate-800 shadow-xl space-y-6 lg:sticky lg:top-20">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-400" /> Live Blueprint Inspection Card
            </h3>
            <span className="text-xs text-slate-400">Preview</span>
          </div>

          {/* Render Card exactly like in Dashboard */}
          <div className="rounded-2xl bg-slate-950 p-5 border border-slate-800 shadow-inner space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider">
                  [{type.replace('_', ' ').toUpperCase()}]
                </span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry Prepared
                </span>
              </div>
              <h4 className="text-base font-bold text-white mt-1 break-words">{name}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                <span>{location}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-900/90 p-3 border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Throughput Capacity</span>
                <span className="font-bold text-white mt-0.5 block">{(lanes * 1150 / 1000).toFixed(1)}k veh/hr</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Initial AI Routing</span>
                <span className="font-bold text-indigo-400 capitalize mt-0.5 block">{aiMode} flow</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-400 font-medium">
                Hardware Capabilities:
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="rounded bg-slate-900 px-2 py-1 text-slate-300 font-mono">
                  Lanes: {lanes}x{lanes}
                </span>
                {hasRail && <span className="rounded bg-purple-500/10 px-2 py-1 text-purple-300">🚂 Rail Gate</span>}
                {hasDrawbridge && <span className="rounded bg-cyan-500/10 px-2 py-1 text-cyan-300">🚢 Drawbridge Span</span>}
                {hasBorder && <span className="rounded bg-emerald-500/10 px-2 py-1 text-emerald-300">🛂 Customs Setup</span>}
              </div>
            </div>
          </div>

          {/* Success Banner if previously deployed */}
          {lastDeployedId && (
            <div className="rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/30 text-center space-y-2 animate-fade-in">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Node Successfully Integrated
              </div>
              <p className="text-[11px] text-slate-300">
                "{name}" is now fully functioning within our neural operational grid.
              </p>
              <button
                onClick={() => onJumpToCrossing(lastDeployedId)}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-500"
              >
                <span>Jump to Live Simulator Feed</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

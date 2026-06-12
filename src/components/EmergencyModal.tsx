import React, { useState } from 'react';
import { Siren, ShieldAlert, Rocket, Activity, AlertTriangle, X, CheckCircle2 } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEngageGreenWave: (modeName: string, targetRegion: string) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onEngageGreenWave,
}) => {
  const [selectedMode, setSelectedMode] = useState<string>('vip_escort');
  const [targetRegion, setTargetRegion] = useState<string>('global_all');
  const [isEngaging, setIsEngaging] = useState<boolean>(false);
  const [successTriggered, setSuccessTriggered] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleEngage = () => {
    setIsEngaging(true);
    setTimeout(() => {
      onEngageGreenWave(selectedMode, targetRegion);
      setIsEngaging(false);
      setSuccessTriggered(true);
      setTimeout(() => {
        setSuccessTriggered(false);
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl border border-rose-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/30 p-8 shadow-2xl shadow-rose-600/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-600/30">
            <Siren className="h-7 w-7 animate-spin" />
          </div>
          <div>
            <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-black text-rose-400 border border-rose-500/30 uppercase tracking-widest">
              Level 0 System Overpass Takeover
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1">Global Green Wave Protocol</h2>
          </div>
        </div>

        {successTriggered ? (
          <div className="py-12 text-center space-y-4 animate-scale-up">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-white">Green Wave Successfully Activated</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              All traffic light phases along the requested corridor have been locked to continuous priority GREEN. Intersecting flows paused.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            
            {/* Mode Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Select Priority Convoy Classification
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMode('vip_escort')}
                  className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all ${
                    selectedMode === 'vip_escort' ? 'bg-gradient-to-br from-rose-600/20 to-red-600/20 border-rose-500 text-white ring-2 ring-rose-500/40' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Rocket className="h-6 w-6 text-rose-400 mb-2" />
                  <span className="text-xs font-bold">VIP Escort Protocol</span>
                  <span className="text-[10px] text-slate-500 mt-1">Armored Motorcade</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMode('organ_transport')}
                  className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all ${
                    selectedMode === 'organ_transport' ? 'bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border-indigo-500 text-white ring-2 ring-indigo-500/40' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Activity className="h-6 w-6 text-indigo-400 mb-2" />
                  <span className="text-xs font-bold">Organ EMS Wave</span>
                  <span className="text-[10px] text-slate-500 mt-1">Medevac & Ambulances</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMode('disaster_evac')}
                  className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all ${
                    selectedMode === 'disaster_evac' ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20 border-amber-500 text-white ring-2 ring-amber-500/40' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <AlertTriangle className="h-6 w-6 text-amber-400 mb-2" />
                  <span className="text-xs font-bold">Disaster Evacuation</span>
                  <span className="text-[10px] text-slate-500 mt-1">Mass Highway Surge</span>
                </button>
              </div>
            </div>

            {/* Scope / Region target */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Target Infrastructure Scope
              </label>
              
              <select
                value={targetRegion}
                onChange={(e) => setTargetRegion(e.target.value)}
                className="w-full rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-bold text-white border border-slate-800 focus:border-rose-500 focus:outline-none"
              >
                <option value="global_all">⚡ Global Broadcast: Lock All Online Crossings (Emergency Wave)</option>
                <option value="downtown_axis">🏙️ Downtown Urban Financial Axis (Nexus & School node)</option>
                <option value="highway_interstate">🛣️ Interstate Highway Corridor (Cyber-Express & Airport Link)</option>
                <option value="freight_harbor">🚢 Maritime & Industrial Rails (Metro-Rail & Bay-Bridge link)</option>
              </select>
            </div>

            {/* Warning Meta */}
            <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 p-4 border border-rose-500/30 text-xs text-rose-200">
              <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0" />
              <p>
                <strong>High Priority Notice:</strong> Engaging this protocol will immediately pre-empt local AI flow controllers. AI signal phases will switch to priority sync to maintain zero vehicle stopping.
              </p>
            </div>

            {/* Action button */}
            <button
              onClick={handleEngage}
              disabled={isEngaging}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 px-8 py-5 text-base font-black text-white shadow-xl shadow-rose-600/30 transition-all hover:from-red-500 hover:to-rose-500 hover:shadow-rose-600/50 active:scale-98 disabled:opacity-50"
            >
              <Siren className={`h-6 w-6 ${isEngaging ? 'animate-spin' : ''}`} />
              <span>{isEngaging ? 'Broadcasting Protocol across Grid Nodes...' : '🚀 ENGAGE IMMEDIATE GREEN WAVE OVERRIDE'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

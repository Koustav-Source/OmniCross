import React from 'react';
import { Activity, ShieldAlert, Zap, Radio, Layers, BarChart3, Settings2, Sparkles, Siren } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemHealth: number;
  activeIncidentsCount: number;
  onTriggerGlobalEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  systemHealth,
  activeIncidentsCount,
  onTriggerGlobalEmergency,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
            <Radio className="h-5 w-5 animate-pulse text-white" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">OmniCross</span>
              <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/30">
                NEXA AI v4.8
              </span>
            </div>
            <p className="text-xs text-slate-400">Intelligent Heavy-Traffic & Crossings Command Center</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-900/80 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="h-4 w-4" />
            Live Dashboard
          </button>

          <button
            onClick={() => setActiveTab('visualizer')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'visualizer'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="h-4 w-4" />
            Live Crossing Simulator
          </button>

          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'infrastructure'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="h-4 w-4" />
            Cloud & API Load Balancer
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics & ALPR
          </button>

          <button
            onClick={() => setActiveTab('incidents')}
            className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'incidents'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            Incidents
            {activeIncidentsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-bounce">
                {activeIncidentsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'builder'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings2 className="h-4 w-4" />
            Crossing Studio
          </button>
        </nav>

        {/* Right: Emergency Override & System KPIs */}
        <div className="flex items-center gap-3">
          
          <div className="hidden lg:flex items-center gap-2 border-r border-slate-800 pr-3">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-200 flex items-center justify-end gap-1">
                <Sparkles className="h-3 w-3 text-indigo-400" /> System Grid: 99.4%
              </div>
              <div className="text-[10px] text-slate-400">Active Load: {systemHealth}% Capacity</div>
            </div>
          </div>

          <button
            onClick={onTriggerGlobalEmergency}
            className="group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:from-red-500 hover:to-rose-500 hover:shadow-red-600/50 active:scale-95"
          >
            <Siren className="h-4 w-4 animate-spin" />
            <span>VIP / Emergency Green Wave</span>
            <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500"></span>
            </span>
          </button>
        </div>

      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden overflow-x-auto py-2 px-4 gap-2 bg-slate-900 border-t border-slate-800 border-b scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-800/50'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('visualizer')}
          className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${activeTab === 'visualizer' ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-800/50'}`}
        >
          Simulator
        </button>
        <button
          onClick={() => setActiveTab('infrastructure')}
          className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${activeTab === 'infrastructure' ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-800/50'}`}
        >
          Cloud Load
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-800/50'}`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${activeTab === 'incidents' ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-800/50'}`}
        >
          Incidents ({activeIncidentsCount})
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${activeTab === 'builder' ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-800/50'}`}
        >
          Studio
        </button>
      </div>
    </header>
  );
};

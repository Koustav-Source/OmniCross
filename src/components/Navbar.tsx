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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3">
        
        {/* Left: Brand */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 shrink-0">
            <Radio className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse text-white" />
            <div className="absolute -top-1 -right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400 ring-2 sm:ring-4 ring-slate-950" />
          </div>
          <div className="min-w-0 flex-1 sm:flex-none">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-xl font-bold tracking-tight text-white truncate">OmniCross</span>
              <span className="hidden sm:inline rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/30 whitespace-nowrap">
                NEXA AI v4.8
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-400">Intelligent Heavy-Traffic & Crossings Command Center</p>
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
        <div className="flex items-center gap-2 sm:gap-3">
          
          <div className="hidden md:flex items-center gap-2 border-r border-slate-800 pr-2 sm:pr-3">
            <div className="text-right">
              <div className="text-[11px] sm:text-xs font-semibold text-slate-200 flex items-center justify-end gap-1 whitespace-nowrap">
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-indigo-400 shrink-0" /> System Grid: 99.4%
              </div>
              <div className="text-[10px] text-slate-400 whitespace-nowrap">Load: {systemHealth}%</div>
            </div>
          </div>

          <button
            onClick={onTriggerGlobalEmergency}
            className="group relative flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:from-red-500 hover:to-rose-500 hover:shadow-red-600/50 active:scale-95 whitespace-nowrap"
          >
            <Siren className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin shrink-0" />
            <span className="hidden sm:inline">VIP / Emergency Green Wave</span>
            <span className="sm:hidden">Emergency</span>
            <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-full w-full rounded-full bg-rose-500"></span>
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

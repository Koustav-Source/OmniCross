import React, { useState } from 'react';
import { Crossing, Incident } from '../../types';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  Clock, 
  Sparkles, 
  MapPin, 
  PlusCircle, 
  ArrowRight,
  Send
} from 'lucide-react';

interface IncidentDeckProps {
  crossings: Crossing[];
  incidents: Incident[];
  onResolveIncident: (incidentId: string) => void;
  onDispatchResponder: (incidentId: string, responder: string) => void;
  onInjectIncident: (crossingId: string, title: string, severity: 'low' | 'medium' | 'high' | 'critical', description: string) => void;
  onSelectCrossing: (crossingId: string) => void;
}

export const IncidentDeck: React.FC<IncidentDeckProps> = ({
  crossings,
  incidents,
  onResolveIncident,
  onDispatchResponder,
  onInjectIncident,
  onSelectCrossing,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // New Incident Form State
  const [targetCrossingId, setTargetCrossingId] = useState<string>(crossings[0]?.id || '');
  const [newTitle, setNewTitle] = useState<string>('Severe Oil Fuel Spill Near South Abutment');
  const [newSeverity, setNewSeverity] = useState<Incident['severity']>('high');
  const [newDescription, setNewDescription] = useState<string>('A tanker has leaked synthetic lubricants across the center zebra lines. Hazmat vacuum squad requested.');
  const [newResponder, setNewResponder] = useState<string>('Hazmat Team #12');

  const filteredIncidents = incidents.filter(i => {
    if (activeFilter === 'resolved') return i.status === 'resolved';
    if (activeFilter === 'active') return i.status !== 'resolved';
    return true;
  });

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onInjectIncident(targetCrossingId, newTitle, newSeverity, newDescription);
    if (newResponder.trim()) {
      const incidentId = `inc-${Date.now()}`;
      onDispatchResponder(incidentId, newResponder);
    }
    setNewTitle('');
    setNewDescription('');
  };

  const getSeverityBadge = (sev: Incident['severity']) => {
    switch (sev) {
      case 'critical':
        return <span className="rounded-full bg-rose-500/20 px-2.5 py-1 text-xs font-bold text-rose-300 border border-rose-500/40 animate-pulse">Critical Emergency</span>;
      case 'high':
        return <span className="rounded-full bg-orange-500/20 px-2.5 py-1 text-xs font-bold text-orange-300 border border-orange-500/40">High Priority</span>;
      case 'medium':
        return <span className="rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-300 border border-amber-500/40">Medium Impact</span>;
      default:
        return <span className="rounded-full bg-indigo-500/20 px-2.5 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/40">Diagnostic / Low</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Status Cards */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-3.5 w-3.5 animate-bounce" /> Emergency Incident Dispatch Hub
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Real-Time Crossing Anomaly & Wrecker Command
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Dispatch tow units, EMS vehicles, and automated green corridors to resolve high-impact gridlocks and accidents across our 8+ heavy crossings.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All Incidents ({incidents.length})
            </button>
            <button
              onClick={() => setActiveFilter('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === 'active' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Urgent / Active ({incidents.filter(i => i.status !== 'resolved').length})
            </button>
            <button
              onClick={() => setActiveFilter('resolved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === 'resolved' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Resolved ({incidents.filter(i => i.status === 'resolved').length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Split Incidents List vs Inject Emergency Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Cols: Incident Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-400" /> Active Dispatches & Logged Emergencies
          </h2>

          {filteredIncidents.length === 0 ? (
            <div className="rounded-2xl bg-slate-900/50 p-12 text-center border border-slate-800 space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
              <div className="text-base font-bold text-white">All Infrastructure Incident Routines Cleared</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No active traffic stalls or sensor false alarms logged. The global traffic flow is fully optimized.
              </p>
            </div>
          ) : (
            filteredIncidents.map(inc => (
              <div
                key={inc.id}
                className={`rounded-2xl p-6 border transition-all relative overflow-hidden group ${
                  inc.status === 'resolved'
                    ? 'bg-slate-900/40 border-slate-800 opacity-75 hover:opacity-100'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-xl'
                }`}
              >
                {/* Visual side bar */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-2 ${
                    inc.severity === 'critical' ? 'bg-rose-500' : inc.severity === 'high' ? 'bg-orange-500' : inc.severity === 'medium' ? 'bg-amber-500' : 'bg-indigo-500'
                  }`} 
                />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pl-2">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getSeverityBadge(inc.severity)}
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {inc.timestamp}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        inc.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {inc.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{inc.title}</h3>

                    <div className="text-xs text-slate-300 flex items-center gap-1.5 font-medium bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800/80 w-fit">
                      <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{inc.crossingName}</span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      {inc.description}
                    </p>
                  </div>

                  {/* Right Responder Action box inside card */}
                  <div className="sm:shrink-0 flex flex-col justify-between gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 sm:w-64">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-500">Assigned Responder Unit:</div>
                      <div className="mt-1 flex items-center gap-2 text-xs font-bold text-slate-200">
                        <Truck className="h-4 w-4 text-indigo-400" />
                        <span className="truncate">{inc.responderAssigned || 'Automated Sentinel Drone'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {inc.status !== 'resolved' && (
                        <button
                          onClick={() => onResolveIncident(inc.id)}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 transition-all active:scale-95"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Clear Intersection Stall</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectCrossing(inc.crossingId)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2 text-[11px] font-bold text-slate-200 transition-all border border-slate-700"
                      >
                        <span>Jump to Live Visualizer</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Right 1 Col: Emergency Simulation Creator Form */}
        <div className="rounded-2xl bg-slate-900/80 p-6 border border-slate-800 shadow-xl space-y-5 lg:sticky lg:top-20">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-indigo-400" /> Inject Field Emergency Stall
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate a real-time anomaly to test operational responder routing.
            </p>
          </div>

          <form onSubmit={handleCreateIncident} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Target Crossing Intersection
              </label>
              <select
                value={targetCrossingId}
                onChange={(e) => setTargetCrossingId(e.target.value)}
                className="w-full rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-bold text-white border border-slate-700 focus:border-indigo-500 focus:outline-none"
              >
                {crossings.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Incident Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Broken Down 18-Wheeler Payload"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-bold text-white border border-slate-700 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Severity Level
                </label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-bold text-white border border-slate-700 focus:border-indigo-500 focus:outline-none capitalize"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low / Diagnostic</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Assign Wrecker / Unit
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heavy Wrecker #5"
                  value={newResponder}
                  onChange={(e) => setNewResponder(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-bold text-white border border-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Emergency Scenario Description
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe the grid impact and hazardous situation..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full rounded-xl bg-slate-950 p-3 text-xs text-white border border-slate-700 focus:border-indigo-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/20 hover:from-rose-500 hover:to-red-500 transition-all active:scale-98"
            >
              <Send className="h-4 w-4" /> Dispatch Anomaly Alert
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

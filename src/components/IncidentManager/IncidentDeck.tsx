import React, { useState } from 'react';
import { Crossing, Incident } from '../../types';
import { ShieldAlert, CheckCircle, Truck, MapPin, Clock, AlertTriangle, UserCheck, PlusCircle } from 'lucide-react';

interface IncidentDeckProps {
  crossings: Crossing[];
  incidents: Incident[];
  onResolveIncident: (id: string) => void;
  onDispatchResponder: (id: string, responder: string) => void;
  onInjectIncident: (
    crossingId: string,
    title: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description?: string
  ) => void;
  onSelectCrossing: (id: string) => void;
}

export const IncidentDeck: React.FC<IncidentDeckProps> = ({
  crossings,
  incidents,
  onResolveIncident,
  onDispatchResponder,
  onInjectIncident,
  onSelectCrossing,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [selectedCrossingId, setSelectedCrossingId] = useState(crossings[0]?.id || '');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onInjectIncident(selectedCrossingId, newTitle, severity, description);
    setNewTitle('');
    setDescription('');
  };

  const getLifecycleStep = (status: string): number => {
    switch (status) {
      case 'active':
        return 1; // VERIFIED
      case 'dispatching':
        return 2; // DISPATCHED
      case 'resolving':
        return 3; // RESPONDING
      case 'resolved':
      case 'closed':
        return 4; // RESOLVED / CLOSED
      default:
        return 0; // DETECTED
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Incident Response Commander
            <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-xs font-semibold text-rose-400 border border-rose-500/30">
              {incidents.filter((i) => i.status !== 'resolved').length} Active Anomalies
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time incident detection lifecycle (DETECTED → VERIFIED → DISPATCHED → RESPONDING → RESOLVED → CLOSED)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Incident Lifecycle Deck (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          {incidents.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-400">
              No incidents reported across the network.
            </div>
          ) : (
            incidents.map((incident) => {
              const currentStep = getLifecycleStep(incident.status);
              const isResolved = incident.status === 'resolved';

              return (
                <div
                  key={incident.id}
                  className={`rounded-2xl border p-5 transition-all shadow-lg ${
                    isResolved
                      ? 'border-slate-800 bg-slate-900/60 opacity-80'
                      : incident.severity === 'critical'
                      ? 'border-red-500/50 bg-gradient-to-r from-red-950/30 to-slate-900'
                      : 'border-slate-800 bg-slate-900'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase border ${
                          incident.severity === 'critical'
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : incident.severity === 'high'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                        }`}
                      >
                        {incident.severity} SEVERITY
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {incident.timestamp}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectCrossing(incident.crossingId)}
                      className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <MapPin className="h-3.5 w-3.5" /> View Crossing Node
                    </button>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-white">{incident.title}</h3>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">{incident.description}</p>
                  <div className="mt-1 text-[11px] text-slate-400">Location: <strong className="text-slate-200">{incident.crossingName}</strong></div>

                  {/* Operational Timeline Progress Bar */}
                  <div className="mt-4 rounded-xl bg-slate-950/70 p-3 border border-slate-800">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Operational Incident Timeline
                    </div>
                    <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-semibold">
                      {['DETECTED', 'VERIFIED', 'DISPATCHED', 'RESPONDING', 'RESOLVED'].map((stepName, idx) => {
                        const isPassed = currentStep >= idx;
                        const isCurrent = currentStep === idx;

                        return (
                          <div
                            key={stepName}
                            className={`rounded-lg py-1.5 px-1 border transition-all ${
                              isCurrent
                                ? 'bg-indigo-600 text-white border-indigo-400 animate-pulse'
                                : isPassed
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-900 text-slate-500 border-slate-800'
                            }`}
                          >
                            {stepName}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Responder & Dispatch Actions */}
                  <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-3 gap-2">
                    <div className="text-xs text-slate-300 flex items-center gap-1.5">
                      <Truck className="h-4 w-4 text-indigo-400" />
                      Assigned Team: <strong className="text-white">{incident.responderAssigned || 'Unassigned'}</strong>
                    </div>

                    {!isResolved && (
                      <div className="flex items-center gap-2">
                        {!incident.responderAssigned && (
                          <button
                            onClick={() => onDispatchResponder(incident.id, 'Rapid EMS Response Team #3')}
                            className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 transition-all flex items-center gap-1"
                          >
                            <UserCheck className="h-3.5 w-3.5" /> Dispatch Emergency Team
                          </button>
                        )}
                        <button
                          onClick={() => onResolveIncident(incident.id)}
                          className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all flex items-center gap-1"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Mark Resolved
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Report New Incident Form (1 column) */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              <h3 className="text-sm font-bold text-white">Manual Incident Injection</h3>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Target Crossing</label>
                <select
                  value={selectedCrossingId}
                  onChange={(e) => setSelectedCrossingId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  {crossings.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Incident Title</label>
                <input
                  type="text"
                  placeholder="e.g. Stalled Cargo Truck"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="low">Low Severity</option>
                  <option value="medium">Medium Severity</option>
                  <option value="high">High Severity</option>
                  <option value="critical">Critical Emergency</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details regarding obstruction, lane blockage, or emergency..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="h-4 w-4" /> Log & Broadcast Incident
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

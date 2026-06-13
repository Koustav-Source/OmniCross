import { useState } from 'react';
import { Crossing, Incident, AlprRecord } from './types';
import { 
  INITIAL_CROSSINGS, 
  INITIAL_INCIDENTS, 
  INITIAL_INFRASTRUCTURE, 
  INITIAL_ALPR_RECORDS, 
  THROUGHPUT_HISTORY, 
  VEHICLE_CATEGORIES 
} from './mockData';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { CrossingView } from './components/CrossingVisualizer/CrossingView';
import { InfrastructureMonitor } from './components/InfrastructureLoad/InfrastructureMonitor';
import { AnalyticsDashboard } from './components/Analytics/AnalyticsDashboard';
import { IncidentDeck } from './components/IncidentManager/IncidentDeck';
import { CustomCrossingBuilder } from './components/CrossingBuilder/CustomCrossingBuilder';
import { EmergencyModal } from './components/EmergencyModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [crossings, setCrossings] = useState<Crossing[]>(INITIAL_CROSSINGS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [infrastructure] = useState(INITIAL_INFRASTRUCTURE);
  const [alprRecords, setAlprRecords] = useState<AlprRecord[]>(INITIAL_ALPR_RECORDS);
  const [throughputHistory] = useState(THROUGHPUT_HISTORY);
  const [vehicleCategories] = useState(VEHICLE_CATEGORIES);

  const [selectedVisualizerId, setSelectedVisualizerId] = useState<string>(INITIAL_CROSSINGS[0].id);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Switch to Visualizer from Dashboard or Studio
  const handleJumpToVisualizer = (crossingId: string) => {
    setSelectedVisualizerId(crossingId);
    setActiveTab('visualizer');
    triggerToast(`Switched active camera and simulator deck to "${crossings.find(c => c.id === crossingId)?.name || crossingId}"`);
  };

  // Optimize all network flow
  const handleOptimizeAll = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setCrossings(prev => prev.map(c => ({
        ...c,
        status: 'optimal',
        congestionIndex: Math.floor(Math.random() * 15 + 20),
        activeVehiclesCount: Math.floor(Math.random() * 20 + 15),
        aiMode: 'adaptive',
      })));
      setIsOptimizing(false);
      triggerToast('Global Network Optimization Complete. All heavy gridlock nodes restored to optimal adaptive flow.');
    }, 1400);
  };

  // Update a specific crossing in state
  const handleUpdateCrossing = (updated: Crossing) => {
    setCrossings(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  // Deploy custom newly built crossing
  const handleDeployCrossing = (newCrossing: Crossing) => {
    setCrossings(prev => [...prev, newCrossing]);
    triggerToast(`Successfully registered custom node "${newCrossing.name}" into Distributed Cloud Engine.`);
  };

  // Inject a global emergency or breakdown incident
  const handleInjectGlobalIncident = (
    crossingId: string, 
    title: string, 
    severity: 'low' | 'medium' | 'high' | 'critical', 
    description?: string
  ) => {
    const targetCrossing = crossings.find(c => c.id === crossingId) || crossings[0];
    const newIncident: Incident = {
      id: `inc-${Date.now()}`,
      crossingId: targetCrossing.id,
      crossingName: targetCrossing.name,
      title,
      severity,
      timestamp: 'Just now',
      status: 'active',
      description: description || `Automated grid alert logged for ${targetCrossing.name}. Operational response team alerted.`,
    };

    setIncidents(prev => [newIncident, ...prev]);

    // Update crossing to show congestion
    handleUpdateCrossing({
      ...targetCrossing,
      status: 'heavy_congestion',
      incidentsCount: targetCrossing.incidentsCount + 1,
      congestionIndex: Math.min(100, targetCrossing.congestionIndex + 30),
    });

    triggerToast(`🚨 URGENT INCIDENT: "${title}" recorded at ${targetCrossing.name}`);
  };

  // Resolve an incident
  const handleResolveIncident = (incidentId: string) => {
    setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, status: 'resolved' } : i));
    const resolvedInc = incidents.find(i => i.id === incidentId);
    if (resolvedInc) {
      triggerToast(`✅ Cleared intersection anomaly: "${resolvedInc.title}"`);
    }
  };

  // Assign responder
  const handleDispatchResponder = (incidentId: string, responder: string) => {
    setIncidents(prev => prev.map(i => i.id === incidentId ? { ...i, responderAssigned: responder, status: 'dispatching' } : i));
    triggerToast(`Dispatched "${responder}" to active incident location.`);
  };

  // Add ALPR
  const handleAddAlprRecord = (record: AlprRecord) => {
    setAlprRecords(prev => [record, ...prev]);
    triggerToast(`Logged ALPR Optical Tag "${record.plate}" securely into audit buffer.`);
  };

  // Engage Global / Corridor Green Wave takeover
  const handleEngageGreenWave = (modeName: string, targetRegion: string) => {
    const modeLabel = modeName === 'vip_escort' ? 'VIP Motorcade Escort' :
                      modeName === 'organ_transport' ? 'Emergency EMS Wave' : 'Disaster Evacuation';

    setCrossings(prev => prev.map(c => {
      // If global or matches criteria
      return {
        ...c,
        status: 'emergency_override',
        aiMode: 'green_wave',
        congestionIndex: Math.max(10, c.congestionIndex - 30),
        signalPhases: {
          ...c.signalPhases,
          northSouth: 'green',
          eastWest: 'green',
          special: 'green',
        },
      };
    }));

    // Add high-priority ALPR tag
    handleAddAlprRecord({
      id: `alpr-wave-${Date.now().toString().substr(-4)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      crossingName: 'Global Highway & Downtown Net',
      plate: 'VIP-WAVE-01',
      vehicleType: modeLabel,
      speed: 65,
      flagged: true,
      flagReason: 'Active Green Wave Takeover Override',
    });

    triggerToast(`🚀 GREEN WAVE OVERRIDE ENGAGED: "${modeLabel}" enabled for ${targetRegion.replace('_', ' ').toUpperCase()}`);
  };

  // Aggregate active load score
  const avgLoad = Math.round(crossings.reduce((acc, c) => acc + c.congestionIndex, 0) / crossings.length);
  const activeIncidentsCount = incidents.filter(i => i.status !== 'resolved').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      
      {/* Top Main Industry-Ready Command Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemHealth={avgLoad}
        activeIncidentsCount={activeIncidentsCount}
        onTriggerGlobalEmergency={() => setEmergencyModalOpen(true)}
      />

      {/* Dynamic Workspace Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        
        {/* View 1: Live Overview Dashboard */}
        {activeTab === 'overview' && (
          <DashboardOverview
            crossings={crossings}
            incidents={incidents}
            onSelectCrossing={handleJumpToVisualizer}
            onOptimizeAll={handleOptimizeAll}
            isOptimizing={isOptimizing}
          />
        )}

        {/* View 2: Live Real-time Crossing Simulator & Visualizer Deck */}
        {activeTab === 'visualizer' && (
          <CrossingView
            crossings={crossings}
            selectedCrossingId={selectedVisualizerId}
            onSelectCrossing={setSelectedVisualizerId}
            onUpdateCrossing={handleUpdateCrossing}
            onInjectGlobalIncident={handleInjectGlobalIncident}
          />
        )}

        {/* View 3: Infrastructure Load & Web Worker Stress Balancer */}
        {activeTab === 'infrastructure' && (
          <InfrastructureMonitor
            initialNodes={infrastructure}
          />
        )}

        {/* View 4: Analytics & Professional Recharts Graphics */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            throughputHistory={throughputHistory}
            vehicleCategories={vehicleCategories}
            alprRecords={alprRecords}
            onAddAlprRecord={handleAddAlprRecord}
          />
        )}

        {/* View 5: Emergency Dispatches & Incident Commander */}
        {activeTab === 'incidents' && (
          <IncidentDeck
            crossings={crossings}
            incidents={incidents}
            onResolveIncident={handleResolveIncident}
            onDispatchResponder={handleDispatchResponder}
            onInjectIncident={handleInjectGlobalIncident}
            onSelectCrossing={handleJumpToVisualizer}
          />
        )}

        {/* View 6: Custom Crossing Studio */}
        {activeTab === 'builder' && (
          <CustomCrossingBuilder
            onDeployCrossing={handleDeployCrossing}
            onJumpToCrossing={handleJumpToVisualizer}
          />
        )}

      </main>

      {/* Global Takeover Emergency Override Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        onEngageGreenWave={handleEngageGreenWave}
      />

      {/* Toast Popup Bar */}
      {toastMessage && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto z-50 max-w-sm rounded-lg sm:rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 p-3 sm:p-4 border border-indigo-500/50 shadow-2xl shadow-indigo-600/30 text-xs text-white animate-bounce flex items-center gap-3">
          <span className="flex h-3 w-3 relative shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
          <span className="font-semibold leading-snug text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Premium Dark Command Deck Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 sm:py-6 text-center text-[10px] sm:text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:gap-4 px-3 sm:px-6">
          <div className="flex items-center gap-2 justify-center">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <strong className="text-slate-300">OmniCross Nexa AI</strong>
            <span className="hidden sm:inline">— Distributed High-Frequency Enterprise Traffic Command Engine</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-slate-400 text-[9px] sm:text-xs">
            <span>
              WebSocket: <strong className="text-emerald-400">TLS</strong>
            </span>
            <span className="hidden sm:inline">|</span>
            <span>
              Latency: <strong className="text-indigo-400">14ms</strong>
            </span>
            <span className="hidden sm:inline">|</span>
            <span>
              Grid: <strong className="text-cyan-400">60 FPS</strong>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

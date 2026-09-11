import { useState, useEffect } from 'react';
import { Crossing, Incident, AlprRecord } from './types';
import { 
  INITIAL_CROSSINGS, 
  INITIAL_INCIDENTS, 
  INITIAL_INFRASTRUCTURE, 
  INITIAL_ALPR_RECORDS, 
  THROUGHPUT_HISTORY, 
  VEHICLE_CATEGORIES 
} from './mockData';
import { api } from './services/api';
import { getSocket } from './services/socket';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { DashboardOverview } from './components/DashboardOverview';
import { CrossingView } from './components/CrossingVisualizer/CrossingView';
import { InfrastructureMonitor } from './components/InfrastructureLoad/InfrastructureMonitor';
import { AnalyticsDashboard } from './components/Analytics/AnalyticsDashboard';
import { IncidentDeck } from './components/IncidentManager/IncidentDeck';
import { CustomCrossingBuilder } from './components/CrossingBuilder/CustomCrossingBuilder';
import { EmergencyModal } from './components/EmergencyModal';

function AppContent() {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [crossings, setCrossings] = useState<Crossing[]>(INITIAL_CROSSINGS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [infrastructure] = useState(INITIAL_INFRASTRUCTURE);
  const [alprRecords, setAlprRecords] = useState<AlprRecord[]>(INITIAL_ALPR_RECORDS);
  const [throughputHistory] = useState(THROUGHPUT_HISTORY);
  const [vehicleCategories] = useState(VEHICLE_CATEGORIES);

  const [selectedVisualizerId, setSelectedVisualizerId] = useState<string>(INITIAL_CROSSINGS[0].id);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [latestTelemetryUpdate, setLatestTelemetryUpdate] = useState<any>(null);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [healthInfo, setHealthInfo] = useState<{ status: string; backendConnected: boolean } | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Initial REST API load with fallback to mock data
  useEffect(() => {
    const initData = async () => {
      const health = await api.getHealth();
      if (health) {
        setHealthInfo(health);
      }

      const fetchedCrossings = await api.getCrossings();
      if (fetchedCrossings && fetchedCrossings.length > 0) {
        setCrossings(fetchedCrossings);
      }

      const fetchedIncidents = await api.getIncidents();
      if (fetchedIncidents && fetchedIncidents.length > 0) {
        setIncidents(fetchedIncidents);
      }

      const perf = await api.getPerformanceAnalytics();
      if (perf) {
        setPerformanceData(perf);
      }
    };

    initData();
  }, []);

  // 2. Real-time Socket.IO Telemetry & Incident stream connection
  useEffect(() => {
    const socket = getSocket();

    socket.on('telemetry:update', (data: any) => {
      setLatestTelemetryUpdate(data);

      if (data.crossingState) {
        setCrossings((prev) =>
          prev.map((c) => (c.id === data.crossingId || (c as any).crossingId === data.crossingId ? data.crossingState : c))
        );
      }
    });

    socket.on('incident:new', (newInc: Incident) => {
      setIncidents((prev) => [newInc, ...prev]);
      triggerToast(`🚨 AUTOMATED ALERT: "${newInc.title}" at ${newInc.crossingName}`);
    });

    return () => {
      socket.off('telemetry:update');
      socket.off('incident:new');
    };
  }, []);

  // Switch to Visualizer from Dashboard or Studio
  const handleJumpToVisualizer = (crossingId: string) => {
    setSelectedVisualizerId(crossingId);
    setActiveTab('visualizer');
    triggerToast(`Switched active camera and simulator deck to "${crossings.find(c => c.id === crossingId || (c as any).crossingId === crossingId)?.name || crossingId}"`);
  };

  // Optimize all network flow
  const handleOptimizeAll = async () => {
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

  // Update a specific crossing in state & backend
  const handleUpdateCrossing = async (updated: Crossing) => {
    setCrossings(prev => prev.map(c => (c.id === updated.id || (c as any).crossingId === updated.id ? updated : c)));
    await api.updateCrossing(updated.id || (updated as any).crossingId, updated, token || undefined);
  };

  // Deploy custom newly built crossing into backend
  const handleDeployCrossing = async (newCrossing: Crossing) => {
    setCrossings(prev => [...prev, newCrossing]);
    await api.createCrossing(newCrossing, token || undefined);
    triggerToast(`Successfully registered custom node "${newCrossing.name}" into Distributed Cloud Engine.`);
  };

  // Inject a global emergency or breakdown incident
  const handleInjectGlobalIncident = async (
    crossingId: string, 
    title: string, 
    severity: 'low' | 'medium' | 'high' | 'critical', 
    description?: string
  ) => {
    const targetCrossing = crossings.find(c => c.id === crossingId || (c as any).crossingId === crossingId) || crossings[0];
    const newIncidentData: Partial<Incident> = {
      crossingId: targetCrossing.id || (targetCrossing as any).crossingId,
      crossingName: targetCrossing.name,
      title,
      severity,
      status: 'active',
      description: description || `Automated grid alert logged for ${targetCrossing.name}. Operational response team alerted.`,
    };

    const created = await api.createIncident(newIncidentData, token || undefined);
    if (created) {
      setIncidents(prev => [created, ...prev]);
    } else {
      const fallbackInc: Incident = {
        id: `inc-${Date.now()}`,
        crossingId: targetCrossing.id,
        crossingName: targetCrossing.name,
        title,
        severity,
        timestamp: 'Just now',
        status: 'active',
        description: description || `Automated alert logged for ${targetCrossing.name}`,
      };
      setIncidents(prev => [fallbackInc, ...prev]);
    }

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
  const handleResolveIncident = async (incidentId: string) => {
    setIncidents(prev => prev.map(i => (i.id === incidentId || (i as any).incidentId === incidentId ? { ...i, status: 'resolved' } : i)));
    await api.updateIncident(incidentId, { status: 'resolved' }, token || undefined);
    triggerToast(`✅ Cleared intersection anomaly`);
  };

  // Assign responder
  const handleDispatchResponder = async (incidentId: string, responder: string) => {
    setIncidents(prev => prev.map(i => (i.id === incidentId || (i as any).incidentId === incidentId ? { ...i, responderAssigned: responder, status: 'dispatching' } : i)));
    await api.updateIncident(incidentId, { responderAssigned: responder, status: 'dispatching' }, token || undefined);
    triggerToast(`Dispatched "${responder}" to active incident location.`);
  };

  // Add ALPR Record
  const handleAddAlprRecord = (record: AlprRecord) => {
    setAlprRecords(prev => [record, ...prev]);
    triggerToast(`Logged ALPR Optical Tag "${record.plate}" securely into audit buffer.`);
  };

  // Engage Global Emergency Green Wave takeover
  const handleEngageGreenWave = (modeName: string, targetRegion: string) => {
    const modeLabel = modeName === 'vip_escort' ? 'VIP Motorcade Escort' :
                      modeName === 'organ_transport' ? 'Emergency EMS Wave' : 'Disaster Evacuation';

    setCrossings(prev => prev.map(c => ({
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
    })));

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

  const avgLoad = Math.round(crossings.reduce((acc, c) => acc + c.congestionIndex, 0) / Math.max(1, crossings.length));
  const activeIncidentsCount = incidents.filter(i => i.status !== 'resolved').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      
      {/* Command Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemHealth={avgLoad}
        activeIncidentsCount={activeIncidentsCount}
        onTriggerGlobalEmergency={() => setEmergencyModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Dynamic Workspace Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        
        {/* View 1: Live Overview Dashboard */}
        {activeTab === 'overview' && (
          <DashboardOverview
            crossings={crossings}
            incidents={incidents}
            onSelectCrossing={handleJumpToVisualizer}
            onOptimizeAll={handleOptimizeAll}
            isOptimizing={isOptimizing}
            latestTelemetryUpdate={latestTelemetryUpdate}
          />
        )}

        {/* View 2: Live Real-time Crossing Simulator & Digital Twin Deck */}
        {activeTab === 'visualizer' && (
          <CrossingView
            crossings={crossings}
            selectedCrossingId={selectedVisualizerId}
            onSelectCrossing={setSelectedVisualizerId}
            onUpdateCrossing={handleUpdateCrossing}
            onInjectGlobalIncident={handleInjectGlobalIncident}
            latestTelemetryUpdate={latestTelemetryUpdate}
          />
        )}

        {/* View 3: Infrastructure Load Balancer */}
        {activeTab === 'infrastructure' && (
          <InfrastructureMonitor
            initialNodes={infrastructure}
          />
        )}

        {/* View 4: Analytics & ALPR Graphics */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            throughputHistory={throughputHistory}
            vehicleCategories={vehicleCategories}
            alprRecords={alprRecords}
            onAddAlprRecord={handleAddAlprRecord}
            performanceData={performanceData}
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

      {/* Role-Based Access Control Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Toast Popup Bar */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 p-4 border border-indigo-500/50 shadow-2xl shadow-indigo-600/30 text-xs text-white animate-bounce flex items-center gap-3">
          <span className="flex h-3 w-3 relative shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
          <span className="font-semibold leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Dark Command Deck Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between px-4 sm:px-6 gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <strong>OmniCross Traffic Intelligence Engine</strong> — Integrated Telemetry & Command Platform
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Role: <strong className="text-indigo-400">{user?.role || 'VIEWER'}</strong></span>
            <span>Backend API: <strong className={healthInfo ? "text-emerald-400" : "text-amber-400"}>{healthInfo ? "CONNECTED" : "STANDALONE / LOCAL"}</strong></span>
            <span>Socket.IO: <strong className="text-cyan-400">STREAMING</strong></span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

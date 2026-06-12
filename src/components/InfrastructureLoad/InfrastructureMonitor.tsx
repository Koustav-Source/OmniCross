import React, { useState, useEffect } from 'react';
import { InfrastructureNode } from '../../types';
import { 
  Zap, 
  Server, 
  Cpu, 
  Database, 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  RotateCcw, 
  CheckCircle2, 
  Activity,
  Network
} from 'lucide-react';

interface InfrastructureMonitorProps {
  initialNodes: InfrastructureNode[];
}

export const InfrastructureMonitor: React.FC<InfrastructureMonitorProps> = ({ initialNodes }) => {
  const [nodes, setNodes] = useState<InfrastructureNode[]>(initialNodes);
  const [targetLoad, setTargetLoad] = useState<number>(25000); // RPS
  const [isStressTesting, setIsStressTesting] = useState<boolean>(false);
  const [ddosShieldActive, setDdosShieldActive] = useState<boolean>(true);
  const [cacheHitRate, setCacheHitRate] = useState<number>(94.8);

  // Dynamic simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prevNodes => {
        return prevNodes.map(node => {
          let newCpu = node.cpuUsage;
          let newMem = node.memoryUsage;
          let newWorkers = node.activeWorkers;
          let newRps = node.requestsPerSecond;
          let newStatus = node.status;

          if (isStressTesting) {
            // Scale up
            newCpu = Math.min(99, Math.floor(newCpu + (Math.random() * 8 - 1)));
            newMem = Math.min(96, Math.floor(newMem + (Math.random() * 5)));
            newRps = Math.floor(targetLoad / prevNodes.length + (Math.random() * 5000 - 2500));
            newWorkers = Math.min(128, newWorkers + (newCpu > 80 ? 2 : 0));
            newStatus = newCpu > 88 ? 'scaling' : 'high_load';
          } else {
            // Cool down
            newCpu = Math.max(30, Math.floor(newCpu - (Math.random() * 4)));
            newMem = Math.max(45, Math.floor(newMem - (Math.random() * 2)));
            newRps = Math.max(10000, Math.floor(newRps * 0.95));
            newWorkers = Math.max(24, Math.floor(newWorkers * 0.98));
            newStatus = newCpu < 70 ? 'healthy' : 'high_load';
          }

          return {
            ...node,
            cpuUsage: newCpu,
            memoryUsage: newMem,
            activeWorkers: newWorkers,
            requestsPerSecond: newRps,
            status: newStatus,
          };
        });
      });

      if (isStressTesting) {
        setCacheHitRate(prev => Math.min(98.9, (prev + (Math.random() * 0.2 - 0.05))));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isStressTesting, targetLoad]);

  const handleStartStressTest = (load: number) => {
    setTargetLoad(load);
    setIsStressTesting(true);
  };

  const handleResetCluster = () => {
    setIsStressTesting(false);
    setTargetLoad(20000);
    setNodes(initialNodes);
    setCacheHitRate(94.8);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Overview Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              <Network className="h-3.5 w-3.5" /> High-Performance Edge Cloud Controller
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Global Multi-Region Server Scale & Load Deck
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Simulate heavy web user traffic across our distributed WebSocket clusters. Our AI Auto-Scaler dynamically spawns container pods and Web Workers to prevent API degradation during massive traffic surges.
            </p>
          </div>

          {/* DDoS Toggle & Status */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDdosShieldActive(!ddosShieldActive)}
                className={`p-3 rounded-xl transition-all ${
                  ddosShieldActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                {ddosShieldActive ? <ShieldCheck className="h-6 w-6 animate-pulse" /> : <ShieldAlert className="h-6 w-6" />}
              </button>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  Nexa AI Anti-DDoS Firewall
                </div>
                <div className="text-[11px] text-slate-400">
                  {ddosShieldActive ? '🟢 Automated IP Scrubbing Active' : '🔴 Shield Bypass Ready'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extreme Load Injection Panel */}
      <div className="rounded-2xl bg-slate-900/80 p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" /> Infrastructure Stress Tester
            </h2>
            <p className="text-xs text-slate-400">Select concurrent load simulation to test automatic Web Worker auto-scaling.</p>
          </div>

          {isStressTesting && (
            <button
              onClick={handleResetCluster}
              className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-slate-200 transition-all border border-slate-700"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Normal Output Baseline
            </button>
          )}
        </div>

        {/* Action Buttons for Load */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleStartStressTest(50000)}
            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
              targetLoad === 50000 && isStressTesting ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/30' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">Level 1 Load</div>
            <div className="text-xl font-extrabold text-white mt-1">50,000 Req / sec</div>
            <p className="text-[11px] text-slate-400 mt-2">Moderate peak urban rush hour</p>
          </button>

          <button
            onClick={() => handleStartStressTest(250000)}
            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
              targetLoad === 250000 && isStressTesting ? 'bg-amber-600/20 border-amber-500 ring-2 ring-amber-500/30' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Level 2 Load</div>
            <div className="text-xl font-extrabold text-white mt-1">250,000 Req / sec</div>
            <p className="text-[11px] text-slate-400 mt-2">Extreme multi-city grid traffic</p>
          </button>

          <button
            onClick={() => handleStartStressTest(600000)}
            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
              targetLoad === 600000 && isStressTesting ? 'bg-rose-600/20 border-rose-500 ring-2 ring-rose-500/30' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400">Level 3 Extreme</div>
            <div className="text-xl font-extrabold text-white mt-1">600,000 Req / sec</div>
            <p className="text-[11px] text-slate-400 mt-2">Major holiday convoy simulation</p>
          </button>

          <button
            onClick={() => handleStartStressTest(1200000)}
            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
              targetLoad === 1200000 && isStressTesting ? 'bg-purple-600/20 border-purple-500 ring-2 ring-purple-500/30 animate-pulse' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-purple-400">Maximum Stress</div>
            <div className="text-xl font-extrabold text-white mt-1">1.2M Req / sec</div>
            <p className="text-[11px] text-slate-400 mt-2">Extreme IoT high-frequency polling</p>
          </button>
        </div>
      </div>

      {/* Cluster Nodes Status Deck */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Server className="h-5 w-5 text-indigo-400" /> Active Regional Cluster Edge Nodes ({nodes.length})
        </h3>
        
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {nodes.map(node => (
            <div
              key={node.id}
              className="rounded-2xl bg-slate-900/70 p-6 border border-slate-800/90 shadow-xl space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">{node.region}</span>
                  <h4 className="text-base font-extrabold text-white mt-0.5">{node.nodeName}</h4>
                </div>
                
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                  node.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  node.status === 'scaling' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse' :
                  'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  <span className="h-2 w-2 rounded-full bg-currentColor animate-ping" />
                  <span className="capitalize">{node.status.replace('_', ' ')}</span>
                </span>
              </div>

              {/* Gauges */}
              <div className="space-y-4">
                
                {/* CPU */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-400 flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5 text-indigo-400" /> Virtual CPU</span>
                    <span className={node.cpuUsage > 80 ? 'text-rose-400' : 'text-slate-200'}>{node.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${node.cpuUsage > 85 ? 'bg-rose-500' : node.cpuUsage > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${node.cpuUsage}%` }}
                    />
                  </div>
                </div>

                {/* Memory */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-400 flex items-center gap-1.5"><Database className="h-3.5 w-3.5 text-blue-400" /> Edge RAM Allocation</span>
                    <span className="text-slate-200">{node.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${node.memoryUsage}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Node Stats Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Live Traffic</div>
                  <div className="font-mono text-sm font-bold text-white mt-0.5">{(node.requestsPerSecond / 1000).toFixed(1)}k <span className="text-[10px] font-normal text-slate-400">rps</span></div>
                </div>

                <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Edge Worker Pods</div>
                  <div className="font-mono text-sm font-bold text-indigo-400 mt-0.5">{node.activeWorkers} <span className="text-[10px] font-normal text-slate-400">units</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Cache & WebSockets Architecture Telemetry */}
      <div className="rounded-2xl bg-slate-900/80 p-6 border border-slate-800 shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-400" /> Global WebSocket Engine & Telemetry Buffer
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Redis Distributed Cache Hit</div>
              <div className="text-2xl font-black text-white mt-1">{cacheHitRate.toFixed(1)}%</div>
              <p className="text-[10px] text-emerald-400 mt-0.5">0.4ms In-Memory fetch latency</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Network className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Open WebSocket Tunnels</div>
              <div className="text-2xl font-black text-white mt-1 font-mono">
                {(nodes.reduce((a, b) => a + b.websocketConnections, 0) / 1000).toFixed(0)}k
              </div>
              <p className="text-[10px] text-indigo-400 mt-0.5">Real-time binary TLS streams</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Total Automated Scans Logged</div>
              <div className="text-2xl font-black text-white mt-1 font-mono">14,892,104</div>
              <p className="text-[10px] text-purple-400 mt-0.5">ALPR & RFID FASTag frames</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

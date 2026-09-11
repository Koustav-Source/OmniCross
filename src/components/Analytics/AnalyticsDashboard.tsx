import React from 'react';
import { ThroughputDataPoint, CategoryDataPoint, AlprRecord } from '../../types';
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Zap,
  Camera,
  Activity,
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Layers,
  Search
} from 'lucide-react';

interface AnalyticsDashboardProps {
  throughputHistory: ThroughputDataPoint[];
  vehicleCategories: CategoryDataPoint[];
  alprRecords: AlprRecord[];
  onAddAlprRecord: (record: AlprRecord) => void;
  performanceData?: any;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  throughputHistory,
  vehicleCategories,
  alprRecords,
  onAddAlprRecord,
  performanceData,
}) => {
  const [filterQuery, setFilterQuery] = React.useState('');

  const filteredAlpr = alprRecords.filter(r =>
    r.plate.toLowerCase().includes(filterQuery.toLowerCase()) ||
    r.crossingName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    r.vehicleType.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleManualScan = () => {
    const plates = ['NEX-9021', 'K-2026-X', 'EMERG-991', 'VIP-8802', 'STATE-001'];
    const crossings = ['Nexus Central Urban Junction', 'Cyber-Express Toll Plaza', 'Apex Border Checkpoint', 'Bay-Bridge Drawbridge'];
    const types = ['Sedan', 'Emergency EMS Ambulance', 'Electric Autonomous Pod', 'Heavy Freight Truck'];

    const randomPlate = plates[Math.floor(Math.random() * plates.length)];
    const randomCrossing = crossings[Math.floor(Math.random() * crossings.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const isFlagged = Math.random() > 0.5;

    const newRecord: AlprRecord = {
      id: `alpr-${Date.now().toString().substr(-4)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      crossingName: randomCrossing,
      plate: randomPlate,
      vehicleType: randomType,
      speed: Math.floor(Math.random() * 45 + 35),
      flagged: isFlagged,
      flagReason: isFlagged ? 'Automated Speed & Priority Scan Tag' : undefined,
    };

    onAddAlprRecord(newRecord);
  };

  const beforeDelay = performanceData?.optimizationImpact?.beforeOptimizationDelaySeconds || 82;
  const afterDelay = performanceData?.optimizationImpact?.afterOptimizationDelaySeconds || 51;
  const improvement = performanceData?.optimizationImpact?.improvementPercent || 37.8;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Intelligence Analytics & ALPR Hub
            <span className="rounded-md bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> High-Frequency Data Warehouse
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Before vs After optimization comparison, vehicle classification distribution & Optical ALPR audit stream
          </p>
        </div>

        <button
          onClick={handleManualScan}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
        >
          <Camera className="h-4 w-4" /> Trigger Simulated ALPR Camera Capture
        </button>
      </div>

      {/* Before vs After Optimization Metrics Deck */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 p-6 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">
          <Zap className="h-4 w-4 text-indigo-400" /> Operational Impact Metrics: Before vs After Signal Optimization
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Before Signal Retiming</div>
            <div className="mt-1 text-2xl font-black text-rose-400">{beforeDelay}s <span className="text-xs text-slate-400 font-normal">/ vehicle delay</span></div>
            <p className="mt-1 text-[11px] text-slate-400">Fixed-time signal plan baseline</p>
          </div>

          <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">After Adaptive Intelligence Timing</div>
            <div className="mt-1 text-2xl font-black text-emerald-400">{afterDelay}s <span className="text-xs text-slate-400 font-normal">/ vehicle delay</span></div>
            <p className="mt-1 text-[11px] text-slate-400">Dynamic approach density balance</p>
          </div>

          <div className="rounded-xl bg-emerald-950/30 p-4 border border-emerald-500/30 flex flex-col justify-between">
            <div className="text-xs text-emerald-300 font-bold uppercase">Measured Network Efficiency</div>
            <div className="mt-1 text-3xl font-black text-emerald-400 flex items-center gap-2">
              +{improvement}% <TrendingUp className="h-6 w-6" />
            </div>
            <p className="mt-1 text-[11px] text-emerald-200">
              Significant reduction in intersection bottleneck queuing.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Chart 1: Hourly Throughput Area Chart (2 Cols) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-400" /> Hourly Network Throughput vs AI Capacity
              </h2>
              <p className="text-xs text-slate-400">Vehicles processed per hour across command network</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputHistory}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Area type="monotone" dataKey="actualThroughput" stroke="#6366f1" fillOpacity={1} fill="url(#colorActual)" name="Actual Throughput" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Vehicle Classification Distribution Pie (1 Col) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl lg:col-span-1">
          <div className="border-b border-slate-800 pb-3 mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" /> Vehicle Category Mix
            </h2>
            <p className="text-xs text-slate-400">Fleet distribution percentage</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {vehicleCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 space-y-1.5 text-xs">
            {vehicleCategories.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium text-[11px]">{item.name}</span>
                </div>
                <span className="font-bold text-white text-[11px]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ALPR Tag Optical Recognition Audit Log */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Camera className="h-5 w-5 text-indigo-400" /> ALPR Optical Tag Audit Feed
            </h2>
            <p className="text-xs text-slate-400">High-speed plate recognition records and priority flags</p>
          </div>

          {/* Search Input */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search plate or location..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Timestamp</th>
                <th className="px-4 py-3">License Tag</th>
                <th className="px-4 py-3">Crossing Portal</th>
                <th className="px-4 py-3">Classification</th>
                <th className="px-4 py-3">Speed</th>
                <th className="px-4 py-3 rounded-r-xl">Priority / Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAlpr.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No matching ALPR records found.
                  </td>
                </tr>
              ) : (
                filteredAlpr.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-400">{rec.timestamp}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-slate-950 px-2 py-1 font-mono font-bold text-amber-300 border border-slate-800">
                        {rec.plate}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">{rec.crossingName}</td>
                    <td className="px-4 py-3 text-slate-300">{rec.vehicleType}</td>
                    <td className="px-4 py-3 font-bold text-slate-200">{rec.speed} km/h</td>
                    <td className="px-4 py-3">
                      {rec.flagged ? (
                        <span className="inline-flex items-center gap-1 rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                          <AlertTriangle className="h-3 w-3" /> {rec.flagReason || 'FLAGGED'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="h-3 w-3" /> Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

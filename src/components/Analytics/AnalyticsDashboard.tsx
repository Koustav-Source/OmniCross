import React, { useState } from 'react';
import { AlprRecord, ThroughputDataPoint, CategoryDataPoint } from '../../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  Car, 
  TrendingUp, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Download, 
  PlusCircle, 
  Cpu, 
  Leaf 
} from 'lucide-react';

interface AnalyticsDashboardProps {
  throughputHistory: ThroughputDataPoint[];
  vehicleCategories: CategoryDataPoint[];
  alprRecords: AlprRecord[];
  onAddAlprRecord: (record: AlprRecord) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  throughputHistory,
  vehicleCategories,
  alprRecords,
  onAddAlprRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFlagged, setFilterFlagged] = useState(false);

  // New mock record form state
  const [newPlate, setNewPlate] = useState('');
  const [newType, setNewType] = useState('Commercial SUV');
  const [newSpeed, setNewSpeed] = useState('45');
  const [newFlagged, setNewFlagged] = useState(false);
  const [newReason, setNewReason] = useState('');

  const filteredRecords = alprRecords.filter(r => {
    const matchesSearch = r.plate.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.crossingName.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterFlagged && !r.flagged) return false;
    return matchesSearch;
  });

  const handleMockScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;

    const record: AlprRecord = {
      id: `alpr-${Date.now().toString().substr(-4)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      crossingName: 'Nexus Central Urban Junction',
      plate: newPlate.toUpperCase(),
      vehicleType: newType,
      speed: Number(newSpeed) || 45,
      flagged: newFlagged,
      flagReason: newFlagged ? newReason || 'Automated ALPR Flag' : undefined,
    };

    onAddAlprRecord(record);
    setNewPlate('');
    setNewReason('');
  };

  const handleExportCsv = () => {
    const headers = 'ID,Timestamp,Crossing,Plate,Type,Speed,Flagged,Reason\n';
    const rows = alprRecords.map(r => 
      `${r.id},${r.timestamp},"${r.crossingName}",${r.plate},"${r.vehicleType}",${r.speed},${r.flagged},"${r.flagReason || ''}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniCross-ALPR-Audit-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      
      {/* 1. KPI Telemetry Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
        <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 p-4 sm:p-5 border border-indigo-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs font-bold uppercase text-indigo-400">AI Signal Neural Score</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5 sm:mt-1">98.4 / 100</div>
            <p className="text-[10px] sm:text-[11px] text-slate-400">Continuous Deep Reinforcement Sync</p>
          </div>
        </div>

        <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 p-4 sm:p-5 border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <Leaf className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs font-bold uppercase text-emerald-400">Total Carbon Mitigation</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5 sm:mt-1">14.2 Tons Saved</div>
            <p className="text-[10px] sm:text-[11px] text-emerald-300">Reduced intersection idling emissions</p>
          </div>
        </div>

        <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 p-4 sm:p-5 border border-purple-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
            <Cpu className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs font-bold uppercase text-purple-400">Edge ALPR Accuracy</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5 sm:mt-1">99.82%</div>
            <p className="text-[10px] sm:text-[11px] text-slate-400">Optical character validation frames</p>
          </div>
        </div>
      </div>

      {/* 2. Main Recharts Graphical Visualizations Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Left 2 Cols: Recharts Network Live Throughput & Capacity Trends */}
        <div className="rounded-xl sm:rounded-2xl bg-slate-900/80 p-4 sm:p-6 border border-slate-800 shadow-xl lg:col-span-2 space-y-3 sm:space-y-4">
          <div className="flex flex-col gap-2 sm:gap-0">
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 flex-wrap">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400 shrink-0" /> <span>Hourly Network Throughput</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Comparing active vehicle flow against dynamic capacity.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-slate-300 bg-slate-950 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-slate-800 w-fit mt-2 sm:mt-0">
              <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-indigo-500 shrink-0" /> Flow
              <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-500 ml-1.5 sm:ml-2 shrink-0" /> Capacity
            </div>
          </div>

          <div className="h-60 sm:h-80 w-full pt-2 sm:pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="capacityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="aiPredictedCapacity" name="AI Optimal Capacity" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#capacityGradient)" />
                <Area type="monotone" dataKey="actualThroughput" name="Actual Live Flow" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#flowGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Recharts Vehicle Distribution Classification */}
        <div className="rounded-xl sm:rounded-2xl bg-slate-900/80 p-4 sm:p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3 sm:space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" /> Vehicle Class Classification
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">Live multi-modal classification breakdown.</p>
          </div>

          <div className="h-48 sm:h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vehicleCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Beautiful Legend inside Card */}
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-slate-800/80 max-h-36 overflow-y-auto scrollbar-none">
            {vehicleCategories.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[10px] sm:text-xs">
                <span className="flex items-center gap-1.5 sm:gap-2 text-slate-300 min-w-0">
                  <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate text-[10px] sm:text-xs">{item.name}</span>
                </span>
                <span className="font-mono font-bold text-white shrink-0 ml-1">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Live Automated License Plate Recognition (ALPR) Security Suite */}
      <div className="rounded-xl sm:rounded-2xl bg-slate-900/80 p-4 sm:p-6 border border-slate-800 shadow-xl space-y-4 sm:space-y-6">
        
        {/* Header & Export Bar */}
        <div className="flex flex-col gap-3 sm:gap-4 border-b border-slate-800 pb-3 sm:pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Car className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" /> <span>Live ALPR Feed</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">High-speed character recognition from toll plazas, border portals, and school corridors.</p>
          </div>

          <div className="flex items-center">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-slate-800 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-slate-200 transition-all hover:bg-slate-700 border border-slate-700 w-full sm:w-auto justify-center sm:justify-start"
            >
              <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" /> <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Audit Search, Filter & Mock Injection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
          
          {/* Left 2 Cols: Records List & Table */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            
            {/* Search inputs */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 sm:left-3.5 top-2 sm:top-3 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search plates or crossing..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg sm:rounded-xl bg-slate-950 pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs text-white border border-slate-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                onClick={() => setFilterFlagged(!filterFlagged)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all border w-full sm:w-auto justify-center sm:justify-start ${
                  filterFlagged ? 'bg-rose-500/20 text-rose-300 border-rose-500' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-rose-400 shrink-0" />
                <span>{filterFlagged ? 'All Scans' : 'Flagged'}</span>
              </button>
            </div>

            {/* Live Table */}
            <div className="overflow-x-auto rounded-lg sm:rounded-xl border border-slate-800 bg-slate-950 max-h-96">
              <table className="w-full text-left border-collapse text-[11px] sm:text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 font-semibold text-slate-400">
                    <th className="py-2 sm:py-3 px-2.5 sm:px-4 text-[10px] sm:text-xs">Time</th>
                    <th className="py-2 sm:py-3 px-2.5 sm:px-4 font-mono text-[10px] sm:text-xs">Plate</th>
                    <th className="hidden sm:table-cell py-3 px-4">Crossing</th>
                    <th className="hidden md:table-cell py-3 px-4">Category</th>
                    <th className="py-2 sm:py-3 px-2.5 sm:px-4 text-[10px] sm:text-xs">Speed</th>
                    <th className="py-2 sm:py-3 px-2.5 sm:px-4 text-[10px] sm:text-xs">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 sm:py-8 text-center text-slate-500 font-medium text-xs sm:text-sm">
                        No ALPR scans matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map(r => (
                      <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-2 sm:py-3 px-2.5 sm:px-4 font-mono text-slate-400 text-[10px] sm:text-xs whitespace-nowrap">{r.timestamp}</td>
                        <td className="py-2 sm:py-3 px-2.5 sm:px-4">
                          <span className="font-mono font-bold rounded bg-slate-800 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-white border border-slate-700 block">
                            {r.plate}
                          </span>
                        </td>
                        <td className="hidden sm:table-cell py-3 px-4 font-medium text-slate-200 text-xs truncate">{r.crossingName}</td>
                        <td className="hidden md:table-cell py-3 px-4 text-slate-400 text-xs">{r.vehicleType}</td>
                        <td className="py-2 sm:py-3 px-2.5 sm:px-4 font-mono text-[10px] sm:text-xs">
                          <span className={r.speed > 70 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                            {r.speed}
                          </span>
                        </td>
                        <td className="py-2 sm:py-3 px-2.5 sm:px-4">
                          {r.flagged ? (
                            <span className="inline-flex items-center gap-0.5 sm:gap-1.5 rounded-full bg-rose-500/10 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-bold text-rose-400 border border-rose-500/30 animate-pulse whitespace-nowrap">
                              <ShieldAlert className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                              <span className="hidden sm:inline">{r.flagReason || 'Flagged'}</span>
                              <span className="sm:hidden">Flagged</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 sm:gap-1.5 text-emerald-400 text-[9px] sm:text-[11px] font-medium whitespace-nowrap">
                              <CheckCircle2 className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-emerald-500 shrink-0" />
                              <span className="hidden sm:inline">Valid</span>
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

          {/* Right 1 Col: Test Mock ALPR Generator Form */}
          <div className="rounded-xl bg-slate-950 p-5 border border-slate-800/80 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <PlusCircle className="h-4 w-4 text-emerald-400" /> Test Interactive Live ALPR Scan
            </h4>
            <p className="text-xs text-slate-400">
              Submit a custom license plate to simulate an automatic optical gate scan hitting our database in real-time.
            </p>

            <form onSubmit={handleMockScan} className="space-y-3 pt-2">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">License Plate String</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NEX-4099"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-mono font-bold text-white border border-slate-700 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Vehicle Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Commuter Sedan">Commuter Sedan</option>
                    <option value="Heavy Wrecker Truck">Heavy Wrecker Truck</option>
                    <option value="Armored Escort Convoy">Armored Escort Convoy</option>
                    <option value="Electric Transit Cab">Electric Transit Cab</option>
                    <option value="Customs Freight Container">Customs Freight Container</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Radar Speed (MPH)</label>
                  <input
                    type="number"
                    value={newSpeed}
                    onChange={(e) => setNewSpeed(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-mono text-white border border-slate-700 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newFlagged}
                    onChange={(e) => setNewFlagged(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500/20 h-4 w-4"
                  />
                  <span className="text-xs font-semibold text-rose-400">🚨 Trigger Urgent Security Flag</span>
                </label>
              </div>

              {newFlagged && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Flag Reason / Description</label>
                  <input
                    type="text"
                    placeholder="e.g. VIP Green Wave Convoy Escort"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs text-rose-200 border border-rose-500/50 focus:border-rose-500 focus:outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 transition-all active:scale-98"
              >
                <PlusCircle className="h-4 w-4" /> Inject Plate Record
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { Crossing, SignalState, Vehicle } from '../../types';
import { CrossingCanvas } from './CrossingCanvas';
import { CrossingControls } from './CrossingControls';

interface CrossingViewProps {
  crossings: Crossing[];
  selectedCrossingId: string;
  onSelectCrossing: (id: string) => void;
  onUpdateCrossing: (updated: Crossing) => void;
  onInjectGlobalIncident: (crossingId: string, title: string, severity: 'low' | 'medium' | 'high' | 'critical') => void;
}

export const CrossingView: React.FC<CrossingViewProps> = ({
  crossings,
  selectedCrossingId,
  onSelectCrossing,
  onUpdateCrossing,
  onInjectGlobalIncident,
}) => {
  const activeCrossing = crossings.find(c => c.id === selectedCrossingId) || crossings[0];

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Helper to spawn a new vehicle
  const spawnVehicle = useCallback((customType?: Vehicle['type'], isPriority = false): Vehicle => {
    const directions: Vehicle['direction'][] = ['north', 'south', 'east', 'west'];
    if (activeCrossing.hasRailwayGate) directions.push('rail');
    if (activeCrossing.hasDrawbridge) directions.push('marine');

    const dir = directions[Math.floor(Math.random() * directions.length)];
    const types: Vehicle['type'][] = ['car', 'car', 'car', 'truck', 'bus'];
    
    let type = customType || types[Math.floor(Math.random() * types.length)];
    if (dir === 'rail') type = 'train';
    if (dir === 'marine') type = 'ship';

    const id = `v-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    
    let x = 0; let y = 0;
    let tx = 0; let ty = 0;
    const offset = (Math.random() - 0.5) * 40; // lane offset

    if (dir === 'north') {
      x = 380 + 30 + offset;
      y = 520 + 50;
      tx = x; ty = -100;
    } else if (dir === 'south') {
      x = 380 - 30 + offset;
      y = -50;
      tx = x; ty = 520 + 100;
    } else if (dir === 'east') {
      x = -50;
      y = 260 + 30 + offset;
      tx = 760 + 100; ty = y;
    } else if (dir === 'west') {
      x = 760 + 50;
      y = 260 - 30 + offset;
      tx = -100; ty = y;
    } else if (dir === 'rail') {
      x = 380;
      y = -100;
      tx = 380; ty = 520 + 150;
    } else if (dir === 'marine') {
      x = -100;
      y = 260;
      tx = 760 + 150; ty = 260;
    }

    // Adjust weather speed impact
    let baseSpeed = 2.5 + Math.random() * 1.5;
    if (activeCrossing.weather === 'rain') baseSpeed *= 0.8;
    if (activeCrossing.weather === 'fog') baseSpeed *= 0.6;
    if (activeCrossing.weather === 'snow') baseSpeed *= 0.5;
    if (isPriority || type === 'emergency') baseSpeed = 5.5;
    if (type === 'train' || type === 'ship') baseSpeed = 1.8;

    return {
      id,
      type,
      direction: dir,
      speed: baseSpeed,
      position: { x, y },
      targetPosition: { x: tx, y: ty },
      status: 'moving',
      isPriority: isPriority || type === 'emergency',
    };
  }, [activeCrossing]);

  // Initial population when crossing changes
  useEffect(() => {
    const count = Math.min(25, Math.max(8, Math.floor(activeCrossing.activeVehiclesCount / 2)));
    const initialVehicles: Vehicle[] = [];
    for (let i = 0; i < count; i++) {
      initialVehicles.push(spawnVehicle());
    }
    setVehicles(initialVehicles);
  }, [activeCrossing.id, spawnVehicle]);

  // Main vehicle physics & signal logic simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => {
        return prev.map(veh => {
          let { x, y } = veh.position;
          const { x: tx, y: ty } = veh.targetPosition;
          const dir = veh.direction;

          // Check distance to intersection center (380, 260)
          const distToCenterX = Math.abs(x - 380);
          const distToCenterY = Math.abs(y - 260);

          // Signal adherence logic
          let canMove = true;
          const nsLight = activeCrossing.signalPhases.northSouth;
          const ewLight = activeCrossing.signalPhases.eastWest;

          if (!veh.isPriority) {
            if (dir === 'north' && y > 300 && y < 350 && nsLight !== 'green') canMove = false;
            if (dir === 'south' && y < 220 && y > 170 && nsLight !== 'green') canMove = false;
            if (dir === 'east' && x < 320 && x > 270 && ewLight !== 'green') canMove = false;
            if (dir === 'west' && x > 440 && x < 490 && ewLight !== 'green') canMove = false;

            if (dir === 'rail' && !activeCrossing.isRailwayGateClosed) canMove = false;
            if (dir === 'marine' && !activeCrossing.isDrawbridgeUp) canMove = false;
          }

          if (canMove) {
            // Move towards target
            const dx = tx - x;
            const dy = ty - y;
            const dist = Math.hypot(dx, dy);

            if (dist < veh.speed) {
              x = tx; y = ty;
            } else {
              x += (dx / dist) * veh.speed;
              y += (dy / dist) * veh.speed;
            }
          }

          let newStatus = veh.status;
          if (!canMove) newStatus = 'waiting';
          else if (distToCenterX < 80 && distToCenterY < 80) newStatus = 'crossing';
          else newStatus = 'moving';

          return {
            ...veh,
            position: { x, y },
            status: newStatus,
          };
        }).filter(veh => {
          // Keep if not reached offscreen target
          const dist = Math.hypot(veh.targetPosition.x - veh.position.x, veh.targetPosition.y - veh.position.y);
          return dist > 10;
        });
      });
    }, 50);

    return () => clearInterval(interval);
  }, [activeCrossing]);

  // Periodic random vehicle spawn to keep simulation alive
  useEffect(() => {
    const spawnTimer = setInterval(() => {
      setVehicles(prev => {
        if (prev.length < 35) {
          return [...prev, spawnVehicle()];
        }
        return prev;
      });
    }, 1800);

    return () => clearInterval(spawnTimer);
  }, [spawnVehicle]);

  // Handlers for Controls
  const handleUpdateAiMode = (mode: Crossing['aiMode']) => {
    onUpdateCrossing({ ...activeCrossing, aiMode: mode });
  };

  const handleManualPhaseChange = (ns: SignalState, ew: SignalState, special?: SignalState) => {
    onUpdateCrossing({
      ...activeCrossing,
      aiMode: 'manual',
      signalPhases: {
        ...activeCrossing.signalPhases,
        northSouth: ns,
        eastWest: ew,
        special: special || activeCrossing.signalPhases.special,
      },
    });
  };

  const handleToggleRailwayGate = () => {
    onUpdateCrossing({
      ...activeCrossing,
      isRailwayGateClosed: !activeCrossing.isRailwayGateClosed,
    });
  };

  const handleToggleDrawbridge = () => {
    onUpdateCrossing({
      ...activeCrossing,
      isDrawbridgeUp: !activeCrossing.isDrawbridgeUp,
    });
  };

  const handleToggleBorderGate = () => {
    onUpdateCrossing({
      ...activeCrossing,
      isBorderGateOpen: !activeCrossing.isBorderGateOpen,
    });
  };

  const handleInjectTrafficSurge = (count: number, surgeType: 'normal' | 'heavy' | 'gridlock' | 'vip') => {
    const newVehicles: Vehicle[] = [];
    for (let i = 0; i < count; i++) {
      newVehicles.push(spawnVehicle(surgeType === 'vip' ? 'emergency' : undefined, surgeType === 'vip'));
    }
    setVehicles(prev => [...prev, ...newVehicles]);

    // Update crossing KPIs
    const addedCongestion = surgeType === 'gridlock' ? 35 : surgeType === 'heavy' ? 20 : 5;
    onUpdateCrossing({
      ...activeCrossing,
      activeVehiclesCount: activeCrossing.activeVehiclesCount + count,
      congestionIndex: Math.min(100, activeCrossing.congestionIndex + addedCongestion),
      status: surgeType === 'gridlock' ? 'heavy_congestion' : activeCrossing.status,
    });
  };

  const handleInjectIncident = (title: string, severity: 'low' | 'medium' | 'high' | 'critical') => {
    onInjectGlobalIncident(activeCrossing.id, title, severity);
    onUpdateCrossing({
      ...activeCrossing,
      incidentsCount: activeCrossing.incidentsCount + 1,
      status: 'heavy_congestion',
      congestionIndex: Math.min(100, activeCrossing.congestionIndex + 25),
    });
  };

  const handleUpdateWeather = (weather: Crossing['weather']) => {
    onUpdateCrossing({ ...activeCrossing, weather });
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Main Simulated Animation Canvas Deck */}
        <div className="lg:col-span-2 space-y-4">
          <CrossingCanvas crossing={activeCrossing} vehicles={vehicles} />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 text-center">
              <div className="text-[10px] font-bold uppercase text-slate-400">Active Map Units</div>
              <div className="text-xl font-black text-indigo-400 mt-1">{vehicles.length}</div>
            </div>

            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 text-center">
              <div className="text-[10px] font-bold uppercase text-slate-400">Simulation Speed</div>
              <div className="text-xl font-black text-emerald-400 mt-1">1.0x Realtime</div>
            </div>

            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 text-center">
              <div className="text-[10px] font-bold uppercase text-slate-400">Intersection Yield</div>
              <div className="text-xl font-black text-amber-400 mt-1">98.2% Safe</div>
            </div>

            <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 text-center">
              <div className="text-[10px] font-bold uppercase text-slate-400">AI Latency Sync</div>
              <div className="text-xl font-black text-cyan-400 mt-1">12 ms</div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Control Studio Deck */}
        <div className="lg:col-span-1">
          <CrossingControls
            crossings={crossings}
            selectedCrossingId={activeCrossing.id}
            onSelectCrossing={onSelectCrossing}
            onUpdateAiMode={handleUpdateAiMode}
            onManualPhaseChange={handleManualPhaseChange}
            onToggleRailwayGate={handleToggleRailwayGate}
            onToggleDrawbridge={handleToggleDrawbridge}
            onToggleBorderGate={handleToggleBorderGate}
            onInjectTrafficSurge={handleInjectTrafficSurge}
            onInjectIncident={handleInjectIncident}
            onUpdateWeather={handleUpdateWeather}
          />
        </div>

      </div>
    </div>
  );
};

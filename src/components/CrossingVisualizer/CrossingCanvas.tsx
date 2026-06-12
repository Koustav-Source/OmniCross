import React, { useEffect, useRef } from 'react';
import { Crossing, Vehicle } from '../../types';

interface CrossingCanvasProps {
  crossing: Crossing;
  vehicles: Vehicle[];
}

export const CrossingCanvas: React.FC<CrossingCanvasProps> = ({ crossing, vehicles }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // 1. Clear background
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const roadWidth = Math.max(120, crossing.lanesPerDirection * 35);

      // 2. Draw Marine / Drawbridge Channel if applicable
      if (crossing.hasDrawbridge) {
        ctx.fillStyle = '#0284c7'; // sky-600 water
        ctx.fillRect(0, cy - roadWidth - 40, canvas.width, roadWidth * 2 + 80);

        // Water ripples
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, cy - roadWidth); ctx.lineTo(100, cy - roadWidth);
        ctx.moveTo(300, cy + roadWidth + 20); ctx.lineTo(380, cy + roadWidth + 20);
        ctx.stroke();
      }

      // 3. Draw East-West Road
      ctx.fillStyle = '#334155'; // slate-700 asphalt
      ctx.fillRect(0, cy - roadWidth / 2, canvas.width, roadWidth);

      // East-West lane markings
      const lanesEW = crossing.lanesPerDirection;
      const laneWidthEW = roadWidth / lanesEW;
      ctx.strokeStyle = '#cbd5e1'; // white dashed
      ctx.lineWidth = 2;
      ctx.setLineDash([15, 15]);
      for (let i = 1; i < lanesEW; i++) {
        const y = (cy - roadWidth / 2) + i * laneWidthEW;
        if (i === Math.floor(lanesEW / 2)) {
          // Center double yellow line
          ctx.strokeStyle = '#f59e0b'; // amber
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.moveTo(0, y - 2); ctx.lineTo(canvas.width, y - 2);
          ctx.moveTo(0, y + 2); ctx.lineTo(canvas.width, y + 2);
          ctx.stroke();
          ctx.strokeStyle = '#cbd5e1';
          ctx.setLineDash([15, 15]);
        } else {
          ctx.beginPath();
          ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      // 4. Draw North-South Road / Railway
      if (crossing.hasRailwayGate) {
        // Draw Railway tracks North-South
        ctx.fillStyle = '#475569'; // ballast
        ctx.fillRect(cx - 50, 0, 100, canvas.height);
        
        // Wooden ties
        ctx.fillStyle = '#78350f'; // brown
        for (let ry = 0; ry < canvas.height; ry += 25) {
          ctx.fillRect(cx - 55, ry, 110, 12);
        }

        // Steel rails
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(cx - 35, 0, 8, canvas.height);
        ctx.fillRect(cx + 27, 0, 8, canvas.height);
      } else {
        // Normal North-South asphalt road
        ctx.fillStyle = '#334155';
        ctx.fillRect(cx - roadWidth / 2, 0, roadWidth, canvas.height);

        // North-South lane markings
        const lanesNS = crossing.lanesPerDirection;
        const laneWidthNS = roadWidth / lanesNS;
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.setLineDash([15, 15]);
        for (let i = 1; i < lanesNS; i++) {
          const x = (cx - roadWidth / 2) + i * laneWidthNS;
          if (i === Math.floor(lanesNS / 2)) {
            ctx.strokeStyle = '#f59e0b';
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(x - 2, 0); ctx.lineTo(x - 2, canvas.height);
            ctx.moveTo(x + 2, 0); ctx.lineTo(x + 2, canvas.height);
            ctx.stroke();
            ctx.strokeStyle = '#cbd5e1';
            ctx.setLineDash([15, 15]);
          } else {
            ctx.beginPath();
            ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
            ctx.stroke();
          }
        }
      }
      ctx.setLineDash([]); // reset dash

      // 5. Draw Intersection Center Box / Zebra Crossings
      if (!crossing.hasRailwayGate && !crossing.hasDrawbridge) {
        // Zebra pedestrian lines at 4 corners
        ctx.fillStyle = '#f8fafc';
        const zw = roadWidth / 2;
        // North crosswalk
        ctx.fillRect(cx - zw, cy - zw - 20, roadWidth, 16);
        // South crosswalk
        ctx.fillRect(cx - zw, cy + zw + 4, roadWidth, 16);
        // West crosswalk
        ctx.fillRect(cx - zw - 20, cy - zw, 16, roadWidth);
        // East crosswalk
        ctx.fillRect(cx + zw + 4, cy - zw, 16, roadWidth);
      }

      // 6. Draw Traffic Signals (Lights & Barriers)
      const nsState = crossing.signalPhases.northSouth;
      const ewState = crossing.signalPhases.eastWest;

      const drawTrafficLight = (lx: number, ly: number, state: string, label: string) => {
        ctx.fillStyle = '#020617'; // black housing
        ctx.beginPath();
        ctx.roundRect(lx - 14, ly - 36, 28, 72, 8);
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.stroke();

        // Red bulb
        ctx.fillStyle = state === 'red' ? '#ef4444' : '#450a0a';
        ctx.beginPath(); ctx.arc(lx, ly - 20, 8, 0, Math.PI * 2); ctx.fill();
        if (state === 'red') {
          ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 10;
          ctx.fill(); ctx.shadowBlur = 0;
        }

        // Yellow bulb
        ctx.fillStyle = state === 'yellow' ? '#f59e0b' : '#451a03';
        ctx.beginPath(); ctx.arc(lx, ly, 8, 0, Math.PI * 2); ctx.fill();
        if (state === 'yellow') {
          ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 10;
          ctx.fill(); ctx.shadowBlur = 0;
        }

        // Green bulb
        ctx.fillStyle = state === 'green' ? '#10b981' : '#022c22';
        ctx.beginPath(); ctx.arc(lx, ly + 20, 8, 0, Math.PI * 2); ctx.fill();
        if (state === 'green') {
          ctx.shadowColor = '#10b981'; ctx.shadowBlur = 10;
          ctx.fill(); ctx.shadowBlur = 0;
        }

        // Label
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '10px sans-serif';
        ctx.fillText(label, lx - 10, ly + 48);
      };

      // Draw NS lights
      if (!crossing.hasRailwayGate) {
        drawTrafficLight(cx - roadWidth / 2 - 25, cy - roadWidth / 2 - 40, nsState, 'N/S');
        drawTrafficLight(cx + roadWidth / 2 + 25, cy + roadWidth / 2 + 40, nsState, 'N/S');
      }
      // Draw EW lights
      drawTrafficLight(cx + roadWidth / 2 + 40, cy - roadWidth / 2 - 25, ewState, 'E/W');
      drawTrafficLight(cx - roadWidth / 2 - 40, cy + roadWidth / 2 + 25, ewState, 'E/W');

      // 7. Draw Boom Barriers if Border, Toll, Railway
      if (crossing.hasRailwayGate || crossing.hasBorderGate) {
        const isClosed = crossing.hasRailwayGate ? crossing.isRailwayGateClosed : !crossing.isBorderGateOpen;
        ctx.lineWidth = 8;
        ctx.strokeStyle = isClosed ? '#ef4444' : '#10b981';

        // Boom Gate West
        ctx.beginPath();
        ctx.moveTo(cx - roadWidth / 2 - 10, cy - 20);
        if (isClosed) {
          ctx.lineTo(cx, cy - 20); // horizontal block
        } else {
          ctx.lineTo(cx - roadWidth / 2 - 10, cy - 80); // upright
        }
        ctx.stroke();

        // Boom Gate East
        ctx.beginPath();
        ctx.moveTo(cx + roadWidth / 2 + 10, cy + 20);
        if (isClosed) {
          ctx.lineTo(cx, cy + 20);
        } else {
          ctx.lineTo(cx + roadWidth / 2 + 10, cy + 80);
        }
        ctx.stroke();
      }

      // 8. Draw Drawbridge halves if Drawbridge
      if (crossing.hasDrawbridge) {
        const isUp = crossing.isDrawbridgeUp;
        ctx.fillStyle = '#475569';
        // West abutment
        ctx.fillRect(cx - roadWidth / 2 - 60, cy - roadWidth / 2 - 10, 60, roadWidth + 20);
        // East abutment
        ctx.fillRect(cx + roadWidth / 2, cy - roadWidth / 2 - 10, 60, roadWidth + 20);

        // Animated draw spans
        ctx.fillStyle = isUp ? '#f59e0b' : '#64748b';
        if (isUp) {
          // Open bridge warning text
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText('DRAWBRIDGE RAISED - NAVAL CHANNEL OPEN', cx - 150, cy - roadWidth / 2 - 20);
        }
      }

      // 9. Draw Live Animated Vehicles / Trains / Ships
      vehicles.forEach(veh => {
        ctx.save();
        ctx.translate(veh.position.x, veh.position.y);

        // Rotate based on direction
        if (veh.direction === 'east') ctx.rotate(0);
        if (veh.direction === 'south') ctx.rotate(Math.PI / 2);
        if (veh.direction === 'west') ctx.rotate(Math.PI);
        if (veh.direction === 'north') ctx.rotate(-Math.PI / 2);

        if (veh.type === 'train') {
          // Big heavy locomotive
          ctx.fillStyle = '#ef4444'; // Red locomotive
          ctx.fillRect(-60, -18, 120, 36);
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(30, -14, 20, 28); // cab window
          ctx.fillStyle = '#0f172a';
          ctx.beginPath(); ctx.arc(40, 0, 6, 0, Math.PI * 2); ctx.fill(); // headlight
          ctx.fillStyle = '#f59e0b';
          ctx.fillText('NEXA FREIGHT RAIL', -45, 5);
        } else if (veh.type === 'ship') {
          // Big Maritime Cargo Vessel
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.ellipse(0, 0, 70, 25, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(-30, -15, 40, 30); // Containers
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(10, -15, 20, 30);
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText('CONTAINER LINE', -25, 4);
        } else if (veh.type === 'emergency') {
          // Ambulance / Fire Engine
          ctx.fillStyle = '#ef4444'; // bright red
          ctx.beginPath(); ctx.roundRect(-22, -12, 44, 24, 6); ctx.fill();
          // Flashing lights
          const flash = Math.floor(Date.now() / 150) % 2 === 0;
          ctx.fillStyle = flash ? '#3b82f6' : '#ef4444';
          ctx.beginPath(); ctx.arc(6, -6, 4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = flash ? '#ef4444' : '#3b82f6';
          ctx.beginPath(); ctx.arc(6, 6, 4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText('EMS', -12, 3);
        } else if (veh.type === 'truck') {
          // Semi Transport Truck
          ctx.fillStyle = '#3b82f6'; // Blue cab
          ctx.beginPath(); ctx.roundRect(10, -12, 18, 24, 4); ctx.fill();
          ctx.fillStyle = '#e2e8f0'; // Silver trailer
          ctx.fillRect(-28, -13, 36, 26);
        } else if (veh.type === 'bus') {
          // City Metro Bus
          ctx.fillStyle = '#10b981'; // Emerald bus
          ctx.beginPath(); ctx.roundRect(-25, -12, 50, 24, 5); ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.fillText('CITY TRANSIT', -18, 3);
        } else {
          // Normal Car
          ctx.fillStyle = veh.isPriority ? '#f43f5e' : '#6366f1'; // Indigo or Rose
          ctx.beginPath(); ctx.roundRect(-16, -10, 32, 20, 5); ctx.fill();
          ctx.fillStyle = '#94a3b8'; // windshield
          ctx.fillRect(2, -8, 8, 16);
          ctx.fillRect(-10, -8, 6, 16);
        }

        ctx.restore();
      });

      // 10. Draw AI Zone Radar Overlays
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(cx - roadWidth / 2 - 30, cy - roadWidth / 2 - 30, roadWidth + 60, roadWidth + 60);
      ctx.setLineDash([]);
      ctx.fillStyle = '#6366f1';
      ctx.font = '9px sans-serif';
      ctx.fillText(`AI SENSOR MATRIX: ACTIVE (Nodes: ${vehicles.length})`, cx - roadWidth / 2 - 28, cy - roadWidth / 2 - 35);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [crossing, vehicles]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl">
      <div className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-xl bg-slate-900/90 px-3.5 py-2 border border-slate-800 backdrop-blur-md">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
        </span>
        <span className="text-xs font-bold tracking-tight text-white">{crossing.name} Live View</span>
        <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
          60 FPS AI Render Deck
        </span>
      </div>

      <div className="flex justify-center items-center py-2">
        <canvas
          ref={canvasRef}
          width={760}
          height={520}
          className="rounded-xl border border-slate-800/80 bg-slate-900 shadow-inner max-w-full h-auto"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-900/60 p-3 text-xs text-slate-400 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-6 rounded bg-indigo-500" /> Sedan
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-6 rounded bg-blue-500" /> Semi-Truck
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-6 rounded bg-emerald-500" /> Metro Bus
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-6 rounded bg-red-500" /> EMS / Train
          </div>
        </div>

        <div className="font-mono text-[11px] text-slate-400">
          Live System Coordination: <strong className="text-emerald-400">Perfect Sync</strong>
        </div>
      </div>
    </div>
  );
};

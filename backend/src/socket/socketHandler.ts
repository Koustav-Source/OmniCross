import { Server as SocketIOServer, Socket } from 'socket.io';
import { SyntheticTrafficSimulator } from '../simulator/trafficSimulator.js';

let simulatorInstance: SyntheticTrafficSimulator | null = null;

export const initSocketHandler = (io: SocketIOServer): SyntheticTrafficSimulator => {
  simulatorInstance = new SyntheticTrafficSimulator(io);
  simulatorInstance.start(3000);

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Send initial status check
    socket.emit('system:status', {
      connected: true,
      simulatorRunning: simulatorInstance?.getStatus().isRunning || false,
      timestamp: new Date().toISOString(),
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  return simulatorInstance;
};

export const getSimulatorInstance = (): SyntheticTrafficSimulator | null => {
  return simulatorInstance;
};

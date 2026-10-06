import { io, Socket } from 'socket.io-client';
import { RawTelemetryPayload, ProjectedBusLocation } from '../types/telemetry.types';

const SOCKET_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private connected = false;

  connect() {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
    });
  }

  joinRouteRoom(routeId: string) {
    if (this.socket && this.connected) {
      this.socket.emit('room:join', routeId);
    }
  }

  leaveRouteRoom(routeId: string) {
    if (this.socket && this.connected) {
      this.socket.emit('room:leave', routeId);
    }
  }

  emitTelemetry(payload: RawTelemetryPayload) {
    if (this.socket && this.connected) {
      this.socket.emit('telemetry:emit', payload);
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }
}

export const socketClient = new SocketService();

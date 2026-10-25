import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MapMatchingService } from '../matching/MapMatchingService';
import { SupabaseService } from '../supabase/supabase.service';

export interface LocationPayload {
  userId: string;
  routeId: string;
  latitude: number;
  longitude: number;
  speedKmh?: number;
  heading?: number;
  accuracy?: number;
  timestamp: number;
}

export interface BoardingPayload {
  userId: string;
  routeId: string;
  latitude?: number;
  longitude?: number;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class LocationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly matching: MapMatchingService;
  private readonly supabase: SupabaseService;

  constructor(
    mapMatching?: MapMatchingService,
    supabase?: SupabaseService,
  ) {
    this.matching = mapMatching ?? new MapMatchingService();
    this.supabase = supabase ?? new SupabaseService();
  }

  afterInit() {
    console.log('[LocationGateway] Servidor inicializado');
  }

  handleConnection(client: Socket) {
    console.log(`[LocationGateway] Conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[LocationGateway] Desconectado: ${client.id}`);
    const userId = (client as any)?.data?.userId;
    if (userId) this.supabase.endSession(userId);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string | { routeId: string; userId?: string },
  ) {
    const routeId = typeof data === 'string' ? data : data?.routeId;
    if (routeId) {
      client.join(routeId);
      console.log(`[LocationGateway] Cliente ${client.id} se unio a la ruta: ${routeId}`);
    }
    if (typeof data === 'object' && data.userId && routeId) {
      const session = await this.supabase.registerAnonymousSession({
        userId: data.userId,
        routeId,
      });
      client.emit('sessionRegistered', session);
    }
    return { event: 'roomJoined', routeId };
  }

  @SubscribeMessage('startBoarding')
  async handleStartBoarding(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: BoardingPayload,
  ) {
    if (!payload?.userId || !payload?.routeId) {
      return { status: 'error', message: 'Datos incompletos de abordaje' };
    }
    client.join(payload.routeId);
    (client as any).data = { ...(client as any).data, userId: payload.userId };
    const session = await this.supabase.registerAnonymousSession(payload);
    client.emit('sessionRegistered', session);
    return { status: 'boarded', session };
  }

  @SubscribeMessage('room:join')
  handleRoomJoinAlias(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string | { routeId: string; userId?: string },
  ) {
    return this.handleJoinRoom(client, data);
  }

  @SubscribeMessage('updateLocation')
  handleUpdateLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: LocationPayload,
  ) {
    const routeId = payload?.routeId;
    if (!routeId || !payload.latitude || !payload.longitude) {
      return { status: 'error', message: 'Parametros invalidos' };
    }

    // 1. Procesar con Turf Map-Matching
    const processed = this.matching.processRawCoordinates({
      userId: payload.userId,
      routeId,
      latitude: payload.latitude,
      longitude: payload.longitude,
      speedKmh: payload.speedKmh,
      heading: payload.heading,
      accuracy: payload.accuracy,
      timestamp: payload.timestamp || Date.now(),
    });

    // 2. Si esta desviado (fuera de tolerancia de 45m), alertar o descartar
    if (processed.isDeviated) {
      if (this.server) {
        this.server.to(routeId).emit('locationDeviated', {
          userId: payload.userId,
          routeId,
          distanceMeters: processed.distanceMeters,
          status: 'DEVIATED',
          timestamp: payload.timestamp,
        });
      }
      return { status: 'deviated', distanceMeters: processed.distanceMeters };
    }

    // 3. Coordenada proyectada y limpia lista para dibujar en el mapa
    const cleanPayload = {
      ...payload,
      latitude: processed.snappedLatitude,
      longitude: processed.snappedLongitude,
      snappedLatitude: processed.snappedLatitude,
      snappedLongitude: processed.snappedLongitude,
      distanceMeters: processed.distanceMeters,
      bearing: processed.bearing,
      status: 'SNAPPED',
    };

    if (this.server) {
      this.server.to(routeId).emit('locationUpdated', cleanPayload);
      this.server.to(routeId).emit('telemetry:projected', cleanPayload);
    }

    // Persistir telemetria en Supabase
    this.supabase.updateSessionTelemetry(payload.userId, cleanPayload);

    return { status: 'snapped', cleanPayload };
  }

  @SubscribeMessage('telemetry:emit')
  handleTelemetryEmitAlias(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: LocationPayload,
  ) {
    return this.handleUpdateLocation(client, payload);
  }

  broadcastProjectedBus(routeId: string, data: any) {
    if (this.server) {
      this.server.to(routeId).emit('telemetry:projected', data);
      this.server.to(routeId).emit('locationUpdated', data);
    }
  }

  broadcastToRoute(routeId: string, event: string, data: any) {
    if (this.server) {
      this.server.to(routeId).emit(event, data);
    }
  }
}

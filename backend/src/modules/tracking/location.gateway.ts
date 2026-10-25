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

  constructor(mapMatchingService?: MapMatchingService) {
    this.matching = mapMatchingService ?? new MapMatchingService();
  }

  afterInit() {
    console.log('[LocationGateway] Servidor WebSocket inicializado');
  }

  handleConnection(client: Socket) {
    console.log(`[LocationGateway] Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[LocationGateway] Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string | { routeId: string },
  ) {
    const routeId = typeof data === 'string' ? data : data?.routeId;
    if (routeId) {
      client.join(routeId);
      console.log(`[LocationGateway] Cliente ${client.id} se unio a la ruta: ${routeId}`);
    }
    return { event: 'roomJoined', routeId };
  }

  @SubscribeMessage('room:join')
  handleRoomJoinAlias(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string | { routeId: string },
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
      console.warn(
        `[LocationGateway] Telemetria desviada (${processed.distanceMeters}m) ` +
        `para usuario ${payload.userId} en ruta ${routeId}`,
      );
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

    console.log(
      `[LocationGateway] Telemetria de ${client.id} proyectada en ${routeId}: ` +
      `(${cleanPayload.latitude}, ${cleanPayload.longitude}), rumbo: ${cleanPayload.bearing}°`,
    );

    if (this.server) {
      this.server.to(routeId).emit('locationUpdated', cleanPayload);
      this.server.to(routeId).emit('telemetry:projected', cleanPayload);
    }

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

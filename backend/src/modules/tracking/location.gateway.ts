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
    console.log(
      `[LocationGateway] Telemetria de ${client.id} en ${routeId}: ` +
      `(${payload.latitude}, ${payload.longitude}), vel: ${payload.speedKmh ?? 0} km/h`,
    );

    if (routeId && this.server) {
      this.server.to(routeId).emit('locationUpdated', payload);
      this.server.to(routeId).emit('telemetry:projected', payload);
    }

    return { status: 'acknowledged', timestamp: Date.now() };
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

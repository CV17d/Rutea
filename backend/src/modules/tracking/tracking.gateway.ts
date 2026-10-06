import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`[Socket] Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[Socket] Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('room:join')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() routeId: string,
  ) {
    client.join(routeId);
    console.log(`[Socket] Cliente ${client.id} se unió a la sala de ruta: ${routeId}`);
    return { event: 'room:joined', routeId };
  }

  @SubscribeMessage('room:leave')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() routeId: string,
  ) {
    client.leave(routeId);
    console.log(`[Socket] Cliente ${client.id} abandonó la sala: ${routeId}`);
    return { event: 'room:left', routeId };
  }

  broadcastProjectedBus(routeId: string, data: any) {
    if (this.server) {
      this.server.to(routeId).emit('telemetry:projected', data);
    }
  }
}

import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from './chat.interface';
import { Info } from 'src/infos/entities/info.entity';

interface CommandsProps {
  info: string;
  dados: {
    link: string;
    name: string;
  };
}

@WebSocketGateway({ cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();

  public client: Socket;

  private logger: Logger = new Logger('AppGateway');

  getId(@ConnectedSocket() socket) {
    return socket;
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: any, payload: Info): void {
    this.server.emit('msgToClient', payload);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}

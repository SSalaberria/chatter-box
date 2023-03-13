import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string): string {
    this.server.emit('event', 'This is a server generated event');

    return data;
  }
}

import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class EventsGateway {
  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }
}

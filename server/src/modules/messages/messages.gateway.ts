import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Message } from './schemas/message.schema';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    enableDebugMessages: true,
    transform: true,
  }),
)
@WebSocketGateway({ cors: true })
export class MessagesGateway {
  @WebSocketServer() server: Server;

  constructor(private messagesService: MessagesService) {}

  @SubscribeMessage('message')
  async handleEvent(
    @MessageBody() createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const newMessage = await this.messagesService.create(createMessageDto);
    this.server.emit('event', newMessage);

    return newMessage;
  }
}

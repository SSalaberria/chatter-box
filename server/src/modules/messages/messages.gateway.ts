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
import {
  createParamDecorator,
  ExecutionContext,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtPayload } from '../auth/utils/types';
import { WsAuthGuard } from '../auth/guards/ws-auth.guard';
import { WsUser } from 'src/decorators/ws-user.decorator';

@UseGuards(WsAuthGuard)
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
    @MessageBody() createMessageDto: Omit<CreateMessageDto, 'author'>,
    @WsUser() user: JwtPayload,
  ): Promise<Message> {
    const message = await this.messagesService.create({
      ...createMessageDto,
      author: user.userId,
    });

    this.server.emit('newMessage', {
      message,
      chatroomId: createMessageDto.chatroom,
    });

    return message;
  }
}

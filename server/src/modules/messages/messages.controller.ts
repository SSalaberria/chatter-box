import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRequest } from '../auth/utils/types';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { Message } from './schemas/message.schema';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(
    private messagesService: MessagesService,
    private messageGateway: MessagesGateway,
  ) {}

  @Get()
  async findAll(): Promise<Message[]> {
    return this.messagesService.findAll();
  }

  @Delete('/:id')
  async delete(@Param('id') id: string, @Request() req: UserRequest) {
    const message = await this.messagesService.findById(id);

    if (!message)
      throw new HttpException(
        "The message doesn't exist.",
        HttpStatus.BAD_REQUEST,
      );

    if (message.author._id.toString() !== req.user.userId.toString())
      throw new HttpException(
        "Can't delete message that isn't yours.",
        HttpStatus.FORBIDDEN,
      );

    this.messageGateway.server.emit('onMessageDelete', {
      messageId: message._id,
      chatroomId: message.chatroom._id,
    });

    return this.messagesService.delete(id);
  }
}

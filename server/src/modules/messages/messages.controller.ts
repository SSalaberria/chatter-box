import { Controller, Get } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message } from './schemas/message.schema';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  async findAll(): Promise<Message[]> {
    return this.messagesService.findAll();
  }
}

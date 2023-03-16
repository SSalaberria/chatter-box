import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatroomsService } from './chatrooms.service';
import { CreateChatroomDto } from './dtos/create-chatroom.dto';
import { Chatroom } from './schemas/chatroom.schema';

@Controller('chatrooms')
export class ChatroomsController {
  constructor(private chatroomsService: ChatroomsService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Chatroom> {
    return this.chatroomsService.findOneWithMessages(id);
  }

  @Post()
  async create(
    @Body() createChatroomDto: CreateChatroomDto,
  ): Promise<Chatroom> {
    return this.chatroomsService.create(createChatroomDto);
  }
}

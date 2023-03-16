import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessagesService } from '../messages/messages.service';
import { Message } from '../messages/schemas/message.schema';
import { CreateChatroomDto } from './dtos/create-chatroom.dto';
import { Chatroom, ChatroomDocument } from './schemas/chatroom.schema';

@Injectable()
export class ChatroomsService {
  constructor(
    @InjectModel(Chatroom.name) private chatroomModel: Model<ChatroomDocument>,
    private readonly messagesService: MessagesService,
  ) {}

  async findOneWithMessages(
    id: string,
  ): Promise<Chatroom & { messages: Message[] }> {
    const [chatroomData, messages] = await Promise.all([
      this.chatroomModel.findById(id).exec(),
      this.messagesService.findMessagesInChatroom(id),
    ]);

    if (!chatroomData) throw new Error('Chatroom not found.');

    return { ...chatroomData.toObject(), messages };
  }

  create(CreateChatroomDto: CreateChatroomDto): Promise<Chatroom> {
    const createdChatroom = new this.chatroomModel(CreateChatroomDto);

    return createdChatroom.save();
  }
}

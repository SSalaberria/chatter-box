import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from './dtos/create-message.dto';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  create(createMessageDto: CreateMessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(createMessageDto);

    return createdMessage.save();
  }

  findAll(): Promise<Message[]> {
    return this.messageModel.find().exec();
  }

  findMessagesInChatroom(chatroomId: string): Promise<Message[]> {
    return (
      this.messageModel
        .find({ chatroom: chatroomId }, '-chatroom -__v')
        .exec() || []
    );
  }
}

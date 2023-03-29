import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatroomDocument } from '../chatrooms/schemas/chatroom.schema';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateMessageDto } from './dtos/create-message.dto';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  create(createMessageDto: CreateMessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(createMessageDto);

    return createdMessage
      .save()
      .then((message) => message.populate('author', '_id username avatar'));
  }

  delete(messageId: string): Promise<Message | null> {
    return this.messageModel.findOneAndDelete({ _id: messageId }).exec();
  }

  findAll(): Promise<Message[]> {
    return this.messageModel.find().exec();
  }

  findById(id: string) {
    return this.messageModel
      .findById(id)
      .populate<{ author: UserDocument }>('author', '_id username avatar')
      .populate<{ chatroom: ChatroomDocument }>('chatroom')
      .exec();
  }

  findMessagesInChatroom(chatroomId: string): Promise<Message[]> {
    return (
      this.messageModel
        .find({ chatroom: chatroomId }, '-__v')
        .sort({ createdAt: 1 })
        .populate('author', '_id username avatar')
        .exec() || []
    );
  }
}

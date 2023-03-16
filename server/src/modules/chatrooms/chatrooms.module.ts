import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesModule } from '../messages/messages.module';
import { ChatroomsController } from './chatrooms.controller';
import { ChatroomsService } from './chatrooms.service';
import { Chatroom, ChatroomSchema } from './schemas/chatroom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chatroom.name, schema: ChatroomSchema },
    ]),
    MessagesModule,
  ],
  controllers: [ChatroomsController],
  providers: [ChatroomsService],
})
export class ChatroomsModule {}

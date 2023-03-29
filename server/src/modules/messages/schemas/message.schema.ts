import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Chatroom } from 'src/modules/chatrooms/schemas/chatroom.schema';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type MessageDocument = HydratedDocument<Message>;

export enum MESSAGE_TYPE {
  text = 'text',
  image = 'image',
}

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chatroom',
    required: true,
  })
  chatroom: Chatroom;

  @Prop({
    required: true,
    enum: Object.values(MESSAGE_TYPE),
    default: MESSAGE_TYPE.text,
  })
  type: MESSAGE_TYPE;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

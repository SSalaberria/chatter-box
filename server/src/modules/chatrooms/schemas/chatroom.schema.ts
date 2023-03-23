import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatroomDocument = HydratedDocument<Chatroom>;

@Schema({ timestamps: true })
export class Chatroom {
  @Prop({ required: true, unique: true })
  public name: string;

  @Prop()
  public description: string;
}

export const ChatroomSchema = SchemaFactory.createForClass(Chatroom);

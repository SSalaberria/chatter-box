import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ExcludeProperty } from 'nestjs-mongoose-exclude';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  @ExcludeProperty()
  password: string;

  @Prop({ required: false, default: null })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

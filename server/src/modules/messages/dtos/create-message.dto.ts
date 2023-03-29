import { IsString, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { MESSAGE_TYPE } from '../schemas/message.schema';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  public content: string;

  @IsNotEmpty()
  public chatroom: Types.ObjectId;

  @IsNotEmpty()
  public author: Types.ObjectId;

  @IsNotEmpty()
  public type: MESSAGE_TYPE;
}

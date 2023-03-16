import { IsString, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  public content: string;

  @IsNotEmpty()
  public chatroom: Types.ObjectId;
}

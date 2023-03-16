import { IsString, IsNotEmpty } from 'class-validator';

export class CreateChatroomDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
}

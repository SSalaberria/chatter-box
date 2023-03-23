import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateChatroomDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  public description: string;
}

import { IsNotEmpty } from 'class-validator';

export class EditUserDto {
  @IsNotEmpty()
  public file: Express.Multer.File;
}

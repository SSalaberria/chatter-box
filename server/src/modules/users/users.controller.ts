import {
  Controller,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import {
  Body,
  Get,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude/lib/interceptors/sanitize-mongoose-model.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRequest } from '../auth/utils/types';
import { EditUserDto } from './dtos/edit-user.dto';
import { UsersService } from './users.service';
@UseInterceptors(
  new SanitizeMongooseModelInterceptor({
    excludeMongooseId: false,
    excludeMongooseV: true,
  }),
)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getData(@Request() req: UserRequest) {
    const userData = await this.usersService.findById(req.user.userId);

    return userData;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/online')
  async getOnlineUsers() {
    const users = await this.usersService.getConnectedUsers();

    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile')
  @UseInterceptors(FileInterceptor('file'))
  async editUser(
    @Request() req: UserRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log({ file });
    if (file) {
      this.usersService.changeProfilePicture(req.user.userId, file);
    }
  }
}

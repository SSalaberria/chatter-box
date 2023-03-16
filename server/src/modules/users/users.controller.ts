import { Controller } from '@nestjs/common';
import {
  Get,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common/decorators';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongoose-class-serializer.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRequest } from '../auth/utils/types';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getData(@Request() req: UserRequest) {
    const userData = await this.usersService.findById(req.user.userId);

    return userData;
  }
}

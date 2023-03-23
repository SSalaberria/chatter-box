import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './utils/types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.usersService.findOne(username);

    if (user && this.comparePasswords(password, user.password)) {
      return user;
    }

    return null;
  }

  async login(user: UserDocument) {
    const payload = { username: user.username, sub: user._id };
    // const { password: _, ...userData } = user.toObject();

    return {
      accessToken: this.jwtService.sign(payload),
      userData: user,
    };
  }

  verify(token: string): JwtPayload {
    try {
      const jwtData = this.jwtService.verify(token);

      return {
        username: jwtData.username,
        userId: jwtData.sub,
      };
    } catch (e) {
      throw new Error('Error parsing user token.');
    }
  }

  hashPassword(password: string): string {
    const saltRounds = this.configService.get<string>('SALT') || 10;
    return hashSync(password, saltRounds);
  }

  comparePasswords(plainPassword: string, hashedPassword: string): boolean {
    return compareSync(plainPassword, hashedPassword);
  }
}

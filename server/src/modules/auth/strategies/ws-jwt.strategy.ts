import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../utils/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'wsjwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_PRIVATE_KEY'),
    });
  }

  async validate(payload: any): Promise<JwtPayload> {
    return {
      userId: payload.sub,
      username: payload.username,
    };
  }
}

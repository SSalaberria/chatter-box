import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { AuthService } from '../auth/auth.service';
import { WsAuthGuard } from '../auth/guards/ws-auth.guard';
import {} from '@nestjs/platform-socket.io';
import { JwtPayload } from '../auth/utils/types';
import { UsersService } from './users.service';

@UseGuards(WsAuthGuard)
@WebSocketGateway({ cors: true })
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  connectedUsers: string[];

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(client: any) {
    const { userId } = this.getUserPayloadFromClient(client);

    const user = await this.usersService.addConnectedUser(userId);

    if (user) {
      this.server.emit('userConnected', {
        username: user.username,
        _id: user._id,
      });
    }
  }

  handleDisconnect(client: any) {
    const { userId } = this.getUserPayloadFromClient(client);

    this.usersService.removeConnectedUser(userId);

    this.server.emit('userDisconnected', { userId });
  }

  getUserPayloadFromClient(client: any): JwtPayload {
    let jwtPayload: JwtPayload;

    try {
      jwtPayload = this.authService.verify(
        client.handshake.headers.authorization.split(' ')[1],
      );
    } catch (e) {
      throw new HttpException(e, HttpStatus.UNAUTHORIZED);
    }

    return jwtPayload;
  }
}

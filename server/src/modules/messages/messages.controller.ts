import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRequest } from '../auth/utils/types';
import { StorageService } from '../storage/storage.service';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { Message, MESSAGE_TYPE } from './schemas/message.schema';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(
    private messagesService: MessagesService,
    private messageGateway: MessagesGateway,
    private storageService: StorageService,
  ) {}

  @Get()
  async findAll(): Promise<Message[]> {
    return this.messagesService.findAll();
  }

  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  async createImageMessage(
    @Request() req: UserRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }), // 5mb
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: { chatroomId: Types.ObjectId },
  ) {
    const imageUrl = await this.storageService.uploadFile(file);

    const newMessage = await this.messagesService.create({
      content: imageUrl,
      type: MESSAGE_TYPE.image,
      chatroom: body.chatroomId,
      author: req.user.userId,
    });

    this.messageGateway.emitMessage(newMessage);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string, @Request() req: UserRequest) {
    const message = await this.messagesService.findById(id);

    if (!message)
      throw new HttpException(
        "The message doesn't exist.",
        HttpStatus.BAD_REQUEST,
      );

    if (message.author._id.toString() !== req.user.userId.toString())
      throw new HttpException(
        "Can't delete message that isn't yours.",
        HttpStatus.FORBIDDEN,
      );

    this.messageGateway.server.emit('onMessageDelete', {
      messageId: message._id,
      chatroomId: message.chatroom._id,
    });

    return this.messagesService.delete(id);
  }
}

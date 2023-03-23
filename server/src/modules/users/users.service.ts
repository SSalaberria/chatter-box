import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private onlineUsers: Types.ObjectId[] = [];

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async findOne(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(id: Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async create(username: string, password: string): Promise<UserDocument> {
    const hashedPassword = this.authService.hashPassword(password);
    const createdUser = await this.userModel.create({
      username,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async changeProfilePicture(id: Types.ObjectId, file: Express.Multer.File) {
    console.log({ id, file });
  }

  async getConnectedUsers(): Promise<UserDocument[]> {
    return this.userModel.find({ _id: { $in: this.onlineUsers } }).exec();
  }

  async addConnectedUser(id: Types.ObjectId): Promise<UserDocument | null> {
    const user = await this.findById(id);

    if (!this.onlineUsers.includes(id)) {
      this.onlineUsers.push(id);
    }

    return user;
  }

  removeConnectedUser(id: Types.ObjectId) {
    this.onlineUsers = this.onlineUsers.filter((userId) => userId !== id);
  }
}

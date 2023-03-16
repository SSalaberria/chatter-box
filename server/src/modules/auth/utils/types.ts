import { Types } from 'mongoose';

export type JwtPayload = {
  userId: Types.ObjectId;
  username: string;
};

export type UserRequest = Request & { user: JwtPayload };

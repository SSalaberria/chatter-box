import { User } from "@/features/auth";

export enum MESSAGE_TYPE {
  text = "text",
  image = "image",
}

export interface Message {
  _id: string;
  content: string;
  author: User;
  type: MESSAGE_TYPE;
  chatroom: string;
  createdAt: string;
}

export interface Chatroom {
  _id: string;
  name: string;
  description?: string | null;
  messages: Message[];
}

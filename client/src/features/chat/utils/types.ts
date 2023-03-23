import { User } from "@/features/auth";

export interface Message {
  _id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface Chatroom {
  _id: string;
  name: string;
  description?: string | null;
  messages: Message[];
}

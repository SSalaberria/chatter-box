import { Chatroom } from "./types";

import http from "@/utils/http";

export const getChatroom = async (id: string) =>
  http.get<Chatroom>(`/chatrooms/${id}`).then((res) => res.data);

export const getChatrooms = async () => http.get<Chatroom[]>("/chatrooms").then((res) => res.data);

export const createChatroom = async (payload: { name: string; description?: string }) =>
  http.post<Chatroom>("/chatrooms", payload).then((res) => res.data);

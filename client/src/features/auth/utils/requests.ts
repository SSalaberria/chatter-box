import { User } from "./types";

import http from "@/utils/http";

interface LoginResponse {
  userData: User;
  accessToken: string;
}

export const login = (payload: { username: string; password: string }) =>
  http.post<LoginResponse>("/auth/login", payload).then((res) => res.data);

export const getUser = async () => http.get<User>("/users").then((res) => res.data);

export const register = async (payload: { username: string; password: string }) =>
  http.post<LoginResponse>("/auth/register", payload).then((res) => res.data);

export const getOnlineUsers = async () => http.get<User[]>("/users/online").then((res) => res.data);

export const editProfilePicture = async (payload: { file: File }) =>
  http
    .post("/users/profile", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

import { io } from "socket.io-client";

import { getCookie } from "./cookies";

const URL = process.env.API_URL || "";

export const socket = io(URL, {
  autoConnect: false,
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: (() => {
          const jwt = getCookie("jwt");

          return jwt ? `Bearer ${jwt}` : undefined;
        })(),
      },
    },
  },
});

export const authorizeSocket = (token: string | null) => {
  socket.io.opts.transportOptions = {
    polling: {
      extraHeaders: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    },
  };
};

import axios from "axios";

import { getCookie } from "./cookies";

const http = axios.create({
  baseURL: `${process.env.API_URL}/api`,
  ...(getCookie("jwt") && {
    headers: {
      Authorization: `Bearer ${getCookie("jwt")}`,
    },
  }),
});

export const setToken = (token: string | null) => {
  if (token) {
    http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common["Authorization"];
  }
};

export default http;

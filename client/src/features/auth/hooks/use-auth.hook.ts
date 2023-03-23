import { useCookies } from "react-cookie";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";

import { editProfilePicture, getUser, login } from "../utils/requests";

import { ONLINE_USERS_QUERY_KEY } from "./use-online-users.hook";

import { setToken } from "@/utils/http";
import { authorizeSocket, socket } from "@/utils/socket";
import { CHATROOM_QUERY_KEY } from "@/features/chat/hooks/use-chatroom.hook";

const USER_QUERY_KEY = "user";

export function useAuth() {
  const queryClient = useQueryClient();
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const { push } = useRouter();

  const userQuery = useQuery([USER_QUERY_KEY], getUser, {
    staleTime: 3600,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: Boolean(cookies.jwt),
    onSuccess: () => {
      if (cookies.jwt) {
        afterAuthSetup(cookies.jwt);
      }
    },
    onError: () => {
      removeCookie("jwt");
      removeAuthConfig();
      push("/login");
    },
  });

  const modifyProfilePicture = useMutation(editProfilePicture, {
    onSuccess: (data) => {
      queryClient.setQueryData([USER_QUERY_KEY], data);
      queryClient.invalidateQueries([CHATROOM_QUERY_KEY]);
      queryClient.invalidateQueries([ONLINE_USERS_QUERY_KEY]);
    },
  });

  const logIn = useMutation(login, {
    onSuccess(data) {
      const { accessToken, user } = data;

      queryClient.setQueryData([USER_QUERY_KEY], user);

      afterAuthSetup(accessToken);
    },
  });

  const afterAuthSetup = (accessToken: string) => {
    setCookie("jwt", accessToken);
    setAuthConfig(accessToken);
    socket.connect();
  };

  const setAuthConfig = (accessToken: string) => {
    setToken(accessToken);
    authorizeSocket(accessToken);
  };

  const removeAuthConfig = () => {
    setToken(null);
    authorizeSocket(null);
  };

  return { userQuery, logIn, modifyProfilePicture };
}

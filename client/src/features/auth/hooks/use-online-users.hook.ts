/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";

import { getOnlineUsers } from "../utils/requests";
import { User } from "../utils/types";

import { socket } from "@/utils/socket";

export const ONLINE_USERS_QUERY_KEY = "onlineUsers";

export function useOnlineUsers() {
  const queryClient = useQueryClient();
  const onlineUsersQuery = useQuery([ONLINE_USERS_QUERY_KEY], getOnlineUsers, {
    staleTime: 180,
  });

  useEffect(() => {
    const onUserConnected = (user: User) =>
      queryClient.setQueryData<User[] | undefined>([ONLINE_USERS_QUERY_KEY], (prevUsers) => {
        if (!prevUsers) {
          queryClient.refetchQueries([ONLINE_USERS_QUERY_KEY]);
        }

        if (!prevUsers?.find((onlineUser) => onlineUser._id === user._id)) {
          return [...(prevUsers || []), user];
        }

        return prevUsers;
      });

    const onUserDisconnected = ({ userId }: { userId: string }) =>
      queryClient.setQueryData<User[] | undefined>([ONLINE_USERS_QUERY_KEY], (prevUsers) => {
        return prevUsers?.filter((user) => user._id !== userId);
      });

    socket.on("userConnected", onUserConnected);
    socket.on("userDisconnected", onUserDisconnected);

    return () => {
      socket.off("userConnected");
      socket.off("userDisconnected");
    };
  }, []);

  return { onlineUsersQuery };
}

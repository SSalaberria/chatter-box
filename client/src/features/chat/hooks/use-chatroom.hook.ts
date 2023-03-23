import { useQuery, useQueryClient } from "react-query";
import { useEffect, useMemo } from "react";

import { getChatroom } from "../utils/requests";
import { Message, Chatroom } from "../utils/types";

import { socket } from "@/utils/socket";

interface Options {
  onMessageReceived?: (message: Message) => void;
}

export function useChatroom(chatroomId: string, options?: Options) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["chatroom", chatroomId], [chatroomId]);
  const chatroomQuery = useQuery(queryKey, () => getChatroom(chatroomId), {
    refetchOnWindowFocus: false,
    staleTime: 13600,
  });
  const { onMessageReceived } = { ...options };

  const sendMessage = async (message: string) => {
    return new Promise((res) => {
      socket.emit("message", { content: message, chatroom: chatroomId }, (response: object) =>
        res(response),
      );
    });
  };

  useEffect(() => {
    const onNewMessage = (event: { chatroomId: string; message: Message }) => {
      const chatroomQueryKey = ["chatroom", event.chatroomId];

      if (queryClient.getQueryData(chatroomQueryKey)) {
        queryClient.setQueryData<Chatroom | undefined>(chatroomQueryKey, (oldData) => {
          if (oldData) {
            return {
              ...oldData,
              messages: [...(oldData?.messages || []), event.message],
            };
          }
        });
      } else {
        queryClient.fetchQuery(chatroomQueryKey, () => getChatroom(event.chatroomId));
      }

      if (onMessageReceived) {
        onMessageReceived(event.message);
      }
    };

    socket.on("newMessage", onNewMessage);

    return () => {
      socket.off("newMessage", onNewMessage);
    };
  }, [queryClient, queryKey, onMessageReceived]);

  return { chatroomQuery, sendMessage };
}

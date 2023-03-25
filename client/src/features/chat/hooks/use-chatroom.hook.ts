import { useMutation, useQuery, useQueryClient } from "react-query";
import { useEffect, useMemo } from "react";

import { deleteMessage as deleteMessageRequest, getChatroom } from "../utils/requests";
import { Message, Chatroom } from "../utils/types";

import { socket } from "@/utils/socket";

interface Options {
  onMessageReceived?: (message: Message) => void;
}

export const CHATROOM_QUERY_KEY = "chatroom";

export function useChatroom(chatroomId: string, options?: Options) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => [CHATROOM_QUERY_KEY, chatroomId], [chatroomId]);
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

  const deleteMessage = useMutation(deleteMessageRequest, {
    onMutate: (messageId) => {
      const oldData = queryClient.getQueryData<Chatroom | undefined>(queryKey);

      queryClient.setQueryData<Chatroom | undefined>(queryKey, (prevData) =>
        prevData
          ? {
              ...prevData,
              messages: prevData?.messages.filter((message) => message._id !== messageId),
            }
          : undefined,
      );

      return { oldData };
    },
    onError: (_err, _var, context) => {
      queryClient.setQueryData(queryKey, context?.oldData);
    },
  });

  useEffect(() => {
    const onNewMessage = (event: { chatroomId: string; message: Message }) => {
      const chatroomQueryKey = [CHATROOM_QUERY_KEY, event.chatroomId];

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

    const onMessageDelete = (event: { chatroomId: string; messageId: string }) => {
      const chatroomQueryKey = [CHATROOM_QUERY_KEY, event.chatroomId];

      queryClient.setQueryData<Chatroom | undefined>(chatroomQueryKey, (oldData) =>
        oldData
          ? {
              ...oldData,
              messages: oldData.messages.filter((message) => message._id !== event.messageId),
            }
          : undefined,
      );
    };

    socket.on("newMessage", onNewMessage);
    socket.on("onMessageDelete", onMessageDelete);

    return () => {
      socket.off("newMessage", onNewMessage);
      socket.off("onMessageDelete", onMessageDelete);
    };
  }, [queryClient, queryKey, onMessageReceived]);

  return { chatroomQuery, sendMessage, deleteMessage };
}

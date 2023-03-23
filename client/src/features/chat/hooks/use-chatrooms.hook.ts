import { useMutation, useQuery, useQueryClient } from "react-query";

import { createChatroom as createChatroomRequest, getChatrooms } from "../utils/requests";
import { Chatroom } from "../utils/types";

const QUERY_KEY = "chatrooms";

export function useChatrooms() {
  const queryClient = useQueryClient();
  const chatroomsQuery = useQuery([QUERY_KEY], getChatrooms, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const createChatroom = useMutation(createChatroomRequest, {
    onSuccess: (data) => {
      queryClient.setQueryData<Chatroom[] | undefined>([QUERY_KEY], (prevValue) => [
        ...(prevValue ?? []),
        data,
      ]);
    },
  });

  return { chatroomsQuery, createChatroom };
}

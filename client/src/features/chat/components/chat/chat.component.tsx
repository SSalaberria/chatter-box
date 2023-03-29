import Image from "next/image";
import { memo, useEffect, useRef } from "react";

import { useChatroom } from "../../hooks/use-chatroom.hook";

import { Message } from "./message.component";

import { useAuth } from "@/features/auth";

interface ChatProps {
  id: string;
}

export const Chat = memo(
  function Chat({ id }: ChatProps) {
    const { userQuery } = useAuth();
    const bottomRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { sendMessage, chatroomQuery, deleteMessage, sendImage } = useChatroom(id);

    const handleSubmit = (e: React.SyntheticEvent) => {
      e.preventDefault();

      const { message } = e.target as typeof e.target & {
        message: { value: string };
      };

      if (Boolean(message.value)) {
        sendMessage(message.value).then(() => scrollToBottom());
      }

      (e.target as HTMLFormElement).reset();
    };

    useEffect(() => {
      if (
        chatRef.current &&
        chatRef.current.scrollHeight - (chatRef.current.offsetHeight + 100) <=
          chatRef.current.scrollTop
      ) {
        scrollToBottom();
      }
    }, [chatroomQuery.data]);

    useEffect(() => scrollToBottom(), [chatroomQuery.isSuccess, id]);

    const scrollToBottom = () => chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);

    return (
      <div className="flex w-full flex-col justify-between px-2">
        <div
          ref={chatRef}
          className="flex flex-col overflow-y-auto pl-2"
          style={{ overflowAnchor: "none" }}
        >
          {chatroomQuery?.data?.messages.map((message, index) => {
            const isFromPreviousAuthor =
              index > 0 && chatroomQuery.data.messages[index - 1].author._id === message.author._id;

            return (
              <Message
                key={message._id}
                isFromPreviousAuthor={isFromPreviousAuthor}
                message={message}
                {...(userQuery.data?._id === message.author._id && {
                  onDelete: (message) => deleteMessage.mutate(message._id),
                })}
              />
            );
          })}
          {chatroomQuery.isSuccess && chatroomQuery.data.messages.length === 0 && (
            <div className="m-auto pt-12">There are no messages here yet, be the first one!</div>
          )}
          {chatroomQuery.isLoading && [...Array(30).keys()].map((i) => <Message key={i} />)}
          <div
            ref={bottomRef}
            style={{
              overflowAnchor: "auto",
            }}
          />
        </div>
        <div className="h-16 min-h-[4rem] pt-2">
          <form className="relative" onSubmit={handleSubmit}>
            <input
              className="w-full pr-20 pl-10 "
              id="message"
              maxLength={1024}
              placeholder={`Message #${chatroomQuery.data?.name}`}
              type="text"
            />
            <div className="absolute left-2.5 bottom-1">
              <input
                ref={fileInputRef}
                accept="image/png, image/jpeg"
                className="absolute hidden"
                multiple={false}
                required={false}
                type="file"
                onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
                  e.target.files && sendImage.mutate(e.target?.files[0])
                }
              />
              <button
                disabled={sendImage.isLoading}
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image
                  alt="btn-send-image"
                  className="hover:scale-105"
                  height={20}
                  src={sendImage.isLoading ? "/icons/loading.svg" : "/icons/plus.svg"}
                  width={20}
                />
              </button>
            </div>
            <div className="absolute right-2.5 bottom-0.5">
              <button
                className="border-l-2 border-gray-300 bg-transparent pl-4 hover:scale-110 dark:border-[#4F545C]"
                type="submit"
              >
                <Image alt="btn-send" height={24} src="/icons/right-arrow.svg" width={24} />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.id === nextProps.id,
);

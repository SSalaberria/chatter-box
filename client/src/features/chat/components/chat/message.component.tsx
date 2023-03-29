import Image from "next/image";
import { memo } from "react";

import { Message as IMessage, MESSAGE_TYPE } from "../../utils/types";

import { formatDate } from "@/utils/helpers";
import { ZoomableImage } from "@/common";

interface MessageProps {
  message?: IMessage;
  isFromPreviousAuthor?: boolean;
  onDelete?: (message: IMessage) => void;
}

export const Message = memo(
  function Message({ message, isFromPreviousAuthor, onDelete }: MessageProps) {
    return (
      <div
        className={`flex min-w-fit items-center gap-4 hover:bg-gray-100 dark:hover:bg-[#2E3035] ${
          !isFromPreviousAuthor ? "mt-4" : ""
        }`}
      >
        <div className="mb-auto w-8 pt-2">
          {!isFromPreviousAuthor && message && (
            <Image
              alt="user-icon"
              className="rounded-full"
              height={36}
              src={
                message.author.avatar ??
                "https://icongr.am/material/account-circle.svg?size=64&color=5865f2"
              }
              style={{
                objectFit: "contain",
                maxHeight: "36px",
                maxWidth: "36px",
              }}
              width={36}
            />
          )}
          {!message && <div className="mb-2 h-7 w-7 animate-pulse rounded-full bg-gray-500" />}
        </div>
        <div className="group/item relative flex w-full flex-col gap-1 py-0.5">
          <div className="flex">
            {!isFromPreviousAuthor && message && (
              <div className="flex items-end gap-2">
                <span className="text-m font-bold dark:text-white">{message.author.username}</span>
                <span className="-mb-[1px] text-s text-[#72767D]">
                  {formatDate(message.createdAt)}
                </span>
              </div>
            )}
            {!message && (
              <div className="flex-1 animate-pulse space-y-6 py-1">
                <div className="space-y-3">
                  <div className="grid grid-cols-8 gap-2">
                    <div className="col-span-2 h-2 rounded bg-gray-500" />
                    <div className="col-span-1 h-2 rounded bg-gray-500" />
                  </div>
                  <div className="h-2 rounded bg-gray-500" />
                  {Math.random() > 0.5 && (
                    <>
                      {Math.random() > 0.5 ? (
                        <div className="h-2 rounded bg-gray-500" />
                      ) : (
                        <div className="grid grid-cols-8 gap-2">
                          <div className="col-span-4 h-2 rounded bg-gray-500" />
                          <div className="col-span-3 h-2 rounded bg-gray-500" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          {message?.content && (
            <div className={"relative"}>
              {message.type === MESSAGE_TYPE.text && message.content}{" "}
              {message.type === MESSAGE_TYPE.image && (
                <ZoomableImage
                  alt="msg-image"
                  height="450"
                  src={message.content}
                  style={{
                    objectFit: "contain",
                    maxWidth: "350px",
                    maxHeight: "450px",
                  }}
                  width="350"
                />
              )}
            </div>
          )}

          {message && onDelete && (
            <div
              className="invisible absolute right-1 -top-3 flex items-center bg-white px-1 py-0.5 group-hover/item:visible dark:bg-[#313338]"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              }}
            >
              <button
                className="hover:bg-[#DDDDDD70] dark:hover:bg-[#DDDDDD30]"
                onClick={() => onDelete(message)}
              >
                <Image
                  alt="btn-delete-msg"
                  className=""
                  height={22}
                  src="https://icongr.am/material/delete.svg?size=36&color=ED4245"
                  width={22}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps?.message?._id === nextProps?.message?._id &&
    prevProps.message?.author.avatar === nextProps.message?.author.avatar &&
    prevProps.isFromPreviousAuthor === nextProps.isFromPreviousAuthor,
);

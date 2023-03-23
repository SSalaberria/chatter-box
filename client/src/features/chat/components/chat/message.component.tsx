import Image from "next/image";
import { memo } from "react";

import { Message as IMessage } from "../../utils/types";

import { formatDate } from "@/utils/helpers";

interface MessageProps {
  message?: IMessage;
  isFromPreviousAuthor?: boolean;
}

export const Message = memo(
  function Message({ message, isFromPreviousAuthor }: MessageProps) {
    return (
      <div className={`flex min-w-fit items-center gap-4 ${!isFromPreviousAuthor ? "mt-4" : ""}`}>
        <div className="mb-auto w-8 pt-2">
          {!isFromPreviousAuthor && message && (
            <Image
              alt="user-icon"
              height={36}
              src="https://icongr.am/material/account-circle.svg?size=64&color=5865f2"
              style={{
                objectFit: "contain",
              }}
              width={36}
            />
          )}
          {!message && <div className="mb-2 h-7 w-7 animate-pulse rounded-full bg-gray-500" />}
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-end gap-2">
            {!isFromPreviousAuthor && message && (
              <>
                <span className="text-m font-bold dark:text-white">{message.author.username}</span>
                <span className="-mb-[1px] text-s text-[#72767D]">
                  {formatDate(message.createdAt)}
                </span>
              </>
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
          <div>{message && message.content}</div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps?.message?._id === nextProps?.message?._id,
);

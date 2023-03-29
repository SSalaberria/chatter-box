import { memo, useRef } from "react";
import Image from "next/image";

import { User } from "@/features/auth";

interface UserTagProps {
  user: User;
  isOnline: boolean;
  onImageClick?: (file: File) => void;
}

export const UserTag = memo(
  function UserTag({ user, isOnline, onImageClick }: UserTagProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <div className="flex w-full items-center gap-4">
        <div className="relative">
          <Image
            alt="user-profile-pic"
            className={`max-h-10 max-w-[2.75rem] rounded-full object-contain filter ${
              onImageClick ? "cursor-pointer hover:bg-[#DDDDDD30]" : ""
            }`}
            height={38}
            src={
              user?.avatar ?? "https://icongr.am/material/account-circle.svg?size=64&color=5865f2"
            }
            width={38}
            {...(onImageClick && {
              onClick: () => inputRef.current?.click(),
            })}
          />
          {onImageClick && (
            <div>
              <input
                ref={inputRef}
                accept="image/png, image/jpeg"
                className="absolute hidden"
                multiple={false}
                type="file"
                onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
                  e.target.files && onImageClick(e.target?.files[0])
                }
              />
            </div>
          )}

          <div className="z-2 absolute top-5 left-5 h-5 w-5 rounded-full bg-gray-100 dark:bg-gray-700">
            <div
              className={`absolute left-1/2 top-1/2 -mt-1.5 -ml-1.5 h-3 w-3 rounded-full ${
                isOnline ? "bg-green-400" : "bg-gray-400"
              }`}
            />
          </div>
        </div>
        <div className="w-full overflow-hidden text-ellipsis text-m">{user?.username}</div>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.isOnline === nextProps.isOnline &&
    prevProps?.user?.avatar === nextProps?.user?.avatar,
);

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { useAuth, User, withAuth } from "@/features/auth";
import { Chat, ChatroomsList, Chatroom, UsersList } from "@/features/chat";
import { Drawer, Layout, useMediaQuery, UserTag } from "@/common";
import { useChatrooms } from "@/features/chat/hooks/use-chatrooms.hook";
import { useOnlineUsers } from "@/features/auth/hooks/use-online-users.hook";

function Home({ user }: { user: User }) {
  const { chatroomsQuery, createChatroom } = useChatrooms();
  const { modifyProfilePicture, logOut } = useAuth();
  const { onlineUsersQuery } = useOnlineUsers();
  const isMobile = useMediaQuery(640);
  const [selected, setSelected] = useState<Chatroom | null>(null);
  const [chatroomListOpen, setChatroomListOpen] = useState(false);
  const [usersListOpen, setUsersListOpen] = useState(false);

  const handleSelect = useCallback((selected: Chatroom) => setSelected(selected), []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCreateChatroom = useCallback((name: string) => createChatroom.mutate({ name }), []);

  useEffect(() => {
    const firstChatroom = chatroomsQuery?.data && chatroomsQuery.data[0];

    if (firstChatroom) {
      setSelected(firstChatroom);
    }
  }, [chatroomsQuery.data]);

  const chatroomsColumn = useMemo(
    () => (
      <div className="relative flex h-full w-[14rem] min-w-[14rem] flex-col bg-gray-100 pt-2 dark:bg-gray-700">
        <div
          className="h-full overflow-hidden py-2 px-2 hover:overflow-y-auto"
          style={{
            scrollbarGutter: "stable",
          }}
        >
          <ChatroomsList
            chatrooms={chatroomsQuery?.data}
            selected={selected}
            onAddChatroom={handleCreateChatroom}
            onSelect={handleSelect}
          />
        </div>
        <div className="relative flex h-16 min-h-[4rem] w-full items-center justify-between bg-gray-300 px-4 dark:bg-gray-800">
          <div className=" max-w-[10rem]">
            <UserTag
              isOnline={true}
              user={user}
              onImageClick={(file) => modifyProfilePicture.mutate({ file })}
            />
          </div>
          <button onClick={logOut}>
            <Image
              alt="logout"
              className="filter hover:grayscale"
              height={24}
              src="https://icongr.am/material/logout.svg?size=24&color=5865f2"
              width={24}
            />
          </button>
        </div>
      </div>
    ),
    [
      chatroomsQuery?.data,
      handleCreateChatroom,
      handleSelect,
      logOut,
      modifyProfilePicture,
      selected,
      user,
    ],
  );

  const usersColumn = useMemo(
    () => (
      <div
        className="flex h-full w-[14rem] min-w-[14rem] overflow-hidden bg-gray-100 hover:overflow-y-auto dark:bg-gray-700"
        style={{
          scrollbarGutter: "stable",
        }}
      >
        {onlineUsersQuery.data && <UsersList users={onlineUsersQuery.data} />}
      </div>
    ),
    [onlineUsersQuery.data],
  );

  return (
    <Layout loading={chatroomsQuery.isLoading || onlineUsersQuery.isLoading}>
      {chatroomsQuery.data && (
        <>
          {!isMobile && chatroomsColumn}

          {isMobile && (
            <>
              <Drawer
                isOpen={chatroomListOpen}
                origin="left"
                title="Chatrooms"
                onClose={() => setChatroomListOpen(false)}
              >
                {chatroomsColumn}
              </Drawer>

              <Drawer
                isOpen={usersListOpen}
                origin="right"
                title="Online"
                onClose={() => setUsersListOpen(false)}
              >
                {usersColumn}
              </Drawer>
            </>
          )}

          <div className="flex w-full flex-col">
            <div className="flex h-12 min-h-[3rem] items-center px-4 align-middle shadow-elevation-low sm:px-0">
              {selected && (
                <>
                  <button
                    className="sm:hidden"
                    type="button"
                    onClick={() => setChatroomListOpen(true)}
                  >
                    <Image
                      alt="online-users"
                      height={24}
                      src={"https://icongr.am/material/menu.svg?size=36&color=c6c6c7"}
                      width={24}
                    />
                  </button>

                  <div className="flex items-center gap-4">
                    <p className="text-ellipsis whitespace-nowrap pl-4 text-xl dark:text-white sm:text-l">
                      # {selected?.name}
                    </p>
                    <p className="w-44 overflow-hidden text-ellipsis whitespace-nowrap pt-1 text-s text-[#72767D] sm:w-full">
                      {selected?.description}
                    </p>
                  </div>

                  <button
                    className="ml-auto sm:hidden"
                    type="button"
                    onClick={() => setUsersListOpen(true)}
                  >
                    <Image
                      alt="online-users"
                      height={28}
                      src={"https://icongr.am/material/account-multiple.svg?size=36&color=c6c6c7"}
                      width={28}
                    />
                  </button>
                </>
              )}
            </div>
            <div
              className="flex w-full"
              style={{
                height: "calc(100% - 3rem)",
              }}
            >
              <div className="flex w-full">{selected && <Chat id={selected._id} />}</div>
              {!isMobile && usersColumn}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export default withAuth(Home);

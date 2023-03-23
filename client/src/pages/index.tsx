import { useCallback, useEffect, useState } from "react";

import { useAuth, User, withAuth } from "@/features/auth";
import { Chat, ChatroomsList, Chatroom, UsersList } from "@/features/chat";
import { Layout, UserTag } from "@/common";
import { useChatrooms } from "@/features/chat/hooks/use-chatrooms.hook";
import { useOnlineUsers } from "@/features/auth/hooks/use-online-users.hook";

function Home({ user }: { user: User }) {
  const { chatroomsQuery, createChatroom } = useChatrooms();
  const { modifyProfilePicture } = useAuth();
  const { onlineUsersQuery } = useOnlineUsers();
  const [selected, setSelected] = useState<Chatroom | null>(null);

  const handleSelect = useCallback((selected: Chatroom) => setSelected(selected), []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCreateChatroom = useCallback((name: string) => createChatroom.mutate({ name }), []);

  const handleUpload = (file: File) => {
    modifyProfilePicture.mutate({ file });
  };

  useEffect(() => {
    const firstChatroom = chatroomsQuery?.data && chatroomsQuery.data[0];

    if (firstChatroom) {
      setSelected(firstChatroom);
    }
  }, [chatroomsQuery.data]);

  return (
    <Layout loading={chatroomsQuery.isLoading || onlineUsersQuery.isLoading}>
      {chatroomsQuery.data && (
        <>
          <div className="relative flex h-full w-[14rem] min-w-[14rem] flex-col bg-gray-100 pt-2 dark:bg-gray-700">
            <div
              className="h-full overflow-hidden py-2 px-2 hover:overflow-y-auto"
              style={{
                scrollbarGutter: "stable",
              }}
            >
              <ChatroomsList
                chatrooms={chatroomsQuery.data}
                selected={selected}
                onAddChatroom={handleCreateChatroom}
                onSelect={handleSelect}
              />
            </div>
            <div className="relative flex h-24 min-h-[6rem] w-full items-center justify-center bg-gray-300 px-4 pb-6 dark:bg-gray-800">
              <UserTag isOnline={true} user={user} onImageClick={handleUpload} />
            </div>
          </div>
          <div className="flex h-full w-full flex-col">
            <div className="flex h-12 min-h-[3rem] items-center gap-4 align-middle shadow-elevation-low">
              {selected && (
                <>
                  <p className="pl-4 text-l dark:text-white"># {selected?.name}</p>
                  <p className="pt-1 text-s text-[#72767D]">{selected?.description}</p>
                </>
              )}
            </div>
            <div className="flex h-full w-full">
              <div className="flex  h-full w-full overflow-hidden">
                {selected && <Chat id={selected._id} />}
              </div>
              <div
                className="flex h-full w-[14rem] min-w-[14rem] overflow-hidden bg-gray-100 hover:overflow-y-auto dark:bg-gray-700"
                style={{
                  scrollbarGutter: "stable",
                }}
              >
                {onlineUsersQuery.data && <UsersList users={onlineUsersQuery.data} />}
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export default withAuth(Home);

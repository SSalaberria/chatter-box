import { User } from "@/features/auth";
import { UserTag } from "@/common";

interface UsersListProps {
  users: User[];
}

export function UsersList({ users }: UsersListProps) {
  return (
    <div className="flex w-full flex-col gap-4 p-4">
      {users.map((user) => (
        <UserTag key={user._id} isOnline={true} user={user} />
      ))}
    </div>
  );
}

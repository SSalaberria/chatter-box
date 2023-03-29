import Image from "next/image";

import { useAuth } from "@/features/auth";

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ComponentWithAuth(props: P) {
    const { userQuery } = useAuth();

    if (userQuery.isLoading || userQuery.isError || typeof window === "undefined") {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <Image alt="loading" height={48} src={"/icons/loading.svg"} width={48} />
        </div>
      );
    }

    return <Component {...props} user={userQuery.data} />;
  };
}

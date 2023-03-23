import { useAuth } from "@/features/auth";

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ComponentWithAuth(props: P) {
    const { userQuery } = useAuth();

    if (userQuery.isLoading || userQuery.isError || typeof window === "undefined") {
      return <div>Loading...</div>;
    }

    return <Component {...props} user={userQuery.data} />;
  };
}

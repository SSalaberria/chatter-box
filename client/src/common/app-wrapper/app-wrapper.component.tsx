import { useAuth } from "@/features/auth";

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const { userQuery } = useAuth();

  if (userQuery.isLoading || userQuery.isError || typeof window === "undefined") {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
}

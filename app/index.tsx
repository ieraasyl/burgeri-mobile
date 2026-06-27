import { LoadingScreen } from "@/components/loading-screen";
import { useAuth } from "@/providers/auth-provider";
import { Redirect } from "expo-router";

export default function Index() {
  const { isLoading, session } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <Redirect href={session ? "/history" : "/login"} />;
}


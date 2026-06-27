import { authApi } from "@/data/api";
import { ApiError, setForbiddenHandler, setUnauthorizedHandler } from "@/lib/api-client";
import type { UserSession } from "@/types/domain";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { createContext, PropsWithChildren, use, useCallback, useEffect, useMemo, useState } from "react";

type AuthContextValue = {
  session: UserSession | null;
  isLoading: boolean;
  authError?: string;
  clearAuthError: () => void;
  signIn: (input: { employeeId: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | undefined>();
  const queryClient = useQueryClient();

  const clearSession = useCallback(() => {
    queryClient.clear();
    setSession(null);
    setAuthError(undefined);
  }, [queryClient]);

  const clearAuthError = useCallback(() => {
    setAuthError(undefined);
  }, []);

  useEffect(() => {
    return setUnauthorizedHandler(() => {
      clearSession();
      router.replace("/login");
    });
  }, [clearSession]);

  useEffect(() => {
    return setForbiddenHandler((error) => {
      setAuthError(error.message);
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    authApi
      .getSession()
      .then((storedSession) => {
        if (mounted) {
          setSession(storedSession);
        }
      })
      .catch((error) => {
        if (!mounted) {
          return;
        }

        if (error instanceof ApiError && error.status === 403) {
          setAuthError(error.message);
          return;
        }

        setSession(null);
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (input: { employeeId: string; password: string }) => {
    setAuthError(undefined);
    const nextSession = await authApi.login(input);
    setSession(nextSession);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      session,
      isLoading,
      authError,
      clearAuthError,
      signIn,
      signOut
    }),
    [authError, clearAuthError, isLoading, session, signIn, signOut]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const value = use(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
}

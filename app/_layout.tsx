import "@/lib/storage";
import "react-native-gesture-handler";

import { AuthProvider } from "@/providers/auth-provider";
import { DraftProvider } from "@/providers/draft-provider";
import { colors } from "@/theme/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1
    }
  }
});

const burgeriTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.groupedBackground,
    card: colors.groupedBackground,
    text: colors.label,
    border: colors.separator,
    notification: colors.accent
  }
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={burgeriTheme}>
        <AuthProvider>
          <DraftProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="(app)" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </DraftProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

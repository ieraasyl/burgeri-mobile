import { AppButton } from "@/components/app-button";
import { LoadingScreen } from "@/components/loading-screen";
import { useAuth } from "@/providers/auth-provider";
import { colors } from "@/theme/colors";
import { Redirect } from "expo-router";
import { Stack } from "expo-router/stack";
import { Text, View } from "react-native";

export default function AppLayout() {
  const { authError, isLoading, session, signOut } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (authError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 24,
          gap: 16,
          backgroundColor: colors.groupedBackground
        }}
      >
        <Text style={{ color: colors.label, fontSize: 24, fontWeight: "900" }}>Нет доступа</Text>
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 16, lineHeight: 22 }}>
          {authError}
        </Text>
        <AppButton title="Выйти" onPress={signOut} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerLargeTitle: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.label, fontWeight: "800" },
        headerLargeTitleStyle: { color: colors.label, fontWeight: "900" },
        headerStyle: { backgroundColor: colors.groupedBackground },
        contentStyle: { backgroundColor: colors.groupedBackground }
      }}
    >
      <Stack.Screen name="history" options={{ title: "История" }} />
      <Stack.Screen name="camera" options={{ headerShown: false }} />
      <Stack.Screen name="request/product" options={{ title: "Продукт" }} />
      <Stack.Screen name="request/quantity" options={{ title: "Количество" }} />
      <Stack.Screen name="request/details" options={{ title: "Детали" }} />
      <Stack.Screen name="request/employee" options={{ title: "Сотрудник" }} />
      <Stack.Screen name="request/review" options={{ title: "Сводка" }} />
      <Stack.Screen name="request/[id]" options={{ title: "Заявка", headerLargeTitle: false }} />
    </Stack>
  );
}

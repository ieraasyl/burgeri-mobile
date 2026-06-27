import { AppButton } from "@/components/app-button";
import { colors } from "@/theme/colors";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function NotFound() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
        gap: 16,
        backgroundColor: colors.systemBackground
      }}
    >
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.label, fontSize: 28, fontWeight: "800" }}>Экран не найден</Text>
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 16, lineHeight: 22 }}>
          Такой страницы нет или заявка была удалена.
        </Text>
      </View>
      <AppButton title="Вернуться в историю" onPress={() => router.replace("/history")} />
    </ScrollView>
  );
}


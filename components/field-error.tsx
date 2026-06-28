import { colors } from "@/theme/colors";
import { Text, View } from "react-native";

export function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <View
      style={{
        borderRadius: 14,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: "rgba(217, 45, 32, 0.18)",
        backgroundColor: colors.destructiveSoft,
        paddingHorizontal: 12,
        paddingVertical: 10
      }}
    >
      <Text selectable style={{ color: colors.systemRed, fontSize: 13, fontWeight: "700", lineHeight: 18 }}>
        {message}
      </Text>
    </View>
  );
}

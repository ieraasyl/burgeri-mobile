import { colors } from "@/theme/colors";
import { Text } from "react-native";

export function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <Text selectable style={{ color: colors.systemRed, fontSize: 13, lineHeight: 18 }}>
      {message}
    </Text>
  );
}


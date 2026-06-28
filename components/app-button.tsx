import { colors } from "@/theme/colors";
import * as Haptics from "expo-haptics";
import { ActivityIndicator, Pressable, Text, ViewStyle } from "react-native";

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "destructive";
  style?: ViewStyle;
};

export function AppButton({
  title,
  onPress,
  disabled,
  loading,
  variant = "primary",
  style
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  const backgroundColor =
    variant === "primary"
      ? colors.primary
      : variant === "destructive"
        ? colors.destructiveSoft
        : colors.secondarySystemBackground;
  const textColor =
    variant === "primary" ? colors.white : variant === "destructive" ? colors.systemRed : colors.label;
  const borderColor =
    variant === "primary" ? colors.primary : variant === "destructive" ? "rgba(217, 45, 32, 0.16)" : colors.separator;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={async () => {
        if (process.env.EXPO_OS === "ios") {
          await Haptics.selectionAsync();
        }

        onPress?.();
      }}
      style={({ pressed }) => [
        {
          minHeight: 52,
          borderRadius: 999,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 18,
          backgroundColor,
          boxShadow: variant === "primary" ? "0 8px 18px rgba(27, 122, 67, 0.18)" : undefined,
          transform: [{ translateY: pressed && !isDisabled ? 1 : 0 }],
          opacity: isDisabled ? 0.45 : pressed ? 0.86 : 1
        },
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          style={{
            color: textColor,
            fontSize: 16,
            fontWeight: "800"
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

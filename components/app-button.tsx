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
      ? colors.systemBlue
      : variant === "destructive"
        ? colors.systemRed
        : colors.secondarySystemBackground;
  const textColor = variant === "secondary" ? colors.label : colors.white;

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
          borderRadius: 14,
          borderCurve: "continuous",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 18,
          backgroundColor,
          opacity: isDisabled ? 0.45 : pressed ? 0.78 : 1
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
            fontWeight: "700"
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}


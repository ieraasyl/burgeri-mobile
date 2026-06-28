import { colors } from "@/theme/colors";
import { Pressable, Text, View } from "react-native";

type RadioRowProps = {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
};

export function RadioRow({ title, subtitle, selected, onPress }: RadioRowProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 15,
        borderRadius: 18,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: selected ? "rgba(27, 122, 67, 0.32)" : colors.separator,
        backgroundColor: selected ? colors.primarySoft : colors.systemBackground,
        boxShadow: selected ? "0 6px 16px rgba(27, 122, 67, 0.08)" : undefined,
        opacity: pressed ? 0.78 : 1
      })}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: selected ? colors.primary : colors.tertiaryLabel,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {selected ? (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: colors.primary
            }}
          />
        ) : null}
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={{ color: colors.label, fontSize: 16, fontWeight: "800" }}>{title}</Text>
        {subtitle ? (
          <Text selectable style={{ color: colors.secondaryLabel, fontSize: 13, lineHeight: 18 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

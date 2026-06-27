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
        padding: 14,
        borderRadius: 14,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: selected ? colors.systemBlue : colors.separator,
        backgroundColor: selected ? "rgba(10, 132, 255, 0.08)" : colors.systemBackground,
        opacity: pressed ? 0.72 : 1
      })}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: selected ? colors.systemBlue : colors.tertiaryLabel,
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
              backgroundColor: colors.systemBlue
            }}
          />
        ) : null}
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={{ color: colors.label, fontSize: 16, fontWeight: "700" }}>{title}</Text>
        {subtitle ? (
          <Text selectable style={{ color: colors.secondaryLabel, fontSize: 13, lineHeight: 18 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}


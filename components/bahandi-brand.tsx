import { colors } from "@/theme/colors";
import { Text, View, type ViewStyle } from "react-native";

type BahandiMarkProps = {
  size?: number;
  style?: ViewStyle;
};

export function BahandiMark({ size = 44, style }: BahandiMarkProps) {
  const scale = size / 64;

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="Burgeri"
      style={[
        {
          width: size,
          height: size,
          borderRadius: 14 * scale,
          borderCurve: "continuous",
          backgroundColor: colors.charcoal,
          overflow: "hidden"
        },
        style
      ]}
    >
      <View
        style={{
          position: "absolute",
          top: 11 * scale,
          left: 9 * scale,
          width: 46 * scale,
          height: 8 * scale,
          borderRadius: 3 * scale,
          backgroundColor: colors.primary
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 11 * scale,
          left: 9 * scale,
          width: 46 * scale,
          height: 8 * scale,
          borderRadius: 3 * scale,
          backgroundColor: colors.primary
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 24 * scale,
          left: 9 * scale,
          width: 11 * scale,
          height: 16 * scale,
          borderRadius: 3 * scale,
          backgroundColor: colors.accent
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 24 * scale,
          right: 9 * scale,
          width: 11 * scale,
          height: 16 * scale,
          borderRadius: 3 * scale,
          backgroundColor: colors.accent
        }}
      />
      <Text
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 23 * scale,
          color: colors.white,
          fontSize: 27 * scale,
          lineHeight: 27 * scale,
          fontWeight: "900",
          textAlign: "center"
        }}
      >
        B
      </Text>
    </View>
  );
}

export function BurgeriWordmark({ subtitle }: { subtitle?: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <BahandiMark size={44} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: colors.label, fontSize: 18, fontWeight: "900" }}>Burgeri Ops</Text>
        {subtitle ? (
          <Text selectable style={{ color: colors.secondaryLabel, fontSize: 12, fontWeight: "600" }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

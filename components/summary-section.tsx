import { colors } from "@/theme/colors";
import { Image } from "expo-image";
import { Text, View } from "react-native";

export type SummaryRow = {
  label: string;
  value: string;
};

type SummarySectionProps = {
  photoUri?: string;
  rows: SummaryRow[];
};

export function SummarySection({ photoUri, rows }: SummarySectionProps) {
  return (
    <View style={{ gap: 14 }}>
      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          contentFit="cover"
          style={{
            width: "100%",
            aspectRatio: 1.4,
            borderRadius: 18,
            backgroundColor: colors.secondarySystemBackground
          }}
        />
      ) : (
        <View
          style={{
            width: "100%",
            aspectRatio: 1.4,
            borderRadius: 18,
            borderCurve: "continuous",
            backgroundColor: colors.secondarySystemBackground,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text style={{ color: colors.secondaryLabel, fontSize: 15 }}>Фото не сохранено</Text>
        </View>
      )}
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.separator,
          borderRadius: 18,
          borderCurve: "continuous",
          overflow: "hidden",
          backgroundColor: colors.systemBackground
        }}
      >
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={{
              gap: 4,
              padding: 14,
              borderTopWidth: index === 0 ? 0 : 1,
              borderTopColor: colors.separator
            }}
          >
            <Text style={{ color: colors.secondaryLabel, fontSize: 13 }}>{row.label}</Text>
            <Text selectable style={{ color: colors.label, fontSize: 16, fontWeight: "600" }}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

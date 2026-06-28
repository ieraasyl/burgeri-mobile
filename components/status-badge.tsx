import { formatStatus } from "@/lib/format";
import { colors } from "@/theme/colors";
import type { WriteOffStatus } from "@/types/domain";
import { Text, View } from "react-native";

export function StatusBadge({ status }: { status: WriteOffStatus }) {
  const backgroundColor =
    status === "approved"
      ? colors.successSoft
      : status === "rejected"
        ? colors.destructiveSoft
        : colors.warningSoft;
  const color =
    status === "approved"
      ? colors.systemGreen
      : status === "rejected"
        ? colors.systemRed
        : colors.systemOrange;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        alignSelf: "flex-start",
        borderRadius: 999,
        paddingHorizontal: 11,
        paddingVertical: 6,
        backgroundColor
      }}
    >
      <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: color }} />
      <Text style={{ color, fontSize: 12, fontWeight: "800" }}>{formatStatus(status)}</Text>
    </View>
  );
}

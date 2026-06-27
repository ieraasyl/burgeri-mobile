import { formatStatus } from "@/lib/format";
import { colors } from "@/theme/colors";
import type { WriteOffStatus } from "@/types/domain";
import { Text, View } from "react-native";

export function StatusBadge({ status }: { status: WriteOffStatus }) {
  const backgroundColor =
    status === "approved"
      ? "rgba(47, 143, 70, 0.13)"
      : status === "rejected"
        ? "rgba(217, 45, 32, 0.13)"
        : "rgba(196, 107, 20, 0.16)";
  const color =
    status === "approved"
      ? colors.systemGreen
      : status === "rejected"
        ? colors.systemRed
        : colors.systemOrange;

  return (
    <View
      style={{
        alignSelf: "flex-start",
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor
      }}
    >
      <Text style={{ color, fontSize: 12, fontWeight: "700" }}>{formatStatus(status)}</Text>
    </View>
  );
}


import { AppButton } from "@/components/app-button";
import { FieldError } from "@/components/field-error";
import { LoadingScreen } from "@/components/loading-screen";
import { RadioRow } from "@/components/radio-row";
import { catalogApi } from "@/data/api";
import { useRequiredDraft } from "@/hooks/use-required-draft";
import { formatPointOfSaleLocation } from "@/lib/format";
import { parseQuantity } from "@/lib/validation";
import { useDraft } from "@/providers/draft-provider";
import { colors } from "@/theme/colors";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

export default function QuantityStep() {
  const draft = useRequiredDraft();
  const { updateDraft } = useDraft();
  const [quantityText, setQuantityText] = useState(draft?.quantity ? String(draft.quantity).replace(".", ",") : "");
  const [pointOfSaleId, setPointOfSaleId] = useState(draft?.pointOfSaleId);
  const [error, setError] = useState<string | undefined>();

  const productsQuery = useQuery({
    queryKey: ["catalog", "products"],
    queryFn: catalogApi.listProducts
  });
  const pointsQuery = useQuery({
    queryKey: ["catalog", "points"],
    queryFn: catalogApi.listPointsOfSale
  });

  if (!draft || productsQuery.isLoading || pointsQuery.isLoading) {
    return <LoadingScreen />;
  }

  const product = productsQuery.data?.find((item) => item.id === draft.productId);
  const points = pointsQuery.data ?? [];

  function handleContinue() {
    const quantity = parseQuantity(quantityText);

    if (!quantity) {
      setError("Введите количество больше нуля.");
      return;
    }

    if (!pointOfSaleId) {
      setError("Выберите точку продаж.");
      return;
    }

    updateDraft({ quantity, pointOfSaleId });
    router.push("/request/details");
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 16, gap: 18, paddingBottom: 32 }}
    >
      <View
        style={{
          gap: 4,
          padding: 16,
          borderRadius: 22,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: colors.separator,
          backgroundColor: colors.systemBackground,
          boxShadow: colors.subtleShadow
        }}
      >
        <Text style={{ color: colors.secondaryLabel, fontSize: 12, fontWeight: "700" }}>Выбранный продукт</Text>
        <Text selectable style={{ color: colors.label, fontSize: 18, fontWeight: "900" }}>
          {product?.name ?? "Продукт"}
        </Text>
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 14 }}>
          Единица: {product?.unit ?? "шт"}
        </Text>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.label, fontSize: 16, fontWeight: "800" }}>Количество</Text>
        <TextInput
          value={quantityText}
          onChangeText={(value) => {
            setQuantityText(value);
            setError(undefined);
          }}
          keyboardType="decimal-pad"
          placeholder={`Например, 2 ${product?.unit ?? "шт"}`}
          placeholderTextColor={colors.tertiaryLabel}
          style={{
            minHeight: 52,
            borderRadius: 16,
            borderCurve: "continuous",
            paddingHorizontal: 14,
            color: colors.label,
            backgroundColor: colors.systemBackground,
            borderWidth: 1,
            borderColor: colors.separator,
            fontSize: 18,
            fontVariant: ["tabular-nums"]
          }}
        />
      </View>

      <View style={{ gap: 10 }}>
        <Text style={{ color: colors.label, fontSize: 16, fontWeight: "800" }}>Точка продаж</Text>
        {points.map((point) => (
          <RadioRow
            key={point.id}
            title={point.name}
            subtitle={formatPointOfSaleLocation(point)}
            selected={pointOfSaleId === point.id}
            onPress={() => {
              setPointOfSaleId(point.id);
              setError(undefined);
            }}
          />
        ))}
      </View>

      <FieldError message={error} />
      <AppButton title="Заполнить детали" onPress={handleContinue} />
    </ScrollView>
  );
}

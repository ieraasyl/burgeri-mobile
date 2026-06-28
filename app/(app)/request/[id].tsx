import { AppButton } from "@/components/app-button";
import { LoadingScreen } from "@/components/loading-screen";
import { StatusBadge } from "@/components/status-badge";
import { SummarySection, type SummaryRow } from "@/components/summary-section";
import { catalogApi, requestsApi } from "@/data/api";
import { formatDateTime, formatPointOfSale } from "@/lib/format";
import { useDraft } from "@/providers/draft-provider";
import { colors } from "@/theme/colors";
import { useQuery } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";

export default function RequestDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { resetDraft } = useDraft();

  useEffect(() => {
    resetDraft();
  }, [id, resetDraft]);

  function handleReturnToHistory() {
    router.dismissTo("/history");
  }

  const requestQuery = useQuery({
    queryKey: ["requests", "detail", id],
    queryFn: () => requestsApi.getById(id),
    enabled: Boolean(id)
  });
  const productsQuery = useQuery({
    queryKey: ["catalog", "products"],
    queryFn: catalogApi.listProducts
  });
  const pointsQuery = useQuery({
    queryKey: ["catalog", "points"],
    queryFn: catalogApi.listPointsOfSale
  });
  const employeesQuery = useQuery({
    queryKey: ["catalog", "employees"],
    queryFn: catalogApi.listEmployees
  });
  const categoriesQuery = useQuery({
    queryKey: ["catalog", "write-off-categories"],
    queryFn: catalogApi.listWriteOffCategories
  });

  if (
    requestQuery.isLoading ||
    productsQuery.isLoading ||
    pointsQuery.isLoading ||
    employeesQuery.isLoading ||
    categoriesQuery.isLoading
  ) {
    return <LoadingScreen />;
  }

  const request = requestQuery.data;

  if (!request) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20, gap: 14 }}
      >
        <Text style={{ color: colors.label, fontSize: 24, fontWeight: "900" }}>Заявка не найдена</Text>
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 16, lineHeight: 22 }}>
          Она могла быть удалена или недоступна для вашей учетной записи.
        </Text>
        <AppButton title="В историю" onPress={handleReturnToHistory} />
      </ScrollView>
    );
  }

  const product = productsQuery.data?.find((item) => item.id === request.productId);
  const point = pointsQuery.data?.find((item) => item.id === request.pointOfSaleId);
  const employee = employeesQuery.data?.find((item) => item.id === request.deductionEmployeeId);
  const category = categoriesQuery.data?.find((item) => item.id === request.writeOffCategoryId);
  const rows: SummaryRow[] = [
    { label: "Номер", value: request.requestNumber },
    { label: "Дата", value: formatDateTime(request.createdAt) },
    { label: "Продукт", value: product?.name ?? "Продукт" },
    { label: "Количество", value: `${request.quantity} ${product?.unit ?? ""}`.trim() },
    { label: "Точка", value: formatPointOfSale(point) },
    {
      label: "Тип списания",
      value: request.deductionMode === "employee" ? `С удержанием: ${employee?.name ?? "сотрудник"}` : "Без удержания"
    },
    { label: "Категория", value: category?.name ?? "Категория" },
    { label: "Комментарий", value: request.comment }
  ];

  return (
    <>
      <Stack.Screen options={{ title: request.requestNumber }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 18, paddingBottom: 32 }}
      >
        <View
          style={{
            gap: 10,
            padding: 16,
            borderRadius: 22,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: colors.separator,
            backgroundColor: colors.systemBackground,
            boxShadow: colors.subtleShadow
          }}
        >
          <StatusBadge status={request.status} />
          <Text selectable style={{ color: colors.secondaryLabel, fontSize: 15, lineHeight: 21 }}>
            Заявка отправлена в процесс проверки вне мобильного приложения.
          </Text>
        </View>

        <SummarySection photoUri={request.photoUri} rows={rows} />
        <AppButton title="Вернуться в историю" variant="secondary" onPress={handleReturnToHistory} />
      </ScrollView>
    </>
  );
}

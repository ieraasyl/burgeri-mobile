import { AppButton } from "@/components/app-button";
import { FieldError } from "@/components/field-error";
import { LoadingScreen } from "@/components/loading-screen";
import { SummarySection, type SummaryRow } from "@/components/summary-section";
import { catalogApi, requestsApi } from "@/data/api";
import { useRequiredDraft } from "@/hooks/use-required-draft";
import { formatPointOfSale } from "@/lib/format";
import { validateDraft } from "@/lib/validation";
import { useAuth } from "@/providers/auth-provider";
import { colors } from "@/theme/colors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function ReviewStep() {
  const draft = useRequiredDraft();
  const { session } = useAuth();
  const queryClient = useQueryClient();

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

  const submitMutation = useMutation({
    mutationFn: async () => requestsApi.submit(draft!),
    onSuccess: async (request) => {
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
      router.dismissTo("/history");
      router.push(`/request/${request.id}`);
    }
  });

  if (
    !draft ||
    !session ||
    productsQuery.isLoading ||
    pointsQuery.isLoading ||
    employeesQuery.isLoading ||
    categoriesQuery.isLoading
  ) {
    return <LoadingScreen />;
  }

  const validation = validateDraft(draft);
  const product = productsQuery.data?.find((item) => item.id === draft.productId);
  const point = pointsQuery.data?.find((item) => item.id === draft.pointOfSaleId);
  const employee = employeesQuery.data?.find((item) => item.id === draft.deductionEmployeeId);
  const category = categoriesQuery.data?.find((item) => item.id === draft.writeOffCategoryId);
  const rows: SummaryRow[] = [
    { label: "Продукт", value: product?.name ?? "Не выбран" },
    { label: "Количество", value: `${draft.quantity ?? "-"} ${product?.unit ?? ""}`.trim() },
    { label: "Точка", value: formatPointOfSale(point, "Не выбрана") },
    {
      label: "Тип списания",
      value:
        draft.deductionMode === "employee"
          ? `С удержанием: ${employee?.name ?? session.employee.name}`
          : "Без удержания"
    },
    { label: "Категория", value: category?.name ?? "Не выбрана" },
    { label: "Комментарий", value: draft.comment ?? "" }
  ];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 18, paddingBottom: 32 }}
    >
      <View
        style={{
          gap: 6,
          padding: 16,
          borderRadius: 22,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: colors.separator,
          backgroundColor: colors.systemBackground,
          boxShadow: colors.subtleShadow
        }}
      >
        <Text style={{ color: colors.label, fontSize: 20, fontWeight: "900" }}>Проверьте заявку</Text>
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 15, lineHeight: 21 }}>
          После отправки заявка уйдет на проверку ответственному сотруднику.
        </Text>
      </View>

      <SummarySection photoUri={draft.photoUri} rows={rows} />

      {!validation.isValid ? (
        <View style={{ gap: 6 }}>
          {validation.errors.map((error) => (
            <FieldError key={error} message={error} />
          ))}
        </View>
      ) : null}

      <FieldError message={submitMutation.error instanceof Error ? submitMutation.error.message : undefined} />
      <AppButton
        title="Отправить"
        disabled={!validation.isValid}
        loading={submitMutation.isPending}
        onPress={() => submitMutation.mutate()}
      />
    </ScrollView>
  );
}

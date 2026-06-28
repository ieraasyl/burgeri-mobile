import { AppButton } from "@/components/app-button";
import { BurgeriWordmark } from "@/components/bahandi-brand";
import { LoadingScreen } from "@/components/loading-screen";
import { StatusBadge } from "@/components/status-badge";
import { catalogApi, requestsApi } from "@/data/api";
import { formatDateTime, formatPointOfSale } from "@/lib/format";
import { useAuth } from "@/providers/auth-provider";
import { useDraft } from "@/providers/draft-provider";
import { colors } from "@/theme/colors";
import type { WriteOffRequest } from "@/types/domain";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, Stack, useNavigation } from "expo-router";
import { StackActions } from "expo-router/react-navigation";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function History() {
  const { session, signOut } = useAuth();
  const { resetDraft } = useDraft();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const requestsQuery = useQuery({
    queryKey: ["requests", "mine", session?.employee.id],
    queryFn: requestsApi.listMine,
    enabled: Boolean(session)
  });
  const productsQuery = useQuery({
    queryKey: ["catalog", "products"],
    queryFn: catalogApi.listProducts
  });
  const pointsQuery = useQuery({
    queryKey: ["catalog", "points"],
    queryFn: catalogApi.listPointsOfSale
  });

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  function handleStartRequest() {
    resetDraft();

    const state = navigation.getState();

    if (state && state.index > 0) {
      navigation.dispatch({
        ...StackActions.popToTop(),
        target: state.key
      });
    }

    router.push("/camera");
  }

  if (!session || requestsQuery.isLoading) {
    return <LoadingScreen />;
  }

  const requests = requestsQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const points = pointsQuery.data ?? [];
  const stats = {
    total: requests.length,
    pending: requests.filter((request) => request.status === "pending").length,
    approved: requests.filter((request) => request.status === "approved").length,
    rejected: requests.filter((request) => request.status === "rejected").length
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingVertical: 6 })}
            >
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: "700" }}>Выйти</Text>
            </Pressable>
          )
        }}
      />
      <View style={{ flex: 1, backgroundColor: colors.groupedBackground }}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          refreshControl={
            <RefreshControl refreshing={requestsQuery.isFetching} onRefresh={() => requestsQuery.refetch()} />
          }
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 112 + insets.bottom,
            gap: 16
          }}
        >
          <View
            style={{
              gap: 16,
              padding: 18,
              borderRadius: 24,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: colors.separator,
              backgroundColor: colors.systemBackground,
              boxShadow: colors.cardShadow
            }}
          >
            <BurgeriWordmark subtitle="Быстрые и прозрачные списания" />
            <View style={{ gap: 5 }}>
              <Text selectable style={{ color: colors.secondaryLabel, fontSize: 12, fontWeight: "700" }}>
                Сотрудник
              </Text>
              <Text selectable style={{ color: colors.label, fontSize: 19, fontWeight: "900" }}>
                {session.employee.name}
              </Text>
              <Text selectable style={{ color: colors.secondaryLabel, fontSize: 14 }}>
                {session.employee.employeeId} · {session.employee.role}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            <StatCard label="Все" value={stats.total} />
            <StatCard label="На проверке" value={stats.pending} tone="warning" />
            <StatCard label="Одобрено" value={stats.approved} tone="success" />
            <StatCard label="Отклонено" value={stats.rejected} tone="destructive" />
          </View>

          {requests.length === 0 ? (
            <View
              style={{
                paddingVertical: 48,
                paddingHorizontal: 24,
                alignItems: "center",
                gap: 8,
                borderRadius: 22,
                borderCurve: "continuous",
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: colors.separator,
                backgroundColor: colors.systemBackground
              }}
            >
              <Text style={{ color: colors.label, fontSize: 20, fontWeight: "800" }}>Заявок пока нет</Text>
              <Text selectable style={{ color: colors.secondaryLabel, textAlign: "center", lineHeight: 21 }}>
                Сделайте фото продукции, чтобы отправить первую заявку.
              </Text>
            </View>
          ) : (
            requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                productName={products.find((product) => product.id === request.productId)?.name ?? "Продукт"}
                pointName={formatPointOfSale(points.find((point) => point.id === request.pointOfSaleId))}
              />
            ))
          )}
        </ScrollView>

        <View
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: Math.max(insets.bottom, 12)
          }}
        >
          <AppButton title="Сделать фото" onPress={handleStartRequest} />
        </View>
      </View>
    </>
  );
}

function RequestCard({
  request,
  productName,
  pointName
}: {
  request: WriteOffRequest;
  productName: string;
  pointName: string;
}) {
  return (
    <Pressable
      onPress={() => router.push(`/request/${request.id}`)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.76 : 1,
        borderRadius: 22,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.separator,
        backgroundColor: colors.systemBackground,
        overflow: "hidden",
        boxShadow: colors.subtleShadow
      })}
    >
      {request.photoUri ? (
        <Image
          source={{ uri: request.photoUri }}
          contentFit="cover"
          style={{ width: "100%", height: 150, backgroundColor: colors.secondarySystemBackground }}
        />
      ) : null}
      <View style={{ padding: 15, gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: colors.label, fontSize: 17, fontWeight: "900" }}>{productName}</Text>
            <Text selectable style={{ color: colors.secondaryLabel, fontSize: 14 }}>
              {request.requestNumber} · {formatDateTime(request.createdAt)}
            </Text>
          </View>
          <StatusBadge status={request.status} />
        </View>
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 14, lineHeight: 20 }}>
          {request.quantity} · {pointName}
        </Text>
      </View>
    </Pressable>
  );
}

function StatCard({
  label,
  value,
  tone = "default"
}: {
  label: string;
  value: number;
  tone?: "default" | "warning" | "success" | "destructive";
}) {
  const color =
    tone === "warning"
      ? colors.systemOrange
      : tone === "success"
        ? colors.systemGreen
        : tone === "destructive"
          ? colors.systemRed
          : colors.label;

  return (
    <View
      style={{
        flexGrow: 1,
        flexBasis: "47%",
        gap: 6,
        padding: 14,
        borderRadius: 20,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.separator,
        backgroundColor: colors.systemBackground,
        boxShadow: colors.subtleShadow
      }}
    >
      <Text style={{ color: colors.secondaryLabel, fontSize: 12, fontWeight: "700" }}>{label}</Text>
      <Text style={{ color, fontSize: 28, fontWeight: "900", fontVariant: ["tabular-nums"] }}>{value}</Text>
    </View>
  );
}

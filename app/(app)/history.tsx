import { AppButton } from "@/components/app-button";
import { LoadingScreen } from "@/components/loading-screen";
import { StatusBadge } from "@/components/status-badge";
import { catalogApi, requestsApi } from "@/data/api";
import { formatDateTime } from "@/lib/format";
import { useAuth } from "@/providers/auth-provider";
import { colors } from "@/theme/colors";
import type { WriteOffRequest } from "@/types/domain";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function History() {
  const { session, signOut } = useAuth();
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

  if (!session || requestsQuery.isLoading) {
    return <LoadingScreen />;
  }

  const requests = requestsQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const points = pointsQuery.data ?? [];

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingVertical: 6 })}
            >
              <Text style={{ color: colors.systemBlue, fontSize: 16, fontWeight: "600" }}>Выйти</Text>
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
            gap: 14
          }}
        >
          <View
            style={{
              gap: 5,
              padding: 16,
              borderRadius: 18,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: colors.separator,
              backgroundColor: colors.systemBackground
            }}
          >
            <Text selectable style={{ color: colors.secondaryLabel, fontSize: 13 }}>
              Сотрудник
            </Text>
            <Text selectable style={{ color: colors.label, fontSize: 18, fontWeight: "800" }}>
              {session.employee.name}
            </Text>
            <Text selectable style={{ color: colors.secondaryLabel, fontSize: 14 }}>
              {session.employee.employeeId} · {session.employee.role}
            </Text>
          </View>

          {requests.length === 0 ? (
            <View style={{ paddingVertical: 48, alignItems: "center", gap: 8 }}>
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
                pointName={points.find((point) => point.id === request.pointOfSaleId)?.name ?? "Точка продаж"}
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
          <AppButton title="Сделать фото" onPress={() => router.push("/camera")} />
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
        borderRadius: 18,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.separator,
        backgroundColor: colors.systemBackground,
        overflow: "hidden"
      })}
    >
      {request.photoUri ? (
        <Image
          source={{ uri: request.photoUri }}
          contentFit="cover"
          style={{ width: "100%", height: 150, backgroundColor: colors.secondarySystemBackground }}
        />
      ) : null}
      <View style={{ padding: 14, gap: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: colors.label, fontSize: 17, fontWeight: "800" }}>{productName}</Text>
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

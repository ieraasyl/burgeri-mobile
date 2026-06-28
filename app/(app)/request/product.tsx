import { AppButton } from "@/components/app-button";
import { LoadingScreen } from "@/components/loading-screen";
import { catalogApi } from "@/data/api";
import { useRequiredDraft } from "@/hooks/use-required-draft";
import { useDraft } from "@/providers/draft-provider";
import { colors } from "@/theme/colors";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

export default function ProductStep() {
  const draft = useRequiredDraft();
  const { updateDraft } = useDraft();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["catalog", "categories"],
    queryFn: catalogApi.listCategories
  });
  const productsQuery = useQuery({
    queryKey: ["catalog", "products"],
    queryFn: catalogApi.listProducts
  });

  const categories = categoriesQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const selectedProductId = draft?.productId;
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = !categoryId || product.categoryId === categoryId;
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.sku.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [categoryId, products, query]);

  if (!draft || productsQuery.isLoading || categoriesQuery.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
    >
      <Image
        source={{ uri: draft.photoUri }}
        contentFit="cover"
        style={{
          width: "100%",
          aspectRatio: 1.65,
          borderRadius: 22,
          backgroundColor: colors.secondarySystemBackground
        }}
      />

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Поиск по названию или SKU"
        placeholderTextColor={colors.tertiaryLabel}
        returnKeyType="search"
        style={{
          minHeight: 50,
          borderRadius: 999,
          borderCurve: "continuous",
          paddingHorizontal: 14,
          color: colors.label,
          backgroundColor: colors.systemBackground,
          borderWidth: 1,
          borderColor: colors.separator,
          fontSize: 16
        }}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        <CategoryPill title="Все" selected={!categoryId} onPress={() => setCategoryId(null)} />
        {categories.map((category) => (
          <CategoryPill
            key={category.id}
            title={category.name}
            selected={categoryId === category.id}
            onPress={() => setCategoryId(category.id)}
          />
        ))}
      </ScrollView>

      <View style={{ gap: 6 }}>
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 12, fontWeight: "700" }}>
          Показано {filteredProducts.length} из {products.length}
        </Text>
      </View>

      <View style={{ gap: 10 }}>
        {filteredProducts.map((product) => (
          <Pressable
            key={product.id}
            onPress={() => updateDraft({ productId: product.id })}
            style={({ pressed }) => ({
              gap: 5,
              padding: 15,
              borderRadius: 18,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: selectedProductId === product.id ? "rgba(27, 122, 67, 0.32)" : colors.separator,
              backgroundColor: selectedProductId === product.id ? colors.primarySoft : colors.systemBackground,
              boxShadow: selectedProductId === product.id ? "0 6px 16px rgba(27, 122, 67, 0.08)" : undefined,
              opacity: pressed ? 0.76 : 1
            })}
          >
            <Text style={{ color: colors.label, fontSize: 16, fontWeight: "900" }}>{product.name}</Text>
            <Text selectable style={{ color: colors.secondaryLabel, fontSize: 13 }}>
              {product.sku} · {categories.find((category) => category.id === product.categoryId)?.name} · {product.unit}
            </Text>
          </Pressable>
        ))}
      </View>

      <AppButton title="Продолжить" disabled={!selectedProductId} onPress={() => router.push("/request/quantity")} />
    </ScrollView>
  );
}

function CategoryPill({ title, selected, onPress }: { title: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 38,
        justifyContent: "center",
        borderRadius: 999,
        paddingHorizontal: 14,
        backgroundColor: selected ? colors.primary : colors.systemBackground,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.separator,
        opacity: pressed ? 0.7 : 1
      })}
    >
      <Text style={{ color: selected ? colors.white : colors.label, fontSize: 14, fontWeight: "700" }}>{title}</Text>
    </Pressable>
  );
}

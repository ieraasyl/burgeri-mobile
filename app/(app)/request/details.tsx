import { AppButton } from "@/components/app-button";
import { FieldError } from "@/components/field-error";
import { LoadingScreen } from "@/components/loading-screen";
import { RadioRow } from "@/components/radio-row";
import { catalogApi } from "@/data/api";
import { useRequiredDraft } from "@/hooks/use-required-draft";
import { useAuth } from "@/providers/auth-provider";
import { useDraft } from "@/providers/draft-provider";
import { colors } from "@/theme/colors";
import type { DeductionMode } from "@/types/domain";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

export default function DetailsStep() {
  const draft = useRequiredDraft();
  const { session } = useAuth();
  const { updateDraft } = useDraft();
  const [deductionMode, setDeductionMode] = useState<DeductionMode>(draft?.deductionMode ?? "none");
  const [writeOffCategoryId, setWriteOffCategoryId] = useState(draft?.writeOffCategoryId);
  const [comment, setComment] = useState(draft?.comment ?? "");
  const [error, setError] = useState<string | undefined>();

  const categoriesQuery = useQuery({
    queryKey: ["catalog", "write-off-categories"],
    queryFn: catalogApi.listWriteOffCategories
  });

  if (!draft || !session || categoriesQuery.isLoading) {
    return <LoadingScreen />;
  }

  const currentDraft = draft;
  const currentSession = session;
  const categories = categoriesQuery.data ?? [];

  function selectDeductionMode(mode: DeductionMode) {
    setDeductionMode(mode);
    setError(undefined);
    updateDraft({
      deductionMode: mode,
      deductionEmployeeId:
        mode === "employee" ? currentDraft.deductionEmployeeId ?? currentSession.employee.id : null
    });
  }

  function handleContinue() {
    if (!writeOffCategoryId) {
      setError("Выберите категорию списания.");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Комментарий должен содержать минимум 10 символов.");
      return;
    }

    updateDraft({
      deductionMode,
      deductionEmployeeId:
        deductionMode === "employee" ? currentDraft.deductionEmployeeId ?? currentSession.employee.id : null,
      writeOffCategoryId,
      comment: comment.trim()
    });

    if (deductionMode === "employee") {
      router.push("/request/employee");
    } else {
      router.push("/request/review");
    }
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 16, gap: 18, paddingBottom: 32 }}
    >
      <View style={{ gap: 10 }}>
        <Text style={{ color: colors.label, fontSize: 16, fontWeight: "800" }}>Тип списания</Text>
        <RadioRow
          title="Без удержания"
          subtitle="Заявка не привязана к удержанию с сотрудника."
          selected={deductionMode === "none"}
          onPress={() => selectDeductionMode("none")}
        />
        <RadioRow
          title="С удержанием"
          subtitle={`По умолчанию выбран ${currentSession.employee.name}. Можно выбрать другого сотрудника.`}
          selected={deductionMode === "employee"}
          onPress={() => selectDeductionMode("employee")}
        />
      </View>

      <View style={{ gap: 10 }}>
        <Text style={{ color: colors.label, fontSize: 16, fontWeight: "800" }}>Категория списания</Text>
        {categories.map((category) => (
          <RadioRow
            key={category.id}
            title={category.name}
            selected={writeOffCategoryId === category.id}
            onPress={() => {
              setWriteOffCategoryId(category.id);
              setError(undefined);
            }}
          />
        ))}
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.label, fontSize: 16, fontWeight: "800" }}>Комментарий</Text>
        <TextInput
          multiline
          value={comment}
          onChangeText={(value) => {
            setComment(value);
            setError(undefined);
          }}
          placeholder="Опишите причину списания"
          placeholderTextColor={colors.tertiaryLabel}
          textAlignVertical="top"
          style={{
            minHeight: 120,
            borderRadius: 14,
            borderCurve: "continuous",
            padding: 14,
            color: colors.label,
            backgroundColor: colors.systemBackground,
            borderWidth: 1,
            borderColor: colors.separator,
            fontSize: 16,
            lineHeight: 22
          }}
        />
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 13 }}>
          Минимум 10 символов. Сейчас: {comment.trim().length}
        </Text>
      </View>

      <FieldError message={error} />
      <AppButton title="Готово" onPress={handleContinue} />
    </ScrollView>
  );
}

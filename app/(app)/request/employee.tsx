import { AppButton } from "@/components/app-button";
import { LoadingScreen } from "@/components/loading-screen";
import { RadioRow } from "@/components/radio-row";
import { catalogApi } from "@/data/api";
import { useRequiredDraft } from "@/hooks/use-required-draft";
import { useAuth } from "@/providers/auth-provider";
import { useDraft } from "@/providers/draft-provider";
import { colors } from "@/theme/colors";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

export default function EmployeeStep() {
  const draft = useRequiredDraft();
  const { session } = useAuth();
  const { updateDraft } = useDraft();
  const [query, setQuery] = useState("");
  const [employeeId, setEmployeeId] = useState(draft?.deductionEmployeeId);
  const employeesQuery = useQuery({
    queryKey: ["catalog", "employees"],
    queryFn: catalogApi.listEmployees
  });

  useEffect(() => {
    if (draft && draft.deductionMode !== "employee") {
      router.replace("/request/details");
    }
  }, [draft]);

  useEffect(() => {
    if (!employeeId && session) {
      setEmployeeId(session.employee.id);
      updateDraft({ deductionEmployeeId: session.employee.id });
    }
  }, [employeeId, session, updateDraft]);

  const employees = employeesQuery.data ?? [];
  const filteredEmployees = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return employees.filter((employee) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        employee.name.toLowerCase().includes(normalizedQuery) ||
        employee.employeeId.toLowerCase().includes(normalizedQuery) ||
        employee.role.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [employees, query]);

  if (!draft || !session || employeesQuery.isLoading) {
    return <LoadingScreen />;
  }

  function handleContinue() {
    updateDraft({ deductionEmployeeId: employeeId ?? session!.employee.id });
    router.push("/request/review");
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
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
        <Text style={{ color: colors.secondaryLabel, fontSize: 13 }}>Выбран по умолчанию</Text>
        <Text selectable style={{ color: colors.label, fontSize: 18, fontWeight: "800" }}>
          {session.employee.name}
        </Text>
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 14 }}>
          Можно выбрать другого сотрудника для удержания.
        </Text>
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Поиск сотрудника"
        placeholderTextColor={colors.tertiaryLabel}
        returnKeyType="search"
        style={{
          minHeight: 50,
          borderRadius: 14,
          borderCurve: "continuous",
          paddingHorizontal: 14,
          color: colors.label,
          backgroundColor: colors.systemBackground,
          borderWidth: 1,
          borderColor: colors.separator,
          fontSize: 16
        }}
      />

      <View style={{ gap: 10 }}>
        {filteredEmployees.map((employee) => (
          <RadioRow
            key={employee.id}
            title={employee.name}
            subtitle={`${employee.employeeId} · ${employee.role}`}
            selected={employeeId === employee.id}
            onPress={() => {
              setEmployeeId(employee.id);
              updateDraft({ deductionEmployeeId: employee.id });
            }}
          />
        ))}
      </View>

      <AppButton title="Продолжить" disabled={!employeeId} onPress={handleContinue} />
    </ScrollView>
  );
}

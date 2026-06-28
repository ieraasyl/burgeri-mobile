import { BahandiMark } from "@/components/bahandi-brand";
import { AppButton } from "@/components/app-button";
import { FieldError } from "@/components/field-error";
import { LoadingScreen } from "@/components/loading-screen";
import { useAuth } from "@/providers/auth-provider";
import { colors } from "@/theme/colors";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, TextInput, View } from "react-native";

export default function Login() {
  const { authError, clearAuthError, isLoading, session, signIn } = useAuth();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (session) {
    return <Redirect href="/history" />;
  }

  async function handleSubmit() {
    setError(undefined);
    clearAuthError();
    setSubmitting(true);

    try {
      await signIn({ employeeId, password });
      router.replace("/history");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Не удалось войти.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: colors.groupedBackground }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 20,
          gap: 28
        }}
      >
        <View style={{ gap: 18 }}>
          <BahandiMark size={56} />
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.label, fontSize: 34, fontWeight: "900", lineHeight: 38 }}>
              Burgeri Ops
            </Text>
            <Text selectable style={{ color: colors.secondaryLabel, fontSize: 17, lineHeight: 24 }}>
              Войдите в рабочее место списаний Burgeri.
            </Text>
          </View>
        </View>

        <View
          style={{
            gap: 16,
            padding: 18,
            borderRadius: 24,
            borderCurve: "continuous",
            backgroundColor: colors.systemBackground,
            borderWidth: 1,
            borderColor: colors.separator,
            boxShadow: colors.cardShadow
          }}
        >
          <View style={{ gap: 4 }}>
            <Text style={{ color: colors.label, fontSize: 18, fontWeight: "900" }}>Вход</Text>
            <Text selectable style={{ color: colors.secondaryLabel, fontSize: 13, lineHeight: 18 }}>
              Используйте личные данные сотрудника.
            </Text>
          </View>

          <View style={{ gap: 7 }}>
            <Text style={{ color: colors.secondaryLabel, fontSize: 13, fontWeight: "700" }}>Табельный номер</Text>
            <TextInput
              autoCapitalize="characters"
              autoCorrect={false}
              value={employeeId}
              onChangeText={(value) => {
                setEmployeeId(value);
                clearAuthError();
              }}
              placeholder="EMP-1001"
              placeholderTextColor={colors.tertiaryLabel}
              returnKeyType="next"
              style={{
                minHeight: 48,
                borderRadius: 14,
                borderCurve: "continuous",
                paddingHorizontal: 12,
                backgroundColor: colors.systemBackground,
                borderWidth: 1,
                borderColor: colors.separator,
                color: colors.label,
                fontSize: 16
              }}
            />
          </View>

          <View style={{ gap: 7 }}>
            <Text style={{ color: colors.secondaryLabel, fontSize: 13, fontWeight: "700" }}>Пароль</Text>
            <TextInput
              secureTextEntry
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                clearAuthError();
              }}
              placeholder="Пароль"
              placeholderTextColor={colors.tertiaryLabel}
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
              style={{
                minHeight: 48,
                borderRadius: 14,
                borderCurve: "continuous",
                paddingHorizontal: 12,
                backgroundColor: colors.systemBackground,
                borderWidth: 1,
                borderColor: colors.separator,
                color: colors.label,
                fontSize: 16
              }}
            />
          </View>

          <FieldError message={error ?? authError} />
          <AppButton
            title="Войти"
            loading={submitting}
            disabled={!employeeId.trim() || !password.trim()}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

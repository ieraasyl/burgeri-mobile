import { AppButton } from "@/components/app-button";
import { useDraft } from "@/providers/draft-provider";
import { colors } from "@/theme/colors";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import * as ImageManipulator from "expo-image-manipulator";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Camera() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [capturing, setCapturing] = useState(false);
  const { startDraft } = useDraft();
  const insets = useSafeAreaInsets();

  async function prepareUploadPhoto(uri: string) {
    const result = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 1600 } }], {
      compress: 0.68,
      format: ImageManipulator.SaveFormat.JPEG
    });

    return result.uri;
  }

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  async function takePhoto() {
    if (!cameraRef.current || capturing) {
      return;
    }

    setCapturing(true);

    try {
      if (process.env.EXPO_OS === "ios") {
        await Haptics.selectionAsync();
      }

      const photo = await cameraRef.current.takePictureAsync({ quality: 0.72 });

      if (photo?.uri) {
        const uploadUri = await prepareUploadPhoto(photo.uri);
        startDraft(uploadUri);
        router.replace("/request/product");
      }
    } finally {
      setCapturing(false);
    }
  }

  if (!permission) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.black }}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 24,
          gap: 18,
          backgroundColor: colors.systemBackground
        }}
      >
        <Text style={{ color: colors.label, fontSize: 24, fontWeight: "900" }}>Нужен доступ к камере</Text>
        <Text selectable style={{ color: colors.secondaryLabel, fontSize: 16, lineHeight: 22 }}>
          Фото обязательно для заявки на списание. Галерея и файлы в этом процессе недоступны.
        </Text>
        <AppButton title="Разрешить камеру" onPress={requestPermission} />
        <AppButton title="Назад" variant="secondary" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.black }}>
      <CameraView ref={cameraRef} facing={facing} mirror={facing === "front"} style={{ flex: 1 }} />
      <View
        style={{
          position: "absolute",
          top: insets.top + 12,
          left: 16,
          right: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => ({
            minWidth: 48,
            minHeight: 48,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.36)",
            opacity: pressed ? 0.7 : 1
          })}
        >
          <Text style={{ color: colors.white, fontSize: 26, lineHeight: 28 }}>‹</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setFacing((current) => (current === "back" ? "front" : "back"))}
          style={({ pressed }) => ({
            minWidth: 48,
            minHeight: 48,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.36)",
            opacity: pressed ? 0.7 : 1
          })}
        >
          <Text style={{ color: colors.white, fontSize: 19, fontWeight: "800" }}>↻</Text>
        </Pressable>
      </View>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: insets.bottom + 26,
          alignItems: "center"
        }}
      >
        <Pressable
          accessibilityRole="button"
          disabled={capturing}
          onPress={takePhoto}
          style={({ pressed }) => ({
            width: 78,
            height: 78,
            borderRadius: 999,
            borderWidth: 5,
            borderColor: "rgba(255, 255, 255, 0.74)",
            alignItems: "center",
            justifyContent: "center",
            opacity: capturing || pressed ? 0.7 : 1
          })}
        >
          <View
            style={{
              width: 58,
              height: 58,
              borderRadius: 999,
              backgroundColor: colors.white
            }}
          />
        </Pressable>
      </View>
    </View>
  );
}

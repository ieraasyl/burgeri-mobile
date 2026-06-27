import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";

export const authBaseURL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");

export const authClient = createAuthClient({
  baseURL: authBaseURL,
  plugins: [
    expoClient({
      scheme: "burgeri",
      storagePrefix: "burgeri",
      storage: SecureStore
    }),
    usernameClient()
  ]
});

import { useDraft } from "@/providers/draft-provider";
import { router } from "expo-router";
import { useEffect } from "react";

export function useRequiredDraft() {
  const { draft } = useDraft();

  useEffect(() => {
    if (!draft) {
      router.replace("/history");
    }
  }, [draft]);

  return draft;
}


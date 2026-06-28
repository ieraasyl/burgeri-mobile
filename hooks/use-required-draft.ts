import { useDraft } from "@/providers/draft-provider";
import { router, useIsFocused } from "expo-router";
import { useEffect } from "react";

export function useRequiredDraft() {
  const { draft } = useDraft();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && !draft) {
      router.replace("/history");
    }
  }, [draft, isFocused]);

  return draft;
}

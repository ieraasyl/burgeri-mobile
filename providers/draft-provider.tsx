import type { RequestDraft } from "@/types/domain";
import { createContext, PropsWithChildren, use, useCallback, useMemo, useState } from "react";

type DraftContextValue = {
  draft: RequestDraft | null;
  startDraft: (photoUri: string) => void;
  updateDraft: (nextDraft: Partial<RequestDraft>) => void;
  resetDraft: () => void;
};

const DraftContext = createContext<DraftContextValue | null>(null);

export function DraftProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<RequestDraft | null>(null);

  const startDraft = useCallback((photoUri: string) => {
    setDraft({
      photoUri,
      deductionMode: "none",
      deductionEmployeeId: null
    });
  }, []);

  const updateDraft = useCallback((nextDraft: Partial<RequestDraft>) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        ...nextDraft
      };
    });
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(null);
  }, []);

  const value = useMemo(
    () => ({
      draft,
      startDraft,
      updateDraft,
      resetDraft
    }),
    [draft, resetDraft, startDraft, updateDraft]
  );

  return <DraftContext value={value}>{children}</DraftContext>;
}

export function useDraft() {
  const value = use(DraftContext);

  if (!value) {
    throw new Error("useDraft must be used inside DraftProvider");
  }

  return value;
}


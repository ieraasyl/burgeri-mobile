import type { RequestDraft } from "@/types/domain";

export type DraftValidation = {
  isValid: boolean;
  errors: string[];
};

export function parseQuantity(value: string) {
  const normalized = value.replace(",", ".").trim();
  const quantity = Number(normalized);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return null;
  }

  return quantity;
}

export function validateDraft(draft: RequestDraft | null): DraftValidation {
  const errors: string[] = [];

  if (!draft?.photoUri) {
    errors.push("Сделайте фото продукции.");
  }

  if (!draft?.productId) {
    errors.push("Выберите продукт.");
  }

  if (!draft?.quantity || draft.quantity <= 0) {
    errors.push("Введите количество больше нуля.");
  }

  if (!draft?.pointOfSaleId) {
    errors.push("Выберите точку продаж.");
  }

  if (!draft?.deductionMode) {
    errors.push("Выберите тип списания.");
  }

  if (draft?.deductionMode === "employee" && !draft.deductionEmployeeId) {
    errors.push("Выберите сотрудника для удержания.");
  }

  if (!draft?.writeOffCategoryId) {
    errors.push("Выберите категорию списания.");
  }

  if (!draft?.comment || draft.comment.trim().length < 10) {
    errors.push("Комментарий должен содержать минимум 10 символов.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}


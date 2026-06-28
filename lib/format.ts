import type { PointOfSale, WriteOffStatus } from "@/types/domain";

const statusLabels: Record<WriteOffStatus, string> = {
  pending: "На проверке",
  approved: "Одобрено",
  rejected: "Отклонено"
};

export function formatStatus(status: WriteOffStatus) {
  return statusLabels[status];
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ru-KZ", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatRequestNumber(index: number) {
  return `WR-${String(index).padStart(5, "0")}`;
}

export function formatPointOfSaleLocation(point: PointOfSale) {
  return [point.city, point.address].filter(Boolean).join(", ");
}

export function formatPointOfSale(point: PointOfSale | null | undefined, fallback = "Точка продаж") {
  if (!point) {
    return fallback;
  }

  const location = formatPointOfSaleLocation(point);
  return location ? `${point.name}, ${location}` : point.name;
}

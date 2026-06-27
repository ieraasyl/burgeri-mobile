import {
  employees,
  pointsOfSale,
  productCategories,
  products,
  seededRequests,
  writeOffCategories
} from "@/data/fixtures";
import { formatRequestNumber } from "@/lib/format";
import { copyProofPhotoAsync } from "@/lib/photo-storage";
import { storage } from "@/lib/storage";
import { validateDraft } from "@/lib/validation";
import type { RequestDraft, UserSession, WriteOffRequest } from "@/types/domain";
import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "burgeri.session.v1";
const REQUESTS_KEY = "burgeri.write-off.requests.v1";

function delay<T>(value: T, timeout = 180) {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(value), timeout);
  });
}

function getStoredRequests() {
  const existing = storage.get<WriteOffRequest[] | null>(REQUESTS_KEY, null);

  if (existing) {
    return existing;
  }

  storage.set(REQUESTS_KEY, seededRequests);
  return seededRequests;
}

function setStoredRequests(requests: WriteOffRequest[]) {
  storage.set(REQUESTS_KEY, requests);
}

export const authApi = {
  async login(input: { employeeId: string; password: string }) {
    const employee = employees.find(
      (item) => item.employeeId.toLowerCase() === input.employeeId.trim().toLowerCase()
    );

    if (!employee || input.password.trim().length < 4) {
      throw new Error("Проверьте табельный номер и пароль.");
    }

    const session: UserSession = {
      employee,
      permissions: [
        "writeoff.catalog.read",
        "writeoff.photo.upload",
        "writeoff.request.create",
        "writeoff.request.read.own"
      ],
      issuedAt: new Date().toISOString()
    };

    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
    return delay(session);
  },

  async logout() {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    return delay(null);
  },

  async getSession() {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);

    if (!raw) {
      return delay<UserSession | null>(null, 80);
    }

    try {
      return delay(JSON.parse(raw) as UserSession, 80);
    } catch {
      await SecureStore.deleteItemAsync(SESSION_KEY);
      return delay<UserSession | null>(null, 80);
    }
  }
};

export const catalogApi = {
  listCategories: () => delay(productCategories),
  listProducts: () => delay(products),
  listPointsOfSale: () => delay(pointsOfSale),
  listEmployees: () => delay(employees),
  listWriteOffCategories: () => delay(writeOffCategories)
};

export const requestsApi = {
  async listMine(session: UserSession) {
    const requests = getStoredRequests()
      .filter((request) => request.createdByEmployeeId === session.employee.id)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

    return delay(requests);
  },

  async getById(id: string) {
    const request = getStoredRequests().find((item) => item.id === id) ?? null;
    return delay(request);
  },

  async submit(draft: RequestDraft, session: UserSession) {
    const validation = validateDraft(draft);

    if (!validation.isValid) {
      throw new Error(validation.errors[0] ?? "Заполните заявку.");
    }

    const currentRequests = getStoredRequests();
    const nextIndex = currentRequests.length + 1;
    const photoUri = await copyProofPhotoAsync(draft.photoUri);

    const request: WriteOffRequest = {
      id: `req-${Date.now()}`,
      requestNumber: formatRequestNumber(nextIndex),
      status: "pending",
      createdAt: new Date().toISOString(),
      createdByEmployeeId: session.employee.id,
      productId: draft.productId!,
      quantity: draft.quantity!,
      pointOfSaleId: draft.pointOfSaleId!,
      deductionMode: draft.deductionMode!,
      deductionEmployeeId:
        draft.deductionMode === "employee" ? draft.deductionEmployeeId ?? session.employee.id : null,
      writeOffCategoryId: draft.writeOffCategoryId!,
      comment: draft.comment!.trim(),
      photoUri
    };

    setStoredRequests([request, ...currentRequests]);
    return delay(request, 260);
  }
};

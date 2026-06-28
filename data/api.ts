import { authBaseURL, authClient } from "@/lib/auth-client";
import { ApiError, apiFetch, hasApiBaseUrl } from "@/lib/api-client";
import { File } from "expo-file-system";
import { validateDraft } from "@/lib/validation";
import type {
  Employee,
  PointOfSale,
  Product,
  ProductCategory,
  RequestDraft,
  UserSession,
  WriteOffCategory,
  WriteOffRequest
} from "@/types/domain";

type ListEnvelope<T> = T[] | { items: T[] };

type PhotoUploadResponse = {
  photoFileId: string;
  photoUrl?: string;
  photoUri?: string;
};

function unwrapList<T>(value: ListEnvelope<T>) {
  return Array.isArray(value) ? value : value.items;
}

function normalizeSession(value: Partial<UserSession> & Pick<UserSession, "employee">): UserSession {
  return {
    employee: value.employee,
    permissions: value.permissions ?? [],
    issuedAt: value.issuedAt ?? new Date().toISOString()
  };
}

function normalizeMediaUrl(value?: string | null) {
  if (!value) {
    return undefined;
  }

  if (/^(https?:|file:|content:|data:|blob:)/i.test(value)) {
    return value;
  }

  if (value.startsWith("/") && authBaseURL) {
    return `${authBaseURL}${value}`;
  }

  return value;
}

function normalizeRequest(request: WriteOffRequest): WriteOffRequest {
  const photoUrl = normalizeMediaUrl(request.photoUrl);
  const photoUri = normalizeMediaUrl(request.photoUri) ?? photoUrl;

  return {
    ...request,
    photoUrl,
    photoUri
  };
}

function getFileName(uri: string) {
  return uri.split("/").pop()?.split("?")[0] || `write-off-${Date.now()}.jpg`;
}

async function uploadWriteOffPhoto(photoUri: string) {
  const fileName = getFileName(photoUri);
  const formData = new FormData();
  const file = new File(photoUri);

  formData.append("file", file, fileName);

  return apiFetch<PhotoUploadResponse>("/api/mobile/files/write-off-photo", {
    method: "POST",
    body: formData
  });
}

export const authApi = {
  async login(input: { employeeId: string; password: string }) {
    if (!hasApiBaseUrl()) {
      throw new ApiError("Не задан EXPO_PUBLIC_API_URL для подключения к серверу.", 0, "MISSING_API_URL");
    }

    const response = await authClient.signIn.username({
      username: input.employeeId.trim(),
      password: input.password
    });

    if (response.error) {
      throw new ApiError(response.error.message || "Проверьте табельный номер и пароль.", response.error.status ?? 401);
    }

    return authApi.getSession();
  },

  async logout() {
    await authClient.signOut();
  },

  async getSession() {
    const session = await apiFetch<UserSession>("/api/mobile/me");
    return normalizeSession(session);
  }
};

export const catalogApi = {
  async listCategories() {
    return unwrapList(await apiFetch<ListEnvelope<ProductCategory>>("/api/mobile/catalog/product-categories"));
  },

  async listProducts() {
    return unwrapList(await apiFetch<ListEnvelope<Product>>("/api/mobile/catalog/products"));
  },

  async listPointsOfSale() {
    return unwrapList(await apiFetch<ListEnvelope<PointOfSale>>("/api/mobile/catalog/points-of-sale"));
  },

  async listEmployees() {
    return unwrapList(await apiFetch<ListEnvelope<Employee>>("/api/mobile/catalog/employees"));
  },

  async listWriteOffCategories() {
    return unwrapList(await apiFetch<ListEnvelope<WriteOffCategory>>("/api/mobile/catalog/write-off-categories"));
  }
};

export const requestsApi = {
  async listMine() {
    const requests = unwrapList(await apiFetch<ListEnvelope<WriteOffRequest>>("/api/mobile/write-off-requests/mine"));
    return requests.map(normalizeRequest);
  },

  async getById(id: string) {
    const request = await apiFetch<WriteOffRequest>(`/api/mobile/write-off-requests/${encodeURIComponent(id)}`);
    return normalizeRequest(request);
  },

  async submit(draft: RequestDraft) {
    const validation = validateDraft(draft);

    if (!validation.isValid) {
      throw new Error(validation.errors[0] ?? "Заполните заявку.");
    }

    const photo = await uploadWriteOffPhoto(draft.photoUri);
    const request = await apiFetch<WriteOffRequest>("/api/mobile/write-off-requests", {
      method: "POST",
      body: {
        photoFileId: photo.photoFileId,
        productId: draft.productId,
        quantity: draft.quantity,
        pointOfSaleId: draft.pointOfSaleId,
        deductionMode: draft.deductionMode,
        deductionEmployeeId: draft.deductionMode === "employee" ? draft.deductionEmployeeId : null,
        writeOffCategoryId: draft.writeOffCategoryId,
        comment: draft.comment?.trim()
      }
    });

    return normalizeRequest({
      ...request,
      photoUri: request.photoUri ?? request.photoUrl ?? photo.photoUri ?? photo.photoUrl
    });
  }
};

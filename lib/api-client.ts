import { authBaseURL, authClient } from "@/lib/auth-client";
import { fetch } from "expo/fetch";

type ApiErrorBody = {
  message?: string;
  error?: string;
  code?: string;
};

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: RequestInit["body"] | Record<string, unknown>;
  skipAuth?: boolean;
};

type UnauthorizedHandler = () => void | Promise<void>;
type ForbiddenHandler = (error: ApiError) => void | Promise<void>;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let forbiddenHandler: ForbiddenHandler | null = null;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;

  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = null;
    }
  };
}

export function setForbiddenHandler(handler: ForbiddenHandler | null) {
  forbiddenHandler = handler;

  return () => {
    if (forbiddenHandler === handler) {
      forbiddenHandler = null;
    }
  };
}

export function hasApiBaseUrl() {
  return Boolean(authBaseURL);
}

function getApiBaseUrl() {
  if (!authBaseURL) {
    throw new ApiError("Не задан EXPO_PUBLIC_API_URL для подключения к серверу.", 0, "MISSING_API_URL");
  }

  return authBaseURL;
}

function buildApiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

function isFormDataBody(body: ApiFetchOptions["body"]) {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function getErrorMessage(body: unknown, status: number) {
  const errorBody = body && typeof body === "object" ? (body as ApiErrorBody) : null;

  if (errorBody?.message) {
    return errorBody.message;
  }

  if (errorBody?.error) {
    return errorBody.error;
  }

  if (status === 401) {
    return "Сессия истекла. Войдите снова.";
  }

  if (status === 403) {
    return "У вашей учетной записи нет доступа к мобильному приложению.";
  }

  if (status === 404) {
    return "Данные не найдены.";
  }

  return "Не удалось выполнить запрос.";
}

async function parseResponseBody(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function notifyUnauthorized() {
  await unauthorizedHandler?.();
}

async function notifyForbidden(error: ApiError) {
  await forbiddenHandler?.(error);
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const body = options.body;
  const isFormData = isFormDataBody(body);

  if (!options.skipAuth) {
    const cookies = authClient.getCookie();

    if (cookies) {
      headers.set("Cookie", cookies);
    }
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const requestBody = body && !isFormData && typeof body === "object" ? JSON.stringify(body) : body;

  let response: Response;

  const url = buildApiUrl(path);

  try {
    response = await fetch(url, {
      ...options,
      headers,
      body: requestBody as BodyInit | null | undefined,
      credentials: "omit"
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("[apiFetch] network error", {
      method: options.method ?? "GET",
      url,
      error
    });

    throw new ApiError("Не удалось подключиться к серверу.", 0, "NETWORK_ERROR");
  }

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    const errorBody = responseBody && typeof responseBody === "object" ? (responseBody as ApiErrorBody) : null;
    const apiError = new ApiError(getErrorMessage(responseBody, response.status), response.status, errorBody?.code);

    if (response.status === 401) {
      await notifyUnauthorized();
    }

    if (response.status === 403) {
      await notifyForbidden(apiError);
    }

    throw apiError;
  }

  return responseBody as T;
}

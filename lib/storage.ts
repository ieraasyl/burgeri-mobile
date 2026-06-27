import "expo-sqlite/localStorage/install";

type KeyValueStore = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

type Listener = () => void;

const localStore = (globalThis as unknown as { localStorage: KeyValueStore }).localStorage;
const listeners = new Map<string, Set<Listener>>();

function emit(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    const value = localStore.getItem(key);

    if (!value) {
      return defaultValue;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T) {
    localStore.setItem(key, JSON.stringify(value));
    emit(key);
  },

  remove(key: string) {
    localStore.removeItem(key);
    emit(key);
  },

  subscribe(key: string, listener: Listener) {
    if (!listeners.has(key)) {
      listeners.set(key, new Set());
    }

    listeners.get(key)!.add(listener);
    return () => listeners.get(key)?.delete(listener);
  }
};


/**
 * Storage service with local persistence and event listeners
 */

export class StorageService {
  private static memoryFallback: Record<string, string> = {};

  static getItem<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const raw = localStorage.getItem(`stonic_${key}`);
      if (!raw) return defaultValue;
      return JSON.parse(raw) as T;
    } catch {
      const mem = this.memoryFallback[key];
      return mem ? (JSON.parse(mem) as T) : defaultValue;
    }
  }

  static setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`stonic_${key}`, serialized);
      }
      this.memoryFallback[key] = serialized;
    } catch {
      // Fallback
    }
  }

  static removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`stonic_${key}`);
      }
      delete this.memoryFallback[key];
    } catch {
      // Fallback
    }
  }
}

export const loadState = <T>(key: string, defaultValue: T): T => StorageService.getItem<T>(key, defaultValue);
export const saveState = <T>(key: string, value: T): void => StorageService.setItem<T>(key, value);

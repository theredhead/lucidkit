import { inject, Injectable, InjectionToken } from "@angular/core";

/**
 * Strategy interface for key-value storage.
 *
 * Implement this interface to provide alternative storage backends
 * (e.g. sessionStorage, in-memory, IndexedDB, or a server-side store).
 *
 * All methods should handle errors internally and never throw.
 */
export interface IStorageStrategy {
  /** Retrieve a value by key. Returns `null` when the key does not exist. */
  getItem(key: string): string | null;

  /** Store a value under the given key. */
  setItem(key: string, value: string): void;

  /** Remove the value for the given key. */
  removeItem(key: string): void;
}

/**
 * Default storage strategy that delegates to `localStorage`.
 *
 * All operations are wrapped in try/catch so they degrade gracefully
 * in environments where localStorage is unavailable (SSR, private
 * browsing quota exceeded, etc.).
 */
export class LocalStorageStrategy implements IStorageStrategy {
  public getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  public setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage full or unavailable — silently ignore.
    }
  }

  public removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently ignore.
    }
  }
}

/**
 * Injection token for the storage strategy.
 *
 * Defaults to {@link LocalStorageStrategy}. Override at the application
 * root to swap in a different backend:
 *
 * ```ts
 * providers: [
 *   { provide: STORAGE_STRATEGY, useClass: MyCustomStrategy },
 * ]
 * ```
 */
export const STORAGE_STRATEGY = new InjectionToken<IStorageStrategy>(
  "STORAGE_STRATEGY",
  {
    providedIn: "root",
    factory: () => new LocalStorageStrategy(),
  },
);

/**
 * Angular service for persisting key-value data.
 *
 * Delegates to the {@link IStorageStrategy} provided via
 * {@link STORAGE_STRATEGY}. Defaults to {@link LocalStorageStrategy}
 * (i.e. `localStorage`).
 *
 * Inject this service instead of calling `localStorage` directly so
 * that storage behaviour can be swapped application-wide through DI.
 *
 * @example
 * ```ts
 * export class MyComponent {
 *   private readonly storage = inject(StorageService);
 *
 *   public save(key: string, data: unknown): void {
 *     this.storage.setItem(key, JSON.stringify(data));
 *   }
 *
 *   public load(key: string): unknown | null {
 *     const raw = this.storage.getItem(key);
 *     return raw ? JSON.parse(raw) : null;
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: "root" })
export class StorageService {
  private readonly strategy = inject(STORAGE_STRATEGY);

  /** Retrieve a value by key. Returns `null` when the key does not exist. */
  public getItem(key: string): string | null {
    return this.strategy.getItem(key);
  }

  /** Store a value under the given key. */
  public setItem(key: string, value: string): void {
    this.strategy.setItem(key, value);
  }

  /** Remove the value for the given key. */
  public removeItem(key: string): void {
    this.strategy.removeItem(key);
  }
}

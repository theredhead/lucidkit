import { inject, Injectable } from "@angular/core";
import { StorageService } from "@theredhead/foundation";

import type { SavedSearch } from "./saved-search.types";

/**
 * Manages persisted saved searches through the application-wide
 * {@link StorageService} (which defaults to `localStorage` via
 * the `STORAGE_STRATEGY` injection token).
 *
 * Searches are stored as a JSON array under a key derived from the
 * caller-supplied `storageKey`. Multiple independent search views can
 * coexist by using different storage keys.
 *
 * ### Usage
 *
 * ```ts
 * private readonly savedSearchService = inject(SavedSearchService);
 *
 * // list
 * const searches = this.savedSearchService.list('my-view');
 *
 * // save
 * this.savedSearchService.save('my-view', {
 *   id: crypto.randomUUID(),
 *   name: 'Active users',
 *   descriptor: { junction: 'and', rules: [...] },
 *   savedAt: new Date().toISOString(),
 * });
 *
 * // delete
 * this.savedSearchService.remove('my-view', searchId);
 * ```
 *
 * ### Swapping the storage backend
 *
 * Override the `STORAGE_STRATEGY` token from `@theredhead/foundation`:
 *
 * ```ts
 * providers: [
 *   { provide: STORAGE_STRATEGY, useClass: MyIndexedDbStrategy },
 * ]
 * ```
 */
@Injectable({ providedIn: "root" })
export class SavedSearchService {
  private readonly storage = inject(StorageService);

  /**
   * Retrieve all saved searches for the given storage key.
   *
   * Returns an empty array when nothing is stored or when the stored
   * value cannot be parsed.
   */
  public list(storageKey: string): SavedSearch[] {
    const raw = this.storage.getItem(this.prefixedKey(storageKey));
    if (!raw) return [];

    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as SavedSearch[];
    } catch {
      return [];
    }
  }

  /**
   * Persist a saved search. If a search with the same `id` already
   * exists it is replaced; otherwise the new search is appended.
   */
  public save(storageKey: string, search: SavedSearch): void {
    const list = this.list(storageKey);
    const index = list.findIndex((s) => s.id === search.id);
    if (index >= 0) {
      list[index] = search;
    } else {
      list.push(search);
    }
    this.persist(storageKey, list);
  }

  /**
   * Remove a saved search by its `id`.
   *
   * No-op if the id does not exist.
   */
  public remove(storageKey: string, searchId: string): void {
    const list = this.list(storageKey);
    const filtered = list.filter((s) => s.id !== searchId);
    this.persist(storageKey, filtered);
  }

  /**
   * Persist a new ordering of saved searches.
   *
   * Accepts an array of IDs in the desired order. Searches whose
   * IDs are not in the list are dropped.
   */
  public reorder(storageKey: string, orderedIds: readonly string[]): void {
    const list = this.list(storageKey);
    const map = new Map(list.map((s) => [s.id, s]));
    const reordered = orderedIds
      .map((id) => map.get(id))
      .filter((s): s is SavedSearch => s !== undefined);
    this.persist(storageKey, reordered);
  }

  /**
   * Remove all saved searches for a given storage key.
   */
  public clear(storageKey: string): void {
    this.storage.removeItem(this.prefixedKey(storageKey));
  }

  // ── Private helpers ─────────────────────────────────────────────

  private prefixedKey(storageKey: string): string {
    return `ui-saved-searches:${storageKey}`;
  }

  private persist(storageKey: string, list: SavedSearch[]): void {
    this.storage.setItem(this.prefixedKey(storageKey), JSON.stringify(list));
  }
}

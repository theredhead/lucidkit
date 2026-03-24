import { inject, Injectable } from "@angular/core";

import { StorageService } from "@theredhead/foundation";

const STORAGE_PREFIX = "ui-table-col-widths";

export interface ColumnWidthEntry {
  key: string;
  widthPx: number;
}

/**
 * Service that persists user-defined column widths to localStorage
 * keyed by a table identifier.
 */
@Injectable({ providedIn: "root" })
export class ColumnResizeService {
  private readonly storage = inject(StorageService);

  private storageKey(tableId: string): string {
    return `${STORAGE_PREFIX}:${tableId}`;
  }

  /**
   * Load saved column widths for a given table.
   * Returns a map of column key → width in pixels.
   */
  load(tableId: string): Map<string, number> {
    const map = new Map<string, number>();
    if (!tableId) return map;

    try {
      const raw = this.storage.getItem(this.storageKey(tableId));
      if (raw) {
        const entries: ColumnWidthEntry[] = JSON.parse(raw);
        for (const e of entries) {
          if (
            typeof e.key === "string" &&
            typeof e.widthPx === "number" &&
            e.widthPx > 0
          ) {
            map.set(e.key, e.widthPx);
          }
        }
      }
    } catch {
      // Ignore corrupt data
    }

    return map;
  }

  /**
   * Persist current column widths for a given table.
   */
  save(tableId: string, widths: Map<string, number>): void {
    if (!tableId) return;

    const entries: ColumnWidthEntry[] = [];
    for (const [key, widthPx] of widths) {
      entries.push({ key, widthPx });
    }

    try {
      this.storage.setItem(this.storageKey(tableId), JSON.stringify(entries));
    } catch {
      // Storage full or unavailable – silently ignore
    }
  }

  /**
   * Clear saved widths for a given table.
   */
  clear(tableId: string): void {
    if (!tableId) return;
    try {
      this.storage.removeItem(this.storageKey(tableId));
    } catch {
      // Silently ignore
    }
  }
}

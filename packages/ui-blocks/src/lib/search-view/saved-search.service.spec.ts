import { TestBed } from "@angular/core/testing";
import {
  STORAGE_STRATEGY,
  type IStorageStrategy,
} from "@theredhead/lucid-foundation";

import { SavedSearchService } from "./saved-search.service";
import type { SavedSearch } from "./saved-search.types";

/** In-memory storage strategy for testing. */
class MemoryStorageStrategy implements IStorageStrategy {
  private readonly store = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  public removeItem(key: string): void {
    this.store.delete(key);
  }
}

function makeSavedSearch(
  name: string,
  overrides?: Partial<SavedSearch>,
): SavedSearch {
  return {
    id: overrides?.id ?? crypto.randomUUID(),
    name,
    descriptor: overrides?.descriptor ?? { junction: "and", rules: [] },
    savedAt: overrides?.savedAt ?? new Date().toISOString(),
  };
}

describe("SavedSearchService", () => {
  let service: SavedSearchService;
  let storage: MemoryStorageStrategy;

  beforeEach(() => {
    storage = new MemoryStorageStrategy();

    TestBed.configureTestingModule({
      providers: [
        { provide: STORAGE_STRATEGY, useValue: storage },
        SavedSearchService,
      ],
    });

    service = TestBed.inject(SavedSearchService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("list", () => {
    it("should return empty array when nothing is stored", () => {
      expect(service.list("test")).toEqual([]);
    });

    it("should return empty array for corrupted data", () => {
      storage.setItem("ui-saved-searches:test", "not json");
      expect(service.list("test")).toEqual([]);
    });

    it("should return empty array for non-array JSON", () => {
      storage.setItem("ui-saved-searches:test", '{"a":1}');
      expect(service.list("test")).toEqual([]);
    });

    it("should return stored searches", () => {
      const search = makeSavedSearch("My Search");
      storage.setItem("ui-saved-searches:test", JSON.stringify([search]));

      const result = service.list("test");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("My Search");
    });
  });

  describe("save", () => {
    it("should persist a new search", () => {
      const search = makeSavedSearch("Search A");
      service.save("test", search);

      const result = service.list("test");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Search A");
    });

    it("should append multiple searches", () => {
      service.save("test", makeSavedSearch("A"));
      service.save("test", makeSavedSearch("B"));

      expect(service.list("test")).toHaveLength(2);
    });

    it("should replace an existing search with the same id", () => {
      const search = makeSavedSearch("Original");
      service.save("test", search);

      const updated = { ...search, name: "Updated" };
      service.save("test", updated);

      const result = service.list("test");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Updated");
    });

    it("should isolate searches by storage key", () => {
      service.save("key-a", makeSavedSearch("A"));
      service.save("key-b", makeSavedSearch("B"));

      expect(service.list("key-a")).toHaveLength(1);
      expect(service.list("key-a")[0].name).toBe("A");
      expect(service.list("key-b")).toHaveLength(1);
      expect(service.list("key-b")[0].name).toBe("B");
    });
  });

  describe("remove", () => {
    it("should remove a search by id", () => {
      const search = makeSavedSearch("To Remove");
      service.save("test", search);
      expect(service.list("test")).toHaveLength(1);

      service.remove("test", search.id);
      expect(service.list("test")).toHaveLength(0);
    });

    it("should be a no-op for unknown id", () => {
      service.save("test", makeSavedSearch("Keep"));
      service.remove("test", "nonexistent");
      expect(service.list("test")).toHaveLength(1);
    });
  });

  describe("reorder", () => {
    it("should reorder searches by the given ID order", () => {
      const a = makeSavedSearch("A");
      const b = makeSavedSearch("B");
      const c = makeSavedSearch("C");
      service.save("test", a);
      service.save("test", b);
      service.save("test", c);

      service.reorder("test", [c.id, a.id, b.id]);
      const result = service.list("test");
      expect(result.map((s) => s.name)).toEqual(["C", "A", "B"]);
    });

    it("should drop searches not present in the ordered IDs", () => {
      const a = makeSavedSearch("A");
      const b = makeSavedSearch("B");
      service.save("test", a);
      service.save("test", b);

      service.reorder("test", [b.id]);
      expect(service.list("test")).toHaveLength(1);
      expect(service.list("test")[0].name).toBe("B");
    });

    it("should ignore unknown IDs", () => {
      const a = makeSavedSearch("A");
      service.save("test", a);

      service.reorder("test", [a.id, "nonexistent"]);
      expect(service.list("test")).toHaveLength(1);
    });
  });

  describe("clear", () => {
    it("should remove all searches for a key", () => {
      service.save("test", makeSavedSearch("A"));
      service.save("test", makeSavedSearch("B"));
      expect(service.list("test")).toHaveLength(2);

      service.clear("test");
      expect(service.list("test")).toHaveLength(0);
    });

    it("should not affect other keys", () => {
      service.save("key-a", makeSavedSearch("A"));
      service.save("key-b", makeSavedSearch("B"));

      service.clear("key-a");
      expect(service.list("key-a")).toHaveLength(0);
      expect(service.list("key-b")).toHaveLength(1);
    });
  });
});

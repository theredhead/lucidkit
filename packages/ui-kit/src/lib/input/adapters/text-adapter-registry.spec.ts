import { TestBed } from "@angular/core/testing";
import {
  TextAdapterRegistry,
  provideTextAdapters,
} from "./text-adapter-registry";
import type { TextAdapter } from "./text-adapter";

class StubAdapter implements TextAdapter {
  public toValue(text: string): string {
    return text;
  }
}

describe("TextAdapterRegistry", () => {
  describe("with no registrations", () => {
    let registry: TextAdapterRegistry;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      registry = TestBed.inject(TextAdapterRegistry);
    });

    it("should be injectable", () => {
      expect(registry).toBeTruthy();
    });

    it("create should return undefined for unknown key", () => {
      expect(registry.create("nonexistent")).toBeUndefined();
    });

    it("entries should return empty map", () => {
      expect(registry.entries().size).toBe(0);
    });

    it("has should return false", () => {
      expect(registry.has("anything")).toBe(false);
    });

    it("keys should yield no items", () => {
      expect([...registry.keys()]).toEqual([]);
    });
  });

  describe("with registrations via provideTextAdapters", () => {
    let registry: TextAdapterRegistry;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideTextAdapters({
            stub: { label: "Stub", create: () => new StubAdapter() },
            other: { label: "Other", create: () => new StubAdapter() },
          }),
        ],
      });
      registry = TestBed.inject(TextAdapterRegistry);
    });

    it("has should return true for registered key", () => {
      expect(registry.has("stub")).toBe(true);
    });

    it("has should return false for unregistered key", () => {
      expect(registry.has("missing")).toBe(false);
    });

    it("create should return an adapter instance", () => {
      const adapter = registry.create("stub");
      expect(adapter).toBeInstanceOf(StubAdapter);
    });

    it("create should return undefined for unregistered key", () => {
      expect(registry.create("missing")).toBeUndefined();
    });

    it("entries should contain all registrations", () => {
      const entries = registry.entries();
      expect(entries.size).toBe(2);
      expect(entries.has("stub")).toBe(true);
      expect(entries.has("other")).toBe(true);
    });

    it("entries should have correct labels", () => {
      expect(registry.entries().get("stub")?.label).toBe("Stub");
      expect(registry.entries().get("other")?.label).toBe("Other");
    });

    it("keys should yield all registered keys", () => {
      expect([...registry.keys()].sort()).toEqual(["other", "stub"]);
    });

    it("create should return a new instance each call", () => {
      const a = registry.create("stub");
      const b = registry.create("stub");
      expect(a).not.toBe(b);
    });
  });
});

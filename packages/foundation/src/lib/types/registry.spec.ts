import { describe, expect, it } from "vitest";

import {
  KeyedRegistry,
  Registry,
  type IKeyedRegistry,
  type IRegistry,
} from "./registry";

describe("Registry", () => {
  it("implements a set-like registry", () => {
    const registry: IRegistry<string> = new Registry(["alpha"]);

    expect(registry.size).toBe(1);
    expect(registry.has("alpha")).toBe(true);
    expect(registry.has("beta")).toBe(false);
    expect(registry.toArray()).toEqual(["alpha"]);
  });

  it("registers and unregisters values", () => {
    const registry = new Registry<string>();

    registry.register("alpha");
    registry.register("beta");
    registry.unregister("alpha");

    expect([...registry.values()]).toEqual(["beta"]);
  });
});

describe("KeyedRegistry", () => {
  it("implements a keyed registry", () => {
    const registry: IKeyedRegistry<number> = new KeyedRegistry([
      ["one", 1],
      ["two", 2],
    ]);

    expect(registry.size).toBe(2);
    expect(registry.has("one")).toBe(true);
    expect(registry.get("two")).toBe(2);
    expect(registry.get("three")).toBeUndefined();
  });

  it("returns independent entry snapshots", () => {
    const registry = new KeyedRegistry<string>();

    registry.register("alpha", "A");
    const snapshot = registry.toMap();
    registry.register("beta", "B");

    expect(Array.from(snapshot.entries())).toEqual([["alpha", "A"]]);
    expect(Array.from(registry.entries())).toEqual([
      ["alpha", "A"],
      ["beta", "B"],
    ]);
  });
});

import { TestBed } from "@angular/core/testing";

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  type IStorageStrategy,
  LocalStorageStrategy,
  STORAGE_STRATEGY,
  StorageService,
} from "./storage";

describe("LocalStorageStrategy", () => {
  let strategy: LocalStorageStrategy;

  beforeEach(() => {
    strategy = new LocalStorageStrategy();
    localStorage.clear();
  });

  it("should store and retrieve a value", () => {
    strategy.setItem("key", "value");
    expect(strategy.getItem("key")).toBe("value");
  });

  it("should return null for a missing key", () => {
    expect(strategy.getItem("missing")).toBeNull();
  });

  it("should remove a value", () => {
    strategy.setItem("key", "value");
    strategy.removeItem("key");
    expect(strategy.getItem("key")).toBeNull();
  });
});

describe("StorageService", () => {
  let service: StorageService;
  let mockStrategy: IStorageStrategy;
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    mockStrategy = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: STORAGE_STRATEGY, useValue: mockStrategy },
      ],
    });

    service = TestBed.inject(StorageService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should delegate getItem to the strategy", () => {
    store["foo"] = "bar";
    expect(service.getItem("foo")).toBe("bar");
    expect(mockStrategy.getItem).toHaveBeenCalledWith("foo");
  });

  it("should delegate setItem to the strategy", () => {
    service.setItem("foo", "bar");
    expect(mockStrategy.setItem).toHaveBeenCalledWith("foo", "bar");
    expect(store["foo"]).toBe("bar");
  });

  it("should delegate removeItem to the strategy", () => {
    store["foo"] = "bar";
    service.removeItem("foo");
    expect(mockStrategy.removeItem).toHaveBeenCalledWith("foo");
    expect(store["foo"]).toBeUndefined();
  });

  it("should return null for missing keys", () => {
    expect(service.getItem("missing")).toBeNull();
  });
});

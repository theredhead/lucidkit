import { TestBed } from "@angular/core/testing";
import { describe, expect, it, vi } from "vitest";

import type { ILoggingStrategy } from "../logger";
import { LoggerFactory } from "./logger-factory.service";

describe("LoggerFactory", () => {
  let factory: LoggerFactory;

  beforeEach(() => {
    factory = TestBed.inject(LoggerFactory);
  });

  it("should be provided in root", () => {
    expect(factory).toBeTruthy();
  });

  it("should create a Logger with ConsoleLoggingStrategy by default", () => {
    const logger = factory.createLogger("Test");
    expect(logger).toBeTruthy();

    // Verify it actually works end-to-end
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.log("hello");
    expect(spy).toHaveBeenCalledWith("Test: hello");
    spy.mockRestore();
  });

  it("should create a Logger with a custom strategy", () => {
    const custom: ILoggingStrategy = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    const logger = factory.createLogger("Custom", custom);
    logger.warn("attention");

    expect(custom.warn).toHaveBeenCalledWith("Custom", "attention", []);
  });
});

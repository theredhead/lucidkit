import { describe, expect, it, vi } from "vitest";

import {
  ConsoleLoggingStrategy,
  type ILoggingStrategy,
  Logger,
} from "./logger";

// ── Logger ─────────────────────────────────────────────────────────

describe("Logger", () => {
  const createSpy = (): ILoggingStrategy => ({
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  });

  it("should forward log() to the strategy with context", () => {
    const spy = createSpy();
    const log = new Logger(spy, "TestCtx");

    log.log("hello", [42]);

    expect(spy.log).toHaveBeenCalledWith("TestCtx", "hello", [42]);
  });

  it("should forward warn() to the strategy with context", () => {
    const spy = createSpy();
    const log = new Logger(spy, "Ctx");

    log.warn("caution");

    expect(spy.warn).toHaveBeenCalledWith("Ctx", "caution", []);
  });

  it("should forward error() to the strategy with context", () => {
    const spy = createSpy();
    const log = new Logger(spy, "Ctx");

    log.error("boom", ["detail"]);

    expect(spy.error).toHaveBeenCalledWith("Ctx", "boom", ["detail"]);
  });

  it("should default args to an empty array", () => {
    const spy = createSpy();
    const log = new Logger(spy, "X");

    log.log("msg");

    expect(spy.log).toHaveBeenCalledWith("X", "msg", []);
  });
});

// ── ConsoleLoggingStrategy ─────────────────────────────────────────

describe("ConsoleLoggingStrategy", () => {
  it("should call console.log with formatted context", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    const strategy = new ConsoleLoggingStrategy();

    strategy.log("Ctx", "hello", [1, 2]);

    expect(spy).toHaveBeenCalledWith("Ctx: hello", 1, 2);
    spy.mockRestore();
  });

  it("should call console.warn with formatted context", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const strategy = new ConsoleLoggingStrategy();

    strategy.warn("Ctx", "caution", []);

    expect(spy).toHaveBeenCalledWith("Ctx: caution");
    spy.mockRestore();
  });

  it("should call console.error with formatted context", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const strategy = new ConsoleLoggingStrategy();

    strategy.error("Ctx", "boom", ["extra"]);

    expect(spy).toHaveBeenCalledWith("Ctx: boom", "extra");
    spy.mockRestore();
  });
});

import "@analogjs/vitest-angular/setup-zone";
import { webcrypto } from "node:crypto";

import { TestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

// jsdom does not expose crypto.subtle — polyfill from Node's webcrypto
if (globalThis.crypto && !globalThis.crypto.subtle) {
  Object.defineProperty(globalThis.crypto, "subtle", {
    value: (webcrypto as Crypto).subtle,
    configurable: true,
  });
}

// jsdom does not implement ResizeObserver — provide a no-op stub
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

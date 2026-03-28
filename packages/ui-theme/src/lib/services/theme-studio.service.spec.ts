import { DOCUMENT } from "@angular/common";
import { TestBed } from "@angular/core/testing";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeStudioService } from "./theme-studio.service";
import { generateThemeStudioHtml } from "./theme-studio-html";
import type { ThemeStudioManifest } from "./theme-studio.service";

// ── Minimal manifest fixture ──
const TEST_MANIFEST: ThemeStudioManifest = {
  tokenCount: 2,
  namespaces: { ui: "Global tokens" },
  tokens: [
    {
      name: "--ui-accent",
      description: "Primary accent colour",
      type: "color",
      scope: "global",
      namespace: "ui",
      values: { light: "#3584e4", dark: "#7ab0ff" },
    },
    {
      name: "--ui-text",
      description: "Primary text colour",
      type: "color",
      scope: "global",
      namespace: "ui",
      values: { light: "#1d232b", dark: "#f2f6fb" },
    },
  ],
};

describe("ThemeStudioService", () => {
  let service: ThemeStudioService;
  let mockPopup: {
    closed: boolean;
    focus: ReturnType<typeof vi.fn>;
    close: ReturnType<typeof vi.fn>;
    postMessage: ReturnType<typeof vi.fn>;
    document: {
      open: ReturnType<typeof vi.fn>;
      write: ReturnType<typeof vi.fn>;
      close: ReturnType<typeof vi.fn>;
    };
  };
  let messageListeners: ((e: MessageEvent) => void)[];
  let mockDocument: Document;

  beforeEach(() => {
    messageListeners = [];
    mockPopup = {
      closed: false,
      focus: vi.fn(),
      close: vi.fn(),
      postMessage: vi.fn(),
      document: {
        open: vi.fn(),
        write: vi.fn(),
        close: vi.fn(),
      },
    };

    mockDocument = {
      documentElement: {
        classList: { contains: vi.fn(() => false) },
        style: {
          setProperty: vi.fn(),
          removeProperty: vi.fn(),
        },
      },
      defaultView: {
        screen: { width: 1920, height: 1080 },
        open: vi.fn(() => mockPopup),
        addEventListener: vi.fn((_: string, fn: (e: MessageEvent) => void) => {
          messageListeners.push(fn);
        }),
        removeEventListener: vi.fn(),
      },
    } as unknown as Document;

    TestBed.configureTestingModule({
      providers: [
        ThemeStudioService,
        { provide: DOCUMENT, useValue: mockDocument },
      ],
    });

    service = TestBed.inject(ThemeStudioService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("open", () => {
    it("should open a popup window and write HTML", async () => {
      await service.open({ manifest: TEST_MANIFEST });

      const win = mockDocument.defaultView!;
      expect(win.open).toHaveBeenCalledOnce();
      expect(mockPopup.document.open).toHaveBeenCalledOnce();
      expect(mockPopup.document.write).toHaveBeenCalledOnce();
      expect(mockPopup.document.close).toHaveBeenCalledOnce();

      // The HTML string should be written to the popup
      const writtenHtml = (mockPopup.document.write as ReturnType<typeof vi.fn>)
        .mock.calls[0][0] as string;
      expect(writtenHtml).toContain("Theme Studio");
      expect(writtenHtml).toContain("<!DOCTYPE html>");
    });

    it("should register a message listener for the studio ready signal", async () => {
      await service.open({ manifest: TEST_MANIFEST });

      expect(mockDocument.defaultView!.addEventListener).toHaveBeenCalledWith(
        "message",
        expect.any(Function),
      );
    });

    it("should send manifest when studio signals ready", async () => {
      await service.open({ manifest: TEST_MANIFEST });

      // Simulate the studio's "ready" message
      const readyEvent = {
        data: { type: "theredhead-theme-studio-ready" },
      } as MessageEvent;
      messageListeners.forEach((fn) => fn(readyEvent));

      expect(mockPopup.postMessage).toHaveBeenCalledWith(
        { type: "theredhead-theme-studio-manifest", manifest: TEST_MANIFEST },
        "*",
      );
    });

    it("should focus existing window instead of opening a new one", async () => {
      await service.open({ manifest: TEST_MANIFEST });
      mockPopup.focus.mockClear();

      await service.open({ manifest: TEST_MANIFEST });

      // open() should only be called once (the first time)
      expect(mockDocument.defaultView!.open).toHaveBeenCalledOnce();
      expect(mockPopup.focus).toHaveBeenCalledOnce();
    });

    it("should open centered with custom dimensions", async () => {
      await service.open({
        manifest: TEST_MANIFEST,
        width: 800,
        height: 600,
      });

      const features = (
        mockDocument.defaultView!.open as ReturnType<typeof vi.fn>
      ).mock.calls[0][2] as string;
      expect(features).toContain("width=800");
      expect(features).toContain("height=600");
    });

    it("should handle popup being blocked by browser", async () => {
      (
        mockDocument.defaultView!.open as ReturnType<typeof vi.fn>
      ).mockReturnValue(null);
      await service.open({ manifest: TEST_MANIFEST });
      expect(service.isOpen).toBe(false);
    });

    it("should fetch manifest from URL when not provided", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(TEST_MANIFEST),
      } as Response);

      await service.open();

      expect(fetchSpy).toHaveBeenCalledWith("assets/css-token-manifest.json");
      expect(mockPopup.document.write).toHaveBeenCalledOnce();

      fetchSpy.mockRestore();
    });

    it("should use custom manifestUrl for fetching", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(TEST_MANIFEST),
      } as Response);

      await service.open({ manifestUrl: "/custom/tokens.json" });

      expect(fetchSpy).toHaveBeenCalledWith("/custom/tokens.json");
      fetchSpy.mockRestore();
    });

    it("should cache fetched manifest for subsequent opens", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(TEST_MANIFEST),
      } as Response);

      await service.open();
      fetchSpy.mockClear();

      // Close and reopen — should use cache
      mockPopup.closed = true;
      await service.open();

      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    });

    it("should handle failed fetch gracefully", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      await service.open();

      // Open should not be called since manifest failed
      expect(mockDocument.defaultView!.open).not.toHaveBeenCalled();
      expect(service.isOpen).toBe(false);

      fetchSpy.mockRestore();
    });

    it("should handle fetch exception gracefully", async () => {
      const fetchSpy = vi
        .spyOn(globalThis, "fetch")
        .mockRejectedValue(new Error("network error"));

      await service.open();

      expect(mockDocument.defaultView!.open).not.toHaveBeenCalled();
      expect(service.isOpen).toBe(false);

      fetchSpy.mockRestore();
    });

    it("should remove message listener after receiving ready signal", async () => {
      await service.open({ manifest: TEST_MANIFEST });

      const readyEvent = {
        data: { type: "theredhead-theme-studio-ready" },
      } as MessageEvent;
      messageListeners.forEach((fn) => fn(readyEvent));

      expect(
        mockDocument.defaultView!.removeEventListener,
      ).toHaveBeenCalledWith("message", expect.any(Function));
    });
  });

  describe("close", () => {
    it("should close the popup window", async () => {
      await service.open({ manifest: TEST_MANIFEST });
      service.close();

      expect(mockPopup.close).toHaveBeenCalledOnce();
    });

    it("should be a no-op when no window is open", () => {
      expect(() => service.close()).not.toThrow();
    });
  });

  describe("isOpen", () => {
    it("should return false when no window is open", () => {
      expect(service.isOpen).toBe(false);
    });

    it("should return true when the popup is open", async () => {
      await service.open({ manifest: TEST_MANIFEST });
      expect(service.isOpen).toBe(true);
    });

    it("should return false when the popup has been closed", async () => {
      await service.open({ manifest: TEST_MANIFEST });
      mockPopup.closed = true;
      expect(service.isOpen).toBe(false);
    });
  });
});

describe("generateThemeStudioHtml", () => {
  it("should return a complete HTML document", () => {
    const html = generateThemeStudioHtml();
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");
  });

  it("should contain the search input", () => {
    const html = generateThemeStudioHtml();
    expect(html).toContain('id="searchInput"');
  });

  it("should contain export buttons", () => {
    const html = generateThemeStudioHtml();
    expect(html).toContain('id="btnExportCss"');
    expect(html).toContain('id="btnExportJson"');
    expect(html).toContain('id="btnImportJson"');
  });

  it("should contain self-contained styles", () => {
    const html = generateThemeStudioHtml();
    expect(html).toContain("<style>");
    expect(html).toContain("--ts-bg:");
    expect(html).toContain("--ts-surface:");
  });

  it("should contain the postMessage communication code", () => {
    const html = generateThemeStudioHtml();
    expect(html).toContain("theredhead-theme-studio-manifest");
    expect(html).toContain("theredhead-theme-studio-ready");
  });

  it("should contain filter controls for type, scope, and namespace", () => {
    const html = generateThemeStudioHtml();
    expect(html).toContain('id="filterType"');
    expect(html).toContain('id="filterScope"');
    expect(html).toContain('id="filterNamespace"');
  });
});

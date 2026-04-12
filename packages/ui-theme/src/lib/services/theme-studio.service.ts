import { DOCUMENT } from "@angular/common";
import { inject, Injectable } from "@angular/core";

import { LoggerFactory } from "@theredhead/lucid-foundation";

import { generateThemeStudioHtml } from "./theme-studio-html";

/**
 * Token entry matching the shape in `css-token-manifest.json`.
 * Only the fields needed by the studio are declared here.
 */
export interface ThemeStudioToken {

  /** CSS custom property name, e.g. `--ui-accent` */
  readonly name: string;

  /** Human-readable purpose description */
  readonly description: string;

  /** Value type: color, length, font, shadow, number, string, reference, keyword */
  readonly type: string;

  /** `"global"` or `"component"` */
  readonly scope: string;

  /** Namespace prefix, e.g. `"ui"`, `"cv"`, `"kb"` */
  readonly namespace: string;

  /** Default values per colour scheme */
  readonly values: { readonly light?: string; readonly dark?: string };

  /** Definition sites */
  readonly definitions?: readonly {
    readonly file: string;
    readonly line: number;
    readonly owner: string;
    readonly package: string;
    readonly mode: string;
  }[];
}

/**
 * Shape of the manifest JSON file.
 */
export interface ThemeStudioManifest {
  readonly tokenCount: number;
  readonly namespaces: Record<string, string>;
  readonly tokens: readonly ThemeStudioToken[];
}

/**
 * Configuration options for {@link ThemeStudioService.open}.
 */
export interface ThemeStudioOptions {

  /** Window width in pixels (default `960`) */
  readonly width?: number;

  /** Window height in pixels (default `720`) */
  readonly height?: number;

  /**
   * The full token manifest. When omitted the service fetches
   * `/assets/css-token-manifest.json` from the application root.
   */
  readonly manifest?: ThemeStudioManifest;

  /**
   * URL from which to fetch the manifest when `manifest` is not provided.
   * Defaults to `"assets/css-token-manifest.json"`.
   */
  readonly manifestUrl?: string;
}

/** @internal Message sent *to* the opener when the studio window is ready. */
interface StudioReadyMessage {
  readonly type: "theredhead-theme-studio-ready";
}

/**
 * Service that opens a standalone Theme Studio window.
 *
 * The studio lets developers live-edit every CSS custom property defined in the
 * `@theredhead` design-token manifest. Changes are applied in real time to the
 * opener window via `document.documentElement.style.setProperty()`. The studio
 * supports:
 *
 * - Searching / filtering tokens by name, description, type, scope, namespace
 * - Exporting an override CSS stylesheet
 * - Importing / exporting overrides as JSON
 *
 * The popup uses its own self-contained styles so it is never affected by the
 * app's theme changes.
 *
 * @example
 * ```typescript
 * import { ThemeStudioService } from '@theredhead/lucid-theme';
 *
 * export class DevToolbarComponent {
 *   private readonly studio = inject(ThemeStudioService);
 *
 *   openStudio(): void {
 *     this.studio.open();
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: "root" })
export class ThemeStudioService {
  private readonly document = inject(DOCUMENT);
  private readonly log = inject(LoggerFactory).createLogger(
    "ThemeStudioService",
  );

  /** Reference to the currently open studio popup (if any). */
  private studioWindow: Window | null = null;

  /** Cached manifest to avoid re-fetching on every open. */
  private manifestCache: ThemeStudioManifest | null = null;

  /**
   * Open the Theme Studio in a popup window.
   *
   * If the studio is already open and not closed, it will be focused instead
   * of opening a duplicate.
   *
   * @param options - Optional configuration (size, manifest data or URL).
   */
  public async open(options: ThemeStudioOptions = {}): Promise<void> {
    // Re-use existing window if still open
    if (this.studioWindow && !this.studioWindow.closed) {
      this.studioWindow.focus();
      return;
    }

    const manifest = await this.resolveManifest(options);
    if (!manifest) {
      this.log.error("Failed to load the token manifest — cannot open Theme Studio.");
      return;
    }

    const width = options.width ?? 960;
    const height = options.height ?? 720;
    const left = Math.round(
      (this.document.defaultView?.screen?.width ?? 1920) / 2 - width / 2,
    );
    const top = Math.round(
      (this.document.defaultView?.screen?.height ?? 1080) / 2 - height / 2,
    );

    const features = [
      `width=${width}`,
      `height=${height}`,
      `left=${left}`,
      `top=${top}`,
      "menubar=no",
      "toolbar=no",
      "location=no",
      "status=no",
      "resizable=yes",
      "scrollbars=yes",
    ].join(",");

    const popup = this.document.defaultView?.open("", "theredhead-theme-studio", features) ?? null;
    if (!popup) {
      this.log.warn("Popup blocked by browser. Allow popups for this site to use the Theme Studio.");
      return;
    }

    this.studioWindow = popup;
    const html = generateThemeStudioHtml();
    popup.document.open();
    popup.document.write(html);
    popup.document.close();

    // Listen for the studio's "ready" signal, then send the manifest
    const onMessage = (event: MessageEvent<StudioReadyMessage>): void => {
      if (event.data?.type === "theredhead-theme-studio-ready") {
        popup.postMessage(
          { type: "theredhead-theme-studio-manifest", manifest },
          "*",
        );
        this.document.defaultView?.removeEventListener("message", onMessage);
      }
    };
    this.document.defaultView?.addEventListener("message", onMessage);

    this.log.debug("Theme Studio opened", [manifest.tokenCount, "tokens"]);
  }

  /**
   * Close the studio window if it is currently open.
   */
  public close(): void {
    if (this.studioWindow && !this.studioWindow.closed) {
      this.studioWindow.close();
    }
    this.studioWindow = null;
  }

  /**
   * Whether the studio popup is currently open.
   */
  public get isOpen(): boolean {
    return this.studioWindow !== null && !this.studioWindow.closed;
  }

  /**
   * Resolves the manifest either from the provided options, the cache,
   * or by fetching it from the configured URL.
   */
  private async resolveManifest(
    options: ThemeStudioOptions,
  ): Promise<ThemeStudioManifest | null> {
    if (options.manifest) {
      this.manifestCache = options.manifest;
      return options.manifest;
    }

    if (this.manifestCache) {
      return this.manifestCache;
    }

    const url = options.manifestUrl ?? "assets/css-token-manifest.json";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        this.log.error("Failed to fetch token manifest", [
          response.status,
          url,
        ]);
        return null;
      }
      const data = (await response.json()) as ThemeStudioManifest;
      this.manifestCache = data;
      return data;
    } catch (err) {
      this.log.error("Error fetching token manifest", [err]);
      return null;
    }
  }
}

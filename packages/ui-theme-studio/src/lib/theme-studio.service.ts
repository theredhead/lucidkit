import { DOCUMENT } from "@angular/common";
import { computed, inject, Injectable, signal } from "@angular/core";

import { LoggerFactory } from "@theredhead/lucid-foundation";

import type {
  ThemeToken,
  ThemeTokenFilter,
  ThemeTokenManifest,
  ThemeTokenState,
} from "./theme-studio.types";

/**
 * State management service for the Theme Studio drawer.
 *
 * Loads the CSS token manifest, reads live computed values from the document
 * root, tracks per-token overrides, and applies them in real time via
 * `document.documentElement.style.setProperty`.
 *
 * Inject this wherever you need to open/close the studio or query its state.
 *
 * @example
 * ```ts
 * export class DevToolbar {
 *   private readonly studio = inject(ThemeStudioService);
 *
 *   protected open(): void { this.studio.open(); }
 * }
 * ```
 */
@Injectable({ providedIn: "root" })
export class ThemeStudioService {
  private readonly document = inject(DOCUMENT);

  private readonly log =
    inject(LoggerFactory).createLogger("ThemeStudioService");

  // ── Drawer visibility ──────────────────────────────────────────────

  /** Whether the studio drawer is currently visible. */
  public readonly isOpen = signal(false);

  /** Open the studio drawer, loading the manifest if needed. */
  public open(manifestUrl = "assets/css-token-manifest.json"): void {
    if (!this.isOpen()) {
      this.loadManifest(manifestUrl);
      this.isOpen.set(true);
    }
  }

  /** Close the studio drawer. */
  public close(): void {
    this.isOpen.set(false);
  }

  /** Toggle the studio drawer. */
  public toggle(manifestUrl = "assets/css-token-manifest.json"): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open(manifestUrl);
    }
  }

  // ── Manifest + token state ─────────────────────────────────────────

  /** Loading state for the manifest fetch. */
  public readonly loading = signal(false);

  /** Error message from the most recent manifest load attempt, or null. */
  public readonly loadError = signal<string | null>(null);

  /** Raw manifest loaded from JSON. */
  public readonly manifest = signal<ThemeTokenManifest | null>(null);

  /** All tokens with their live computed values and any studio overrides. */
  public readonly tokens = signal<ThemeTokenState[]>([]);

  // ── Filter ─────────────────────────────────────────────────────────

  /** Active filter applied to the token list. */
  public readonly filter = signal<ThemeTokenFilter>({
    query: "",
    type: "",
    scope: "",
    namespace: "",
    modifiedOnly: false,
  });

  /** Tokens after the active filter is applied. */
  public readonly filteredTokens = computed(() => {
    const { query, type, scope, namespace, modifiedOnly } = this.filter();
    const q = query.toLowerCase();

    return this.tokens().filter((t) => {
      if (modifiedOnly && t.override === null) return false;
      if (type && t.type !== type) return false;
      if (scope && t.scope !== scope) return false;
      if (namespace && t.namespace !== namespace) return false;
      if (
        q &&
        !t.name.toLowerCase().includes(q) &&
        !t.description.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  });

  /** Tokens that have been modified by the studio. */
  public readonly modifiedTokens = computed(() =>
    this.tokens().filter((t) => t.override !== null),
  );

  // ── Override API ───────────────────────────────────────────────────

  /**
   * Apply an override value to a token and update the live document.
   * Pass `null` to reset the token to its original computed value.
   */
  public setOverride(tokenName: string, value: string | null): void {
    const root = this.document.documentElement;

    if (value === null) {
      root.style.removeProperty(tokenName);
    } else {
      root.style.setProperty(tokenName, value);
    }

    this.tokens.update((list) =>
      list.map((t) => (t.name === tokenName ? { ...t, override: value } : t)),
    );
  }

  /** Reset all overrides and re-read computed values from the document. */
  public resetAll(): void {
    this.tokens().forEach((t) => {
      if (t.override !== null) {
        this.document.documentElement.style.removeProperty(t.name);
      }
    });
    this.tokens.update((list) =>
      list.map((t) => ({
        ...t,
        override: null,
        computedValue:
          this.readComputedValue(t.name) ||
          t.values.light ||
          t.values.dark ||
          "",
      })),
    );
  }

  /**
   * Export the current overrides as a CSS snippet that can be pasted into
   * a stylesheet.
   */
  public exportCss(): string {
    const lines = this.modifiedTokens()
      .map((t) => `  ${t.name}: ${t.override};`)
      .join("\n");
    return lines ? `:root {\n${lines}\n}` : "";
  }

  /**
   * Export the current overrides as a JSON object
   * (`{ "--ui-accent": "#ff0000", ... }`).
   */
  public exportJson(): Record<string, string> {
    return Object.fromEntries(
      this.modifiedTokens()
        .filter(
          (t): t is ThemeTokenState & { override: string } =>
            t.override !== null,
        )
        .map((t) => [t.name, t.override]),
    );
  }

  /**
   * Import a set of overrides from a plain object.
   * Only tokens present in the manifest are applied.
   */
  public importOverrides(overrides: Record<string, string>): void {
    const known = new Set(this.tokens().map((t) => t.name));
    Object.entries(overrides).forEach(([name, value]) => {
      if (known.has(name)) this.setOverride(name, value);
    });
  }

  // ── Private helpers ────────────────────────────────────────────────

  private loaded = false;

  private loadManifest(url: string): void {
    if (this.loaded) return;
    this.loading.set(true);
    this.loadError.set(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${url}`);
        return res.json() as Promise<ThemeTokenManifest>;
      })
      .then((manifest) => {
        this.manifest.set(manifest);
        this.tokens.set(manifest.tokens.map((t) => this.hydrateToken(t)));
        this.loaded = true;
        this.loading.set(false);
        this.log.info("Loaded token manifest", [manifest.tokenCount, "tokens"]);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        this.loadError.set(msg);
        this.loading.set(false);
        this.log.error("Failed to load token manifest", [msg]);
      });
  }

  private hydrateToken(token: ThemeToken): ThemeTokenState {
    const computedValue =
      this.readComputedValue(token.name) ||
      token.values.light ||
      token.values.dark ||
      "";
    return {
      ...token,
      computedValue,
      override: null,
    };
  }

  private readComputedValue(name: string): string {
    return getComputedStyle(this.document.documentElement)
      .getPropertyValue(name)
      .trim();
  }
}

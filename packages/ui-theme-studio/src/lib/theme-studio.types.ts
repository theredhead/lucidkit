/**
 * Token entry from `css-token-manifest.json`.
 */
export interface ThemeToken {
  /** CSS custom property name, e.g. `--ui-accent` */
  readonly name: string;

  /** Human-readable purpose description */
  readonly description: string;

  /** Value type: color | length | font | shadow | number | string | reference | keyword */
  readonly type: string;

  /** `"global"` or `"component"` */
  readonly scope: string;

  /** Namespace prefix, e.g. `"ui"`, `"cv"`, `"kb"` */
  readonly namespace: string;

  /** Default values per colour scheme */
  readonly values: { readonly light?: string; readonly dark?: string };

  /** Definition sites (optional) */
  readonly definitions?: readonly {
    readonly file: string;
    readonly line: number;
    readonly owner: string;
    readonly package: string;
    readonly mode: string;
  }[];
}

/**
 * Shape of the token manifest JSON file.
 */
export interface ThemeTokenManifest {
  readonly tokenCount: number;
  readonly namespaces: Record<string, string>;
  readonly tokens: readonly ThemeToken[];
}

/**
 * A token paired with its current live value and any override applied by
 * the studio.
 */
export interface ThemeTokenState extends ThemeToken {
  /** The current computed value from `document.documentElement` */
  readonly computedValue: string;

  /** Override applied by the studio, or `null` if unmodified */
  override: string | null;
}

/**
 * Active filter state for the token list.
 */
export interface ThemeTokenFilter {
  readonly query: string;
  readonly type: string;
  readonly scope: string;
  readonly namespace: string;
  readonly modifiedOnly: boolean;
}

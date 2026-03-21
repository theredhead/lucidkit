/**
 * Result of validating raw text through a {@link TextAdapter}.
 */
export interface TextAdapterValidationResult {
  /** Whether the current text is considered valid. */
  readonly valid: boolean;

  /** Human-readable error messages (empty when valid). */
  readonly errors: readonly string[];
}

/**
 * Adapter interface for transforming raw text in a {@link UIInput}.
 *
 * When an adapter is attached to `UIInput`, the component exposes two models:
 * - `text` – the raw string displayed in the native element
 * - `value` – the processed string produced by the adapter
 *
 * Adapters may also provide prefix/suffix icons, respond to clicks on them,
 * and expose validation via {@link validate}.
 *
 * @example
 * ```ts
 * readonly adapter = new EmailTextAdapter();
 * ```
 * ```html
 * <ui-input [adapter]="adapter" [(text)]="email" />
 * ```
 */
export interface TextAdapter {
  /**
   * Transform the raw text into a processed value.
   *
   * Called whenever the `text` model changes. The result is emitted via the
   * `value` model.
   *
   * @param text Raw text from the input element.
   * @returns Processed value string.
   */
  toValue(text: string): string;

  /**
   * Validate the raw text and return a result indicating whether
   * the current input is valid.
   *
   * When present, `UIInput` exposes a `valid` signal and applies the
   * `ui-input--invalid` host class when validation fails.
   *
   * @param text Raw text from the input element.
   * @returns Validation result with `valid` flag and error messages.
   */
  validate?(text: string): TextAdapterValidationResult;

  /**
   * Optional SVG icon content to display before the input.
   *
   * Should be a Lucide SVG inner-content string
   * (e.g. `UIIcons.Lucide.Text.AtSign`).
   */
  prefixIcon?: string;

  /**
   * Optional SVG icon content to display after the input.
   */
  suffixIcon?: string;

  /**
   * Called when the user clicks the prefix icon.
   *
   * @param text Current raw text value.
   */
  onPrefixClick?(text: string): void;

  /**
   * Called when the user clicks the suffix icon.
   *
   * @param text Current raw text value.
   */
  onSuffixClick?(text: string): void;
}

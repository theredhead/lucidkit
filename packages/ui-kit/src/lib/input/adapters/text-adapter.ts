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
 * - `text` – the raw, unaltered string as typed by the user
 * - `value` – the processed string produced by {@link toValue}, also what
 *   is displayed in the native input element
 *
 * The `value` model is the primary output: it is the adapted version of the
 * raw input and should be used by all consuming code (forms, bindings,
 * persistence). The `text` model is a backing store that preserves the
 * original keystrokes for adapters that need access to the unprocessed input
 * (e.g. for validation or undo).
 *
 * Adapters may also provide prefix/suffix icons, respond to clicks on them,
 * and expose validation via {@link validate}.
 *
 * @example
 * ```ts
 * readonly adapter = new UppercaseTextAdapter();
 * // User types "hello" → text() = "hello", value() = "HELLO"
 * // The input field displays "HELLO"
 * ```
 * ```html
 * <ui-input [adapter]="adapter" [(value)]="name" />
 * ```
 */
export interface TextAdapter {
  /**
   * Transform the raw text into the adapted value.
   *
   * Called on every input event. The result is stored in the `value` model
   * **and** written back to the native input element, so the user sees the
   * adapted text. The original keystrokes are preserved in the `text` model.
   *
   * @param text Raw text from the input element.
   * @returns Adapted value string (displayed in the field and emitted via `value`).
   */
  toValue(text: string): string;

  /**
   * Validate the raw text and return a result indicating whether
   * the current input is valid.
   *
   * When present, `UIInput` exposes a `valid` signal and applies the
   * `invalid` host class when validation fails.
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

  /**
   * Optional HTML input `type` attribute value.
   *
   * When set, this overrides the `type` input on `UIInput` so the
   * adapter can request the semantically correct native input type
   * (e.g. `"email"`, `"tel"`, `"url"`).
   */
  inputType?: string;

  /**
   * Optional display formatter.
   *
   * When present, the native input element shows the string returned by
   * this method instead of the raw {@link toValue} result. Use this to
   * add locale-specific formatting (e.g. thousands separators) while
   * keeping `value()` as the clean programmatic output.
   *
   * @param value The adapted value produced by {@link toValue}.
   * @returns Formatted string to display in the input element.
   */
  toDisplayValue?(value: string): string;
}

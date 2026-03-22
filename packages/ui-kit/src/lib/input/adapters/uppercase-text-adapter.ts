import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/**
 * Adapter that converts all input text to uppercase.
 *
 * Useful for fields that require uppercase values (e.g. VIN numbers,
 * licence plates, IATA codes).
 *
 * @example
 * ```ts
 * readonly adapter = new UppercaseTextAdapter();
 * // "abc123" → value "ABC123"
 * ```
 */
export class UppercaseTextAdapter implements TextAdapter {
  public toValue(text: string): string {
    return text.toUpperCase();
  }

  public validate(_text: string): TextAdapterValidationResult {
    return { valid: true, errors: [] };
  }
}

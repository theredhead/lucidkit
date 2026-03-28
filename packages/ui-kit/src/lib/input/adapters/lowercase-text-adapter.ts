import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/**
 * Adapter that converts all input text to lowercase.
 *
 * Useful for fields that require lowercase values (e.g. usernames,
 * email-style identifiers, tags).
 *
 * @example
 * ```ts
 * readonly adapter = new LowercaseTextAdapter();
 * // "ABC123" → value "abc123"
 * ```
 */
export class LowercaseTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Text.CaseLower;

  public toValue(text: string): string {
    return text.toLowerCase();
  }

  public validate(_text: string): TextAdapterValidationResult {
    return { valid: true, errors: [] };
  }
}

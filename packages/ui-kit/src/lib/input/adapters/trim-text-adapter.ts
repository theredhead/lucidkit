import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/**
 * Adapter for trimming and normalising whitespace.
 *
 * Trims leading/trailing whitespace and collapses multiple consecutive
 * spaces into a single space. Shows an eraser prefix icon.
 *
 * @example
 * ```ts
 * readonly adapter = new TrimTextAdapter();
 * // "  hello   world  " → value "hello world"
 * ```
 */
export class TrimTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Text.Eraser;

  public toValue(text: string): string {
    return text.trim().replace(/\s{2,}/g, " ");
  }

  public validate(_text: string): TextAdapterValidationResult {
    return { valid: true, errors: [] };
  }
}

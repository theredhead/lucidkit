import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/**
 * Adapter for hexadecimal values.
 *
 * Strips whitespace and optional `0x` / `0X` prefix, lowercases the result,
 * and validates that the input contains only hexadecimal digits.
 * Shows a binary prefix icon.
 *
 * @example
 * ```ts
 * readonly adapter = new HexadecimalTextAdapter();
 * // "0xFF" → value "ff"
 * ```
 */
export class HexadecimalTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Development.Binary;

  public toValue(text: string): string {
    const trimmed = text.trim();
    const stripped = trimmed.replace(/^0[xX]/, "");
    return stripped.toLowerCase();
  }

  public validate(text: string): TextAdapterValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: true, errors: [] };
    }
    const stripped = trimmed.replace(/^0[xX]/, "");
    if (!stripped || !/^[0-9a-fA-F]+$/.test(stripped)) {
      return {
        valid: false,
        errors: ["Value must contain only hexadecimal digits (0-9, a-f)"],
      };
    }
    return { valid: true, errors: [] };
  }
}

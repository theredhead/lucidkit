import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/** @internal Hex colour pattern: #RGB, #RRGGBB, or #RRGGBBAA */
const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/**
 * Adapter for CSS hex colour values.
 *
 * Strips whitespace, prepends `#` when missing, and lowercases the result.
 * Validates that the input is a valid hex colour (`#RGB`, `#RRGGBB`, or
 * `#RRGGBBAA`).
 *
 * Shows a palette prefix icon.
 *
 * @example
 * ```ts
 * readonly adapter = new ColorTextAdapter();
 * // "FF6600" → value "#ff6600"
 * ```
 */
export class ColorTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Design.Palette;

  public toValue(text: string): string {
    const trimmed = text.trim();
    if (!trimmed) {
      return "";
    }
    const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    return withHash.toLowerCase();
  }

  public validate(text: string): TextAdapterValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: true, errors: [] };
    }
    const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    if (!HEX_COLOR_PATTERN.test(withHash)) {
      return {
        valid: false,
        errors: [
          "Value must be a valid hex colour (#RGB, #RRGGBB, or #RRGGBBAA)",
        ],
      };
    }
    return { valid: true, errors: [] };
  }
}

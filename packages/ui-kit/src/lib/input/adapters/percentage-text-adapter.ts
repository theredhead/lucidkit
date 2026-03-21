import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/**
 * Adapter for percentage values.
 *
 * Strips whitespace and a trailing `%` sign. Validates that the input is
 * a valid number. The value produced is the bare numeric string without
 * the `%` sign.
 *
 * Shows a percent prefix icon.
 *
 * @example
 * ```ts
 * readonly adapter = new PercentageTextAdapter();
 * // "75.5%" → value "75.5"
 * ```
 */
export class PercentageTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Finance.Percent;

  public toValue(text: string): string {
    const trimmed = text.trim().replace(/%$/, "").trim();
    return trimmed;
  }

  public validate(text: string): TextAdapterValidationResult {
    const cleaned = text.trim().replace(/%$/, "").trim();
    if (!cleaned) {
      return { valid: true, errors: [] };
    }
    if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(cleaned)) {
      return {
        valid: false,
        errors: ["Value must be a valid percentage number"],
      };
    }
    return { valid: true, errors: [] };
  }
}

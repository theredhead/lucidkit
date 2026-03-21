import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/**
 * Adapter for integer values.
 *
 * Strips whitespace and validates that the input is a valid integer
 * (optional leading sign, digits only). Shows a hash prefix icon.
 */
export class IntegerTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Social.Hash;

  public toValue(text: string): string {
    return text.trim();
  }

  public validate(text: string): TextAdapterValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: true, errors: [] };
    }
    if (!/^[+-]?\d+$/.test(trimmed)) {
      return { valid: false, errors: ["Value must be a valid integer"] };
    }
    return { valid: true, errors: [] };
  }
}

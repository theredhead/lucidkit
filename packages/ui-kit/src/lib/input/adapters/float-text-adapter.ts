import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/**
 * Adapter for floating-point numbers.
 *
 * Strips whitespace and validates that the input is a valid floating-point
 * number (optional sign, digits, optional decimal point, optional exponent).
 * Shows a calculator prefix icon.
 */
export class FloatTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Math.Calculator;

  public toValue(text: string): string {
    return text.trim();
  }

  public validate(text: string): TextAdapterValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: true, errors: [] };
    }
    if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(trimmed)) {
      return {
        valid: false,
        errors: ["Value must be a valid floating-point number"],
      };
    }
    return { valid: true, errors: [] };
  }
}

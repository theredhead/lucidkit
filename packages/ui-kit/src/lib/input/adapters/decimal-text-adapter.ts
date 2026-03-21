import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/**
 * Adapter for decimal numbers with configurable precision.
 *
 * Strips whitespace and validates that the input is a valid decimal number
 * with at most the specified number of decimal places. Shows a decimals
 * prefix icon.
 *
 * @example
 * ```ts
 * // Allow up to 4 decimal places
 * readonly adapter = new DecimalTextAdapter(4);
 * ```
 */
export class DecimalTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Math.DecimalsArrowRight;

  /**
   * @param maxDecimals Maximum number of digits after the decimal point.
   *   Defaults to `2`.
   */
  public constructor(public readonly maxDecimals = 2) {}

  public toValue(text: string): string {
    return text.trim();
  }

  public validate(text: string): TextAdapterValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: true, errors: [] };
    }

    const pattern = new RegExp(`^[+-]?\\d+(\\.\\d{0,${this.maxDecimals}})?$`);

    if (!pattern.test(trimmed)) {
      const errors: string[] = [];
      if (!/^[+-]?\d+(\.\d+)?$/.test(trimmed)) {
        errors.push("Value must be a valid decimal number");
      } else {
        errors.push(
          `Value must have at most ${this.maxDecimals} decimal place${this.maxDecimals === 1 ? "" : "s"}`,
        );
      }
      return { valid: false, errors };
    }
    return { valid: true, errors: [] };
  }
}

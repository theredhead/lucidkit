import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/**
 * Adapter for credit card numbers.
 *
 * Strips whitespace, dashes, and spaces. Validates that the input contains
 * 13–19 digits and passes the Luhn checksum. The value produced contains
 * only digits.
 *
 * Shows a credit-card prefix icon.
 *
 * @example
 * ```ts
 * readonly adapter = new CreditCardTextAdapter();
 * // "4111 1111 1111 1111" → value "4111111111111111"
 * ```
 */
export class CreditCardTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Account.CreditCard;

  public toValue(text: string): string {
    return text.replace(/\D/g, "");
  }

  public validate(text: string): TextAdapterValidationResult {
    const digits = this.toValue(text);
    if (!digits) {
      return { valid: true, errors: [] };
    }

    if (!/^\d{13,19}$/.test(digits)) {
      return {
        valid: false,
        errors: ["Value must contain 13–19 digits"],
      };
    }

    if (!CreditCardTextAdapter.luhn(digits)) {
      return {
        valid: false,
        errors: ["Card number fails checksum validation"],
      };
    }

    return { valid: true, errors: [] };
  }

  /** @internal Luhn checksum algorithm. */
  private static luhn(digits: string): boolean {
    let sum = 0;
    let alternate = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let n = parseInt(digits[i], 10);
      if (alternate) {
        n *= 2;
        if (n > 9) {
          n -= 9;
        }
      }
      sum += n;
      alternate = !alternate;
    }
    return sum % 10 === 0;
  }
}

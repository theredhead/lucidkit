import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/**
 * Weights for IBAN mod-97 check used in ISO 7064.
 * @internal
 */
function mod97(iban: string): number {
  let remainder = iban;
  while (remainder.length > 2) {
    const block = remainder.slice(0, 9);
    remainder =
      (parseInt(block, 10) % 97).toString() + remainder.slice(block.length);
  }
  return parseInt(remainder, 10) % 97;
}

/**
 * Adapter for IBAN (International Bank Account Number) values.
 *
 * Strips whitespace and non-alphanumeric characters, uppercases letters,
 * and inserts spaces every 4 characters for display. Validates against
 * the ISO 13616 mod-97 checksum.
 *
 * Shows a landmark (bank) prefix icon.
 *
 * @example
 * ```ts
 * readonly adapter = new IbanTextAdapter();
 * // "DE89 3704 0044 0532 0130 00" → value "DE89370400440532013000"
 * // displayed as "DE89 3704 0044 0532 0130 00"
 * ```
 */
export class IbanTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Finance.Landmark;

  public toValue(text: string): string {
    return text.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  }

  public toDisplayValue(value: string): string {
    if (!value) return "";
    return value.replace(/(.{4})/g, "$1 ").trim();
  }

  public validate(text: string): TextAdapterValidationResult {
    const cleaned = this.toValue(text);
    if (!cleaned) return { valid: true, errors: [] };

    if (cleaned.length < 15 || cleaned.length > 34) {
      return {
        valid: false,
        errors: ["IBAN must be between 15 and 34 characters"],
      };
    }

    if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(cleaned)) {
      return {
        valid: false,
        errors: [
          "IBAN must start with a 2-letter country code and 2 check digits",
        ],
      };
    }

    // ISO 7064 mod-97 check: move first 4 chars to end, convert letters to digits
    const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
    const numeric = rearranged.replace(/[A-Z]/g, (ch) =>
      (ch.charCodeAt(0) - 55).toString(),
    );
    if (mod97(numeric) !== 1) {
      return {
        valid: false,
        errors: ["Invalid IBAN checksum"],
      };
    }

    return { valid: true, errors: [] };
  }
}

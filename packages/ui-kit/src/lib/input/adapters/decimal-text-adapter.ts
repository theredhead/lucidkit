import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/**
 * Adapter for decimal numbers with configurable precision.
 *
 * Strips non-numeric characters, parses to a number, and displays with
 * locale-based formatting up to the configured decimal places.
 * Shows a decimals prefix icon.
 *
 * @example
 * ```ts
 * // Allow up to 4 decimal places
 * readonly adapter = new DecimalTextAdapter(4);
 * ```
 */
export class DecimalTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Math.DecimalsArrowRight;

  private readonly locale: string;
  private readonly thousands: string;
  private readonly decimal: string;

  /**
   * @param maxDecimals Maximum number of digits after the decimal point.
   *   Defaults to `2`.
   * @param locale BCP 47 locale tag. Defaults to `navigator.language`.
   */
  public constructor(
    public readonly maxDecimals = 2,
    locale?: string,
  ) {
    this.locale = locale ?? navigator?.language ?? "en";
    const parts = new Intl.NumberFormat(this.locale).formatToParts(1234.5);
    this.thousands = parts.find((p) => p.type === "group")?.value ?? "";
    this.decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";
  }

  public toValue(text: string): string {
    let s = text;
    if (this.thousands) s = s.split(this.thousands).join("");
    if (this.decimal !== ".") s = s.replace(this.decimal, ".");
  const cleaned = s.replace(/[^0-9.+-]/g, "");
    if (!cleaned || cleaned === "-" || cleaned === "." || cleaned === "-.")
      return cleaned;
    const n = Number(cleaned);
    if (!Number.isFinite(n)) return cleaned;
    if (cleaned.includes(".") && n.toString() !== cleaned) return cleaned;
    return n.toString();
  }

  public toDisplayValue(value: string): string {
    if (!value) return "";
    const n = Number(value);
    if (!Number.isFinite(n)) return value;
    if (value.includes(".") && n.toString() !== value) return value;
    return n.toLocaleString(this.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: this.maxDecimals,
    });
  }

  public validate(text: string): TextAdapterValidationResult {
    const raw = text.trim();
    if (!raw) return { valid: true, errors: [] };
    let normalized = this.thousands ? raw.split(this.thousands).join("") : raw;
    if (this.decimal !== ".")
      normalized = normalized.replace(this.decimal, ".");
    const cleaned = normalized.replace(/[^0-9.+-]/g, "");
    if (cleaned !== normalized) {
      return {
        valid: false,
        errors: ["Value must be a valid decimal number"],
      };
    }
    const pattern = new RegExp(`^[+-]?\\d+(\\.\\d{0,${this.maxDecimals}})?$`);
    if (!pattern.test(cleaned)) {
      const errors: string[] = [];
      if (!/^[+-]?\d+(\.\d+)?$/.test(cleaned)) {
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

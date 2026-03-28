import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/**
 * Adapter for integer values.
 *
 * Strips non-numeric characters, parses to a number, and displays with
 * locale-based thousands separators. The `value` output is the clean
 * integer string. Shows a hash prefix icon.
 *
 * @example
 * ```ts
 * readonly adapter = new IntegerTextAdapter();
 * // User types "1234" → value() = "1234", displays "1,234" (en-US)
 * ```
 */
export class IntegerTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Social.Hash;

  private readonly locale: string;
  private readonly thousands: string;

  public constructor(locale?: string) {
    this.locale = locale ?? navigator?.language ?? "en";
    const parts = new Intl.NumberFormat(this.locale).formatToParts(1234.5);
    this.thousands = parts.find((p) => p.type === "group")?.value ?? "";
  }

  public toValue(text: string): string {
    const sign = text.startsWith("-") ? "-" : "";
    const digits = text.replace(/[^0-9]/g, "");
    if (!digits) return "";
    const n = Number(sign + digits);
    return Number.isFinite(n) ? n.toString() : "";
  }

  public toDisplayValue(value: string): string {
    if (!value) return "";
    const n = Number(value);
    if (!Number.isFinite(n)) return value;
    return n.toLocaleString(this.locale, { maximumFractionDigits: 0 });
  }

  public validate(text: string): TextAdapterValidationResult {
    const raw = text.trim();
    if (!raw) return { valid: true, errors: [] };
    const normalized = this.thousands
      ? raw.split(this.thousands).join("")
      : raw;
    if (!/^[+-]?\d+$/.test(normalized)) {
      return { valid: false, errors: ["Value must be a valid integer"] };
    }
    return { valid: true, errors: [] };
  }
}

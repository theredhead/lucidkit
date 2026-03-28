import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/**
 * Adapter for floating-point numbers.
 *
 * Strips non-numeric characters (except `.`, `e`, `E`, `+`, `-`), parses
 * to a number, and displays with locale-based formatting. The `value`
 * output is the clean number string. Shows a calculator prefix icon.
 */
export class FloatTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Math.Calculator;

  private readonly locale: string;
  private readonly thousands: string;
  private readonly decimal: string;

  public constructor(locale?: string) {
    this.locale = locale ?? navigator?.language ?? "en";
    const parts = new Intl.NumberFormat(this.locale).formatToParts(1234.5);
    this.thousands = parts.find((p) => p.type === "group")?.value ?? "";
    this.decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";
  }

  public toValue(text: string): string {
    let s = text;
    if (this.thousands) s = s.split(this.thousands).join("");
    if (this.decimal !== ".") s = s.replace(this.decimal, ".");
  const cleaned = s.replace(/[^0-9.eE+-]/g, "");
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
    return n.toLocaleString(this.locale, { maximumFractionDigits: 20 });
  }

  public validate(text: string): TextAdapterValidationResult {
    const raw = text.trim();
    if (!raw) return { valid: true, errors: [] };
    let normalized = this.thousands ? raw.split(this.thousands).join("") : raw;
    if (this.decimal !== ".")
      normalized = normalized.replace(this.decimal, ".");
    const cleaned = normalized.replace(/[^0-9.eE+-]/g, "");
    if (cleaned !== normalized) {
      return {
        valid: false,
        errors: ["Value must be a valid floating-point number"],
      };
    }
    if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(cleaned)) {
      return {
        valid: false,
        errors: ["Value must be a valid floating-point number"],
      };
    }
    return { valid: true, errors: [] };
  }
}

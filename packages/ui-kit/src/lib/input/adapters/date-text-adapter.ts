import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/** @internal ISO 8601 date pattern: YYYY-MM-DD */
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Adapter for ISO 8601 date strings (`YYYY-MM-DD`).
 *
 * Strips whitespace and validates that the input matches the ISO date
 * format and represents a real calendar date. The value produced is the
 * trimmed string.
 *
 * Shows a calendar prefix icon.
 *
 * @example
 * ```ts
 * readonly adapter = new DateTextAdapter();
 * // "2025-12-31" → value "2025-12-31"
 * ```
 */
export class DateTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Time.Calendar;

  public toValue(text: string): string {
    return text.trim();
  }

  public validate(text: string): TextAdapterValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: true, errors: [] };
    }
    if (!ISO_DATE_PATTERN.test(trimmed)) {
      return {
        valid: false,
        errors: ["Value must be a valid date in YYYY-MM-DD format"],
      };
    }
    // Verify the date is a real calendar date
    const parsed = new Date(`${trimmed}T00:00:00`);
    if (isNaN(parsed.getTime())) {
      return {
        valid: false,
        errors: ["Value must be a valid calendar date"],
      };
    }
    // Verify round-trip (catches invalid dates like 2025-02-30)
    const [year, month, day] = trimmed.split("-").map(Number);
    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() + 1 !== month ||
      parsed.getDate() !== day
    ) {
      return {
        valid: false,
        errors: ["Value must be a valid calendar date"],
      };
    }
    return { valid: true, errors: [] };
  }
}

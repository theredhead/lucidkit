import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/** @internal 24-hour time pattern: HH:MM or HH:MM:SS */
const TIME_PATTERN = /^\d{2}:\d{2}(:\d{2})?$/;

/**
 * Adapter for 24-hour time strings (`HH:MM` or `HH:MM:SS`).
 *
 * Strips whitespace and validates that the input is a valid time with
 * hours 00–23, minutes 00–59, and optional seconds 00–59.
 *
 * Shows a clock prefix icon.
 *
 * @example
 * ```ts
 * readonly adapter = new TimeTextAdapter();
 * // "14:30" → value "14:30"
 * ```
 */
export class TimeTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Time.Clock;

  public toValue(text: string): string {
    return text.trim();
  }

  public validate(text: string): TextAdapterValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: true, errors: [] };
    }
    if (!TIME_PATTERN.test(trimmed)) {
      return {
        valid: false,
        errors: ["Value must be a valid time in HH:MM or HH:MM:SS format"],
      };
    }
    const parts = trimmed.split(":").map(Number);
    const [hours, minutes] = parts;
    const seconds = parts[2] ?? 0;

    if (hours > 23) {
      return { valid: false, errors: ["Hours must be between 00 and 23"] };
    }
    if (minutes > 59) {
      return { valid: false, errors: ["Minutes must be between 00 and 59"] };
    }
    if (seconds > 59) {
      return { valid: false, errors: ["Seconds must be between 00 and 59"] };
    }

    return { valid: true, errors: [] };
  }
}

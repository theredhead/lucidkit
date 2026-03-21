import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/**
 * Adapter for cron expression strings.
 *
 * Supports standard 5-field cron expressions
 * (`minute hour day-of-month month day-of-week`) and optionally a
 * 6th field for seconds. Validates field count and allowed characters.
 *
 * Shows a timer prefix icon.
 *
 * @example
 * ```ts
 * readonly adapter = new CronTextAdapter();
 * // "0 * * * *" → value "0 * * * *" (every hour)
 * ```
 */
export class CronTextAdapter implements TextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Time.Timer;

  public toValue(text: string): string {
    return text.trim();
  }

  public validate(text: string): TextAdapterValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: true, errors: [] };
    }

    const fields = trimmed.split(/\s+/);
    if (fields.length < 5 || fields.length > 6) {
      return {
        valid: false,
        errors: [
          "Cron expression must have 5 fields (or 6 with seconds): " +
            "minute hour day-of-month month day-of-week",
        ],
      };
    }

    // Each field may contain digits, *, /, -, , and named months/days
    const fieldPattern = /^[\d*,/\-?LW#a-zA-Z]+$/;
    for (let i = 0; i < fields.length; i++) {
      if (!fieldPattern.test(fields[i])) {
        return {
          valid: false,
          errors: [
            `Cron field ${i + 1} contains invalid characters: "${fields[i]}"`,
          ],
        };
      }
    }

    return { valid: true, errors: [] };
  }
}

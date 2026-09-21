import { UIIcons } from "../../icon/lucide-icons.generated";
import type { TextAdapter, TextAdapterValidationResult } from "./text-adapter";

/** Display mode for time values. */
export type TimeFormat = "24" | "12";

/** Options for {@link TimeTextAdapter}. */
export interface TimeTextAdapterOptions {
  /** Display mode. Defaults to 24-hour time. */
  readonly mode?: TimeFormat;
}

interface ParsedTime {
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
}

/**
 * Adapter for compact time entry with 24-hour output by default.
 *
 * Accepts `930`, `0930`, `17:30`, and, in 12-hour mode, `930p` or
 * `9:30 PM`. Complete digit sequences are normalized to `HH:MM` or
 * `h:MM AM/PM` without requiring the user to type a colon.
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
  public readonly formatOnBlur = true;
  private readonly mode: TimeFormat;

  public constructor(options: TimeTextAdapterOptions = {}) {
    this.mode = options.mode ?? "24";
  }

  public toValue(text: string): string {
    const trimmed = text.trim();
    if (!trimmed) return "";

    const parsed = this.parse(trimmed);
    return parsed ? this.format(parsed) : trimmed;
  }

  public toDisplayValue(value: string): string {
    const parsed = this.parse(value);
    return parsed ? this.format(parsed) : value;
  }

  public validate(text: string): TextAdapterValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: true, errors: [] };
    }
    if (!this.parse(trimmed)) {
      return {
        valid: false,
        errors: [
          this.mode === "24"
            ? "Value must be a valid time in HH:MM or HH:MM:SS format"
            : "Value must be a valid time in h:MM AM/PM format",
        ],
      };
    }

    return { valid: true, errors: [] };
  }

  private parse(text: string): ParsedTime | null {
    const upper = text.toUpperCase();
    const meridiemMatch = upper.match(/\s*(AM|PM|A|P)$/);
    const suffix = meridiemMatch?.[1];
    const meridiem = suffix === "A" ? "AM" : suffix === "P" ? "PM" : suffix;
    const body = meridiemMatch
      ? upper.slice(0, meridiemMatch.index).trim()
      : upper;

    if (this.mode === "24" && meridiem) return null;
    if (/[^\d:]/.test(body)) return null;

    const parts = body.includes(":")
      ? body.split(":")
      : this.splitCompact(body);
    if (!parts) return null;

    const [hourText, minuteText, secondText] = parts;
    if (!hourText || !minuteText || (secondText !== undefined && !secondText)) {
      return null;
    }

    const hours = Number(hourText);
    const minutes = Number(minuteText);
    const seconds = Number(secondText ?? 0);
    if (![hours, minutes, seconds].every(Number.isInteger)) return null;
    if (minutes > 59 || seconds > 59) return null;

    let normalizedHours = hours;
    if (meridiem) {
      if (hours < 1 || hours > 12) return null;
      normalizedHours = hours % 12 + (meridiem === "PM" ? 12 : 0);
    } else if (hours > 23) {
      return null;
    }

    return { hours: normalizedHours, minutes, seconds };
  }

  private splitCompact(body: string): [string, string, string?] | null {
    if (!/^\d+$/.test(body)) return null;
    if (body.length === 3) return [body.slice(0, 1), body.slice(1)];
    if (body.length === 4) return [body.slice(0, 2), body.slice(2)];
    if (body.length === 6) {
      return [body.slice(0, 2), body.slice(2, 4), body.slice(4)];
    }
    return null;
  }

  private format(time: ParsedTime): string {
    const hours = String(time.hours).padStart(2, "0");
    const minutes = String(time.minutes).padStart(2, "0");
    const seconds = String(time.seconds).padStart(2, "0");
    const withSeconds = time.seconds > 0 ? `:${seconds}` : "";

    if (this.mode === "24") return `${hours}:${minutes}${withSeconds}`;

    const meridiem = time.hours >= 12 ? "PM" : "AM";
    const displayHours = time.hours % 12 || 12;
    return `${displayHours}:${minutes}${withSeconds} ${meridiem}`;
  }
}

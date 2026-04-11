/** Display format for UICountdown. */
export type CountdownFormat = "dhms" | "hms" | "ms";

/** Whether to count down to a target or count up from zero. */
export type CountdownMode = "countdown" | "elapsed";

/** Parsed time parts emitted by UICountdown. */
export interface CountdownParts {
  /** Days remaining / elapsed. */
  readonly days: number;
  /** Hours (0–23). */
  readonly hours: number;
  /** Minutes (0–59). */
  readonly minutes: number;
  /** Seconds (0–59). */
  readonly seconds: number;
  /** Total seconds remaining / elapsed. */
  readonly totalSeconds: number;
}

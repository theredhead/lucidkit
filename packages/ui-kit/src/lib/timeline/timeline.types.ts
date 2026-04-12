import type { Type } from "@angular/core";

/**
 * Template context exposed to each event rendered by the timeline.
 *
 * @typeParam T - The event data type.
 */
export interface TimelineEventContext<T> {

  /** The event object (also available via the implicit `let-event` variable). */
  readonly $implicit: T;

  /** Zero-based index of this event in the timeline. */
  readonly index: number;

  /** Whether this is the first event. */
  readonly first: boolean;

  /** Whether this is the last event. */
  readonly last: boolean;
}

/**
 * A function that returns the Angular component class to render for a
 * given timeline event.
 *
 * The returned component receives the event data via an `event` input.
 *
 * @typeParam T - The event data type.
 */
export type TimelineComponentResolver<T> = (event: T) => Type<unknown>;

/**
 * Orientation of the timeline layout.
 *
 * - `'vertical'`   — events flow top to bottom (default).
 * - `'horizontal'` — events flow left to right.
 */
export type TimelineOrientation = "vertical" | "horizontal";

/**
 * Controls how event nodes alternate sides in a vertical timeline.
 *
 * - `'start'`      — all events on the start (left in LTR) side.
 * - `'end'`        — all events on the end (right in LTR) side.
 * - `'alternate'`  — events alternate between start and end.
 */
export type TimelineAlignment = "start" | "end" | "alternate";

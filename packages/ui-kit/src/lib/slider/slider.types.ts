/** Slider mode: single thumb or range (two thumbs). */
export type SliderMode = "single" | "range";

/** Value emitted by the slider. Single mode: number, range mode: [min, max]. */
export type SliderValue = number | readonly [number, number];

/**
 * A tick mark on the slider track.
 *
 * - `value` — the numeric position on the slider scale.
 * - `label` — optional text rendered below the tick. When omitted,
 *   only a visual tick mark is shown (no label).
 */
export interface SliderTick {
  readonly value: number;
  readonly label?: string;
}

/** Slider mode: single thumb or range (two thumbs). */
export type SliderMode = "single" | "range";

/** Value emitted by the slider. Single mode: number, range mode: [min, max]. */
export type SliderValue = number | readonly [number, number];

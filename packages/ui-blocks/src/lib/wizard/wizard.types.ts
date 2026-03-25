/**
 * Emitted when the active step changes.
 */
export interface StepChangeEvent {
  /** Index of the step being left. */
  readonly previousIndex: number;

  /** Index of the step being entered. */
  readonly currentIndex: number;
}

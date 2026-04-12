import type { OutputEmitterRef, Type } from "@angular/core";

import type { TextAdapter } from "./text-adapter";

/**
 * Interface that popup panel components must implement to be used
 * with a {@link PopupTextAdapter} inside {@link UIInput}.
 *
 * The panel communicates back to the input through two outputs:
 * - `valueSelected` — the user picked a value (e.g. a date)
 * - `closeRequested` — the popup should close (e.g. Escape key)
 *
 * UIInput subscribes to both and handles text/value sync and
 * popup lifecycle automatically.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface InputPopupPanel<T = any> {

  /** Emitted when the user selects a value from the popup. */
  readonly valueSelected: OutputEmitterRef<T>;

  /** Emitted when the popup should close without a selection. */
  readonly closeRequested: OutputEmitterRef<void>;
}

/**
 * Extension of {@link TextAdapter} that provides a popup panel component.
 *
 * When a `PopupTextAdapter` is attached to {@link UIInput}, the input
 * renders a suffix icon that toggles an absolutely-positioned popup
 * containing the adapter's {@link popupPanel} component.
 *
 * @example
 * ```ts
 * readonly dateAdapter = new DateInputAdapter({ format: 'dd/MM/yyyy' });
 * ```
 * ```html
 * <ui-input [adapter]="dateAdapter" [(text)]="dateText" placeholder="dd/MM/yyyy" />
 * ```
 */
export interface PopupTextAdapter extends TextAdapter {

  /** The Angular component type to render inside the popup. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly popupPanel: Type<InputPopupPanel<any>>;

  /**
   * Returns a map of inputs to set on the popup panel component.
   *
   * Called each time the popup opens. The `currentText` parameter
   * carries the current raw text from the input so the adapter can
   * forward it to the panel (e.g. as `currentValue`).
   *
   * @param currentText Raw text currently in the input.
   */
  popupInputs?(currentText: string): Record<string, unknown>;

  /**
   * Convert a value emitted by the popup panel's `valueSelected`
   * output into the raw text string for the input.
   *
   * @param value The value emitted by the panel.
   * @returns Formatted text string.
   */
  fromPopupValue(value: unknown): string;
}

/**
 * Type guard that checks whether a {@link TextAdapter} is a
 * {@link PopupTextAdapter} with popup panel support.
 */
export function isPopupAdapter(
  adapter: TextAdapter,
): adapter is PopupTextAdapter {
  return (
    "popupPanel" in adapter &&
    typeof (adapter as PopupTextAdapter).popupPanel === "function"
  );
}

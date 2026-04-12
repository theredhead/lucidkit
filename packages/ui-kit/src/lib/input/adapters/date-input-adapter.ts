import type { Type } from "@angular/core";

import type { DateFormat } from "../../date-picker/date-picker.types";
import {
  formatDate,
  getLocaleFirstDayOfWeek,
  getLocaleFormat,
  parseDate,
} from "../../date-picker/date-picker.utils";
import { UICalendarPanel } from "../../calendar-panel/calendar-panel.component";
import { UIIcons } from "../../icon/lucide-icons.generated";
import type { InputPopupPanel } from "./popup-text-adapter";
import type { PopupTextAdapter } from "./popup-text-adapter";
import type { TextAdapterValidationResult } from "./text-adapter";

/**
 * Options for configuring a {@link DateInputAdapter}.
 */
export interface DateInputAdapterOptions {

  /** Date format for display and parsing. Defaults to locale detection. */
  readonly format?: DateFormat;

  /** Minimum selectable date. */
  readonly min?: Date | null;

  /** Maximum selectable date. */
  readonly max?: Date | null;

  /** First day of the week (`0` = Sunday … `6` = Saturday). Defaults to locale detection. */
  readonly firstDayOfWeek?: number;
}

/**
 * Text adapter with calendar popup for date input.
 *
 * Provides date validation, formatting, a calendar suffix icon, and an
 * inline calendar panel popup when used with {@link UIInput}.
 *
 * Replaces the standalone `UIDatePicker` component — consumers get the
 * same functionality by attaching this adapter to a plain `<ui-input>`.
 *
 * @example
 * ```ts
 * readonly dateAdapter = new DateInputAdapter({ format: 'dd/MM/yyyy' });
 * ```
 * ```html
 * <ui-input [adapter]="dateAdapter" [(text)]="birthday" placeholder="dd/MM/yyyy" />
 * ```
 */
export class DateInputAdapter implements PopupTextAdapter {

  /** Calendar icon displayed as a prefix button. */
  public readonly prefixIcon = UIIcons.Lucide.Time.Calendar;

  /** Calendar panel component rendered inside the popup. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly popupPanel: Type<InputPopupPanel<any>> = UICalendarPanel;

  private readonly _format: DateFormat;
  private readonly _min: Date | null;
  private readonly _max: Date | null;
  private readonly _firstDayOfWeek: number;

  public constructor(options?: DateInputAdapterOptions) {
    this._format = options?.format ?? getLocaleFormat();
    this._min = options?.min ?? null;
    this._max = options?.max ?? null;
    this._firstDayOfWeek = options?.firstDayOfWeek ?? getLocaleFirstDayOfWeek();
  }

  /** Transform raw text to a trimmed value string. */
  public toValue(text: string): string {
    return text.trim();
  }

  /** Validate the raw text as a date in the configured format. */
  public validate(text: string): TextAdapterValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: true, errors: [] };
    }

    const parsed = parseDate(trimmed, this._format);
    if (!parsed) {
      return {
        valid: false,
        errors: [`Expected date format: ${this._format}`],
      };
    }

    if (this._min) {
      const min = new Date(this._min);
      min.setHours(0, 0, 0, 0);
      const d = new Date(parsed);
      d.setHours(0, 0, 0, 0);
      if (d < min) {
        return { valid: false, errors: ["Date is before the minimum"] };
      }
    }

    if (this._max) {
      const max = new Date(this._max);
      max.setHours(0, 0, 0, 0);
      const d = new Date(parsed);
      d.setHours(0, 0, 0, 0);
      if (d > max) {
        return { valid: false, errors: ["Date is after the maximum"] };
      }
    }

    return { valid: true, errors: [] };
  }

  /** Inputs to pass to the calendar panel when the popup opens. */
  public popupInputs(currentText: string): Record<string, unknown> {
    return {
      currentValue: currentText,
      format: this._format,
      min: this._min,
      max: this._max,
      firstDayOfWeek: this._firstDayOfWeek,
    };
  }

  /** Convert a Date selected in the calendar to a formatted string. */
  public fromPopupValue(value: unknown): string {
    return formatDate(value as Date, this._format);
  }
}

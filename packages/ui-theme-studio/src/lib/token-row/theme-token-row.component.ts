import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";

import type { ThemeTokenState } from "../theme-studio.types";
import { ThemeStudioService } from "../theme-studio.service";

/**
 * A single row in the theme-studio token list.
 *
 * Displays the token name, description, type/scope chips, and an editor
 * appropriate to the token type (colour swatch + text, or plain text).
 */
@Component({
  selector: "ui-theme-token-row",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./theme-token-row.component.html",
  styleUrl: "./theme-token-row.component.scss",
  host: {
    class: "ui-theme-token-row",
    "[class.modified]": "token().override !== null",
  },
})
export class UIThemeTokenRow {
  // ── Inputs / outputs ───────────────────────────────────────────────

  /** The token to display and edit. */
  public readonly token = input.required<ThemeTokenState>();

  /** Emitted when the user changes the token value. */
  public readonly valueChange = output<string>();

  /** Emitted when the user clicks Reset. */
  public readonly resetToken = output<void>();

  // ── Private ────────────────────────────────────────────────────────

  private readonly studio = inject(ThemeStudioService);

  // ── Protected helpers ──────────────────────────────────────────────

  /** The effective displayed value: override if set, else computed. */
  protected get displayValue(): string {
    const t = this.token();
    return t.override !== null ? t.override : t.computedValue;
  }

  /** `true` when the token type is `"color"`. */
  protected get isColor(): boolean {
    return this.token().type === "color";
  }

  /** Forward text-input changes through the output. */
  protected onTextInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }

  /** Forward colour-picker changes through the output. */
  protected onColorInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }
}

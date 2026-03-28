import type { Type } from "@angular/core";

import { UIColorPanel } from "../../color-picker/color-panel.component";
import { UIIcons } from "../../icon/lucide-icons.generated";
import type { InputPopupPanel } from "./popup-text-adapter";
import type { PopupTextAdapter } from "./popup-text-adapter";
import type { TextAdapterValidationResult } from "./text-adapter";

/** @internal Hex colour pattern: #RGB, #RRGGBB, or #RRGGBBAA */
const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/**
 * Adapter for CSS hex colour values.
 *
 * Strips whitespace, prepends `#` when missing, and lowercases the result.
 * Validates that the input is a valid hex colour (`#RGB`, `#RRGGBB`, or
 * `#RRGGBBAA`).
 *
 * Clicking the palette prefix icon opens a full colour-picker popup
 * (theme palette, grid, named colours, RGBA / HSLA sliders).
 *
 * @example
 * ```ts
 * readonly adapter = new ColorTextAdapter();
 * // "FF6600" → value "#ff6600"
 * ```
 */
export class ColorTextAdapter implements PopupTextAdapter {
  public readonly prefixIcon = UIIcons.Lucide.Design.Palette;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly popupPanel: Type<InputPopupPanel<any>> = UIColorPanel;

  public toValue(text: string): string {
    const trimmed = text.trim();
    if (!trimmed) {
      return "";
    }
    const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    return withHash.toLowerCase();
  }

  public validate(text: string): TextAdapterValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return { valid: true, errors: [] };
    }
    const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    if (!HEX_COLOR_PATTERN.test(withHash)) {
      return {
        valid: false,
        errors: [
          "Value must be a valid hex colour (#RGB, #RRGGBB, or #RRGGBBAA)",
        ],
      };
    }
    return { valid: true, errors: [] };
  }

  public popupInputs(currentText: string): Record<string, unknown> {
    return {
      currentValue: this.toValue(currentText) || "#0061a4",
    };
  }

  public fromPopupValue(value: unknown): string {
    return value as string;
  }
}

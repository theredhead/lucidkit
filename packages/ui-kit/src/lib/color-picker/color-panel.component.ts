import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";

import { DecimalPipe } from "@angular/common";

import type {
  ColorPickerMode,
  HslaColor,
  RgbaColor,
} from "./color-picker.types";
import {
  COLOR_GRID,
  NAMED_COLORS,
  THEME_PALETTE_BASES,
} from "./color-picker.types";
import {
  hexToRgba,
  hslaToRgba,
  rgbaToHex,
  rgbaToHsla,
} from "./color-picker.utils";
import type { InputPopupPanel } from "../input/adapters/popup-text-adapter";

// ── Modes ──────────────────────────────────────────────────────────

/** Available mode tabs shown in the panel header. */
const MODES: readonly {
  readonly key: ColorPickerMode;
  readonly label: string;
}[] = [
  { key: "theme", label: "Theme" },
  { key: "grid", label: "Grid" },
  { key: "named", label: "Named" },
  { key: "rgba", label: "RGBA" },
  { key: "hsla", label: "HSLA" },
];

/**
 * Inline colour-picker panel for use inside {@link UIInput} via a
 * {@link PopupTextAdapter}.
 *
 * Implements {@link InputPopupPanel} so {@link UIInput} can subscribe
 * to `valueSelected` and `closeRequested` automatically.
 *
 * Provides the same five-mode colour selection UI as the standalone
 * {@link UIColorPickerPopover}: theme palette, grid, named colours,
 * RGBA sliders, and HSLA sliders.
 */
@Component({
  selector: "ui-color-panel",
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-color-panel",
    "(keydown.escape)": "closeRequested.emit()",
  },
  templateUrl: "./color-panel.component.html",
  styleUrl: "./color-picker-popover.component.scss",
})
export class UIColorPanel implements InputPopupPanel<string> {
  // ── Inputs ─────────────────────────────────────────────────

  /** The current colour value (hex string) passed in from the adapter. */
  public readonly currentValue = input<string>("#0061a4");

  /** Which mode tab to show initially. */
  public readonly initialMode = input<ColorPickerMode>("grid");

  // ── Outputs ────────────────────────────────────────────────

  /** Emitted when the user applies a colour. */
  public readonly valueSelected = output<string>();

  /** Emitted when the panel should close (e.g. Escape or Cancel). */
  public readonly closeRequested = output<void>();

  // ── Internal state ─────────────────────────────────────────

  /** The available mode tabs. */
  protected readonly modes = MODES;

  /** Active mode tab. */
  protected readonly activeMode = signal<ColorPickerMode>("grid");

  /** The current working colour as RGBA. */
  protected readonly rgba = signal<RgbaColor>({ r: 0, g: 97, b: 164, a: 1 });

  /** Hex input field value (kept in sync but editable). */
  protected readonly hexInput = signal("#0061a4");

  // ── Computed ────────────────────────────────────────────────

  /** Current colour as HSLA (derived from RGBA). */
  protected readonly hsla = computed<HslaColor>(() => rgbaToHsla(this.rgba()));

  /** Current colour as hex string (derived from RGBA). */
  protected readonly hexValue = computed(() => rgbaToHex(this.rgba()));

  /** CSS background for the preview swatch. */
  protected readonly previewCss = computed(() => {
    const c = this.rgba();
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
  });

  /** Theme palette base rows. */
  protected readonly themePalette = THEME_PALETTE_BASES;

  /** Flat colour grid. */
  protected readonly colorGrid = COLOR_GRID;

  /** Named CSS colours. */
  protected readonly namedColors = NAMED_COLORS;

  /** Filter text for the named colours list. */
  protected readonly namedFilter = signal("");

  /** Filtered named colours based on the search input. */
  protected readonly filteredNamedColors = computed(() => {
    const q = this.namedFilter().toLowerCase();
    if (!q) return this.namedColors;
    return this.namedColors.filter(
      (c) => c.name.toLowerCase().includes(q) || c.hex.includes(q),
    );
  });

  // ── Constructor ────────────────────────────────────────────

  public constructor() {
    queueMicrotask(() => {
      this.activeMode.set(this.initialMode());
      const parsed = hexToRgba(this.currentValue());
      if (parsed) {
        this.rgba.set(parsed);
        this.hexInput.set(rgbaToHex(parsed));
      }
    });
  }

  // ── Public methods ─────────────────────────────────────────

  /** Switch to a mode tab. */
  protected setMode(mode: ColorPickerMode): void {
    this.activeMode.set(mode);
  }

  /** Select a hex colour from the palette or grid. */
  protected selectHex(hex: string): void {
    const parsed = hexToRgba(hex);
    if (parsed) {
      this.rgba.set(parsed);
      this.hexInput.set(hex);
    }
  }

  /** Apply the current colour and emit. */
  protected apply(): void {
    this.valueSelected.emit(this.hexValue());
  }

  /** Cancel — close without selecting. */
  protected cancel(): void {
    this.closeRequested.emit();
  }

  // ── RGBA slider handlers ───────────────────────────────────

  /** @internal */
  protected setRgbaChannel(channel: "r" | "g" | "b", event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.rgba.update((c) => ({ ...c, [channel]: value }));
    this.hexInput.set(rgbaToHex(this.rgba()));
  }

  /** @internal */
  protected setAlpha(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.rgba.update((c) => ({ ...c, a: value / 100 }));
    this.hexInput.set(rgbaToHex(this.rgba()));
  }

  // ── HSLA slider handlers ───────────────────────────────────

  /** @internal */
  protected setHslaChannel(channel: "h" | "s" | "l", event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    const currentHsla = this.hsla();
    const newHsla: HslaColor = { ...currentHsla, [channel]: value };
    this.rgba.set(hslaToRgba(newHsla));
    this.hexInput.set(rgbaToHex(this.rgba()));
  }

  /** @internal */
  protected setHslaAlpha(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    const currentHsla = this.hsla();
    const newHsla: HslaColor = { ...currentHsla, a: value / 100 };
    this.rgba.set(hslaToRgba(newHsla));
    this.hexInput.set(rgbaToHex(this.rgba()));
  }

  // ── Hex input handler ──────────────────────────────────────

  /** @internal */
  protected onHexInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    this.hexInput.set(raw);
    const parsed = hexToRgba(raw);
    if (parsed) {
      this.rgba.set(parsed);
    }
  }

  /** @internal */
  protected onNamedFilterInput(event: Event): void {
    this.namedFilter.set((event.target as HTMLInputElement).value);
  }

  // ── Gradient helpers for slider tracks ─────────────────────

  /** @internal */
  protected rgbaRedGradient(): string {
    const c = this.rgba();
    return `linear-gradient(to right, rgba(0,${c.g},${c.b},1), rgba(255,${c.g},${c.b},1))`;
  }

  /** @internal */
  protected rgbaGreenGradient(): string {
    const c = this.rgba();
    return `linear-gradient(to right, rgba(${c.r},0,${c.b},1), rgba(${c.r},255,${c.b},1))`;
  }

  /** @internal */
  protected rgbaBlueGradient(): string {
    const c = this.rgba();
    return `linear-gradient(to right, rgba(${c.r},${c.g},0,1), rgba(${c.r},${c.g},255,1))`;
  }

  /** @internal */
  protected rgbaAlphaGradient(): string {
    const c = this.rgba();
    return `linear-gradient(to right, rgba(${c.r},${c.g},${c.b},0), rgba(${c.r},${c.g},${c.b},1))`;
  }

  /** @internal */
  protected hslaHueGradient(): string {
    return "linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))";
  }

  /** @internal */
  protected hslaSatGradient(): string {
    const c = this.hsla();
    return `linear-gradient(to right, hsl(${c.h},0%,${c.l}%), hsl(${c.h},100%,${c.l}%))`;
  }

  /** @internal */
  protected hslaLightGradient(): string {
    const c = this.hsla();
    return `linear-gradient(to right, hsl(${c.h},${c.s}%,0%), hsl(${c.h},${c.s}%,50%), hsl(${c.h},${c.s}%,100%))`;
  }

  /** @internal */
  protected hslaAlphaGradient(): string {
    const c = this.hsla();
    return `linear-gradient(to right, hsla(${c.h},${c.s}%,${c.l}%,0), hsla(${c.h},${c.s}%,${c.l}%,1))`;
  }

  // ── Track-by helpers ───────────────────────────────────────

  /** @internal */
  protected trackByLabel(_: number, group: { label: string }): string {
    return group.label;
  }

  /** @internal */
  protected trackByIndex(index: number): number {
    return index;
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from "@angular/core";

import { DecimalPipe } from "@angular/common";

import { PopoverRef, type UIPopoverContent } from "../popover/popover.types";
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
import { UISurface } from '@theredhead/lucid-foundation';

// ── Modes ──────────────────────────────────────────────────────────

/** Available mode tabs shown in the popover header. */
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
 * Popover content component for the colour picker.
 *
 * Renders four switchable modes (tabs): theme palette, colour grid,
 * RGBA sliders, and HSLA sliders.  Selecting a colour closes the
 * popover and returns the chosen hex string.
 *
 * @internal  Used exclusively by {@link UIColorPicker}.
 */
@Component({
  selector: "ui-color-picker-popover",
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: { class: "ui-color-picker-popover" },
  templateUrl: "./color-picker-popover.component.html",
  styleUrl: "./color-picker-popover.component.scss",
})
export class UIColorPickerPopover implements UIPopoverContent<string> {
  public readonly popoverRef = inject(PopoverRef<string>);

  // ── Inputs (set by PopoverService) ─────────────────────────

  /** The current colour value (hex string) passed in from the host. */
  public readonly initialValue = input<string>("#0061a4");

  /** Which mode tab to show initially. */
  public readonly initialMode = input<ColorPickerMode>("theme");

  /** Restrict available mode tabs. When set, only these modes are shown. */
  public readonly availableModes = input<
    readonly ColorPickerMode[] | undefined
  >(undefined);

  // ── Internal state ─────────────────────────────────────────

  /** The available mode tabs (filtered by availableModes when set). */
  public readonly modes = computed(() => {
    const allowed = this.availableModes();
    return allowed ? MODES.filter((m) => allowed.includes(m.key)) : MODES;
  });

  /** Active mode tab. */
  public readonly activeMode = signal<ColorPickerMode>("theme");

  /** The current working colour as RGBA. */
  public readonly rgba = signal<RgbaColor>({ r: 0, g: 97, b: 164, a: 1 });

  /** Hex input field value (kept in sync but editable). */
  public readonly hexInput = signal("#0061a4");

  // ── Computed ────────────────────────────────────────────────

  /** Current colour as HSLA (derived from RGBA). */
  public readonly hsla = computed<HslaColor>(() => rgbaToHsla(this.rgba()));

  /** Current colour as hex string (derived from RGBA). */
  public readonly hexValue = computed(() => rgbaToHex(this.rgba()));

  /** CSS background for the preview swatch. */
  public readonly previewCss = computed(() => {
    const c = this.rgba();
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
  });

  /** Theme palette base rows. */
  public readonly themePalette = THEME_PALETTE_BASES;

  /** Flat colour grid. */
  public readonly colorGrid = COLOR_GRID;

  /** Named CSS colours for the named list mode. */
  public readonly namedColors = NAMED_COLORS;

  /** Filter text for the named colours list. */
  public readonly namedFilter = signal("");

  /** Filtered named colours based on the search input. */
  public readonly filteredNamedColors = computed(() => {
    const q = this.namedFilter().toLowerCase();
    if (!q) return this.namedColors;
    return this.namedColors.filter(
      (c) => c.name.toLowerCase().includes(q) || c.hex.includes(q),
    );
  });

  /** Columns count for the grid (12 per row). */
  public readonly gridColumns = 12;

  // ── Constructor ────────────────────────────────────────────

  public constructor() {
    // Defer reading inputs to after they're set by PopoverService
    queueMicrotask(() => {
      this.activeMode.set(this.initialMode());
      const parsed = hexToRgba(this.initialValue());
      if (parsed) {
        this.rgba.set(parsed);
        this.hexInput.set(rgbaToHex(parsed));
      }
    });
  }

  // ── Public methods ─────────────────────────────────────────

  /** Switch to a mode tab. */
  public setMode(mode: ColorPickerMode): void {
    this.activeMode.set(mode);
  }

  /** Select a hex colour from the palette or grid. */
  public selectHex(hex: string): void {
    const parsed = hexToRgba(hex);
    if (parsed) {
      this.rgba.set(parsed);
      this.hexInput.set(hex);
    }
  }

  /** Apply the current colour and close the popover. */
  public apply(): void {
    this.popoverRef.close(this.hexValue());
  }

  /** Cancel and close without a result. */
  public cancel(): void {
    this.popoverRef.close(undefined);
  }

  // ── RGBA slider handlers ───────────────────────────────────

  /** Update a single RGBA channel from a slider. */
  public setRgbaChannel(channel: "r" | "g" | "b", event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.rgba.update((c) => ({ ...c, [channel]: value }));
    this.hexInput.set(rgbaToHex(this.rgba()));
  }

  /** Update the alpha channel from a slider. */
  public setAlpha(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.rgba.update((c) => ({ ...c, a: value / 100 }));
    this.hexInput.set(rgbaToHex(this.rgba()));
  }

  // ── HSLA slider handlers ───────────────────────────────────

  /** Update a single HSLA channel from a slider. */
  public setHslaChannel(channel: "h" | "s" | "l", event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    const currentHsla = this.hsla();
    const newHsla: HslaColor = { ...currentHsla, [channel]: value };
    this.rgba.set(hslaToRgba(newHsla));
    this.hexInput.set(rgbaToHex(this.rgba()));
  }

  /** Update the alpha channel from the HSLA tab slider. */
  public setHslaAlpha(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    const currentHsla = this.hsla();
    const newHsla: HslaColor = { ...currentHsla, a: value / 100 };
    this.rgba.set(hslaToRgba(newHsla));
    this.hexInput.set(rgbaToHex(this.rgba()));
  }

  // ── Hex input handler ──────────────────────────────────────

  /** Update colour from the hex text input. */
  public onHexInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    this.hexInput.set(raw);
    const parsed = hexToRgba(raw);
    if (parsed) {
      this.rgba.set(parsed);
    }
  }

  // ── Track-by helpers ───────────────────────────────────────

  /** Update the named colour search filter. */
  public onNamedFilterInput(event: Event): void {
    this.namedFilter.set((event.target as HTMLInputElement).value);
  }

  /** @internal */
  public trackByLabel(_: number, group: { label: string }): string {
    return group.label;
  }

  /** @internal */
  public trackByIndex(index: number): number {
    return index;
  }

  // ── Gradient helpers for slider tracks ─────────────────────

  /** @internal — returns a CSS gradient for the R channel slider. */
  public rgbaRedGradient(): string {
    const c = this.rgba();
    return `linear-gradient(to right, rgba(0,${c.g},${c.b},1), rgba(255,${c.g},${c.b},1))`;
  }

  /** @internal */
  public rgbaGreenGradient(): string {
    const c = this.rgba();
    return `linear-gradient(to right, rgba(${c.r},0,${c.b},1), rgba(${c.r},255,${c.b},1))`;
  }

  /** @internal */
  public rgbaBlueGradient(): string {
    const c = this.rgba();
    return `linear-gradient(to right, rgba(${c.r},${c.g},0,1), rgba(${c.r},${c.g},255,1))`;
  }

  /** @internal */
  public rgbaAlphaGradient(): string {
    const c = this.rgba();
    return `linear-gradient(to right, rgba(${c.r},${c.g},${c.b},0), rgba(${c.r},${c.g},${c.b},1))`;
  }

  /** @internal — returns a CSS gradient for the Hue slider (full hue spectrum). */
  public hslaHueGradient(): string {
    return "linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))";
  }

  /** @internal */
  public hslaSatGradient(): string {
    const c = this.hsla();
    return `linear-gradient(to right, hsl(${c.h},0%,${c.l}%), hsl(${c.h},100%,${c.l}%))`;
  }

  /** @internal */
  public hslaLightGradient(): string {
    const c = this.hsla();
    return `linear-gradient(to right, hsl(${c.h},${c.s}%,0%), hsl(${c.h},${c.s}%,50%), hsl(${c.h},${c.s}%,100%))`;
  }

  /** @internal */
  public hslaAlphaGradient(): string {
    const c = this.hsla();
    return `linear-gradient(to right, hsla(${c.h},${c.s}%,${c.l}%,0), hsla(${c.h},${c.s}%,${c.l}%,1))`;
  }
}

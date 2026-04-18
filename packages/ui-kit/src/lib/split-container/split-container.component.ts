import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import { StorageService, UISurface } from "@theredhead/lucid-foundation";

import type {
  SplitOrientation,
  SplitResizeEvent,
} from "./split-container.types";

import { UISplitPanel } from "./split-panel.component";

/** localStorage key prefix for persisted panel sizes. */
const STORAGE_PREFIX = "ui-split-container:";

/**
 * A resizable split container that renders N panels separated by
 * draggable dividers. Place `<ui-split-panel>` elements as children —
 * one divider is automatically inserted between every adjacent pair.
 *
 * Each divider only ever adjusts its two immediately adjacent panels;
 * all other panels are unaffected.
 *
 * ### Basic usage
 * ```html
 * <ui-split-container>
 *   <ui-split-panel>Left</ui-split-panel>
 *   <ui-split-panel>Right</ui-split-panel>
 * </ui-split-container>
 * ```
 *
 * ### Three-pane layout
 * ```html
 * <ui-split-container orientation="horizontal">
 *   <ui-split-panel [min]="120">Nav</ui-split-panel>
 *   <ui-split-panel>Editor</ui-split-panel>
 *   <ui-split-panel [min]="160">Inspector</ui-split-panel>
 * </ui-split-container>
 * ```
 *
 * ### Vertical orientation with initial sizes
 * ```html
 * <ui-split-container orientation="vertical" [initialSizes]="[30, 70]">
 *   <ui-split-panel>Top</ui-split-panel>
 *   <ui-split-panel>Bottom</ui-split-panel>
 * </ui-split-container>
 * ```
 *
 * ### Persistent sizes (localStorage)
 * ```html
 * <ui-split-container name="editor-layout">
 *   <ui-split-panel>Sidebar</ui-split-panel>
 *   <ui-split-panel>Main</ui-split-panel>
 * </ui-split-container>
 * ```
 */
@Component({
  selector: "ui-split-container",
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: "./split-container.component.html",
  styleUrl: "./split-container.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: {
    class: "ui-split-container",
    "[class.horizontal]": "orientation() === 'horizontal'",
    "[class.vertical]": "orientation() === 'vertical'",
    "[class.dragging]": "dragging()",
    "[class.disabled]": "disabled()",
    "[style.--ui-divider-width]": "dividerWidth() + 'px'",
  },
})
export class UISplitContainer implements AfterViewInit {

  // ── Inputs ──────────────────────────────────────────────────────────

  /** Whether the split container is disabled. */
  public readonly disabled = input<boolean>(false);

  /** Layout orientation. Defaults to `'horizontal'` (side-by-side). */
  public readonly orientation = input<SplitOrientation>("horizontal");

  /**
   * Initial panel sizes as percentages. Must sum to 100 and have one
   * entry per `<ui-split-panel>` child. Defaults to equal distribution.
   */
  public readonly initialSizes = input<readonly number[]>([]);

  /**
   * Optional name used as the localStorage key for persisting sizes.
   * When set, the container restores its last saved sizes on init and
   * saves after every resize.
   */
  public readonly name = input<string | undefined>(undefined);

  /** Width (or height, in vertical mode) of each divider bar in pixels. */
  public readonly dividerWidth = input(6);

  /** Accessible label for each divider. */
  public readonly ariaLabel = input<string>("Resize panels");

  // ── Outputs ─────────────────────────────────────────────────────────

  /** Emits after the user finishes dragging (on `pointerup`). */
  public readonly resized = output<SplitResizeEvent>();

  /** Emits continuously while the user is dragging. */
  public readonly resizing = output<SplitResizeEvent>();

  // ── Queries ─────────────────────────────────────────────────────────

  /** @internal */
  protected readonly containerRef =
    viewChild.required<ElementRef<HTMLElement>>("container");

  /** @internal */
  protected readonly panels = contentChildren(UISplitPanel);

  // ── Computed ────────────────────────────────────────────────────────

  /**
   * Current panel sizes as a percentage array.
   * One entry per `<ui-split-panel>` child.
   */
  public readonly sizes = computed<readonly number[]>(() => this._sizes());

  // ── Protected fields ──────────────────────────────────────────────

  /** @internal — whether a drag is active. */
  protected readonly dragging = signal(false);

  // ── Private fields ────────────────────────────────────────────────

  private readonly _sizes = signal<number[]>([]);
  private readonly storage = inject(StorageService);

  // ── Lifecycle ─────────────────────────────────────────────────────

  public ngAfterViewInit(): void {
    const n = this.panels().length;
    const stored = this.loadSizes(n);
    const initial = stored ?? this.resolveInitialSizes(n);
    this._sizes.set([...initial]);
  }

  // ── Public methods ────────────────────────────────────────────────

  /**
   * CSS flex value for the panel at the given index.
   * @internal — called from template.
   */
  public panelFlex(index: number): string {
    return `${this._sizes()[index] ?? 0} 1 0%`;
  }

  // ── Protected methods (template) ──────────────────────────────────

  /** @internal — starts pointer-based divider dragging. */
  protected onDividerPointerDown(event: PointerEvent, dividerIndex: number): void {
    event.preventDefault();
    const divider = event.currentTarget as HTMLElement;
    divider.setPointerCapture(event.pointerId);
    this.dragging.set(true);

    const container = this.containerRef().nativeElement;
    const rect = container.getBoundingClientRect();
    const isHorizontal = this.orientation() === "horizontal";
    const totalSize = isHorizontal ? rect.width : rect.height;
    const numDividers = this.panels().length - 1;
    const usableSize = totalSize - numDividers * this.dividerWidth();

    const onMove = (e: PointerEvent): void => {
      // Compute the cursor position relative to the container start
      const cursor = (isHorizontal ? e.clientX - rect.left : e.clientY - rect.top)
        - dividerIndex * this.dividerWidth();

      // Sum of all panels before this divider gives the offset baseline
      const sizes = this._sizes();
      const precedingPct = sizes.slice(0, dividerIndex).reduce((a, b) => a + b, 0);
      const pairTotal = sizes[dividerIndex] + sizes[dividerIndex + 1];

      // Convert cursor to a percentage within the full usable space
      if (usableSize <= 0) return;
      let leftPct = (cursor / usableSize) * 100 - precedingPct;
      leftPct = this.clampPair(leftPct, pairTotal, dividerIndex, usableSize);

      const newSizes = [...sizes];
      newSizes[dividerIndex] = leftPct;
      newSizes[dividerIndex + 1] = pairTotal - leftPct;
      this._sizes.set(newSizes);

      this.resizing.emit({ sizes: newSizes, orientation: this.orientation() });
    };

    const onUp = (): void => {
      this.dragging.set(false);
      divider.removeEventListener("pointermove", onMove);
      divider.removeEventListener("pointerup", onUp);
      divider.removeEventListener("pointercancel", onUp);
      const finalSizes = this._sizes();
      this.saveSizes(finalSizes);
      this.resized.emit({ sizes: finalSizes, orientation: this.orientation() });
    };

    divider.addEventListener("pointermove", onMove);
    divider.addEventListener("pointerup", onUp);
    divider.addEventListener("pointercancel", onUp);
  }

  /** @internal — double-click on a divider collapses the smaller adjacent panel. */
  protected onDividerDblClick(dividerIndex: number): void {
    const sizes = [...this._sizes()];
    const a = sizes[dividerIndex];
    const b = sizes[dividerIndex + 1];
    const total = a + b;

    // Toggle: if either adjacent panel is already ~0 restore 50/50 of total;
    // otherwise collapse whichever is smaller.
    if (a < 1) {
      sizes[dividerIndex] = total / 2;
      sizes[dividerIndex + 1] = total / 2;
    } else if (b < 1) {
      sizes[dividerIndex] = total / 2;
      sizes[dividerIndex + 1] = total / 2;
    } else if (a <= b) {
      sizes[dividerIndex] = 0;
      sizes[dividerIndex + 1] = total;
    } else {
      sizes[dividerIndex] = total;
      sizes[dividerIndex + 1] = 0;
    }

    this._sizes.set(sizes);
    this.saveSizes(sizes);
    this.resized.emit({ sizes, orientation: this.orientation() });
  }

  /** @internal — keyboard support for divider (arrow keys). */
  protected onDividerKeydown(event: KeyboardEvent, dividerIndex: number): void {
    const step = event.shiftKey ? 5 : 1;
    const isHorizontal = this.orientation() === "horizontal";

    let delta: number;
    if (isHorizontal) {
      if (event.key === "ArrowLeft") delta = -step;
      else if (event.key === "ArrowRight") delta = step;
      else return;
    } else {
      if (event.key === "ArrowUp") delta = -step;
      else if (event.key === "ArrowDown") delta = step;
      else return;
    }

    event.preventDefault();
    const container = this.containerRef().nativeElement;
    const rect = container.getBoundingClientRect();
    const isHoriz = this.orientation() === "horizontal";
    const totalSize = isHoriz ? rect.width : rect.height;
    const numDividers = this.panels().length - 1;
    const usableSize = totalSize - numDividers * this.dividerWidth();

    const sizes = [...this._sizes()];
    const pairTotal = sizes[dividerIndex] + sizes[dividerIndex + 1];
    let newLeft = sizes[dividerIndex] + delta;
    newLeft = this.clampPair(newLeft, pairTotal, dividerIndex, usableSize);

    sizes[dividerIndex] = newLeft;
    sizes[dividerIndex + 1] = pairTotal - newLeft;
    this._sizes.set(sizes);
    this.saveSizes(sizes);
    this.resized.emit({ sizes, orientation: this.orientation() });
  }

  // ── Private methods ───────────────────────────────────────────────

  /**
   * Clamps the left panel of a pair using its and its neighbour's
   * `min`/`max` constraints from the corresponding `UISplitPanel` inputs.
   */
  private clampPair(
    leftPct: number,
    pairTotalPct: number,
    dividerIndex: number,
    usablePx: number,
  ): number {
    const panelArray = this.panels();
    const leftConstraints = panelArray[dividerIndex]?.constraints ?? {};
    const rightConstraints = panelArray[dividerIndex + 1]?.constraints ?? {};

    const toPercent = (px: number): number =>
      usablePx > 0 ? (px / usablePx) * 100 : 0;

    const leftMin  = leftConstraints.min  != null ? toPercent(leftConstraints.min)  : 0;
    const leftMax  = leftConstraints.max  != null ? toPercent(leftConstraints.max)  : pairTotalPct;
    const rightMin = rightConstraints.min != null ? toPercent(rightConstraints.min) : 0;
    const rightMax = rightConstraints.max != null ? toPercent(rightConstraints.max) : pairTotalPct;

    // left ≥ leftMin, left ≤ leftMax
    // right = pairTotal - left  →  right ≥ rightMin  ↔  left ≤ pairTotal - rightMin
    //                           →  right ≤ rightMax  ↔  left ≥ pairTotal - rightMax
    let clamped = Math.max(leftMin, Math.min(leftMax, leftPct));
    clamped = Math.min(clamped, pairTotalPct - rightMin);
    clamped = Math.max(clamped, pairTotalPct - rightMax);

    return clamped;
  }

  /** Returns equal-distribution sizes for N panels. */
  private resolveInitialSizes(n: number): number[] {
    const provided = this.initialSizes();
    if (provided.length === n && Math.abs(provided.reduce((a, b) => a + b, 0) - 100) < 0.01) {
      return [...provided];
    }
    if (n === 0) return [];
    const base = Math.floor(100 / n);
    const remainder = 100 - base * n;
    return Array.from({ length: n }, (_, i) => base + (i === n - 1 ? remainder : 0));
  }

  /** Persists sizes to storage (if a name is set). */
  private saveSizes(sizes: readonly number[]): void {
    const key = this.name();
    if (!key) return;
    this.storage.setItem(STORAGE_PREFIX + key, JSON.stringify(sizes));
  }

  /** Restores sizes from storage (if a name is set and count matches). */
  private loadSizes(n: number): number[] | null {
    const key = this.name();
    if (!key) return null;
    try {
      const raw = this.storage.getItem(STORAGE_PREFIX + key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === n && parsed.every((v) => typeof v === "number")) {
        return parsed as number[];
      }
    } catch {
      // Corrupt data — ignore.
    }
    return null;
  }
}

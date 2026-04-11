import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from "@angular/core";

import { StorageService, UISurface } from "@theredhead/foundation";

import type {
  SplitCollapseTarget,
  SplitOrientation,
  SplitPanelConstraints,
  SplitResizeEvent,
} from "./split-container.types";

/** localStorage key prefix for persisted panel sizes. */
const STORAGE_PREFIX = "ui-split-container:";

/**
 * A resizable split container that hosts two content panels separated
 * by a draggable divider.
 *
 * Project two `ng-template` children with `#first` and `#second`
 * template references.
 *
 * ### Basic usage
 * ```html
 * <ui-split-container>
 *   <ng-template #first>Left panel</ng-template>
 *   <ng-template #second>Right panel</ng-template>
 * </ui-split-container>
 * ```
 *
 * ### Vertical orientation
 * ```html
 * <ui-split-container orientation="vertical" [initialSizes]="[30, 70]">
 *   <ng-template #first>Top panel</ng-template>
 *   <ng-template #second>Bottom panel</ng-template>
 * </ui-split-container>
 * ```
 *
 * ### Persistent sizes
 * ```html
 * <ui-split-container name="editor-layout">
 *   <ng-template #first>Sidebar</ng-template>
 *   <ng-template #second>Main</ng-template>
 * </ui-split-container>
 * ```
 *
 * ### Double-click collapse
 * ```html
 * <ui-split-container collapseTarget="first">
 *   <ng-template #first>Sidebar</ng-template>
 *   <ng-template #second>Main</ng-template>
 * </ui-split-container>
 * ```
 */
@Component({
  selector: "ui-split-container",
  standalone: true,
  imports: [],
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
   * Initial panel sizes as a `[first, second]` percentage tuple.
   * Must sum to 100. Defaults to `[50, 50]`.
   */
  public readonly initialSizes = input<readonly [number, number]>([50, 50]);

  /**
   * Optional name used as the localStorage key for persisting sizes.
   * When set, the container restores its last saved sizes on init and
   * saves after every resize.
   */
  public readonly name = input<string | undefined>(undefined);

  /** Size constraints for the first (left / top) panel. */
  public readonly firstConstraints = input<SplitPanelConstraints>({});

  /** Size constraints for the second (right / bottom) panel. */
  public readonly secondConstraints = input<SplitPanelConstraints>({});

  /** Width (or height, in vertical mode) of the divider bar in pixels. */
  public readonly dividerWidth = input(6);

  /**
   * Which panel to collapse when the divider is double-clicked.
   * Set to `'none'` (default) to disable double-click collapse.
   */
  public readonly collapseTarget = input<SplitCollapseTarget>("none");

  /** Accessible label for the divider. */
  public readonly ariaLabel = input<string>("Resize panels");

  // ── Outputs ─────────────────────────────────────────────────────────

  /** Emits after the user finishes dragging (on `pointerup`). */
  public readonly resized = output<SplitResizeEvent>();

  /** Emits continuously while the user is dragging. */
  public readonly resizing = output<SplitResizeEvent>();

  // ── View queries ────────────────────────────────────────────────────

  /** @internal */
  protected readonly containerRef =
    viewChild.required<ElementRef<HTMLElement>>("container");

  // ── Computed ────────────────────────────────────────────────────────

  /** Panel sizes as a `[first, second]` percentage tuple. */
  public readonly sizes = computed<readonly [number, number]>(() => [
    this.firstPercent(),
    this.secondPercent(),
  ]);

  /** @internal — CSS flex value for the first panel. */
  protected readonly firstFlex = computed(() => `${this.firstPercent()} 1 0%`);

  /** @internal — CSS flex value for the second panel. */
  protected readonly secondFlex = computed(
    () => `${this.secondPercent()} 1 0%`,
  );

  // ── Protected fields ──────────────────────────────────────────────

  /** @internal — whether a drag is active. */
  protected readonly dragging = signal(false);

  /** @internal — percentage of the first panel. */
  protected readonly firstPercent = signal(50);

  /** @internal — percentage of the second panel. */
  protected readonly secondPercent = signal(50);

  /**
   * The sizes before a collapse. Stored so double-clicking again
   * can restore the original sizes.
   * @internal
   */
  protected readonly preCollapsePercent = signal<
    readonly [number, number] | null
  >(null);

  // ── Private fields ────────────────────────────────────────────────

  private readonly storage = inject(StorageService);

  // ── Lifecycle ─────────────────────────────────────────────────────

  public ngAfterViewInit(): void {
    // Restore from localStorage or use initial sizes
    const storedSizes = this.loadSizes();
    const init = storedSizes ?? this.initialSizes();
    this.firstPercent.set(init[0]);
    this.secondPercent.set(init[1]);
  }

  // ── Protected methods (template) ──────────────────────────────────

  /** @internal — starts pointer-based divider dragging. */
  protected onDividerPointerDown(event: PointerEvent): void {
    event.preventDefault();
    const divider = event.currentTarget as HTMLElement;
    divider.setPointerCapture(event.pointerId);

    this.dragging.set(true);

    const container = this.containerRef().nativeElement;
    const rect = container.getBoundingClientRect();
    const isHorizontal = this.orientation() === "horizontal";
    const totalSize = isHorizontal ? rect.width : rect.height;
    const dividerPx = this.dividerWidth();

    const onMove = (e: PointerEvent): void => {
      const cursor = isHorizontal
        ? e.clientX - rect.left
        : e.clientY - rect.top;

      // Convert cursor position to a percentage, accounting for
      // the divider width.
      const usableSize = totalSize - dividerPx;
      if (usableSize <= 0) return;

      let firstPct = (cursor / totalSize) * 100;
      firstPct = this.clampPercent(firstPct, usableSize);

      this.firstPercent.set(firstPct);
      this.secondPercent.set(100 - firstPct);
      this.preCollapsePercent.set(null);

      this.resizing.emit({
        sizes: [firstPct, 100 - firstPct],
        orientation: this.orientation(),
      });
    };

    const onUp = (): void => {
      this.dragging.set(false);
      divider.removeEventListener("pointermove", onMove);
      divider.removeEventListener("pointerup", onUp);
      divider.removeEventListener("pointercancel", onUp);

      const currentSizes: readonly [number, number] = [
        this.firstPercent(),
        this.secondPercent(),
      ];
      this.saveSizes(currentSizes);
      this.resized.emit({
        sizes: currentSizes,
        orientation: this.orientation(),
      });
    };

    divider.addEventListener("pointermove", onMove);
    divider.addEventListener("pointerup", onUp);
    divider.addEventListener("pointercancel", onUp);
  }

  /** @internal — handles double-click on divider to collapse/restore. */
  protected onDividerDblClick(): void {
    const target = this.collapseTarget();
    if (target === "none") return;

    const pre = this.preCollapsePercent();
    if (pre !== null) {
      // Restore previous sizes
      this.firstPercent.set(pre[0]);
      this.secondPercent.set(pre[1]);
      this.preCollapsePercent.set(null);
    } else {
      // Collapse the target panel
      this.preCollapsePercent.set([this.firstPercent(), this.secondPercent()]);
      if (target === "first") {
        this.firstPercent.set(0);
        this.secondPercent.set(100);
      } else {
        this.firstPercent.set(100);
        this.secondPercent.set(0);
      }
    }

    const currentSizes: readonly [number, number] = [
      this.firstPercent(),
      this.secondPercent(),
    ];
    this.saveSizes(currentSizes);
    this.resized.emit({
      sizes: currentSizes,
      orientation: this.orientation(),
    });
  }

  /** @internal — keyboard support for divider (left/right/up/down). */
  protected onDividerKeydown(event: KeyboardEvent): void {
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
    const totalSize = isHorizontal ? rect.width : rect.height;
    const usableSize = totalSize - this.dividerWidth();

    let firstPct = this.firstPercent() + delta;
    firstPct = this.clampPercent(firstPct, usableSize);

    this.firstPercent.set(firstPct);
    this.secondPercent.set(100 - firstPct);
    this.preCollapsePercent.set(null);

    const currentSizes: readonly [number, number] = [firstPct, 100 - firstPct];
    this.saveSizes(currentSizes);
    this.resized.emit({
      sizes: currentSizes,
      orientation: this.orientation(),
    });
  }

  // ── Private methods ───────────────────────────────────────────────

  /**
   * Clamps the first-panel percentage according to both panel
   * constraints.
   */
  private clampPercent(firstPct: number, usablePx: number): number {
    const first = this.firstConstraints();
    const second = this.secondConstraints();

    // Convert pixel constraints to percentages
    const firstMinPct =
      usablePx > 0 && first.min != null ? (first.min / usablePx) * 100 : 0;
    const firstMaxPct =
      usablePx > 0 && first.max != null ? (first.max / usablePx) * 100 : 100;
    const secondMinPct =
      usablePx > 0 && second.min != null ? (second.min / usablePx) * 100 : 0;
    const secondMaxPct =
      usablePx > 0 && second.max != null ? (second.max / usablePx) * 100 : 100;

    // Clamp: first panel must be ≥ firstMin and ≤ firstMax
    let clamped = Math.max(firstMinPct, Math.min(firstMaxPct, firstPct));

    // The second panel = 100 − first, so enforce second constraints
    // as limits on first.
    // second ≥ secondMin  →  first ≤ 100 − secondMin
    clamped = Math.min(clamped, 100 - secondMinPct);
    // second ≤ secondMax  →  first ≥ 100 − secondMax
    clamped = Math.max(clamped, 100 - secondMaxPct);

    return clamped;
  }

  /** Persists sizes to storage (if a name is set). */
  private saveSizes(sizes: readonly [number, number]): void {
    const key = this.name();
    if (!key) return;
    this.storage.setItem(STORAGE_PREFIX + key, JSON.stringify(sizes));
  }

  /** Restores sizes from storage (if a name is set). */
  private loadSizes(): readonly [number, number] | null {
    const key = this.name();
    if (!key) return null;
    try {
      const raw = this.storage.getItem(STORAGE_PREFIX + key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.length === 2 &&
        typeof parsed[0] === "number" &&
        typeof parsed[1] === "number"
      ) {
        return parsed as [number, number];
      }
    } catch {
      // Corrupt data — ignore.
    }
    return null;
  }
}

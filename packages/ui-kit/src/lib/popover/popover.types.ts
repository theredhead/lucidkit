import { type Type } from "@angular/core";
import { Observable, Subject } from "rxjs";

// ── Alignment ──────────────────────────────────────────────────────

/**
 * Vertical alignment of the popover relative to its anchor element.
 *
 * - `'auto'`   — automatically chooses `'bottom'` or `'top'` based on
 *                available viewport space (prefers below)
 * - `'top'`    — popover sits above the anchor (bottom edge → anchor top edge)
 * - `'center'` — popover is vertically centred on the anchor
 * - `'bottom'` — popover sits below the anchor (top edge → anchor bottom edge)
 */
export type PopoverVerticalAlignment = "auto" | "top" | "center" | "bottom";

/**
 * Horizontal alignment of the popover relative to its anchor element.
 *
 * - `'auto'`   — prefers `'center'`; falls back to `'end'` or `'start'`
 *                if centering would clip the viewport
 * - `'start'`  — popover sits to the left of the anchor (right edge → anchor left edge)
 * - `'center'` — popover is horizontally centred on the anchor
 * - `'end'`    — popover sits to the right of the anchor (left edge → anchor right edge)
 */
export type PopoverHorizontalAlignment = "auto" | "start" | "center" | "end";

// ── PopoverRef ─────────────────────────────────────────────────────

/**
 * Reference to an open popover.
 *
 * Returned by {@link PopoverService.openPopover} and injected into
 * the content component.  Similar to {@link ModalRef} but for
 * non-modal popovers anchored to an element.
 *
 * @example
 * ```ts
 * readonly popoverRef = inject(PopoverRef<string>);
 *
 * selectItem(item: string): void {
 *   this.popoverRef.close(item);
 * }
 * ```
 */
export class PopoverRef<R = unknown> {
  private readonly resultSubject = new Subject<R | undefined>();
  private _isClosed = false;

  /** @internal */
  private readonly cleanupFns: (() => void)[] = [];

  /**
   * Observable that emits the result value when the popover closes,
   * then completes.  Emits `undefined` on light-dismiss.
   */
  readonly closed: Observable<R | undefined> =
    this.resultSubject.asObservable();

  /** Whether the popover has already been closed. */
  get isClosed(): boolean {
    return this._isClosed;
  }

  /**
   * Close the popover, optionally returning a result value.
   */
  close(result?: R): void {
    if (this._isClosed) return;
    this._isClosed = true;
    this.resultSubject.next(result);
    this.resultSubject.complete();
    this.cleanupFns.forEach((fn) => fn());
  }

  /**
   * Register a teardown function called once on close.
   * @internal
   */
  onDestroy(fn: () => void): void {
    this.cleanupFns.push(fn);
  }
}

// ── UIPopoverContent ───────────────────────────────────────────────

/**
 * Interface that popover content components should implement.
 *
 * @example
 * ```ts
 * @Component({ ... })
 * export class UIContextMenu implements UIPopoverContent<string> {
 *   readonly popoverRef = inject(PopoverRef<string>);
 *
 *   pick(action: string): void { this.popoverRef.close(action); }
 * }
 * ```
 */
export interface UIPopoverContent<R = unknown> {
  /** Injected reference used to close the popover and return a result. */
  readonly popoverRef: PopoverRef<R>;
}

// ── OpenPopoverConfig ──────────────────────────────────────────────

/**
 * Configuration object passed to {@link PopoverService.openPopover}.
 */
export interface OpenPopoverConfig<T> {
  /** The standalone component class to render inside the popover. */
  readonly component: Type<T>;

  /** The DOM element the popover is anchored to. */
  readonly anchor: Element;

  /**
   * Vertical alignment of the popover relative to the anchor.
   * @default 'auto'
   */
  readonly verticalAxisAlignment?: PopoverVerticalAlignment;

  /**
   * Horizontal alignment of the popover relative to the anchor.
   * @default 'auto'
   */
  readonly horizontalAxisAlignment?: PopoverHorizontalAlignment;

  /**
   * Pixel offset on the vertical axis (positive = down).
   * Applied after alignment — e.g. a small gap between anchor
   * and popover.
   * @default 4
   */
  readonly verticalOffset?: number;

  /**
   * Pixel offset on the horizontal axis (positive = right).
   * @default 0
   */
  readonly horizontalOffset?: number;

  /**
   * Input values set on the component via
   * `ComponentRef.setInput()`.
   */
  readonly inputs?: Record<string, unknown>;

  /**
   * Map of output property names to handler callbacks.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly outputs?: Record<string, (event: any) => void>;

  /** Accessible label applied to the popover element. */
  readonly ariaLabel?: string;

  /**
   * Whether clicking outside the popover closes it (light-dismiss).
   *
   * When `true`, uses `popover="auto"` (native light-dismiss).
   * When `false`, uses `popover="manual"` and the content component
   * must call `popoverRef.close()` explicitly.
   *
   * @default true
   */
  readonly closeOnOutsideClick?: boolean;
}

import { type Type } from "@angular/core";
import { Observable, Subject } from "rxjs";

// ── Placement ──────────────────────────────────────────────────────

/**
 * Placement of a popover relative to its anchor element.
 *
 * The first word is the side the popover appears on; the optional
 * suffix controls alignment along that side.
 */
export type PopoverPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

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
   * Where to place the popover relative to the anchor.
   * @default 'bottom-start'
   */
  readonly placement?: PopoverPlacement;

  /**
   * Pixel gap between the anchor and the popover edge.
   * @default 4
   */
  readonly offset?: number;

  /**
   * Input values set on the component via
   * `ComponentRef.setInput()`.
   */
  readonly inputs?: Record<string, unknown>;

  /**
   * Map of output property names to handler callbacks.
   */
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

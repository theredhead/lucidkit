import { type Type } from "@angular/core";
import { Observable, Subject } from "rxjs";

// ── ModalRef ───────────────────────────────────────────────────────

/**
 * Reference to an open modal dialog.
 *
 * Returned by {@link ModalService.openModal} and injected into the
 * content component.  The opener subscribes to {@link closed} to
 * receive the result; the content component calls {@link close} to
 * dismiss the dialog.
 *
 * @example
 * ```ts
 * // Inside a modal content component
 * readonly modalRef = inject(ModalRef<string>);
 *
 * save(): void {
 *   this.modalRef.close(this.form.value.name);
 * }
 * ```
 */
export class ModalRef<R = unknown> {
  private readonly resultSubject = new Subject<R | undefined>();
  private _isClosed = false;

  /** @internal */
  private readonly cleanupFns: (() => void)[] = [];

  /**
   * Observable that emits the result value when the modal closes,
   * then completes.  Emits `undefined` when closed without a result
   * (e.g. Escape key or backdrop click).
   */
  readonly closed: Observable<R | undefined> =
    this.resultSubject.asObservable();

  /** Whether the modal has already been closed. */
  get isClosed(): boolean {
    return this._isClosed;
  }

  /**
   * Close the modal, optionally returning a result value to the
   * opener.
   */
  close(result?: R): void {
    if (this._isClosed) return;
    this._isClosed = true;
    this.resultSubject.next(result);
    this.resultSubject.complete();
    this.cleanupFns.forEach((fn) => fn());
  }

  /**
   * Register a teardown function called once when the modal closes.
   * @internal
   */
  onDestroy(fn: () => void): void {
    this.cleanupFns.push(fn);
  }
}

// ── UIModalContent ─────────────────────────────────────────────────

/**
 * Interface that modal content components should implement.
 *
 * The only requirement is to inject the {@link ModalRef} so the
 * component can close itself and optionally return a result.
 *
 * @example
 * ```ts
 * @Component({ selector: 'ui-confirm-dialog', standalone: true, ... })
 * export class UIConfirmDialog implements UIModalContent<boolean> {
 *   readonly modalRef = inject(ModalRef<boolean>);
 *
 *   confirm(): void { this.modalRef.close(true); }
 *   cancel():  void { this.modalRef.close(false); }
 * }
 * ```
 */
export interface UIModalContent<R = unknown> {
  /** Injected reference used to close the modal and return a result. */
  readonly modalRef: ModalRef<R>;
}

// ── OpenModalConfig ────────────────────────────────────────────────

/**
 * Configuration object passed to {@link ModalService.openModal}.
 */
export interface OpenModalConfig<T> {
  /** The standalone component class to render inside the dialog. */
  readonly component: Type<T>;

  /**
   * Input values set on the component via
   * `ComponentRef.setInput()`.
   */
  readonly inputs?: Record<string, unknown>;

  /**
   * Map of output property names to handler callbacks.
   *
   * Works with both signal `output()` and legacy `EventEmitter`
   * outputs.
   */
  readonly outputs?: Record<string, (event: any) => void>;

  /** Accessible label applied to the `<dialog>` element. */
  readonly ariaLabel?: string;

  /**
   * Whether pressing Escape closes the dialog.
   * @default true
   */
  readonly closeOnEscape?: boolean;

  /**
   * Whether clicking the backdrop closes the dialog.
   * @default true
   */
  readonly closeOnBackdropClick?: boolean;
}

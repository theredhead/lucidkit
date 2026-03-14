/**
 * Minimal typed event emitter — a lightweight alternative to RxJS
 * `Subject` for discrete notifications.
 *
 * ```ts
 * const event = new Emitter<RowChangedNotification>();
 *
 * // Consumer (e.g. in a component):
 * const unsub = event.subscribe(n => console.log(n.rowIndex));
 * destroyRef.onDestroy(unsub);
 *
 * // Producer (e.g. in a datasource):
 * event.emit({ rowIndex: 42 });
 * ```
 *
 * @typeParam T - The event payload type.
 */
export class Emitter<T> {
  private readonly listeners = new Set<(event: T) => void>();

  /**
   * Registers a listener that is invoked every time the event fires.
   *
   * @param fn - Callback receiving the event payload.
   * @returns A teardown function that removes the listener when called.
   *          Designed to be passed directly to `DestroyRef.onDestroy()`.
   */
  subscribe(fn: (event: T) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /**
   * Fires the event, invoking all registered listeners synchronously.
   * Listener errors are caught individually so one failing handler
   * never prevents the remaining listeners from executing.
   * All caught errors are re-thrown asynchronously after the loop
   * so they still surface in the console / error tracking.
   *
   * @param event - The payload to deliver to every listener.
   */
  emit(event: T): void {
    let errors: unknown[] | undefined;
    for (const fn of this.listeners) {
      try {
        fn(event);
      } catch (e) {
        (errors ??= []).push(e);
      }
    }
    if (errors) {
      for (const e of errors) {
        queueMicrotask(() => {
          throw e;
        });
      }
    }
  }
}

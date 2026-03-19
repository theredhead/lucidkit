import { Injectable, signal } from "@angular/core";

import type {
  ToastConfig,
  ToastInstance,
  ToastPosition,
  ToastSeverity,
} from "./toast.types";

/** Default auto-dismiss duration in milliseconds. */
const DEFAULT_DURATION = 4000;

/** Default toast position. */
const DEFAULT_POSITION: ToastPosition = "top-right";

/** Default severity. */
const DEFAULT_SEVERITY: ToastSeverity = "info";

let nextId = 0;

/**
 * Service for showing auto-dismissing toast notifications.
 *
 * Inject this service and call one of the convenience methods
 * (`info`, `success`, `warning`, `error`) or use `show()` for
 * full control.
 *
 * The toast container component (`<ui-toast-container>`) must be
 * placed somewhere in the application template (typically in the
 * root component) for toasts to be rendered.
 *
 * @example
 * ```ts
 * private readonly toast = inject(ToastService);
 *
 * save(): void {
 *   this.toast.success('Document saved');
 * }
 * ```
 */
@Injectable({ providedIn: "root" })
export class ToastService {
  /** All currently active toast instances. */
  public readonly toasts = signal<readonly ToastInstance[]>([]);

  /** @internal Timer IDs keyed by toast id. */
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  /**
   * Show a toast with full configuration.
   *
   * @returns The unique ID of the created toast.
   */
  public show(config: ToastConfig): string {
    const id = `toast-${++nextId}`;
    const instance: ToastInstance = {
      id,
      message: config.message,
      title: config.title ?? "",
      severity: config.severity ?? DEFAULT_SEVERITY,
      duration: config.duration ?? DEFAULT_DURATION,
      actionLabel: config.actionLabel ?? "",
      actionFn: config.actionFn,
      position: config.position ?? DEFAULT_POSITION,
      exiting: false,
    };

    this.toasts.update((list) => [...list, instance]);

    if (instance.duration > 0) {
      const timer = setTimeout(() => this.dismiss(id), instance.duration);
      this.timers.set(id, timer);
    }

    return id;
  }

  /** Show an informational toast. */
  public info(message: string, config?: Partial<ToastConfig>): string {
    return this.show({ ...config, message, severity: "info" });
  }

  /** Show a success toast. */
  public success(message: string, config?: Partial<ToastConfig>): string {
    return this.show({ ...config, message, severity: "success" });
  }

  /** Show a warning toast. */
  public warning(message: string, config?: Partial<ToastConfig>): string {
    return this.show({ ...config, message, severity: "warning" });
  }

  /** Show an error toast. */
  public error(message: string, config?: Partial<ToastConfig>): string {
    return this.show({ ...config, message, severity: "error" });
  }

  /** Dismiss a toast by ID with exit animation. */
  public dismiss(id: string): void {
    // Mark as exiting for CSS animation
    this.toasts.update((list) =>
      list.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );

    // Remove after animation completes
    setTimeout(() => this.remove(id), 200);
  }

  /** Immediately remove a toast without animation. */
  public remove(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  /** Remove all toasts. */
  public clear(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    this.toasts.set([]);
  }
}

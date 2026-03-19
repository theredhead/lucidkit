import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";

import { ToastService } from "./toast.service";
import type { ToastInstance, ToastPosition } from "./toast.types";

/**
 * Renders active toasts at the specified screen position.
 *
 * Place one instance in your root component template.
 * Multiple containers with different `position` values are supported.
 *
 * @example
 * ```html
 * <!-- app.component.html -->
 * <router-outlet />
 * <ui-toast-container />
 * ```
 */
@Component({
  selector: "ui-toast-container",
  standalone: true,
  templateUrl: "./toast.component.html",
  styleUrl: "./toast.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-toast-container",
    "[class.ui-toast-container--top-right]": "position() === 'top-right'",
    "[class.ui-toast-container--top-left]": "position() === 'top-left'",
    "[class.ui-toast-container--top-center]": "position() === 'top-center'",
    "[class.ui-toast-container--bottom-right]": "position() === 'bottom-right'",
    "[class.ui-toast-container--bottom-left]": "position() === 'bottom-left'",
    "[class.ui-toast-container--bottom-center]":
      "position() === 'bottom-center'",
  },
})
export class UIToastContainer {
  /** Screen position for this container. Defaults to `"top-right"`. */
  public readonly position = input<ToastPosition>("top-right");

  private readonly toastService = inject(ToastService);

  /** Toasts filtered by this container's position. */
  protected readonly visibleToasts = computed(() =>
    this.toastService.toasts().filter((t) => t.position === this.position()),
  );

  /** Dismiss a toast. */
  protected dismiss(toast: ToastInstance): void {
    this.toastService.dismiss(toast.id);
  }

  /** Execute the toast action and then dismiss. */
  protected executeAction(toast: ToastInstance): void {
    toast.actionFn?.();
    this.toastService.dismiss(toast.id);
  }

  /** TrackBy function for toast list. */
  protected trackById(_index: number, toast: ToastInstance): string {
    return toast.id;
  }
}

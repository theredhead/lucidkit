import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  Injector,
} from "@angular/core";

import { ModalRef, type OpenModalConfig } from "./dialog.types";

// ── Dialog stylesheet (injected into <head> once) ──────────────────

/** @internal */
const DIALOG_STYLES = /* css */ `
/* ── ui-dialog service base ─────────────────────────────── */

dialog.ui-dialog-service {
  --tv-surface: var(--theredhead-surface, #ffffff);
  --tv-text: var(--theredhead-on-surface, #1d232b);
  --tv-border: var(--theredhead-outline, #d7dce2);
  --tv-accent: var(--theredhead-primary, #3584e4);

  border: none;
  border-radius: 0.75rem;
  padding: 0;
  max-width: min(90vw, 40rem);
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--tv-surface);
  color: var(--tv-text);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  animation: ui-dialog-svc-enter 180ms ease-out;
}

dialog.ui-dialog-service::backdrop {
  background: rgba(0, 0, 0, 0.45);
  animation: ui-dialog-svc-backdrop-enter 180ms ease-out;
}

/* ── dark mode (explicit class) ─────────────────────────── */

html.dark-theme dialog.ui-dialog-service {
  --tv-surface: var(--theredhead-surface, #2a2f38);
  --tv-text: var(--theredhead-on-surface, #f2f6fb);
  --tv-border: var(--theredhead-outline, #3a3f47);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

html.dark-theme dialog.ui-dialog-service::backdrop {
  background: rgba(0, 0, 0, 0.65);
}

/* ── dark mode (system preference fallback) ─────────────── */

@media (prefers-color-scheme: dark) {
  html:not(.light-theme):not(.dark-theme) dialog.ui-dialog-service {
    --tv-surface: var(--theredhead-surface, #2a2f38);
    --tv-text: var(--theredhead-on-surface, #f2f6fb);
    --tv-border: var(--theredhead-outline, #3a3f47);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }

  html:not(.light-theme):not(.dark-theme) dialog.ui-dialog-service::backdrop {
    background: rgba(0, 0, 0, 0.65);
  }
}

/* ── animations ─────────────────────────────────────────── */

@keyframes ui-dialog-svc-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes ui-dialog-svc-backdrop-enter {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;

// ── Service ────────────────────────────────────────────────────────

/**
 * Service for opening modal dialogs programmatically using the native
 * HTML5 `<dialog>` element.
 *
 * This is the **imperative** counterpart to the declarative
 * {@link UIDialog} component. Use this service when you need to
 * dynamically render a component, pass inputs/outputs, and collect a
 * typed result via {@link ModalRef.closed}.
 *
 * @example
 * ```ts
 * const ref = this.modal.openModal<MyDialog, string>({
 *   component: MyDialog,
 *   inputs: { title: 'Confirm' },
 *   outputs: { saved: (v) => console.log('Saved:', v) },
 * });
 *
 * ref.closed.subscribe((result) => {
 *   if (result) { … }
 * });
 * ```
 */
@Injectable({ providedIn: "root" })
export class ModalService {
  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);
  private stylesInjected = false;

  /**
   * Opens a modal dialog containing the given component.
   *
   * @param config  Component type, inputs, and output handlers.
   * @returns A {@link ModalRef} to observe the result or close
   *          programmatically.
   */
  public openModal<T, R = unknown>(config: OpenModalConfig<T>): ModalRef<R> {
    this.ensureStyles();

    const modalRef = new ModalRef<R>();

    // ── Create native <dialog> ──────────────────────────────

    const dialog = document.createElement("dialog");
    dialog.classList.add("ui-dialog-service");

    if (config.ariaLabel) {
      dialog.setAttribute("aria-label", config.ariaLabel);
    }

    // ── Build a child injector that provides ModalRef ────────

    const modalInjector = Injector.create({
      providers: [{ provide: ModalRef, useValue: modalRef }],
      parent: this.envInjector,
    });

    // ── Dynamically create the content component ────────────

    const componentRef = createComponent(config.component, {
      environmentInjector: this.envInjector,
      elementInjector: modalInjector,
    });

    // ── Set inputs ──────────────────────────────────────────

    if (config.inputs) {
      for (const [key, value] of Object.entries(config.inputs)) {
        componentRef.setInput(key, value);
      }
    }

    // ── Wire outputs ────────────────────────────────────────

    if (config.outputs) {
      for (const [key, handler] of Object.entries(config.outputs)) {
        if (!handler) continue;
        const ref = (componentRef.instance as Record<string, any>)[key];
        if (ref && typeof ref.subscribe === "function") {
          const sub = ref.subscribe(handler);
          modalRef.onDestroy(() => sub.unsubscribe());
        }
      }
    }

    // ── Assemble DOM and open ───────────────────────────────

    dialog.appendChild(componentRef.location.nativeElement);
    document.body.appendChild(dialog);
    this.appRef.attachView(componentRef.hostView);
    dialog.showModal();

    // ── Register teardown ───────────────────────────────────

    modalRef.onDestroy(() => {
      dialog.close();
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
      dialog.remove();
    });

    // ── Native close event (Escape key, etc.) ───────────────

    dialog.addEventListener("close", () => {
      if (!modalRef.isClosed) {
        modalRef.close(undefined);
      }
    });

    // ── Prevent Escape when configured ──────────────────────

    if (config.closeOnEscape === false) {
      dialog.addEventListener("cancel", (e: Event) => {
        e.preventDefault();
      });
    }

    // ── Backdrop click ──────────────────────────────────────

    if (config.closeOnBackdropClick !== false) {
      dialog.addEventListener("click", (event: MouseEvent) => {
        if (event.target === dialog) {
          modalRef.close(undefined);
        }
      });
    }

    return modalRef;
  }

  /** Injects the dialog stylesheet into `<head>` once. */
  private ensureStyles(): void {
    if (this.stylesInjected) return;
    this.stylesInjected = true;
    const style = document.createElement("style");
    style.setAttribute("data-ui-dialog-service", "");
    style.textContent = DIALOG_STYLES;
    document.head.appendChild(style);
  }
}

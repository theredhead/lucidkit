import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  Injector,
} from "@angular/core";

import { ModalRef, type OpenModalConfig } from "./modal.types";

// ── Modal stylesheet (injected into <head> once) ───────────────────

/** @internal */
const MODAL_STYLES = /* css */ `
/* ── ui-modal base ──────────────────────────────────────── */

dialog.ui-modal {
  border: none;
  border-radius: 0.5rem;
  padding: 0;
  max-width: min(90vw, 40rem);
  max-height: 85vh;
  overflow: auto;
  background: var(--theredhead-surface, #fff);
  color: var(--theredhead-on-surface, #1d232b);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  animation: ui-modal-enter 180ms ease-out;
}

dialog.ui-modal::backdrop {
  background: rgba(0, 0, 0, 0.45);
  animation: ui-modal-backdrop-enter 180ms ease-out;
}

/* ── dark mode (explicit class) ─────────────────────────── */

html.dark-theme dialog.ui-modal {
  background: var(--theredhead-surface, #1e2228);
  color: var(--theredhead-on-surface, #f2f6fb);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

html.dark-theme dialog.ui-modal::backdrop {
  background: rgba(0, 0, 0, 0.65);
}

/* ── dark mode (system preference fallback) ─────────────── */

@media (prefers-color-scheme: dark) {
  html:not(.light-theme):not(.dark-theme) dialog.ui-modal {
    background: var(--theredhead-surface, #1e2228);
    color: var(--theredhead-on-surface, #f2f6fb);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }

  html:not(.light-theme):not(.dark-theme) dialog.ui-modal::backdrop {
    background: rgba(0, 0, 0, 0.65);
  }
}

/* ── animations ─────────────────────────────────────────── */

@keyframes ui-modal-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes ui-modal-backdrop-enter {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;

// ── Service ────────────────────────────────────────────────────────

/**
 * Service for opening modal dialogs using the native HTML5
 * `<dialog>` element.
 *
 * Content components implement {@link UIModalContent} and receive a
 * {@link ModalRef} via dependency injection to close themselves and
 * return a result.
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
  openModal<T, R = unknown>(config: OpenModalConfig<T>): ModalRef<R> {
    this.ensureStyles();

    const modalRef = new ModalRef<R>();

    // ── Create native <dialog> ──────────────────────────────

    const dialog = document.createElement("dialog");
    dialog.classList.add("ui-modal");

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

  /** Injects the modal stylesheet into `<head>` once. */
  private ensureStyles(): void {
    if (this.stylesInjected) return;
    this.stylesInjected = true;
    const style = document.createElement("style");
    style.setAttribute("data-ui-modal", "");
    style.textContent = MODAL_STYLES;
    document.head.appendChild(style);
  }
}

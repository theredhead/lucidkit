import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  Injector,
} from "@angular/core";

import {
  PopoverRef,
  type OpenPopoverConfig,
  type PopoverPlacement,
} from "./popover.types";

// ── Popover stylesheet (injected into <head> once) ─────────────────

/** @internal */
const POPOVER_STYLES = /* css */ `
/* ── ui-popover base ────────────────────────────────────── */

.ui-popover {
  position: fixed;
  margin: 0;
  border: 1px solid var(--theredhead-outline-variant, #d7dce2);
  border-radius: 0.375rem;
  padding: 0;
  background: var(--theredhead-surface, #fff);
  color: var(--theredhead-on-surface, #1d232b);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.14);
  animation: ui-popover-enter 120ms ease-out;
  overflow: auto;
  max-width: min(90vw, 24rem);
  max-height: 70vh;
}

/* ── dark mode (explicit class) ─────────────────────────── */

html.dark-theme .ui-popover {
  background: var(--theredhead-surface, #1e2228);
  color: var(--theredhead-on-surface, #f2f6fb);
  border-color: var(--theredhead-outline-variant, #3a3f47);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

/* ── dark mode (system preference fallback) ─────────────── */

@media (prefers-color-scheme: dark) {
  html:not(.light-theme):not(.dark-theme) .ui-popover {
    background: var(--theredhead-surface, #1e2228);
    color: var(--theredhead-on-surface, #f2f6fb);
    border-color: var(--theredhead-outline-variant, #3a3f47);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  }
}

/* ── animation ──────────────────────────────────────────── */

@keyframes ui-popover-enter {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

// ── Positioning helper ─────────────────────────────────────────────

/** @internal */
interface Position {
  top: number;
  left: number;
}

/**
 * Computes fixed-position coordinates for the popover relative to
 * the anchor rect and viewport.
 *
 * @internal
 */
function computePosition(
  anchorRect: DOMRect,
  popoverRect: DOMRect,
  placement: PopoverPlacement,
  offset: number,
): Position {
  let top = 0;
  let left = 0;

  const side = placement.split("-")[0] as
    | "top"
    | "bottom"
    | "left"
    | "right";
  const align = placement.split("-")[1] as
    | "start"
    | "end"
    | undefined;

  // ── Side positioning ────────────────────────────────────

  switch (side) {
    case "bottom":
      top = anchorRect.bottom + offset;
      break;
    case "top":
      top = anchorRect.top - popoverRect.height - offset;
      break;
    case "left":
      left = anchorRect.left - popoverRect.width - offset;
      break;
    case "right":
      left = anchorRect.right + offset;
      break;
  }

  // ── Alignment along the cross axis ──────────────────────

  if (side === "top" || side === "bottom") {
    switch (align) {
      case "start":
        left = anchorRect.left;
        break;
      case "end":
        left = anchorRect.right - popoverRect.width;
        break;
      default: // centre
        left = anchorRect.left + (anchorRect.width - popoverRect.width) / 2;
    }
  } else {
    switch (align) {
      case "start":
        top = anchorRect.top;
        break;
      case "end":
        top = anchorRect.bottom - popoverRect.height;
        break;
      default: // centre
        top = anchorRect.top + (anchorRect.height - popoverRect.height) / 2;
    }
  }

  // ── Viewport clamping ───────────────────────────────────

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pad = 8;

  if (left + popoverRect.width > vw - pad) left = vw - popoverRect.width - pad;
  if (left < pad) left = pad;
  if (top + popoverRect.height > vh - pad) top = vh - popoverRect.height - pad;
  if (top < pad) top = pad;

  return { top, left };
}

// ── Service ────────────────────────────────────────────────────────

/**
 * Service for opening non-modal popovers anchored to a DOM element
 * using the native HTML5 Popover API (`[popover]`,
 * `showPopover()`).
 *
 * Ideal for context menus, rich tooltips, dropdown panels, and any
 * content that should float above the page without blocking
 * interaction with the rest of the UI.
 *
 * Content components implement {@link UIPopoverContent} and receive
 * a {@link PopoverRef} via dependency injection.
 *
 * @example
 * ```ts
 * this.popover.openPopover<MyMenu, string>({
 *   component: MyMenu,
 *   anchor: buttonElement,
 *   placement: 'bottom-start',
 *   inputs: { items: menuItems },
 * }).closed.subscribe((action) => this.handleAction(action));
 * ```
 */
@Injectable({ providedIn: "root" })
export class PopoverService {
  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);
  private stylesInjected = false;

  /**
   * Opens a popover anchored to the given element.
   *
   * @param config  Component type, anchor, placement, inputs, and
   *                output handlers.
   * @returns A {@link PopoverRef} to observe the result or close
   *          programmatically.
   */
  openPopover<T, R = unknown>(config: OpenPopoverConfig<T>): PopoverRef<R> {
    this.ensureStyles();

    const popoverRef = new PopoverRef<R>();
    const placement = config.placement ?? "bottom-start";
    const offset = config.offset ?? 4;
    const useAutoPopover = config.closeOnOutsideClick !== false;

    // ── Create the popover host element ─────────────────────

    const host = document.createElement("div");
    host.classList.add("ui-popover");
    host.setAttribute("popover", useAutoPopover ? "auto" : "manual");

    if (config.ariaLabel) {
      host.setAttribute("aria-label", config.ariaLabel);
    }

    // ── Build a child injector providing PopoverRef ──────────

    const popoverInjector = Injector.create({
      providers: [{ provide: PopoverRef, useValue: popoverRef }],
      parent: this.envInjector,
    });

    // ── Dynamically create the content component ────────────

    const componentRef = createComponent(config.component, {
      environmentInjector: this.envInjector,
      elementInjector: popoverInjector,
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
          popoverRef.onDestroy(() => sub.unsubscribe());
        }
      }
    }

    // ── Assemble DOM, show, and position ────────────────────

    host.appendChild(componentRef.location.nativeElement);
    document.body.appendChild(host);
    this.appRef.attachView(componentRef.hostView);
    host.showPopover();

    // Position after showing so the popover has layout dimensions
    this.positionPopover(host, config.anchor, placement, offset);

    // ── Register teardown ───────────────────────────────────

    popoverRef.onDestroy(() => {
      try {
        host.hidePopover();
      } catch {
        /* already hidden */
      }
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
      host.remove();
    });

    // ── Native toggle event (light-dismiss) ─────────────────

    host.addEventListener("toggle", (e: Event) => {
      const toggleEvent = e as ToggleEvent;
      if (toggleEvent.newState === "closed" && !popoverRef.isClosed) {
        popoverRef.close(undefined);
      }
    });

    // ── Reposition on scroll/resize ─────────────────────────

    const reposition = () => {
      if (popoverRef.isClosed) return;
      this.positionPopover(host, config.anchor, placement, offset);
    };
    window.addEventListener("scroll", reposition, { passive: true });
    window.addEventListener("resize", reposition, { passive: true });
    popoverRef.onDestroy(() => {
      window.removeEventListener("scroll", reposition);
      window.removeEventListener("resize", reposition);
    });

    return popoverRef;
  }

  // ── Internals ──────────────────────────────────────────────────

  /** @internal */
  private positionPopover(
    host: HTMLElement,
    anchor: Element,
    placement: PopoverPlacement,
    offset: number,
  ): void {
    const anchorRect = anchor.getBoundingClientRect();
    const popoverRect = host.getBoundingClientRect();
    const pos = computePosition(anchorRect, popoverRect, placement, offset);
    host.style.top = `${pos.top}px`;
    host.style.left = `${pos.left}px`;
  }

  /** Injects the popover stylesheet into `<head>` once. */
  private ensureStyles(): void {
    if (this.stylesInjected) return;
    this.stylesInjected = true;
    const style = document.createElement("style");
    style.setAttribute("data-ui-popover", "");
    style.textContent = POPOVER_STYLES;
    document.head.appendChild(style);
  }
}

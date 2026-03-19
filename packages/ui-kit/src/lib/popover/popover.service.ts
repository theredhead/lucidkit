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
  type PopoverHorizontalAlignment,
  type PopoverVerticalAlignment,
} from "./popover.types";

// ── Popover stylesheet (injected into <head> once) ─────────────────

/** @internal */
const POPOVER_STYLES = /* css */ `
/* ── ui-popover base ────────────────────────────────────── */

.ui-popover {
  position: fixed;
  margin: 0;
  inset: unset;
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

/* ── arrow ──────────────────────────────────────────────── */

.ui-popover[data-arrow-side] {
  overflow: visible;
}

.ui-popover[data-arrow-side]::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  background: inherit;
  border: inherit;
  border-radius: 0 0 2px 0;
  pointer-events: none;
}

/* bottom arrow (popover above anchor) */
.ui-popover[data-arrow-side="bottom"]::after {
  bottom: -8px;
  left: calc(var(--ui-popover-arrow-offset, 50%) - 7px);
  transform: rotate(45deg);
  border-top: none;
  border-left: none;
}

/* top arrow (popover below anchor) */
.ui-popover[data-arrow-side="top"]::after {
  top: -8px;
  left: calc(var(--ui-popover-arrow-offset, 50%) - 7px);
  transform: rotate(-135deg);
  border-top: none;
  border-left: none;
}

/* right arrow (popover to the left of anchor) */
.ui-popover[data-arrow-side="right"]::after {
  right: -8px;
  top: calc(var(--ui-popover-arrow-offset, 50%) - 7px);
  transform: rotate(-45deg);
  border-top: none;
  border-left: none;
}

/* left arrow (popover to the right of anchor) */
.ui-popover[data-arrow-side="left"]::after {
  left: -8px;
  top: calc(var(--ui-popover-arrow-offset, 50%) - 7px);
  transform: rotate(135deg);
  border-top: none;
  border-left: none;
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

/**
 * The side of the popover that the arrow should appear on.
 * Corresponds to the edge of the popover closest to the anchor.
 *
 * - `'top'`    — arrow on top edge (popover is below the anchor)
 * - `'bottom'` — arrow on bottom edge (popover is above the anchor)
 * - `'left'`   — arrow on left edge (popover is to the right of the anchor)
 * - `'right'`  — arrow on right edge (popover is to the left of the anchor)
 */
export type PopoverArrowSide = "top" | "bottom" | "left" | "right";

/** @internal */
interface Position {
  top: number;
  left: number;
  resolvedV: "top" | "center" | "bottom";
  resolvedH: "start" | "center" | "end";
}

/**
 * Resolves `'auto'` vertical alignment by picking the side of the
 * anchor with the most available viewport space.
 *
 * Prefers `'bottom'` when the popover fits below the anchor, then
 * falls back to `'top'` if it fits above, and finally picks
 * whichever side has more room.
 *
 * @internal
 */
function resolveVerticalAuto(
  anchorRect: DOMRect,
  popoverRect: DOMRect,
  vh: number,
): "top" | "bottom" {
  const spaceBelow = vh - anchorRect.bottom;
  const spaceAbove = anchorRect.top;

  if (spaceBelow >= popoverRect.height) return "bottom";
  if (spaceAbove >= popoverRect.height) return "top";
  return spaceBelow >= spaceAbove ? "bottom" : "top";
}

/**
 * Resolves `'auto'` horizontal alignment.
 *
 * Prefers `'center'` when the popover fits centred on the anchor
 * within the viewport, otherwise picks the side with more room.
 *
 * @internal
 */
function resolveHorizontalAuto(
  anchorRect: DOMRect,
  popoverRect: DOMRect,
  vw: number,
): "start" | "center" | "end" {
  const pad = 8;
  const centeredLeft =
    anchorRect.left + (anchorRect.width - popoverRect.width) / 2;

  if (centeredLeft >= pad && centeredLeft + popoverRect.width <= vw - pad) {
    return "center";
  }

  const spaceRight = vw - anchorRect.right;
  const spaceLeft = anchorRect.left;
  return spaceRight >= spaceLeft ? "end" : "start";
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
  vAlign: PopoverVerticalAlignment,
  hAlign: PopoverHorizontalAlignment,
  vOffset: number,
  hOffset: number,
): Position {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pad = 8;

  // ── Resolve auto alignments ───────────────────────────────

  const resolvedV =
    vAlign === "auto"
      ? resolveVerticalAuto(anchorRect, popoverRect, vh)
      : vAlign;
  const resolvedH =
    hAlign === "auto"
      ? resolveHorizontalAuto(anchorRect, popoverRect, vw)
      : hAlign;

  // Always push AWAY from the anchor so the gap is consistent
  // regardless of which side was chosen (auto-resolved or explicit).
  const effectiveVOffset = resolvedV === "top" ? -Math.abs(vOffset) : vOffset;
  const effectiveHOffset = resolvedH === "start" ? -Math.abs(hOffset) : hOffset;

  let top = 0;
  let left = 0;

  // ── Vertical axis ─────────────────────────────────────────

  switch (resolvedV) {
    case "top":
      top = anchorRect.top - popoverRect.height;
      break;
    case "center":
      top = anchorRect.top + (anchorRect.height - popoverRect.height) / 2;
      break;
    case "bottom":
      top = anchorRect.bottom;
      break;
  }

  // ── Horizontal axis ───────────────────────────────────────

  switch (resolvedH) {
    case "start":
      left = anchorRect.left - popoverRect.width;
      break;
    case "center":
      left = anchorRect.left + (anchorRect.width - popoverRect.width) / 2;
      break;
    case "end":
      left = anchorRect.right;
      break;
  }

  // ── Apply offsets ─────────────────────────────────────────

  top += effectiveVOffset;
  left += effectiveHOffset;

  // ── Viewport clamping ─────────────────────────────────────

  if (left + popoverRect.width > vw - pad) left = vw - popoverRect.width - pad;
  if (left < pad) left = pad;
  if (top + popoverRect.height > vh - pad) top = vh - popoverRect.height - pad;
  if (top < pad) top = pad;

  return { top, left, resolvedV, resolvedH };
}

/**
 * Derives the arrow side from the resolved alignment values.
 *
 * For side-anchored popovers (start / end) the arrow appears on
 * the edge closest to the anchor. For top/bottom anchored
 * popovers the arrow appears on the top or bottom edge.
 *
 * @internal
 */
function deriveArrowSide(
  resolvedV: "top" | "center" | "bottom",
  resolvedH: "start" | "center" | "end",
): PopoverArrowSide {
  // Side-anchored (horizontal placement)
  if (resolvedH === "end" && resolvedV === "center") return "left";
  if (resolvedH === "start" && resolvedV === "center") return "right";

  // Vertical placement (most common)
  if (resolvedV === "bottom") return "top";
  if (resolvedV === "top") return "bottom";

  // Fallback for center/center
  return "top";
}

/**
 * Computes the arrow offset so that the arrow points at the
 * horizontal (or vertical) centre of the anchor element.
 *
 * Returns a pixel value relative to the popover's edge.
 *
 * @internal
 */
function computeArrowOffset(
  anchorRect: DOMRect,
  popoverRect: DOMRect,
  arrowSide: PopoverArrowSide,
): number {
  if (arrowSide === "top" || arrowSide === "bottom") {
    // Arrow on top/bottom → offset along horizontal axis
    const anchorCenter = anchorRect.left + anchorRect.width / 2;
    return anchorCenter - popoverRect.left;
  }
  // Arrow on left/right → offset along vertical axis
  const anchorCenter = anchorRect.top + anchorRect.height / 2;
  return anchorCenter - popoverRect.top;
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
 *   verticalAxisAlignment: 'bottom',
 *   horizontalAxisAlignment: 'start',
 *   verticalOffset: 4,
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
    const vAlign = config.verticalAxisAlignment ?? "auto";
    const hAlign = config.horizontalAxisAlignment ?? "auto";
    const showArrow = config.showArrow ?? false;
    const arrowGap = config.arrowGap ?? 16;
    const vOffset = config.verticalOffset ?? (showArrow ? arrowGap : 4);
    const hOffset = config.horizontalOffset ?? (showArrow ? arrowGap : 0);
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // Run change detection so the content component renders its
    // template and the popover element gets real dimensions.
    componentRef.changeDetectorRef.detectChanges();

    host.showPopover();

    // Position immediately with the dimensions we have now.
    this.positionPopover(
      host,
      config.anchor,
      vAlign,
      hAlign,
      vOffset,
      hOffset,
      showArrow,
    );

    // Re-position after the next frame in case the browser
    // needed an additional layout pass (e.g. async projections,
    // font loading, images).
    const rafId = requestAnimationFrame(() => {
      if (!popoverRef.isClosed) {
        this.positionPopover(
          host,
          config.anchor,
          vAlign,
          hAlign,
          vOffset,
          hOffset,
          showArrow,
        );
      }
    });
    popoverRef.onDestroy(() => cancelAnimationFrame(rafId));

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
      this.positionPopover(
        host,
        config.anchor,
        vAlign,
        hAlign,
        vOffset,
        hOffset,
        showArrow,
      );
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
    vAlign: PopoverVerticalAlignment,
    hAlign: PopoverHorizontalAlignment,
    vOffset: number,
    hOffset: number,
    showArrow = false,
  ): void {
    const anchorRect = anchor.getBoundingClientRect();
    const popoverRect = host.getBoundingClientRect();
    const pos = computePosition(
      anchorRect,
      popoverRect,
      vAlign,
      hAlign,
      vOffset,
      hOffset,
    );
    host.style.top = `${pos.top}px`;
    host.style.left = `${pos.left}px`;

    if (showArrow) {
      const arrowSide = deriveArrowSide(pos.resolvedV, pos.resolvedH);
      host.setAttribute("data-arrow-side", arrowSide);

      // Re-read the positioned rect for accurate arrow offset
      const positionedRect = new DOMRect(
        pos.left,
        pos.top,
        popoverRect.width,
        popoverRect.height,
      );
      const offset = computeArrowOffset(anchorRect, positionedRect, arrowSide);
      host.style.setProperty("--ui-popover-arrow-offset", `${offset}px`);
    }
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

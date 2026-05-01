import { Directive, ElementRef, inject, input, OnDestroy } from "@angular/core";

import type { TooltipPosition } from "./tooltip.types";

/**
 * A lightweight tooltip directive.
 *
 * Attach to any element to display a text tooltip on hover/focus.
 *
 * @example
 * ```html
 * <button uiTooltip="Save your work" tooltipPosition="top">Save</button>
 * ```
 */
@Directive({
  selector: "[uiTooltip]",
  standalone: true,
  host: {
    "(mouseenter)": "show()",
    "(mouseleave)": "hide()",
    "(focus)": "show()",
    "(blur)": "hide()",
  },
})
export class UITooltip implements OnDestroy {
  /** The tooltip text content. */
  public readonly uiTooltip = input.required<string>();

  /** Position relative to the host element. */
  public readonly tooltipPosition = input<TooltipPosition>("top");

  /** Delay in ms before showing the tooltip. */
  public readonly tooltipDelay = input(200);

  private readonly el = inject(ElementRef<HTMLElement>);

  private tooltipElement: HTMLElement | null = null;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Show the tooltip after the configured delay. */
  public show(): void {
    if (this.showTimeout || this.tooltipElement) {
      return;
    }
    const delay = this.tooltipDelay();
    if (delay <= 0) {
      this.createTooltip();
    } else {
      this.showTimeout = setTimeout(() => {
        this.showTimeout = null;
        this.createTooltip();
      }, delay);
    }
  }

  /** Hide and destroy the tooltip. */
  public hide(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    this.destroyTooltip();
  }

  public ngOnDestroy(): void {
    this.hide();
  }

  private createTooltip(): void {
    if (this.tooltipElement) {
      return;
    }

    const text = this.uiTooltip();
    if (!text) {
      return;
    }

    const el = document.createElement("div");
    // For 'auto', the resolved position class is applied in positionTooltip().
    const position = this.tooltipPosition();
    el.className =
      position === "auto" ? "ui-tooltip" : `ui-tooltip ${position}`;
    el.setAttribute("role", "tooltip");
    el.textContent = text;
    document.body.appendChild(el);
    this.tooltipElement = el;

    this.positionTooltip();
  }

  private positionTooltip(): void {
    if (!this.tooltipElement) {
      return;
    }

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    const gap = 8;

    const requestedPosition = this.tooltipPosition();
    const resolvedPosition =
      requestedPosition === "auto"
        ? this.resolveAutoPosition(hostRect, tooltipRect, gap)
        : requestedPosition;

    if (requestedPosition === "auto") {
      this.tooltipElement.className = `ui-tooltip ${resolvedPosition}`;
    }

    let top = 0;
    let left = 0;

    switch (resolvedPosition) {
      case "top":
        top = hostRect.top - tooltipRect.height - gap;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      case "bottom":
        top = hostRect.bottom + gap;
        left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
        break;
      case "left":
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left - tooltipRect.width - gap;
        break;
      case "right":
        top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.right + gap;
        break;
    }

    // When auto, clamp coordinates so the tooltip stays within the viewport.
    if (requestedPosition === "auto") {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      left = Math.max(gap, Math.min(left, vw - tooltipRect.width - gap));
      top = Math.max(gap, Math.min(top, vh - tooltipRect.height - gap));
    }

    this.tooltipElement.style.top = `${top + window.scrollY}px`;
    this.tooltipElement.style.left = `${left + window.scrollX}px`;
  }

  /**
   * Selects the first position that fits within the current viewport.
   *
   * Preference order: top → bottom → right → left. Falls back to `top`
   * if no position fits entirely (the coordinates will then be clamped).
   *
   * @internal
   */
  private resolveAutoPosition(
    hostRect: DOMRect,
    tooltipRect: DOMRect,
    gap: number,
  ): "top" | "bottom" | "left" | "right" {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const fits: Record<"top" | "bottom" | "left" | "right", boolean> = {
      top: hostRect.top - tooltipRect.height - gap >= 0,
      bottom: hostRect.bottom + gap + tooltipRect.height <= vh,
      right: hostRect.right + gap + tooltipRect.width <= vw,
      left: hostRect.left - tooltipRect.width - gap >= 0,
    };

    for (const pos of ["top", "bottom", "right", "left"] as const) {
      if (fits[pos]) {
        return pos;
      }
    }

    return "top";
  }

  private destroyTooltip(): void {
    if (this.tooltipElement) {
      this.tooltipElement.remove();
      this.tooltipElement = null;
    }
  }
}

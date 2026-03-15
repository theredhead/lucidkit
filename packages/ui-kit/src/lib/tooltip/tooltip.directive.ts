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
    el.className = `ui-tooltip ui-tooltip--${this.tooltipPosition()}`;
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

    let top = 0;
    let left = 0;

    switch (this.tooltipPosition()) {
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

    this.tooltipElement.style.top = `${top + window.scrollY}px`;
    this.tooltipElement.style.left = `${left + window.scrollX}px`;
  }

  private destroyTooltip(): void {
    if (this.tooltipElement) {
      this.tooltipElement.remove();
      this.tooltipElement = null;
    }
  }
}

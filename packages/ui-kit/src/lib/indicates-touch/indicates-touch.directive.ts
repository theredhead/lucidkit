import { DOCUMENT } from "@angular/common";
import { Directive, ElementRef, OnDestroy, inject } from "@angular/core";

const STYLE_ID = "ui-indicates-touch-styles";

function ensureRippleStyles(doc: Document): void {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
.ui-ripple-wave {
  position: absolute;
  border-radius: 50%;
  background: var(--ui-ripple-color, rgba(255, 255, 255, 0.35));
  transform: scale(0);
  animation: ui-ripple 500ms ease-out forwards;
  pointer-events: none;
}
@keyframes ui-ripple {
  to {
    opacity: 0;
    transform: scale(3);
  }
}
`;
  doc.head.appendChild(style);
}

/**
 * Adds a touch-ripple feedback effect to the host element on pointer interaction.
 *
 * Apply as the `[uiIndicatesTouch]` attribute on any element that should
 * respond with a ripple. The host element gains `position: relative` and
 * `overflow: hidden` automatically.
 *
 * The ripple colour is controlled via the `--ui-ripple-color` CSS custom
 * property (default: `rgba(255, 255, 255, 0.35)`).
 *
 * @example
 * ```html
 * <button uiIndicatesTouch>Click me</button>
 * ```
 */
@Directive({
  selector: "[uiIndicatesTouch]",
  standalone: true,
  host: {
    style: "position: relative; overflow: hidden;",
  },
})
export class UIIndicatesTouch implements OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly doc = inject(DOCUMENT);

  private readonly onPointerDown = (event: PointerEvent): void => {
    const el = this.el.nativeElement;
    if ((el as HTMLButtonElement).disabled) return;

    const rect = el.getBoundingClientRect();
    const diameter = Math.max(el.clientWidth, el.clientHeight);
    const radius = diameter / 2;

    const ripple = this.doc.createElement("div");
    ripple.classList.add("ui-ripple-wave");
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;

    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  };

  public constructor() {
    ensureRippleStyles(this.doc);
    this.el.nativeElement.addEventListener("pointerdown", this.onPointerDown);
  }

  public ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener(
      "pointerdown",
      this.onPointerDown,
    );
  }
}

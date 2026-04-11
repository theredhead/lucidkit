import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  ElementRef,
  inject,
  input,
  model,
  output,
  TemplateRef,
} from "@angular/core";
import { NgStyle, NgTemplateOutlet } from "@angular/common";

import type {
  CarouselItemContext,
  CarouselItemStyle,
  CarouselStrategy,
} from "./carousel.types";
import { CoverflowCarouselStrategy } from "./coverflow-strategy";
import { UISurface } from "@theredhead/lucid-foundation";

/**
 * A generic carousel that delegates layout and animation to a
 * pluggable {@link CarouselStrategy}.
 *
 * Supply a data array via `[items]` and a projected `<ng-template>`
 * that receives a {@link CarouselItemContext}. Navigation is driven
 * by the two-way `[(activeIndex)]` model, or via the built-in
 * prev / next buttons.
 *
 * Two strategies ship out of the box:
 *
 * - {@link ScrollCarouselStrategy} — horizontal slide
 * - {@link CoverflowCarouselStrategy} — 3D perspective fan
 *
 * @example
 * ```html
 * <ui-carousel [items]="albums" [strategy]="coverflow">
 *   <ng-template let-album>
 *     <img [src]="album.cover" [alt]="album.title" />
 *   </ng-template>
 * </ui-carousel>
 * ```
 */
@Component({
  selector: "ui-carousel",
  standalone: true,
  imports: [NgStyle, NgTemplateOutlet],
  templateUrl: "./carousel.component.html",
  styleUrl: "./carousel.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: {
    class: "ui-carousel",
    "(keydown.arrowLeft)": "prev()",
    "(keydown.arrowRight)": "next()",
    tabindex: "0",
    role: "region",
    "[attr.aria-label]": "ariaLabel()",
    "[attr.aria-roledescription]": "'carousel'",
    "[class.disabled]": "disabled()",
  },
})
export class UICarousel<T = unknown> {
  // ── Inputs ──────────────────────────────────────────────────────────

  /** Whether the carousel is disabled. */
  public readonly disabled = input<boolean>(false);

  /** Data items to display. */
  public readonly items = input.required<readonly T[]>();

  /**
   * Layout / animation strategy.
   *
   * Defaults to {@link CoverflowCarouselStrategy} (3D coverflow).
   * Switch to {@link ScrollCarouselStrategy} for a simpler
   * horizontal slide.
   */
  public readonly strategy = input<CarouselStrategy>(
    new CoverflowCarouselStrategy(),
  );

  /** Whether to show the previous / next navigation buttons. */
  public readonly showControls = input(true);

  /** Whether to show dot indicators below the carousel. */
  public readonly showIndicators = input(true);

  /**
   * When `true` the carousel wraps around: navigating past
   * the last item jumps to the first, and vice-versa.
   */
  public readonly wrap = input(false);

  /** Accessible label for the carousel region. */
  public readonly ariaLabel = input<string>("Carousel");

  // ── Models ──────────────────────────────────────────────────────────

  /** Zero-based index of the currently active (centred) item. */
  public readonly activeIndex = model(0);

  // ── Outputs ─────────────────────────────────────────────────────────

  /** Emitted when the active index changes. */
  public readonly activeIndexChange = output<number>();

  // ── Content queries ─────────────────────────────────────────────────

  /**
   * Projected item template.
   *
   * Receives a {@link CarouselItemContext} with `$implicit` (the item),
   * `index`, and `active`.
   */
  public readonly itemTemplate =
    contentChild.required<TemplateRef<CarouselItemContext<T>>>(TemplateRef);

  // ── Private fields ──────────────────────────────────────────────────

  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * Cooldown flag that prevents rapid-fire navigation from
   * high-frequency wheel / trackpad events.
   * @internal
   */
  private wheelCooldown = false;

  // ── Constructor ─────────────────────────────────────────────────────

  public constructor() {
    // Attach wheel listener outside Angular's template binding so
    // high-frequency events don't trigger unnecessary CD cycles.
    // `passive: false` lets us call `preventDefault()` to stop
    // the page from scrolling while the carousel captures the gesture.
    afterNextRender(() => {
      const el = this.elRef.nativeElement;
      const handler = (e: WheelEvent) => this.onWheel(e);
      el.addEventListener("wheel", handler, { passive: false });
      this.destroyRef.onDestroy(() => el.removeEventListener("wheel", handler));
    });
  }

  // ── Computed ────────────────────────────────────────────────────────

  /** Whether the prev button should be disabled (never in wrap mode). */
  protected readonly hasPrev = computed(
    () => this.wrap() || this.activeIndex() > 0,
  );

  /** Whether the next button should be disabled (never in wrap mode). */
  protected readonly hasNext = computed(
    () => this.wrap() || this.activeIndex() < this.items().length - 1,
  );

  /** Track style from the strategy. */
  protected readonly trackStyle = computed(() =>
    this.strategy().getTrackStyle(),
  );

  /** Per-item styles resolved from the current strategy and active index. */
  protected readonly itemStyles = computed(() => {
    const strat = this.strategy();
    const active = this.activeIndex();
    const total = this.items().length;
    const w = this.wrap();
    return this.items().map((_, i) => strat.getItemStyle(i, active, total, w));
  });

  // ── Public methods ──────────────────────────────────────────────────

  /** Navigate to the previous item. */
  public prev(): void {
    const len = this.items().length;
    if (len === 0) return;

    if (this.wrap()) {
      this.goTo((this.activeIndex() - 1 + len) % len);
    } else if (this.hasPrev()) {
      this.goTo(this.activeIndex() - 1);
    }
  }

  /** Navigate to the next item. */
  public next(): void {
    const len = this.items().length;
    if (len === 0) return;

    if (this.wrap()) {
      this.goTo((this.activeIndex() + 1) % len);
    } else if (this.hasNext()) {
      this.goTo(this.activeIndex() + 1);
    }
  }

  /** Navigate directly to a specific index. */
  public goTo(index: number): void {
    const len = this.items().length;
    if (len === 0) return;

    let target: number;
    if (this.wrap()) {
      target = ((index % len) + len) % len;
    } else {
      target = Math.max(0, Math.min(index, len - 1));
    }
    this.activeIndex.set(target);
    this.activeIndexChange.emit(target);
  }

  // ── Template helpers ────────────────────────────────────────────────

  /** @internal Build the template context for a given index. */
  protected buildContext(item: T, index: number): CarouselItemContext<T> {
    return {
      $implicit: item,
      item,
      index,
      active: index === this.activeIndex(),
    };
  }

  /** @internal Convert a CarouselItemStyle to an inline style object. */
  protected toStyleMap(style: CarouselItemStyle): Record<string, string> {
    const map: Record<string, string> = {};
    if (style.transform != null) {
      map["transform"] = `translate(-50%, -50%) ${style.transform}`;
    } else {
      map["transform"] = "translate(-50%, -50%)";
    }
    if (style.opacity != null) {
      map["opacity"] = String(style.opacity);
    }
    if (style.zIndex != null) {
      map["z-index"] = String(style.zIndex);
    }
    if (style.transition != null) {
      map["transition"] = style.transition;
    }
    if (style.pointerEvents != null) {
      map["pointer-events"] = style.pointerEvents;
    }
    if (style.filter != null) {
      map["filter"] = style.filter;
    }
    return map;
  }

  // ── Private methods ─────────────────────────────────────────────────

  /**
   * Handle horizontal wheel / trackpad gestures.
   *
   * Uses a short cooldown so each deliberate scroll "tick"
   * advances exactly one item, even on trackpads that fire
   * dozens of wheel events per gesture.
   *
   * @internal
   */
  private onWheel(event: WheelEvent): void {
    // Prefer deltaX (horizontal scroll); fall back to deltaY so a
    // regular mouse wheel also works when the cursor is over the
    // carousel.
    const delta =
      Math.abs(event.deltaX) >= Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

    // Ignore tiny deltas (noise) and respect cooldown.
    if (Math.abs(delta) < 5 || this.wheelCooldown) return;

    event.preventDefault();

    this.wheelCooldown = true;
    setTimeout(() => (this.wheelCooldown = false), 250);

    if (delta > 0) {
      this.next();
    } else {
      this.prev();
    }
  }
}

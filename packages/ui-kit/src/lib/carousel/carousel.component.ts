import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
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
import { ScrollCarouselStrategy } from "./scroll-strategy";

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
  host: {
    class: "ui-carousel",
    "(keydown.arrowLeft)": "prev()",
    "(keydown.arrowRight)": "next()",
    tabindex: "0",
    role: "region",
    "[attr.aria-label]": "ariaLabel()",
    "[attr.aria-roledescription]": "'carousel'",
  },
})
export class UICarousel<T = unknown> {
  // ── Inputs ──────────────────────────────────────────────────────────

  /** Data items to display. */
  public readonly items = input.required<readonly T[]>();

  /**
   * Layout / animation strategy.
   *
   * Defaults to {@link ScrollCarouselStrategy} (simple horizontal
   * scroll). Switch to {@link CoverflowCarouselStrategy} for the
   * classic 3D coverflow effect.
   */
  public readonly strategy = input<CarouselStrategy>(
    new ScrollCarouselStrategy(),
  );

  /** Whether to show the previous / next navigation buttons. */
  public readonly showControls = input(true);

  /** Whether to show dot indicators below the carousel. */
  public readonly showIndicators = input(true);

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

  // ── Computed ────────────────────────────────────────────────────────

  /** Whether the prev button should be disabled. */
  protected readonly hasPrev = computed(() => this.activeIndex() > 0);

  /** Whether the next button should be disabled. */
  protected readonly hasNext = computed(
    () => this.activeIndex() < this.items().length - 1,
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
    return this.items().map((_, i) => strat.getItemStyle(i, active, total));
  });

  // ── Public methods ──────────────────────────────────────────────────

  /** Navigate to the previous item. */
  public prev(): void {
    if (this.hasPrev()) {
      this.goTo(this.activeIndex() - 1);
    }
  }

  /** Navigate to the next item. */
  public next(): void {
    if (this.hasNext()) {
      this.goTo(this.activeIndex() + 1);
    }
  }

  /** Navigate directly to a specific index. */
  public goTo(index: number): void {
    const clamped = Math.max(0, Math.min(index, this.items().length - 1));
    this.activeIndex.set(clamped);
    this.activeIndexChange.emit(clamped);
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
      map["transform"] = style.transform;
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
}

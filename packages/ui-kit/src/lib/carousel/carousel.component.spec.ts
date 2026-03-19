import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import { UICarousel } from "./carousel.component";
import { ScrollCarouselStrategy } from "./scroll-strategy";
import { CoverflowCarouselStrategy } from "./coverflow-strategy";
import type { CarouselStrategy } from "./carousel.types";

@Component({
  standalone: true,
  imports: [UICarousel],
  template: `
    <ui-carousel
      [items]="items()"
      [strategy]="strategy()"
      [showControls]="showControls()"
      [showIndicators]="showIndicators()"
      [wrap]="wrap()"
      [(activeIndex)]="activeIndex"
    >
      <ng-template let-item>
        <div class="test-slide">{{ item }}</div>
      </ng-template>
    </ui-carousel>
  `,
})
class TestHost {
  public readonly items = signal<readonly string[]>([
    "Alpha",
    "Bravo",
    "Charlie",
    "Delta",
    "Echo",
  ]);
  public readonly strategy = signal<CarouselStrategy>(
    new ScrollCarouselStrategy(),
  );
  public readonly showControls = signal(true);
  public readonly showIndicators = signal(true);
  public readonly wrap = signal(false);
  public readonly activeIndex = signal(0);
}

describe("UICarousel", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement.querySelector("ui-carousel");
  });

  it("should create", () => {
    expect(el).toBeTruthy();
  });

  it("should have ui-carousel host class", () => {
    expect(el.classList).toContain("ui-carousel");
  });

  it("should have carousel role attributes", () => {
    expect(el.getAttribute("role")).toBe("region");
    expect(el.getAttribute("aria-roledescription")).toBe("carousel");
  });

  describe("items", () => {
    it("should render all items", () => {
      const items = el.querySelectorAll(".cr-item");
      expect(items.length).toBe(5);
    });

    it("should render projected template content", () => {
      const slides = el.querySelectorAll(".test-slide");
      expect(slides[0].textContent).toBe("Alpha");
      expect(slides[4].textContent).toBe("Echo");
    });

    it("should mark the active item", () => {
      const items = el.querySelectorAll(".cr-item");
      expect(items[0].classList).toContain("cr-item--active");
      expect(items[1].classList).not.toContain("cr-item--active");
    });

    it("should update active item when activeIndex changes", () => {
      host.activeIndex.set(2);
      fixture.detectChanges();
      const items = el.querySelectorAll(".cr-item");
      expect(items[2].classList).toContain("cr-item--active");
      expect(items[0].classList).not.toContain("cr-item--active");
    });
  });

  describe("navigation", () => {
    it("should navigate to next on next button click", () => {
      const nextBtn = el.querySelector(".cr-btn--next") as HTMLButtonElement;
      nextBtn.click();
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(1);
    });

    it("should navigate to prev on prev button click", () => {
      host.activeIndex.set(3);
      fixture.detectChanges();
      const prevBtn = el.querySelector(".cr-btn--prev") as HTMLButtonElement;
      prevBtn.click();
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(2);
    });

    it("should disable prev button at first item", () => {
      const prevBtn = el.querySelector(".cr-btn--prev") as HTMLButtonElement;
      expect(prevBtn.disabled).toBe(true);
    });

    it("should disable next button at last item", () => {
      host.activeIndex.set(4);
      fixture.detectChanges();
      const nextBtn = el.querySelector(".cr-btn--next") as HTMLButtonElement;
      expect(nextBtn.disabled).toBe(true);
    });

    it("should not go below 0", () => {
      const carousel = fixture.debugElement.children[0]
        .componentInstance as UICarousel;
      carousel.prev();
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(0);
    });

    it("should not go above last index", () => {
      host.activeIndex.set(4);
      fixture.detectChanges();
      const carousel = fixture.debugElement.children[0]
        .componentInstance as UICarousel;
      carousel.next();
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(4);
    });

    it("should jump to index via goTo", () => {
      const carousel = fixture.debugElement.children[0]
        .componentInstance as UICarousel;
      carousel.goTo(3);
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(3);
    });

    it("should clamp goTo to valid range", () => {
      const carousel = fixture.debugElement.children[0]
        .componentInstance as UICarousel;
      carousel.goTo(100);
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(4);

      carousel.goTo(-5);
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(0);
    });
  });

  describe("dot indicators", () => {
    it("should render dot indicators", () => {
      const dots = el.querySelectorAll(".cr-dot");
      expect(dots.length).toBe(5);
    });

    it("should mark active dot", () => {
      const dots = el.querySelectorAll(".cr-dot");
      expect(dots[0].classList).toContain("cr-dot--active");
    });

    it("should navigate on dot click", () => {
      const dots = el.querySelectorAll(
        ".cr-dot",
      ) as NodeListOf<HTMLButtonElement>;
      dots[3].click();
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(3);
    });

    it("should hide indicators when showIndicators is false", () => {
      host.showIndicators.set(false);
      fixture.detectChanges();
      expect(el.querySelector(".cr-indicators")).toBeNull();
    });
  });

  describe("controls visibility", () => {
    it("should hide controls when showControls is false", () => {
      host.showControls.set(false);
      fixture.detectChanges();
      expect(el.querySelector(".cr-btn")).toBeNull();
    });

    it("should hide controls with single item", () => {
      host.items.set(["Only"]);
      fixture.detectChanges();
      expect(el.querySelector(".cr-btn")).toBeNull();
    });

    it("should hide indicators with single item", () => {
      host.items.set(["Only"]);
      fixture.detectChanges();
      expect(el.querySelector(".cr-indicators")).toBeNull();
    });
  });

  describe("strategies", () => {
    it("should return scroll strategy track style", () => {
      const carousel = fixture.debugElement.children[0]
        .componentInstance as UICarousel;
      const style = carousel["trackStyle"]();
      expect(Object.keys(style).length).toBe(0);
    });

    it("should return coverflow strategy track style", () => {
      host.strategy.set(new CoverflowCarouselStrategy());
      fixture.detectChanges();
      const carousel = fixture.debugElement.children[0]
        .componentInstance as UICarousel;
      const style = carousel["trackStyle"]();
      expect(style["perspective"]).toBe("800px");
      expect(style["overflow"]).toBe("visible");
    });

    it("should update item styles when strategy changes", () => {
      const carousel = fixture.debugElement.children[0]
        .componentInstance as UICarousel;
      const scrollStyles = carousel["itemStyles"]();
      const scrollTransform = scrollStyles[0].transform;

      host.strategy.set(new CoverflowCarouselStrategy());
      fixture.detectChanges();

      const coverflowStyles = carousel["itemStyles"]();
      expect(coverflowStyles[0].transform).not.toBe(scrollTransform);
    });
  });

  describe("scroll strategy", () => {
    it("should give all items full opacity by default", () => {
      const strategy = new ScrollCarouselStrategy();
      expect(strategy.getItemStyle(2, 2, 5).opacity).toBe(1);
      expect(strategy.getItemStyle(1, 2, 5).opacity).toBe(1);
      expect(strategy.getItemStyle(0, 2, 5).opacity).toBe(1);
    });

    it("should fade adjacent items when fade is enabled", () => {
      const strategy = new ScrollCarouselStrategy({ fade: true });
      const style = strategy.getItemStyle(1, 2, 5);
      expect(style.opacity).toBe(0.7);
    });

    it("should fade distant items more when fade is enabled", () => {
      const strategy = new ScrollCarouselStrategy({ fade: true });
      const style = strategy.getItemStyle(0, 2, 5);
      expect(style.opacity).toBe(0.4);
    });
  });

  describe("coverflow strategy", () => {
    it("should centre active item without rotation", () => {
      const strategy = new CoverflowCarouselStrategy();
      const style = strategy.getItemStyle(2, 2, 5);
      expect(style.transform).toContain("rotateY(0deg)");
      expect(style.opacity).toBe(1);
      expect(style.zIndex).toBe(100);
    });

    it("should give all items full opacity by default", () => {
      const strategy = new CoverflowCarouselStrategy();
      const side = strategy.getItemStyle(0, 2, 5);
      expect(side.opacity).toBe(1);
    });

    it("should fade non-active items when fade is enabled", () => {
      const strategy = new CoverflowCarouselStrategy({ fade: true });
      const side = strategy.getItemStyle(0, 2, 5);
      expect(side.opacity).toBeLessThan(1);
    });

    it("should rotate left neighbours with positive Y", () => {
      const strategy = new CoverflowCarouselStrategy();
      const style = strategy.getItemStyle(1, 2, 5);
      // Item is to the left → offset = -1 → direction = -1 → rotate = -(-1)*72 = 72
      expect(style.transform).toContain("rotateY(72deg)");
    });

    it("should rotate right neighbours with negative Y", () => {
      const strategy = new CoverflowCarouselStrategy();
      const style = strategy.getItemStyle(3, 2, 5);
      // Item is to the right → offset = 1 → direction = 1 → rotate = -(1)*72 = -72
      expect(style.transform).toContain("rotateY(-72deg)");
    });

    it("should apply blur to non-active items", () => {
      const strategy = new CoverflowCarouselStrategy({ blur: true });
      const style = strategy.getItemStyle(0, 2, 5);
      expect(style.filter).toContain("blur");
    });

    it("should not blur the active item", () => {
      const strategy = new CoverflowCarouselStrategy({ blur: true });
      const style = strategy.getItemStyle(2, 2, 5);
      expect(style.filter).toBeUndefined();
    });

    it("should omit blur when blur option is false", () => {
      const strategy = new CoverflowCarouselStrategy();
      const style = strategy.getItemStyle(0, 2, 5);
      expect(style.filter).toBeUndefined();
    });

    it("should use circular offset in wrap mode", () => {
      const strategy = new CoverflowCarouselStrategy();
      // 5 items, active=0 → item 4 is offset -1 (left neighbour) in wrap mode
      // offset = 4 - 0 = 4, > 5/2 → offset = 4 - 5 = -1
      // direction = -1, rotate = -(-1)*72 = 72
      const style = strategy.getItemStyle(4, 0, 5, true);
      expect(style.transform).toContain("rotateY(72deg)");
      expect(style.zIndex).toBe(99);
    });

    it("should use linear offset without wrap", () => {
      const strategy = new CoverflowCarouselStrategy();
      // 5 items, active=0 → item 4 is offset +4 (far right) without wrap
      // direction = 1, rotate = -(1)*72 = -72
      const style = strategy.getItemStyle(4, 0, 5, false);
      expect(style.transform).toContain("rotateY(-72deg)");
      expect(style.zIndex).toBe(96);
    });
  });

  describe("keyboard navigation", () => {
    it("should navigate on ArrowRight", () => {
      el.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(1);
    });

    it("should navigate on ArrowLeft", () => {
      host.activeIndex.set(3);
      fixture.detectChanges();
      el.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
      );
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(2);
    });
  });

  describe("wrap mode", () => {
    beforeEach(() => {
      host.wrap.set(true);
      fixture.detectChanges();
    });

    it("should wrap from first to last on prev", () => {
      host.activeIndex.set(0);
      fixture.detectChanges();
      const carousel = fixture.debugElement.children[0]
        .componentInstance as UICarousel;
      carousel.prev();
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(4);
    });

    it("should wrap from last to first on next", () => {
      host.activeIndex.set(4);
      fixture.detectChanges();
      const carousel = fixture.debugElement.children[0]
        .componentInstance as UICarousel;
      carousel.next();
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(0);
    });

    it("should not disable prev button at first item", () => {
      host.activeIndex.set(0);
      fixture.detectChanges();
      const prevBtn = el.querySelector(".cr-btn--prev") as HTMLButtonElement;
      expect(prevBtn.disabled).toBe(false);
    });

    it("should not disable next button at last item", () => {
      host.activeIndex.set(4);
      fixture.detectChanges();
      const nextBtn = el.querySelector(".cr-btn--next") as HTMLButtonElement;
      expect(nextBtn.disabled).toBe(false);
    });

    it("should wrap goTo with negative index", () => {
      const carousel = fixture.debugElement.children[0]
        .componentInstance as UICarousel;
      carousel.goTo(-1);
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(4);
    });

    it("should wrap goTo past end", () => {
      const carousel = fixture.debugElement.children[0]
        .componentInstance as UICarousel;
      carousel.goTo(7);
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(2);
    });
  });

  describe("wheel navigation", () => {
    function dispatchWheel(
      target: HTMLElement,
      deltaX: number,
      deltaY = 0,
    ): void {
      const event = new WheelEvent("wheel", {
        deltaX,
        deltaY,
        bubbles: true,
        cancelable: true,
      });
      target.dispatchEvent(event);
    }

    it("should navigate next on positive deltaX", async () => {
      dispatchWheel(el, 30);
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(1);
    });

    it("should navigate prev on negative deltaX", async () => {
      host.activeIndex.set(2);
      fixture.detectChanges();
      dispatchWheel(el, -30);
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(1);
    });

    it("should use deltaY when deltaX is negligible", async () => {
      dispatchWheel(el, 0, 30);
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(1);
    });

    it("should ignore tiny deltas (noise)", () => {
      dispatchWheel(el, 2);
      fixture.detectChanges();
      expect(host.activeIndex()).toBe(0);
    });

    it("should throttle rapid wheel events", async () => {
      dispatchWheel(el, 30);
      dispatchWheel(el, 30);
      dispatchWheel(el, 30);
      fixture.detectChanges();
      // Only the first should have fired — cooldown blocks the rest
      expect(host.activeIndex()).toBe(1);
    });
  });
});

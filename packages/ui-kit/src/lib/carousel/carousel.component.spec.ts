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
      expect(style["overflow"]).toBe("hidden");
    });

    it("should return coverflow strategy track style", () => {
      host.strategy.set(new CoverflowCarouselStrategy());
      fixture.detectChanges();
      const carousel = fixture.debugElement.children[0]
        .componentInstance as UICarousel;
      const style = carousel["trackStyle"]();
      expect(style["perspective"]).toBe("1200px");
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
    it("should give active item full opacity", () => {
      const strategy = new ScrollCarouselStrategy();
      const style = strategy.getItemStyle(2, 2, 5);
      expect(style.opacity).toBe(1);
    });

    it("should give adjacent items reduced opacity", () => {
      const strategy = new ScrollCarouselStrategy();
      const style = strategy.getItemStyle(1, 2, 5);
      expect(style.opacity).toBe(0.7);
    });

    it("should give distant items low opacity", () => {
      const strategy = new ScrollCarouselStrategy();
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

    it("should rotate left neighbours with positive Y", () => {
      const strategy = new CoverflowCarouselStrategy();
      const style = strategy.getItemStyle(1, 2, 5);
      // Item is to the left → offset = -1 → direction = -1 → rotate = -(-1)*45 = 45
      expect(style.transform).toContain("rotateY(45deg)");
    });

    it("should rotate right neighbours with negative Y", () => {
      const strategy = new CoverflowCarouselStrategy();
      const style = strategy.getItemStyle(3, 2, 5);
      // Item is to the right → offset = 1 → direction = 1 → rotate = -(1)*45 = -45
      expect(style.transform).toContain("rotateY(-45deg)");
    });

    it("should apply blur to non-active items", () => {
      const strategy = new CoverflowCarouselStrategy();
      const style = strategy.getItemStyle(0, 2, 5);
      expect(style.filter).toContain("blur");
    });

    it("should not blur the active item", () => {
      const strategy = new CoverflowCarouselStrategy();
      const style = strategy.getItemStyle(2, 2, 5);
      expect(style.filter).toBeUndefined();
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
});

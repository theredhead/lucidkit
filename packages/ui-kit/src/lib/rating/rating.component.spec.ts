import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import { UIRating, type RatingSize } from "./rating.component";

@Component({
  standalone: true,
  imports: [UIRating],
  template: `
    <ui-rating
      [(value)]="value"
      [max]="max()"
      [readonly]="readonly()"
      [disabled]="disabled()"
    />
  `,
})
class TestHost {
  public readonly value = signal(3);
  public readonly max = signal(5);
  public readonly readonly = signal(false);
  public readonly disabled = signal(false);
}

describe("UIRating", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(fixture.nativeElement.querySelector("ui-rating")).toBeTruthy();
  });

  it("should render max stars", () => {
    const stars = fixture.nativeElement.querySelectorAll(".star");
    expect(stars.length).toBe(5);
  });

  it("should respect custom max", () => {
    host.max.set(10);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll(".star").length).toBe(10);
  });

  it("should mark filled stars up to value", () => {
    const stars = fixture.nativeElement.querySelectorAll(".star");
    expect(stars[0].classList).toContain("filled");
    expect(stars[2].classList).toContain("filled");
    expect(stars[3].classList).not.toContain("filled");
  });

  it("should update value when a star is clicked", () => {
    const stars = fixture.nativeElement.querySelectorAll(".star");
    stars[4].click();
    fixture.detectChanges();
    expect(host.value()).toBe(5);
  });

  it("should not change value when readonly", () => {
    host.readonly.set(true);
    fixture.detectChanges();
    const stars = fixture.nativeElement.querySelectorAll(".star");
    stars[4].click();
    fixture.detectChanges();
    expect(host.value()).toBe(3);
  });

  describe("size classes", () => {
    const sizes: RatingSize[] = ["small", "medium", "large"];
    for (const size of sizes) {
      it(`should apply "${size}" class`, () => {
        fixture.nativeElement.querySelector("ui-rating");
        const comp = TestBed.createComponent(UIRating);
        comp.componentRef.setInput("size", size);
        comp.detectChanges();
        expect(comp.nativeElement.classList).toContain(size);
      });
    }
  });

  describe("accessibility", () => {
    it('should have role="radiogroup"', () => {
      const el = fixture.nativeElement.querySelector("ui-rating");
      expect(el.getAttribute("role")).toBe("radiogroup");
    });

    it('each star should have role="radio"', () => {
      const stars = fixture.nativeElement.querySelectorAll(".star");
      for (const s of stars) {
        expect(s.getAttribute("role")).toBe("radio");
      }
    });
  });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import {
  UISegmentedControl,
  type SegmentedItem,
} from "./segmented-control.component";

const ITEMS: SegmentedItem[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

@Component({
  standalone: true,
  imports: [UISegmentedControl],
  template: `
    <ui-segmented-control
      [items]="items"
      [(value)]="value"
      [disabled]="disabled()"
    />
  `,
})
class TestHost {
  public readonly items = ITEMS;
  public readonly value = signal("day");
  public readonly disabled = signal(false);
}

describe("UISegmentedControl", () => {
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
    expect(
      fixture.nativeElement.querySelector("ui-segmented-control"),
    ).toBeTruthy();
  });

  it("should render one segment per item", () => {
    const segments = fixture.nativeElement.querySelectorAll(".segment");
    expect(segments.length).toBe(ITEMS.length);
  });

  it("should mark the active segment", () => {
    const segments = fixture.nativeElement.querySelectorAll(".segment");
    expect(segments[0].classList).toContain("active");
    expect(segments[1].classList).not.toContain("active");
  });

  it("should update value when a segment is clicked", () => {
    const segments = fixture.nativeElement.querySelectorAll(".segment");
    segments[1].click();
    fixture.detectChanges();
    expect(host.value()).toBe("week");
  });

  it("should switch active class after click", () => {
    const segments = fixture.nativeElement.querySelectorAll(".segment");
    segments[2].click();
    fixture.detectChanges();
    expect(segments[2].classList).toContain("active");
    expect(segments[0].classList).not.toContain("active");
  });

  it("should not change value when disabled control is clicked", () => {
    host.disabled.set(true);
    fixture.detectChanges();
    const segments = fixture.nativeElement.querySelectorAll(".segment");
    segments[1].click();
    fixture.detectChanges();
    expect(host.value()).toBe("day");
  });

  describe("accessibility", () => {
    it('should have role="radiogroup" on host', () => {
      const el = fixture.nativeElement.querySelector("ui-segmented-control");
      expect(el.getAttribute("role")).toBe("radiogroup");
    });

    it('each segment should have role="radio"', () => {
      const segments = fixture.nativeElement.querySelectorAll(".segment");
      for (const s of segments) {
        expect(s.getAttribute("role")).toBe("radio");
      }
    });

    it('active segment should have aria-checked="true"', () => {
      const first = fixture.nativeElement.querySelector(".segment.active");
      expect(first.getAttribute("aria-checked")).toBe("true");
    });
  });
});

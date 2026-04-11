import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import { UIChip, type ChipColor } from "./chip.component";

@Component({
  standalone: true,
  imports: [UIChip],
  template: `
    <ui-chip
      [color]="color()"
      [removable]="removable()"
      [disabled]="disabled()"
      (removed)="onRemoved()"
    >
      Test Chip
    </ui-chip>
  `,
})
class TestHost {
  public readonly color = signal<ChipColor>("neutral");
  public readonly removable = signal(false);
  public readonly disabled = signal(false);
  public removed = false;

  public onRemoved(): void {
    this.removed = true;
  }
}

describe("UIChip", () => {
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
    expect(fixture.nativeElement.querySelector("ui-chip")).toBeTruthy();
  });

  it("should render projected content", () => {
    const label = fixture.nativeElement.querySelector(".label");
    expect(label.textContent.trim()).toBe("Test Chip");
  });

  it("should have ui-chip host class", () => {
    expect(fixture.nativeElement.querySelector("ui-chip").classList).toContain(
      "ui-chip",
    );
  });

  describe("colors", () => {
    const colors: ChipColor[] = [
      "primary",
      "success",
      "warning",
      "danger",
      "neutral",
    ];

    for (const color of colors) {
      it(`should apply ${color} class`, () => {
        host.color.set(color);
        fixture.detectChanges();
        expect(
          fixture.nativeElement.querySelector("ui-chip").classList,
        ).toContain(`${color}`);
      });
    }
  });

  describe("removable", () => {
    it("should not show dismiss button by default", () => {
      expect(fixture.nativeElement.querySelector(".dismiss")).toBeNull();
    });

    it("should show dismiss button when removable", () => {
      host.removable.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".dismiss")).toBeTruthy();
    });

    it("should emit removed event on dismiss click", () => {
      host.removable.set(true);
      fixture.detectChanges();
      fixture.nativeElement.querySelector(".dismiss").click();
      expect(host.removed).toBe(true);
    });
  });

  describe("disabled", () => {
    it("should apply disabled class", () => {
      host.disabled.set(true);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector("ui-chip").classList,
      ).toContain("disabled");
    });

    it("should not show dismiss button when disabled", () => {
      host.removable.set(true);
      host.disabled.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".dismiss")).toBeNull();
    });
  });
});

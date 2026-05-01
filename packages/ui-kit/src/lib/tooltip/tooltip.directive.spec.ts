import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { vi } from "vitest";

import { UITooltip } from "./tooltip.directive";

@Component({
  standalone: true,
  imports: [UITooltip],
  template: `
    <button
      uiTooltip="Hello tooltip"
      [tooltipPosition]="'top'"
      [tooltipDelay]="0"
    >
      Hover me
    </button>
  `,
})
class TestHost {}

@Component({
  standalone: true,
  imports: [UITooltip],
  template: `
    <button
      [uiTooltip]="text()"
      [tooltipPosition]="position()"
      [tooltipDelay]="delay()"
    >
      Configurable
    </button>
  `,
})
class ConfigHost {
  public readonly text = signal("Tooltip text");
  public readonly position = signal<
    "top" | "bottom" | "left" | "right" | "auto"
  >("top");
  public readonly delay = signal(0);
}

describe("UITooltip", () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  afterEach(() => {
    document.querySelectorAll(".ui-tooltip").forEach((el) => el.remove());
  });

  it("should create directive on button", () => {
    const button = fixture.nativeElement.querySelector("button");
    expect(button).toBeTruthy();
  });

  it("should show tooltip on mouseenter", () => {
    const button = fixture.nativeElement.querySelector("button");
    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    const tooltip = document.querySelector(".ui-tooltip");
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toBe("Hello tooltip");
  });

  it("should hide tooltip on mouseleave", () => {
    const button = fixture.nativeElement.querySelector("button");
    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(document.querySelector(".ui-tooltip")).toBeTruthy();

    button.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    expect(document.querySelector(".ui-tooltip")).toBeFalsy();
  });

  it("should show tooltip on focus", () => {
    const button = fixture.nativeElement.querySelector("button");
    button.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    const tooltip = document.querySelector(".ui-tooltip");
    expect(tooltip).toBeTruthy();
  });

  it("should hide tooltip on blur", () => {
    const button = fixture.nativeElement.querySelector("button");
    button.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
    expect(document.querySelector(".ui-tooltip")).toBeTruthy();

    button.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    expect(document.querySelector(".ui-tooltip")).toBeFalsy();
  });

  it("should apply position class", () => {
    const button = fixture.nativeElement.querySelector("button");
    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    const tooltip = document.querySelector(".ui-tooltip");
    expect(tooltip?.classList).toContain("top");
  });

  it('should have role="tooltip"', () => {
    const button = fixture.nativeElement.querySelector("button");
    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    const tooltip = document.querySelector(".ui-tooltip");
    expect(tooltip?.getAttribute("role")).toBe("tooltip");
  });

  it("should clean up on destroy", () => {
    const button = fixture.nativeElement.querySelector("button");
    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(document.querySelector(".ui-tooltip")).toBeTruthy();

    fixture.destroy();
    expect(document.querySelector(".ui-tooltip")).toBeFalsy();
  });
});

describe("UITooltip — configurable", () => {
  let fixture: ComponentFixture<ConfigHost>;
  let host: ConfigHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigHost],
    }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.querySelectorAll(".ui-tooltip").forEach((el) => el.remove());
  });

  it("should apply bottom position class", () => {
    host.position.set("bottom");
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("button");
    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    const tooltip = document.querySelector(".ui-tooltip");
    expect(tooltip?.classList).toContain("bottom");
  });

  it("should apply left position class", () => {
    host.position.set("left");
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("button");
    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    const tooltip = document.querySelector(".ui-tooltip");
    expect(tooltip?.classList).toContain("left");
  });

  it("should apply right position class", () => {
    host.position.set("right");
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("button");
    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    const tooltip = document.querySelector(".ui-tooltip");
    expect(tooltip?.classList).toContain("right");
  });

  it("should not create tooltip when text is empty", () => {
    host.text.set("");
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("button");
    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    expect(document.querySelector(".ui-tooltip")).toBeFalsy();
  });

  it("should show tooltip after delay", () => {
    vi.useFakeTimers();
    host.delay.set(100);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("button");
    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));

    // Tooltip should not appear yet
    expect(document.querySelector(".ui-tooltip")).toBeFalsy();

    vi.advanceTimersByTime(100);

    expect(document.querySelector(".ui-tooltip")).toBeTruthy();
    vi.useRealTimers();
  });

  it("should cancel delayed tooltip on mouseleave", () => {
    vi.useFakeTimers();
    host.delay.set(100);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("button");
    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));

    vi.advanceTimersByTime(50);
    button.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    vi.advanceTimersByTime(100);

    expect(document.querySelector(".ui-tooltip")).toBeFalsy();
    vi.useRealTimers();
  });

  it("should not create duplicate tooltip on double show", () => {
    const button = fixture.nativeElement.querySelector("button");
    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    const tooltips = document.querySelectorAll(".ui-tooltip");
    expect(tooltips.length).toBe(1);
  });

  it("should resolve auto position to a concrete position class", () => {
    host.position.set("auto");
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("button");
    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    const tooltip = document.querySelector(".ui-tooltip");
    expect(tooltip).toBeTruthy();
    // The class must be one of the four concrete positions, not 'auto'
    const hasConcretePosition = ["top", "bottom", "left", "right"].some((p) =>
      tooltip?.classList.contains(p),
    );
    expect(hasConcretePosition).toBe(true);
    expect(tooltip?.classList.contains("auto")).toBe(false);
  });
});

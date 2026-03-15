import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";

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
    expect(tooltip?.classList).toContain("ui-tooltip--top");
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

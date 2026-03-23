import { describe, it, expect, beforeEach } from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIDropdownList } from "./dropdown-list.component";

describe("UIDropdownList", () => {
  let component: UIDropdownList;
  let fixture: ComponentFixture<UIDropdownList>;

  const testOptions = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta" },
    { value: "c", label: "Gamma" },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIDropdownList],
    }).compileComponents();

    fixture = TestBed.createComponent(UIDropdownList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("options", testOptions);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it("should have empty value by default", () => {
      expect(component.value()).toBe("");
    });

    it("should not be disabled by default", () => {
      expect(component.disabled()).toBe(false);
    });

    it("should show placeholder by default", () => {
      expect(component.placeholder()).toBe("— Select —");
    });
  });

  describe("display label", () => {
    it("should show placeholder when no value is set", () => {
      const el: HTMLElement = fixture.nativeElement;
      const label = el.querySelector(".dropdown-label");
      expect(label?.textContent?.trim()).toBe("— Select —");
    });

    it("should show option label when value is set", () => {
      fixture.componentRef.setInput("value", "b");
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      const label = el.querySelector(".dropdown-label");
      expect(label?.textContent?.trim()).toBe("Beta");
    });

    it("should apply placeholder class when no value", () => {
      const el: HTMLElement = fixture.nativeElement;
      const label = el.querySelector(".dropdown-label");
      expect(label?.classList.contains("dropdown-label--placeholder")).toBe(
        true,
      );
    });

    it("should remove placeholder class when value is set", () => {
      fixture.componentRef.setInput("value", "a");
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      const label = el.querySelector(".dropdown-label");
      expect(label?.classList.contains("dropdown-label--placeholder")).toBe(
        false,
      );
    });
  });

  describe("host classes", () => {
    it("should have ui-dropdown-list class", () => {
      expect(fixture.nativeElement.classList.contains("ui-dropdown-list")).toBe(
        true,
      );
    });

    it("should apply disabled class when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.classList.contains("ui-dropdown-list--disabled"),
      ).toBe(true);
    });
  });

  describe("button", () => {
    it("should render an outlined button", () => {
      const btn = fixture.nativeElement.querySelector("ui-button");
      expect(btn).toBeTruthy();
      expect(btn.classList.contains("ui-button--outlined")).toBe(true);
    });

    it("should render a chevron icon", () => {
      const icon = fixture.nativeElement.querySelector("ui-icon");
      expect(icon).toBeTruthy();
    });

    it("should disable the button when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector("button");
      expect(btn?.disabled).toBe(true);
    });
  });
});

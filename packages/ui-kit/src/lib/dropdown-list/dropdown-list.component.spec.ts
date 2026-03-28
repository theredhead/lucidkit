import { describe, it, expect, beforeEach, vi } from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Subject } from "rxjs";

import { UIDropdownList } from "./dropdown-list.component";
import { PopoverService } from "../popover/popover.service";

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

  describe("toggle", () => {
    let closedSubject: Subject<string | undefined>;
    let openPopoverSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      closedSubject = new Subject<string | undefined>();
      openPopoverSpy = vi
        .fn()
        .mockReturnValue({ closed: closedSubject.asObservable() });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).popover = {
        openPopover: openPopoverSpy,
      } as unknown as PopoverService;
      // Provide a fake triggerRef so the popover has an anchor
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).triggerRef = () => ({
        nativeElement: document.createElement("div"),
      });
    });

    it("should not open when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).toggle();
      expect(openPopoverSpy).not.toHaveBeenCalled();
    });

    it("should not open when already open", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).isOpen.set(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).toggle();
      expect(openPopoverSpy).not.toHaveBeenCalled();
    });

    it("should call openPopover with correct inputs", () => {
      fixture.componentRef.setInput("value", "b");
      fixture.detectChanges();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).toggle();
      expect(openPopoverSpy).toHaveBeenCalledTimes(1);
      const callArgs = openPopoverSpy.mock.calls[0][0];
      expect(callArgs.inputs.options).toBe(component.options());
      expect(callArgs.inputs.selectedValue).toBe("b");
    });

    it("should set isOpen to true on toggle", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).toggle();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((component as any).isOpen()).toBe(true);
    });

    it("should apply open host class", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).toggle();
      fixture.detectChanges();
      expect(
        fixture.nativeElement.classList.contains("ui-dropdown-list--open"),
      ).toBe(true);
    });

    it("should set isOpen to false when popover closes", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).toggle();
      closedSubject.next(undefined);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((component as any).isOpen()).toBe(false);
    });

    it("should update value when popover returns a result", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).toggle();
      closedSubject.next("c");
      expect(component.value()).toBe("c");
    });

    it("should NOT update value when popover returns undefined", () => {
      fixture.componentRef.setInput("value", "a");
      fixture.detectChanges();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).toggle();
      closedSubject.next(undefined);
      expect(component.value()).toBe("a");
    });
  });
});

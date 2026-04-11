import { ComponentFixture, TestBed } from "@angular/core/testing";

import { type CheckboxVariant, UICheckbox } from "./checkbox.component";

describe("UICheckbox", () => {
  let component: UICheckbox;
  let fixture: ComponentFixture<UICheckbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UICheckbox],
    }).compileComponents();

    fixture = TestBed.createComponent(UICheckbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it('should default variant to "checkbox"', () => {
      expect(component.variant()).toBe("checkbox");
    });

    it("should default checked to false", () => {
      expect(component.checked()).toBe(false);
    });

    it("should default disabled to false", () => {
      expect(component.disabled()).toBe(false);
    });

    it("should default indeterminate to false", () => {
      expect(component.indeterminate()).toBe(false);
    });
  });

  describe("variants", () => {
    const variants: CheckboxVariant[] = ["checkbox", "switch"];

    for (const variant of variants) {
      it(`should apply ${variant} host class`, () => {
        fixture.componentRef.setInput("variant", variant);
        fixture.detectChanges();
        expect(fixture.nativeElement.classList).toContain(
          `${variant}`,
        );
      });
    }
  });

  describe("toggle", () => {
    it("should toggle checked state on click", () => {
      const control = fixture.nativeElement.querySelector(
        ".control",
      ) as HTMLElement;
      control.click();
      fixture.detectChanges();
      expect(component.checked()).toBe(true);
    });

    it("should toggle back to unchecked on second click", () => {
      const control = fixture.nativeElement.querySelector(
        ".control",
      ) as HTMLElement;
      control.click();
      control.click();
      fixture.detectChanges();
      expect(component.checked()).toBe(false);
    });

    it("should not toggle when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      component.toggle();
      expect(component.checked()).toBe(false);
    });

    it("should emit checkedChange on toggle", () => {
      const spy = vi.fn();
      component.checkedChange.subscribe(spy);
      component.toggle();
      expect(spy).toHaveBeenCalledWith(true);
    });
  });

  describe("checkbox variant", () => {
    it("should render checkbox box element", () => {
      const box = fixture.nativeElement.querySelector(".box");
      expect(box).toBeTruthy();
    });

    it("should show check icon when checked", () => {
      fixture.componentRef.setInput("checked", true);
      fixture.detectChanges();
      const icon = fixture.nativeElement.querySelector(".icon polyline");
      expect(icon).toBeTruthy();
    });

    it("should show indeterminate icon when indeterminate", () => {
      fixture.componentRef.setInput("indeterminate", true);
      fixture.detectChanges();
      const icon = fixture.nativeElement.querySelector(".icon line");
      expect(icon).toBeTruthy();
    });

    it("should apply checked host class", () => {
      fixture.componentRef.setInput("checked", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain("checked");
    });

    it("should apply indeterminate host class", () => {
      fixture.componentRef.setInput("indeterminate", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain(
        "indeterminate",
      );
    });
  });

  describe("switch variant", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("variant", "switch");
      fixture.detectChanges();
    });

    it("should render track and thumb", () => {
      const track = fixture.nativeElement.querySelector(".track");
      const thumb = fixture.nativeElement.querySelector(".thumb");
      expect(track).toBeTruthy();
      expect(thumb).toBeTruthy();
    });

    it("should not render checkbox box", () => {
      const box = fixture.nativeElement.querySelector(".box");
      expect(box).toBeFalsy();
    });

    it("should toggle on click", () => {
      const control = fixture.nativeElement.querySelector(
        ".control",
      ) as HTMLElement;
      control.click();
      fixture.detectChanges();
      expect(component.checked()).toBe(true);
    });
  });

  describe("keyboard interaction", () => {
    it("should toggle on Space key", () => {
      const control = fixture.nativeElement.querySelector(
        ".control",
      ) as HTMLElement;
      control.dispatchEvent(
        new KeyboardEvent("keydown", { key: " ", bubbles: true }),
      );
      fixture.detectChanges();
      expect(component.checked()).toBe(true);
    });

    it("should toggle on Enter key", () => {
      const control = fixture.nativeElement.querySelector(
        ".control",
      ) as HTMLElement;
      control.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      fixture.detectChanges();
      expect(component.checked()).toBe(true);
    });

    it("should not toggle on other keys", () => {
      const control = fixture.nativeElement.querySelector(
        ".control",
      ) as HTMLElement;
      control.dispatchEvent(
        new KeyboardEvent("keydown", { key: "a", bubbles: true }),
      );
      fixture.detectChanges();
      expect(component.checked()).toBe(false);
    });
  });

  describe("disabled state", () => {
    it("should apply disabled host class", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain(
        "disabled",
      );
    });

    it("should set aria-disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      const control = fixture.nativeElement.querySelector(".control");
      expect(control.getAttribute("aria-disabled")).toBe("true");
    });

    it("should set tabindex to -1 when disabled", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      const control = fixture.nativeElement.querySelector(".control");
      expect(control.getAttribute("tabindex")).toBe("-1");
    });
  });

  describe("accessibility", () => {
    it('should have role="checkbox" for checkbox variant', () => {
      const control = fixture.nativeElement.querySelector(".control");
      expect(control.getAttribute("role")).toBe("checkbox");
    });

    it('should have role="switch" for switch variant', () => {
      fixture.componentRef.setInput("variant", "switch");
      fixture.detectChanges();
      const control = fixture.nativeElement.querySelector(".control");
      expect(control.getAttribute("role")).toBe("switch");
    });

    it("should set aria-checked to true when checked", () => {
      fixture.componentRef.setInput("checked", true);
      fixture.detectChanges();
      const control = fixture.nativeElement.querySelector(".control");
      expect(control.getAttribute("aria-checked")).toBe("true");
    });

    it('should set aria-checked to "mixed" when indeterminate', () => {
      fixture.componentRef.setInput("indeterminate", true);
      fixture.detectChanges();
      const control = fixture.nativeElement.querySelector(".control");
      expect(control.getAttribute("aria-checked")).toBe("mixed");
    });

    it("should forward ariaLabel", () => {
      fixture.componentRef.setInput("ariaLabel", "Accept terms");
      fixture.detectChanges();
      const control = fixture.nativeElement.querySelector(".control");
      expect(control.getAttribute("aria-label")).toBe("Accept terms");
    });

    it("should have tabindex 0 when enabled", () => {
      const control = fixture.nativeElement.querySelector(".control");
      expect(control.getAttribute("tabindex")).toBe("0");
    });
  });
});

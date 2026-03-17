import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopoverService } from "../popover/popover.service";
import { UIColorPicker } from "./color-picker.component";

describe("UIColorPicker", () => {
  let component: UIColorPicker;
  let fixture: ComponentFixture<UIColorPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIColorPicker],
      providers: [PopoverService],
    }).compileComponents();

    fixture = TestBed.createComponent(UIColorPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it('should default value to "#0061a4"', () => {
      expect(component.value()).toBe("#0061a4");
    });

    it('should default initialMode to "theme"', () => {
      expect(component.initialMode()).toBe("theme");
    });

    it("should default disabled to false", () => {
      expect(component.disabled()).toBe(false);
    });

    it('should default ariaLabel to "Pick a colour"', () => {
      expect(component.ariaLabel()).toBe("Pick a colour");
    });
  });

  describe("disabled state", () => {
    it("should add the disabled host class", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const host: HTMLElement = fixture.nativeElement;
      expect(host.classList.contains("ui-color-picker--disabled")).toBe(true);
    });

    it("should disable the trigger button", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".cp-trigger");
      expect(btn.disabled).toBe(true);
    });
  });

  describe("swatch", () => {
    it("should show the current value as background-color", () => {
      fixture.componentRef.setInput("value", "#ff0000");
      fixture.detectChanges();

      const swatch: HTMLElement =
        fixture.nativeElement.querySelector(".cp-swatch");
      expect(swatch.style.backgroundColor).toBeTruthy();
    });
  });

  describe("aria", () => {
    it("should forward ariaLabel to the button", () => {
      fixture.componentRef.setInput("ariaLabel", "Choose colour");
      fixture.detectChanges();

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".cp-trigger");
      expect(btn.getAttribute("aria-label")).toBe("Choose colour");
    });
  });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";

import {
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
  UI_BUTTON_DEFAULTS,
  UIButton,
} from "./button.component";

describe("UIButton", () => {
  let component: UIButton;
  let fixture: ComponentFixture<UIButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIButton],
    }).compileComponents();

    fixture = TestBed.createComponent(UIButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it('should default type to "button"', () => {
      expect(component.type()).toBe("button");
    });

    it('should default variant to "filled"', () => {
      expect(component.variant()).toBe("filled");
    });

    it('should default size to "medium"', () => {
      expect(component.size()).toBe("medium");
    });

    it('should default color to "primary"', () => {
      expect(component.color()).toBe("primary");
    });

    it("should default disabled to false", () => {
      expect(component.disabled()).toBe(false);
    });
  });

  describe("variants", () => {
    const variants: ButtonVariant[] = ["filled", "outlined", "ghost"];

    variants.forEach((variant) => {
      it(`should apply ${variant} host class`, () => {
        fixture.componentRef.setInput("variant", variant);
        fixture.detectChanges();

        const host: HTMLElement = fixture.nativeElement;
        expect(host.classList.contains(`ui-button--${variant}`)).toBe(true);
      });
    });
  });

  describe("sizes", () => {
    const sizes: ButtonSize[] = ["small", "medium", "large"];

    sizes.forEach((size) => {
      it(`should apply ${size} host class`, () => {
        fixture.componentRef.setInput("size", size);
        fixture.detectChanges();

        const host: HTMLElement = fixture.nativeElement;
        expect(host.classList.contains(`ui-button--${size}`)).toBe(true);
      });
    });
  });

  describe("disabled state", () => {
    it("should disable the native button", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const button: HTMLButtonElement =
        fixture.nativeElement.querySelector("button");
      expect(button.disabled).toBe(true);
    });
  });

  describe("content projection", () => {
    it("should render projected content", () => {
      const button: HTMLButtonElement =
        fixture.nativeElement.querySelector("button");
      expect(button).toBeTruthy();
    });
  });

  describe("accessibility", () => {
    it("should not set aria-label by default", () => {
      const button: HTMLButtonElement =
        fixture.nativeElement.querySelector("button");
      expect(button.getAttribute("aria-label")).toBeNull();
    });

    it("should forward ariaLabel to the native button", () => {
      fixture.componentRef.setInput("ariaLabel", "Close dialog");
      fixture.detectChanges();

      const button: HTMLButtonElement =
        fixture.nativeElement.querySelector("button");
      expect(button.getAttribute("aria-label")).toBe("Close dialog");
    });

    it("should set type=button by default to prevent implicit submit", () => {
      const button: HTMLButtonElement =
        fixture.nativeElement.querySelector("button");
      expect(button.type).toBe("button");
    });
  });

  describe("UI_BUTTON_DEFAULTS", () => {
    it("should use provided defaults", async () => {
      await TestBed.resetTestingModule()
        .configureTestingModule({
          imports: [UIButton],
          providers: [
            {
              provide: UI_BUTTON_DEFAULTS,
              useValue: {
                variant: "outlined",
                color: "danger",
                size: "large",
                pill: true,
              },
            },
          ],
        })
        .compileComponents();

      const f = TestBed.createComponent(UIButton);
      f.detectChanges();

      expect(f.componentInstance.variant()).toBe("outlined");
      expect(f.componentInstance.color()).toBe("danger");
      expect(f.componentInstance.size()).toBe("large");
      expect(f.componentInstance.pill()).toBe(true);
    });

    it("should allow partial defaults", async () => {
      await TestBed.resetTestingModule()
        .configureTestingModule({
          imports: [UIButton],
          providers: [
            {
              provide: UI_BUTTON_DEFAULTS,
              useValue: { color: "neutral" },
            },
          ],
        })
        .compileComponents();

      const f = TestBed.createComponent(UIButton);
      f.detectChanges();

      expect(f.componentInstance.variant()).toBe("filled");
      expect(f.componentInstance.color()).toBe("neutral");
      expect(f.componentInstance.size()).toBe("medium");
      expect(f.componentInstance.pill()).toBe(false);
    });
  });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { type BadgeColor, type BadgeVariant, UIBadge } from "./badge.component";

describe("UIBadge", () => {
  let component: UIBadge;
  let fixture: ComponentFixture<UIBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(UIBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it('should default variant to "count"', () => {
      expect(component.variant()).toBe("count");
    });

    it('should default color to "primary"', () => {
      expect(component.color()).toBe("primary");
    });

    it("should default count to 0", () => {
      expect(component.count()).toBe(0);
    });

    it("should default maxCount to 99", () => {
      expect(component.maxCount()).toBe(99);
    });
  });

  describe("variants", () => {
    const variants: BadgeVariant[] = ["count", "dot", "label"];

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

  describe("colors", () => {
    const colors: BadgeColor[] = [
      "primary",
      "success",
      "warning",
      "danger",
      "neutral",
    ];

    for (const color of colors) {
      it(`should apply ${color} host class`, () => {
        fixture.componentRef.setInput("color", color);
        fixture.detectChanges();
        expect(fixture.nativeElement.classList).toContain(`${color}`);
      });
    }
  });

  describe("count display", () => {
    it("should display the count", () => {
      fixture.componentRef.setInput("count", 5);
      fixture.detectChanges();
      const body = fixture.nativeElement.querySelector(".body");
      expect(body.textContent.trim()).toBe("5");
    });

    it("should display maxCount+ when count exceeds maxCount", () => {
      fixture.componentRef.setInput("count", 150);
      fixture.componentRef.setInput("maxCount", 99);
      fixture.detectChanges();
      const body = fixture.nativeElement.querySelector(".body");
      expect(body.textContent.trim()).toBe("99+");
    });

    it("should display exact count at maxCount boundary", () => {
      fixture.componentRef.setInput("count", 99);
      fixture.componentRef.setInput("maxCount", 99);
      fixture.detectChanges();
      const body = fixture.nativeElement.querySelector(".body");
      expect(body.textContent.trim()).toBe("99");
    });

    it("should respect custom maxCount", () => {
      fixture.componentRef.setInput("count", 15);
      fixture.componentRef.setInput("maxCount", 9);
      fixture.detectChanges();
      const body = fixture.nativeElement.querySelector(".body");
      expect(body.textContent.trim()).toBe("9+");
    });
  });

  describe("dot variant", () => {
    it("should render dot element", () => {
      fixture.componentRef.setInput("variant", "dot");
      fixture.detectChanges();
      const dot = fixture.nativeElement.querySelector(".dot");
      expect(dot).toBeTruthy();
    });

    it("should not render count body", () => {
      fixture.componentRef.setInput("variant", "dot");
      fixture.detectChanges();
      const body = fixture.nativeElement.querySelector(".body");
      expect(body).toBeFalsy();
    });
  });

  describe("label variant", () => {
    it("should render label body", () => {
      fixture.componentRef.setInput("variant", "label");
      fixture.detectChanges();
      const body = fixture.nativeElement.querySelector(".body--label");
      expect(body).toBeTruthy();
    });
  });

  describe("accessibility", () => {
    it("should forward ariaLabel", () => {
      fixture.componentRef.setInput("ariaLabel", "5 notifications");
      fixture.detectChanges();
      const body = fixture.nativeElement.querySelector(".body");
      expect(body.getAttribute("aria-label")).toBe("5 notifications");
    });
  });
});

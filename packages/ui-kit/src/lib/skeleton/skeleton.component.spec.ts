import { ComponentFixture, TestBed } from "@angular/core/testing";

import { type SkeletonVariant, UISkeleton } from "./skeleton.component";

describe("UISkeleton", () => {
  let component: UISkeleton;
  let fixture: ComponentFixture<UISkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UISkeleton],
    }).compileComponents();
    fixture = TestBed.createComponent(UISkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it('should default variant to "text"', () => {
      expect(component.variant()).toBe("text");
    });

    it("should default lines to 1", () => {
      expect(component.lines()).toBe(1);
    });

    it('should default width to "100%"', () => {
      expect(component.width()).toBe("100%");
    });

    it("should default animated to true", () => {
      expect(component.animated()).toBe(true);
    });
  });

  describe("host classes", () => {
    const variants: SkeletonVariant[] = ["text", "rect", "circle"];

    for (const variant of variants) {
      it(`should apply "${variant}" host class for variant="${variant}"`, () => {
        fixture.componentRef.setInput("variant", variant);
        fixture.detectChanges();
        expect(fixture.nativeElement.classList).toContain(variant);
      });
    }

    it("should apply animated class when animated=true", () => {
      expect(fixture.nativeElement.classList).toContain("animated");
    });

    it("should not have animated class when animated=false", () => {
      fixture.componentRef.setInput("animated", false);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).not.toContain("animated");
    });
  });

  describe("text variant", () => {
    it("should render one .line for lines=1", () => {
      fixture.componentRef.setInput("variant", "text");
      fixture.componentRef.setInput("lines", 1);
      fixture.detectChanges();
      const lines = fixture.nativeElement.querySelectorAll(".line");
      expect(lines.length).toBe(1);
    });

    it("should render 3 .line elements for lines=3", () => {
      fixture.componentRef.setInput("variant", "text");
      fixture.componentRef.setInput("lines", 3);
      fixture.detectChanges();
      const lines = fixture.nativeElement.querySelectorAll(".line");
      expect(lines.length).toBe(3);
    });

    it("should mark last line as .short when lines > 1", () => {
      fixture.componentRef.setInput("variant", "text");
      fixture.componentRef.setInput("lines", 3);
      fixture.detectChanges();
      const lines = fixture.nativeElement.querySelectorAll(".line");
      expect(lines[2].classList).toContain("short");
    });
  });

  describe("non-text variants", () => {
    it("should set inline height style for rect", () => {
      fixture.componentRef.setInput("variant", "rect");
      fixture.componentRef.setInput("height", "200px");
      fixture.detectChanges();
      expect(fixture.nativeElement.style.height).toBe("200px");
    });

    it("should set inline height style for circle", () => {
      fixture.componentRef.setInput("variant", "circle");
      fixture.componentRef.setInput("height", "3rem");
      fixture.detectChanges();
      expect(fixture.nativeElement.style.height).toBe("3rem");
    });
  });

  describe("accessibility", () => {
    it('should have aria-busy="true"', () => {
      expect(fixture.nativeElement.getAttribute("aria-busy")).toBe("true");
    });

    it("should expose aria-label", () => {
      fixture.componentRef.setInput("ariaLabel", "Content loading");
      fixture.detectChanges();
      expect(fixture.nativeElement.getAttribute("aria-label")).toBe(
        "Content loading",
      );
    });
  });
});

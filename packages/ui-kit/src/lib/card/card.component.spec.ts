import { ComponentFixture, TestBed } from "@angular/core/testing";

import {
  type CardVariant,
  UICard,
  UICardBody,
  UICardFooter,
  UICardHeader,
} from "./card.component";

describe("UICard", () => {
  let component: UICard;
  let fixture: ComponentFixture<UICard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UICard],
    }).compileComponents();

    fixture = TestBed.createComponent(UICard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it('should default variant to "elevated"', () => {
      expect(component.variant()).toBe("elevated");
    });

    it("should default interactive to false", () => {
      expect(component.interactive()).toBe(false);
    });

    it("should default ariaLabel to undefined", () => {
      expect(component.ariaLabel()).toBeUndefined();
    });
  });

  describe("variants", () => {
    const variants: CardVariant[] = ["elevated", "outlined", "filled"];

    for (const variant of variants) {
      it(`should apply ${variant} host class`, () => {
        fixture.componentRef.setInput("variant", variant);
        fixture.detectChanges();
        expect(fixture.nativeElement.classList).toContain(
          `ui-card--${variant}`,
        );
      });
    }
  });

  describe("interactive", () => {
    it("should apply interactive host class when enabled", () => {
      fixture.componentRef.setInput("interactive", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain("ui-card--interactive");
    });

    it("should not apply interactive host class by default", () => {
      expect(fixture.nativeElement.classList).not.toContain(
        "ui-card--interactive",
      );
    });
  });

  describe("accessibility", () => {
    it('should have role="region"', () => {
      expect(fixture.nativeElement.getAttribute("role")).toBe("region");
    });

    it("should forward ariaLabel", () => {
      fixture.componentRef.setInput("ariaLabel", "User profile card");
      fixture.detectChanges();
      expect(fixture.nativeElement.getAttribute("aria-label")).toBe(
        "User profile card",
      );
    });
  });
});

describe("UICardHeader", () => {
  it("should create", async () => {
    await TestBed.configureTestingModule({
      imports: [UICardHeader],
    }).compileComponents();

    const fixture = TestBed.createComponent(UICardHeader);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should have host class", async () => {
    await TestBed.configureTestingModule({
      imports: [UICardHeader],
    }).compileComponents();

    const fixture = TestBed.createComponent(UICardHeader);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain("ui-card-header");
  });
});

describe("UICardBody", () => {
  it("should create", async () => {
    await TestBed.configureTestingModule({
      imports: [UICardBody],
    }).compileComponents();

    const fixture = TestBed.createComponent(UICardBody);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should have host class", async () => {
    await TestBed.configureTestingModule({
      imports: [UICardBody],
    }).compileComponents();

    const fixture = TestBed.createComponent(UICardBody);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain("ui-card-body");
  });
});

describe("UICardFooter", () => {
  it("should create", async () => {
    await TestBed.configureTestingModule({
      imports: [UICardFooter],
    }).compileComponents();

    const fixture = TestBed.createComponent(UICardFooter);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should have host class", async () => {
    await TestBed.configureTestingModule({
      imports: [UICardFooter],
    }).compileComponents();

    const fixture = TestBed.createComponent(UICardFooter);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain("ui-card-footer");
  });
});

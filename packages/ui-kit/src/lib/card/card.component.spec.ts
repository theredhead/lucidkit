import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import {
  type CardVariant,
  UICard,
  UICardBody,
  UICardFooter,
  UICardHeader,
  UICardImage,
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
        expect(fixture.nativeElement.classList).toContain(`${variant}`);
      });
    }
  });

  describe("interactive", () => {
    it("should apply interactive host class when enabled", () => {
      fixture.componentRef.setInput("interactive", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.classList).toContain("interactive");
    });

    it("should not apply interactive host class by default", () => {
      expect(fixture.nativeElement.classList).not.toContain("interactive");
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
  @Component({
    standalone: true,
    imports: [UICardHeader],
    template: `
      <ui-card-header
        [icon]="icon"
        [avatarName]="avatarName"
        [avatarAriaLabel]="avatarAriaLabel"
        [subtitle]="subtitle"
      >
        Header content
      </ui-card-header>
    `,
  })
  class CardHeaderHost {
    public icon = '<path d="M12 5v14" /><path d="M5 12h14" />';

    public avatarName = "";

    public avatarAriaLabel = "";

    public subtitle = "";
  }

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

  it("should render a leading icon when provided", async () => {
    await TestBed.configureTestingModule({
      imports: [CardHeaderHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(CardHeaderHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("ui-icon")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("ui-avatar")).toBeFalsy();
  });

  it("should render a leading avatar when avatar data is provided", async () => {
    await TestBed.configureTestingModule({
      imports: [CardHeaderHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(CardHeaderHost);
    fixture.componentInstance.avatarName = "Jane Doe";
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("ui-avatar")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("ui-icon")).toBeFalsy();
  });

  it("should render a subtitle when provided", async () => {
    await TestBed.configureTestingModule({
      imports: [CardHeaderHost],
    }).compileComponents();

    const fixture = TestBed.createComponent(CardHeaderHost);
    fixture.componentInstance.subtitle = "Last updated 2 minutes ago";
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector(".subtitle")?.textContent,
    ).toContain("Last updated 2 minutes ago");
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

describe("UICardImage", () => {
  it("should create", async () => {
    await TestBed.configureTestingModule({
      imports: [UICardImage],
    }).compileComponents();

    const fixture = TestBed.createComponent(UICardImage);
    fixture.componentRef.setInput("src", "/hero.jpg");
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should have host class", async () => {
    await TestBed.configureTestingModule({
      imports: [UICardImage],
    }).compileComponents();

    const fixture = TestBed.createComponent(UICardImage);
    fixture.componentRef.setInput("src", "/hero.jpg");
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain("ui-card-image");
  });

  it("should render the provided image source", async () => {
    await TestBed.configureTestingModule({
      imports: [UICardImage],
    }).compileComponents();

    const fixture = TestBed.createComponent(UICardImage);
    fixture.componentRef.setInput("src", "/hero.jpg");
    fixture.componentRef.setInput("alt", "Hero image");
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector(
      "img",
    ) as HTMLImageElement;
    expect(image.getAttribute("src")).toBe("/hero.jpg");
    expect(image.getAttribute("alt")).toBe("Hero image");
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

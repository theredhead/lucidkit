import { ComponentFixture, TestBed } from "@angular/core/testing";

import {
  registerDataDetector,
  unregisterDataDetector,
  type IDataDetector,
} from "@theredhead/lucid-foundation";

import {
  provideRichTextViewDataDetectors,
  UIRichTextView,
} from "./rich-text-view.component";

const linkDetector: IDataDetector = {
  detect: (text) => text.includes("555-1212"),
  process: (text) =>
    text.replace("555-1212", '<a href="tel:5551212">555-1212</a>'),
};

describe("UIRichTextView", () => {
  let component: UIRichTextView;
  let fixture: ComponentFixture<UIRichTextView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIRichTextView],
    }).compileComponents();
    fixture = TestBed.createComponent(UIRichTextView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    unregisterDataDetector(linkDetector);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it("should default content to empty string", () => {
      expect(component.content()).toBe("");
    });

    it('should default ariaLabel to "Rich text content"', () => {
      expect(component.ariaLabel()).toBe("Rich text content");
    });
  });

  describe("rendering", () => {
    it("should render HTML content", () => {
      fixture.componentRef.setInput(
        "content",
        "<p>Hello <strong>world</strong></p>",
      );
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      const contentDiv = el.querySelector(".content");
      expect(contentDiv).toBeTruthy();
      expect(contentDiv!.querySelector("p")).toBeTruthy();
      expect(contentDiv!.querySelector("strong")?.textContent).toBe("world");
    });

    it("should update when content changes", () => {
      fixture.componentRef.setInput("content", "<p>First</p>");
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector(".content p")?.textContent).toBe("First");

      fixture.componentRef.setInput("content", "<p>Second</p>");
      fixture.detectChanges();
      expect(el.querySelector(".content p")?.textContent).toBe("Second");
    });

    it("should have the host class", () => {
      expect(
        fixture.nativeElement.classList.contains("ui-rich-text-view"),
      ).toBe(true);
    });

    it("should apply explicit data detectors to rendered text nodes", () => {
      fixture.componentRef.setInput("dataDetectors", [linkDetector]);
      fixture.componentRef.setInput("content", "<p>Call 555-1212</p>");
      fixture.detectChanges();

      const link = fixture.nativeElement.querySelector('a[href="tel:5551212"]');
      expect(link?.textContent).toBe("555-1212");
    });

    it("should fall back to globally registered data detectors", () => {
      registerDataDetector(linkDetector);
      fixture.componentRef.setInput("content", "<p>Call 555-1212</p>");
      fixture.detectChanges();

      const link = fixture.nativeElement.querySelector('a[href="tel:5551212"]');
      expect(link?.textContent).toBe("555-1212");
    });

    it("should use injected data detectors when no input detectors are supplied", async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [UIRichTextView],
        providers: [...provideRichTextViewDataDetectors(linkDetector)],
      }).compileComponents();

      const injectedFixture = TestBed.createComponent(UIRichTextView);
      injectedFixture.componentRef.setInput("content", "<p>Call 555-1212</p>");
      injectedFixture.detectChanges();

      const link = injectedFixture.nativeElement.querySelector(
        'a[href="tel:5551212"]',
      );
      expect(link?.textContent).toBe("555-1212");
    });
  });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UIRichTextView } from "./rich-text-view.component";

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
      const contentDiv = el.querySelector(".rtv-content");
      expect(contentDiv).toBeTruthy();
      expect(contentDiv!.querySelector("p")).toBeTruthy();
      expect(contentDiv!.querySelector("strong")?.textContent).toBe("world");
    });

    it("should update when content changes", () => {
      fixture.componentRef.setInput("content", "<p>First</p>");
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector(".rtv-content p")?.textContent).toBe("First");

      fixture.componentRef.setInput("content", "<p>Second</p>");
      fixture.detectChanges();
      expect(el.querySelector(".rtv-content p")?.textContent).toBe("Second");
    });

    it("should have the host class", () => {
      expect(
        fixture.nativeElement.classList.contains("ui-rich-text-view"),
      ).toBe(true);
    });
  });
});

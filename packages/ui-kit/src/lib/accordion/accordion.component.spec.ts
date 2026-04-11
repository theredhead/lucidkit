import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import { UIAccordion } from "./accordion.component";
import { UIAccordionItem } from "./accordion-item.component";

@Component({
  standalone: true,
  imports: [UIAccordion, UIAccordionItem],
  template: `
    <ui-accordion [mode]="mode()" [requireOpen]="requireOpen()">
      <ui-accordion-item label="Section 1">Content A</ui-accordion-item>
      <ui-accordion-item label="Section 2">Content B</ui-accordion-item>
      <ui-accordion-item label="Section 3" [disabled]="true"
        >Content C</ui-accordion-item
      >
    </ui-accordion>
  `,
})
class TestHost {
  public readonly mode = signal<"single" | "multi">("single");
  public readonly requireOpen = signal(true);
}

describe("UIAccordion", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it("should create", () => {
    const accordion = fixture.nativeElement.querySelector("ui-accordion");
    expect(accordion).toBeTruthy();
  });

  it("should render all items", () => {
    const items = fixture.nativeElement.querySelectorAll("ui-accordion-item");
    expect(items.length).toBe(3);
  });

  it("should start with all panels collapsed", () => {
    const panels = fixture.nativeElement.querySelectorAll(".panel");
    expect(panels.length).toBe(0);
  });

  describe("expand/collapse", () => {
    it("should expand a panel when header is clicked", () => {
      const headers = fixture.nativeElement.querySelectorAll(".header");
      headers[0].click();
      fixture.detectChanges();
      const panels = fixture.nativeElement.querySelectorAll(".panel");
      expect(panels.length).toBe(1);
      expect(panels[0].textContent.trim()).toBe("Content A");
    });

    it("should collapse an expanded panel when header is clicked again in multi mode", () => {
      host.mode.set("multi");
      fixture.detectChanges();
      const headers = fixture.nativeElement.querySelectorAll(".header");
      headers[0].click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll(".panel").length).toBe(
        1,
      );
      headers[0].click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll(".panel").length).toBe(
        0,
      );
    });

    it("should not toggle a disabled item", () => {
      const headers = fixture.nativeElement.querySelectorAll(".header");
      headers[2].click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll(".panel").length).toBe(
        0,
      );
    });
  });

  describe("single mode", () => {
    it("should not collapse the open panel when requireOpen is true", () => {
      const headers = fixture.nativeElement.querySelectorAll(".header");
      headers[0].click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll(".panel").length).toBe(
        1,
      );
      headers[0].click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll(".panel").length).toBe(
        1,
      );
    });

    it("should allow collapsing the open panel when requireOpen is false", () => {
      host.requireOpen.set(false);
      fixture.detectChanges();
      const headers = fixture.nativeElement.querySelectorAll(".header");
      headers[0].click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll(".panel").length).toBe(
        1,
      );
      headers[0].click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll(".panel").length).toBe(
        0,
      );
    });

    it("should collapse other panels when one is expanded", async () => {
      const headers = fixture.nativeElement.querySelectorAll(".header");
      headers[0].click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll(".panel").length).toBe(
        1,
      );

      headers[1].click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const panels = fixture.nativeElement.querySelectorAll(".panel");
      expect(panels.length).toBe(1);
      expect(panels[0].textContent.trim()).toBe("Content B");
    });
  });

  describe("multi mode", () => {
    it("should allow multiple panels to be expanded simultaneously", async () => {
      host.mode.set("multi");
      fixture.detectChanges();

      const headers = fixture.nativeElement.querySelectorAll(".header");
      headers[0].click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      headers[1].click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const panels = fixture.nativeElement.querySelectorAll(".panel");
      expect(panels.length).toBe(2);
    });
  });

  describe("keyboard", () => {
    it("should toggle on Enter key", () => {
      const headers = fixture.nativeElement.querySelectorAll(".header");
      headers[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll(".panel").length).toBe(
        1,
      );
    });

    it("should toggle on Space key", () => {
      const headers = fixture.nativeElement.querySelectorAll(".header");
      headers[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: " ", bubbles: true }),
      );
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll(".panel").length).toBe(
        1,
      );
    });
  });

  describe("host classes", () => {
    it("should have ui-accordion class", () => {
      expect(
        fixture.nativeElement.querySelector("ui-accordion").classList,
      ).toContain("ui-accordion");
    });

    it("should apply expanded class to expanded item", () => {
      const headers = fixture.nativeElement.querySelectorAll(".header");
      headers[0].click();
      fixture.detectChanges();
      const item = fixture.nativeElement.querySelector("ui-accordion-item");
      expect(item.classList).toContain("expanded");
    });

    it("should apply disabled class to disabled item", () => {
      const items = fixture.nativeElement.querySelectorAll("ui-accordion-item");
      expect(items[2].classList).toContain("disabled");
    });
  });

  describe("aria", () => {
    it("should set aria-expanded on headers", () => {
      const headers = fixture.nativeElement.querySelectorAll(".header");
      expect(headers[0].getAttribute("aria-expanded")).toBe("false");
      headers[0].click();
      fixture.detectChanges();
      expect(headers[0].getAttribute("aria-expanded")).toBe("true");
    });

    it("should set aria-disabled on disabled items", () => {
      const headers = fixture.nativeElement.querySelectorAll(".header");
      expect(headers[2].getAttribute("aria-disabled")).toBe("true");
    });
  });
});

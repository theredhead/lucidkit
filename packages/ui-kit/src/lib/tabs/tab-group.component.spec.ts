import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import { UITabGroup } from "./tab-group.component";
import { UITab } from "./tab.component";

@Component({
  standalone: true,
  imports: [UITabGroup, UITab],
  template: `
    <ui-tab-group [selectedIndex]="startIndex()">
      <ui-tab label="One">Content one</ui-tab>
      <ui-tab label="Two">Content two</ui-tab>
      <ui-tab label="Three" [disabled]="true">Content three</ui-tab>
    </ui-tab-group>
  `,
})
class TestHost {
  public readonly startIndex = signal(0);
}

describe("UITabGroup", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create with three tabs", () => {
    const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
    expect(tabs.length).toBe(3);
  });

  describe("tab headers", () => {
    it("should display tab labels", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      expect(tabs[0].textContent.trim()).toBe("One");
      expect(tabs[1].textContent.trim()).toBe("Two");
      expect(tabs[2].textContent.trim()).toBe("Three");
    });

    it("should mark first tab as active by default", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
      expect(tabs[0].classList).toContain("tab--active");
    });

    it("should mark disabled tab", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      expect(tabs[2].classList).toContain("tab--disabled");
    });
  });

  describe("panel", () => {
    it("should render active tab content", () => {
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel.textContent).toContain("Content one");
    });

    it("should switch content on tab click", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      tabs[1].click();
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel.textContent).toContain("Content two");
    });

    it("should not switch to disabled tab", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      tabs[2].click();
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel.textContent).toContain("Content one");
    });
  });

  describe("selectedIndex", () => {
    it("should respect initial selectedIndex", () => {
      host.startIndex.set(1);
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel.textContent).toContain("Content two");
    });
  });

  describe("keyboard navigation", () => {
    it("should navigate right with ArrowRight", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      tabs[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel.textContent).toContain("Content two");
    });

    it("should navigate left with ArrowLeft", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      tabs[1].click();
      fixture.detectChanges();
      tabs[1].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }),
      );
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel.textContent).toContain("Content one");
    });

    it("should skip disabled tabs", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      tabs[1].click();
      fixture.detectChanges();
      // ArrowRight from tab 1 should skip disabled tab 2
      tabs[1].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel.textContent).toContain("Content two"); // stays on Two because Three is disabled and there's nothing after
    });

    it("should go to first tab on Home", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      tabs[1].click();
      fixture.detectChanges();
      tabs[1].dispatchEvent(
        new KeyboardEvent("keydown", { key: "Home", bubbles: true }),
      );
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel.textContent).toContain("Content one");
    });

    it("should go to last enabled tab on End", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      tabs[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "End", bubbles: true }),
      );
      fixture.detectChanges();
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      // Should be "Two" since "Three" is disabled
      expect(panel.textContent).toContain("Content two");
    });
  });

  describe("accessibility", () => {
    it("should have tablist role on header", () => {
      const header = fixture.nativeElement.querySelector("[role='tablist']");
      expect(header).toBeTruthy();
    });

    it("should have tabpanel role on panel", () => {
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(panel).toBeTruthy();
    });

    it("should set aria-selected correctly", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      expect(tabs[0].getAttribute("aria-selected")).toBe("true");
      expect(tabs[1].getAttribute("aria-selected")).toBe("false");
    });

    it("should set tabindex on active tab", () => {
      const tabs = fixture.nativeElement.querySelectorAll("[role='tab']");
      expect(tabs[0].getAttribute("tabindex")).toBe("0");
      expect(tabs[1].getAttribute("tabindex")).toBe("-1");
    });

    it("should link tab to panel via aria-controls", () => {
      const tab = fixture.nativeElement.querySelector("[role='tab']");
      const panel = fixture.nativeElement.querySelector("[role='tabpanel']");
      expect(tab.getAttribute("aria-controls")).toBe(panel.id);
    });
  });
});

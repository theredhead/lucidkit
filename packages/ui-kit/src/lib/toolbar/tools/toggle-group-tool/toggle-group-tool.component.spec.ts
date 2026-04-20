import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import type { ToolActionEvent } from "../../toolbar-action";
import { UIToolbar } from "../../toolbar.component";
import { UIToggleGroupTool } from "./toggle-group-tool.component";
import { UIToggleTool } from "../toggle-tool/toggle-tool.component";

// ── Basic host ────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [UIToolbar, UIToggleGroupTool, UIToggleTool],
  template: `
    <ui-toolbar (toolAction)="onAction($event)">
      <ui-toggle-group-tool id="alignment">
        <ui-toggle-tool id="left" label="Left" />
        <ui-toggle-tool id="center" label="Center" />
        <ui-toggle-tool id="right" label="Right" />
      </ui-toggle-group-tool>
    </ui-toolbar>
  `,
})
class TestHost {
  public lastAction: ToolActionEvent | null = null;

  public onAction(e: ToolActionEvent): void {
    this.lastAction = e;
  }
}

// ── Conditional host — regression for undefined contentChildren crash ──

@Component({
  standalone: true,
  imports: [UIToolbar, UIToggleGroupTool, UIToggleTool],
  template: `
    <ui-toolbar (toolAction)="onAction($event)">
      <ui-toggle-group-tool id="alignment">
        <ui-toggle-tool id="left" label="Left" />
        @if (showCenter()) {
          <ui-toggle-tool id="center" label="Center" />
        }
        <ui-toggle-tool id="right" label="Right" />
      </ui-toggle-group-tool>
    </ui-toolbar>
  `,
})
class ConditionalHost {
  public readonly showCenter = signal(false);
  public lastAction: ToolActionEvent | null = null;

  public onAction(e: ToolActionEvent): void {
    this.lastAction = e;
  }
}

// ── Tests ─────────────────────────────────────────────────────────────

describe("UIToggleGroupTool", () => {
  describe("basic rendering", () => {
    let fixture: ComponentFixture<TestHost>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHost],
      }).compileComponents();
      fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
    });

    it("should create", () => {
      expect(fixture.componentInstance).toBeTruthy();
    });

    it("should render child toggle tools", () => {
      const toggles = fixture.nativeElement.querySelectorAll("ui-toggle-tool");
      expect(toggles.length).toBe(3);
    });
  });

  describe("mutual exclusion", () => {
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

    it("should add the checked class when a toggle is clicked", () => {
      const toggles = fixture.nativeElement.querySelectorAll("ui-toggle-tool");
      const leftBtn: HTMLButtonElement = toggles[0].querySelector("button");

      leftBtn.click();
      fixture.detectChanges();

      expect(toggles[0].classList).toContain("checked");
    });

    it("should deactivate the previously active sibling", () => {
      const toggles = fixture.nativeElement.querySelectorAll("ui-toggle-tool");
      const leftBtn: HTMLButtonElement = toggles[0].querySelector("button");
      const centerBtn: HTMLButtonElement = toggles[1].querySelector("button");

      leftBtn.click();
      fixture.detectChanges();
      expect(toggles[0].classList).toContain("checked");

      centerBtn.click();
      fixture.detectChanges();
      expect(toggles[0].classList).not.toContain("checked");
      expect(toggles[1].classList).toContain("checked");
    });

    it("should bubble toolAction to the toolbar", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector("button");
      btn.click();
      expect(host.lastAction?.itemId).toBe("left");
    });
  });

  describe("conditional children — regression: undefined contentChildren entries crash", () => {
    let fixture: ComponentFixture<ConditionalHost>;
    let host: ConditionalHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ConditionalHost],
      }).compileComponents();
      fixture = TestBed.createComponent(ConditionalHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should not throw when conditional child is initially hidden", () => {
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it("should not throw when conditional child is shown", () => {
      expect(() => {
        host.showCenter.set(true);
        fixture.detectChanges();
      }).not.toThrow();
    });

    it("should not throw when conditional child is toggled multiple times", () => {
      expect(() => {
        for (let i = 0; i < 6; i++) {
          host.showCenter.set(i % 2 === 0);
          fixture.detectChanges();
        }
      }).not.toThrow();
    });

    it("should deactivate left sibling when center is clicked while visible", () => {
      host.showCenter.set(true);
      fixture.detectChanges();

      const toggles = fixture.nativeElement.querySelectorAll("ui-toggle-tool");
      const leftBtn: HTMLButtonElement = toggles[0].querySelector("button");
      const centerBtn: HTMLButtonElement = toggles[1].querySelector("button");

      leftBtn.click();
      fixture.detectChanges();
      centerBtn.click();
      fixture.detectChanges();

      expect(toggles[0].classList).not.toContain("checked");
      expect(toggles[1].classList).toContain("checked");
    });

    it("should still forward toolAction after toggling conditional child off", () => {
      host.showCenter.set(true);
      fixture.detectChanges();
      host.showCenter.set(false);
      fixture.detectChanges();

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector("button");
      btn.click();
      expect(host.lastAction?.itemId).toBe("left");
    });
  });
});

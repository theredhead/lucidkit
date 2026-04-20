import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import type { ToolActionEvent } from "../../toolbar-action";
import { UIToolbar } from "../../toolbar.component";
import { UIButtonGroupTool } from "./button-group-tool.component";
import { UIButtonTool } from "../button-tool/button-tool.component";

// ── Basic host ────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [UIToolbar, UIButtonGroupTool, UIButtonTool],
  template: `
    <ui-toolbar (toolAction)="onAction($event)">
      <ui-button-group-tool id="group">
        <ui-button-tool id="undo" label="Undo" />
        <ui-button-tool id="redo" label="Redo" />
      </ui-button-group-tool>
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
  imports: [UIToolbar, UIButtonGroupTool, UIButtonTool],
  template: `
    <ui-toolbar (toolAction)="onAction($event)">
      <ui-button-group-tool id="group">
        <ui-button-tool id="always" label="Always" />
        @if (showExtra()) {
          <ui-button-tool id="extra" label="Extra" />
        }
      </ui-button-group-tool>
    </ui-toolbar>
  `,
})
class ConditionalHost {
  public readonly showExtra = signal(false);
  public lastAction: ToolActionEvent | null = null;

  public onAction(e: ToolActionEvent): void {
    this.lastAction = e;
  }
}

// ── Tests ─────────────────────────────────────────────────────────────

describe("UIButtonGroupTool", () => {
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

    it("should render child button tools", () => {
      const buttons = fixture.nativeElement.querySelectorAll("ui-button-tool");
      expect(buttons.length).toBe(2);
    });
  });

  describe("event forwarding", () => {
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

    it("should bubble child itemAction up to toolbar toolAction", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector("button");
      btn.click();
      expect(host.lastAction).not.toBeNull();
      expect(host.lastAction?.itemId).toBe("undo");
    });

    it("should correctly identify the second child's action", () => {
      const btns: NodeListOf<HTMLButtonElement> =
        fixture.nativeElement.querySelectorAll("button");
      btns[1].click();
      expect(host.lastAction?.itemId).toBe("redo");
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
        host.showExtra.set(true);
        fixture.detectChanges();
      }).not.toThrow();
    });

    it("should not throw when conditional child is toggled multiple times", () => {
      expect(() => {
        for (let i = 0; i < 6; i++) {
          host.showExtra.set(i % 2 === 0);
          fixture.detectChanges();
        }
      }).not.toThrow();
    });

    it("should forward toolAction from always-present item after toggling conditional item off", () => {
      host.showExtra.set(true);
      fixture.detectChanges();
      host.showExtra.set(false);
      fixture.detectChanges();

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector("button");
      btn.click();
      expect(host.lastAction?.itemId).toBe("always");
    });

    it("should forward toolAction from conditional item when it is visible", () => {
      host.showExtra.set(true);
      fixture.detectChanges();

      const btns: NodeListOf<HTMLButtonElement> =
        fixture.nativeElement.querySelectorAll("button");
      btns[1].click();
      expect(host.lastAction?.itemId).toBe("extra");
    });
  });
});

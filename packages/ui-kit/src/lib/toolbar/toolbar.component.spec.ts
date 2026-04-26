import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import type { ToolActionEvent } from "./toolbar-action";
import { UIToolbar } from "./toolbar.component";
import { UIButtonTool } from "./tools/button-tool/button-tool.component";
import { UISeparatorTool } from "./tools/separator-tool/separator-tool.component";

// ── Basic host ────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [UIToolbar, UIButtonTool, UISeparatorTool],
  template: `
    <ui-toolbar (toolAction)="onAction($event)">
      <ui-button-tool id="save" label="Save" />
      <ui-separator-tool id="sep1" />
      <ui-button-tool id="cancel" label="Cancel" />
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
  imports: [UIToolbar, UIButtonTool],
  template: `
    <ui-toolbar (toolAction)="onAction($event)">
      <ui-button-tool id="always" label="Always" />
      @if (showExtra()) {
        <ui-button-tool id="extra" label="Extra" />
      }
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

@Component({
  standalone: true,
  imports: [UIToolbar, UIButtonTool],
  template: `
    <div class="anchor">
      <ui-toolbar
        displayMode="floating-toggle"
        ariaLabel="Floating toolbar"
        [collapsed]="collapsed()"
        (collapsedChange)="onCollapsedChange($event)"
      >
        <ui-button-tool id="format" label="Format" />
      </ui-toolbar>
    </div>
  `,
})
class FloatingToggleHost {
  public readonly collapsed = signal(true);

  public onCollapsedChange(value: boolean): void {
    this.collapsed.set(value);
  }
}

// ── Tests ─────────────────────────────────────────────────────────────

describe("UIToolbar", () => {
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

    it("should project button tool children", () => {
      const tools = fixture.nativeElement.querySelectorAll("ui-button-tool");
      expect(tools.length).toBe(2);
    });

    it("should project separator tool children", () => {
      const seps = fixture.nativeElement.querySelectorAll("ui-separator-tool");
      expect(seps.length).toBe(1);
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

    it("should emit toolAction when a child button tool is clicked", () => {
      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector("button");
      btn.click();
      expect(host.lastAction).not.toBeNull();
      expect(host.lastAction?.itemId).toBe("save");
    });

    it("should emit toolAction for the second item when it is clicked", () => {
      const btns: NodeListOf<HTMLButtonElement> =
        fixture.nativeElement.querySelectorAll("button");
      btns[1].click();
      expect(host.lastAction?.itemId).toBe("cancel");
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

    it("should not throw when the conditional item is initially hidden", () => {
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it("should not throw when the conditional item is shown", () => {
      expect(() => {
        host.showExtra.set(true);
        fixture.detectChanges();
      }).not.toThrow();
    });

    it("should not throw when the conditional item is toggled multiple times", () => {
      expect(() => {
        for (let i = 0; i < 6; i++) {
          host.showExtra.set(i % 2 === 0);
          fixture.detectChanges();
        }
      }).not.toThrow();
    });

    it("should still forward toolAction from always-present item after toggling conditional item off", () => {
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

  describe("floating toggle mode", () => {
    let fixture: ComponentFixture<FloatingToggleHost>;
    let host: FloatingToggleHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FloatingToggleHost],
      }).compileComponents();
      fixture = TestBed.createComponent(FloatingToggleHost);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should show only the floating toggle button when collapsed", () => {
      const toolbar: HTMLElement =
        fixture.nativeElement.querySelector("ui-toolbar");
      const shell = toolbar.querySelector(".toolbar-shell");
      const floatingToggle = toolbar.querySelector(".floating-toggle-button");

      expect(toolbar.classList).toContain("collapsed");
      expect(shell).toBeTruthy();
      expect(floatingToggle).toBeTruthy();
    });

    it("should expand when the floating toggle button is clicked", () => {
      const toolbar: HTMLElement =
        fixture.nativeElement.querySelector("ui-toolbar");
      const floatingToggle: HTMLButtonElement | null = toolbar.querySelector(
        ".floating-toggle-button",
      );

      floatingToggle?.click();
      fixture.detectChanges();

      expect(host.collapsed()).toBe(false);
      expect(toolbar.classList).not.toContain("collapsed");
      expect(toolbar.classList).toContain("expanding");
    });

    it("should collapse again when the floating toggle button is clicked", () => {
      host.collapsed.set(false);
      fixture.detectChanges();

      const toolbar: HTMLElement =
        fixture.nativeElement.querySelector("ui-toolbar");
      const floatingToggle: HTMLButtonElement | null = toolbar.querySelector(
        ".floating-toggle-button",
      );

      floatingToggle?.click();
      fixture.detectChanges();

      expect(host.collapsed()).toBe(true);
      expect(toolbar.classList).toContain("collapsed");
      expect(toolbar.classList).toContain("collapsing");
    });

    it("should keep the shell mounted until collapse animation completes", () => {
      host.collapsed.set(false);
      fixture.detectChanges();

      const toolbar: HTMLElement =
        fixture.nativeElement.querySelector("ui-toolbar");
      const shell: HTMLElement | null = toolbar.querySelector(".toolbar-shell");
      const floatingToggle: HTMLButtonElement | null = toolbar.querySelector(
        ".floating-toggle-button",
      );

      floatingToggle?.click();
      fixture.detectChanges();

      expect(shell).toBeTruthy();
      expect(toolbar.classList).toContain("collapsing");

      shell?.dispatchEvent(new Event("animationend"));
      fixture.detectChanges();

      expect(toolbar.classList).not.toContain("collapsing");
      expect(toolbar.classList).toContain("collapsed");
    });

    it("should settle back to expanded after the open animation completes", () => {
      const toolbar: HTMLElement =
        fixture.nativeElement.querySelector("ui-toolbar");
      const shell: HTMLElement | null = toolbar.querySelector(".toolbar-shell");
      const floatingToggle: HTMLButtonElement | null = toolbar.querySelector(
        ".floating-toggle-button",
      );

      floatingToggle?.click();
      fixture.detectChanges();

      expect(toolbar.classList).toContain("expanding");

      shell?.dispatchEvent(new Event("animationend"));
      fixture.detectChanges();

      expect(toolbar.classList).not.toContain("expanding");
      expect(toolbar.classList).not.toContain("collapsed");
    });
  });
});

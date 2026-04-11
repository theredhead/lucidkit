import { Component, signal, viewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { UIDashboard } from "./dashboard.component";
import { UIDashboardPanel } from "./dashboard-panel.component";
import type { DashboardPanelConfig } from "./dashboard.types";

// ── Test host ────────────────────────────────────────────────────

const panelConfigs: DashboardPanelConfig[] = [
  { id: "kpi", title: "KPI Overview", placement: { colSpan: 2 } },
  { id: "chart", title: "Revenue Chart" },
  {
    id: "feed",
    title: "Activity Feed",
    collapsible: true,
    removable: true,
  },
];

@Component({
  selector: "ui-test-dashboard-host",
  standalone: true,
  imports: [UIDashboard, UIDashboardPanel],
  template: `
    <ui-dashboard
      [columns]="columns()"
      [gap]="gap()"
      [ariaLabel]="ariaLabel()"
      (panelRemoved)="onPanelRemoved($event)"
    >
      @for (cfg of configs(); track cfg.id) {
        <ui-dashboard-panel [config]="cfg">
          <p class="test-content">Content for {{ cfg.id }}</p>
        </ui-dashboard-panel>
      }
    </ui-dashboard>
  `,
})
class TestDashboardHost {
  public readonly dashboard = viewChild.required(UIDashboard);
  public readonly columns = signal<"auto" | number>(3);
  public readonly gap = signal(16);
  public readonly ariaLabel = signal("Test dashboard");
  public readonly configs = signal(panelConfigs);
  public readonly removedPanelId = signal<string | undefined>(undefined);

  public onPanelRemoved(id: string): void {
    this.removedPanelId.set(id);
  }
}

// ── Tests ────────────────────────────────────────────────────────

describe("UIDashboard", () => {
  let fixture: ComponentFixture<TestDashboardHost>;
  let host: TestDashboardHost;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDashboardHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestDashboardHost);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(host.dashboard()).toBeTruthy();
  });

  describe("rendering", () => {
    it("should render all panels", () => {
      const panels = el.querySelectorAll("ui-dashboard-panel");
      expect(panels.length).toBe(3);
    });

    it("should render panel titles", () => {
      const titles = el.querySelectorAll(".title");
      expect(titles.length).toBe(3);
      expect(titles[0].textContent?.trim()).toBe("KPI Overview");
      expect(titles[1].textContent?.trim()).toBe("Revenue Chart");
      expect(titles[2].textContent?.trim()).toBe("Activity Feed");
    });

    it("should project content into panels", () => {
      const contents = el.querySelectorAll(".test-content");
      expect(contents.length).toBe(3);
      expect(contents[0].textContent?.trim()).toBe("Content for kpi");
    });

    it("should render the grid container", () => {
      const grid = el.querySelector(".grid");
      expect(grid).toBeTruthy();
    });
  });

  describe("grid layout", () => {
    it("should set grid-template-columns for fixed column count", () => {
      const grid = el.querySelector(".grid") as HTMLElement;
      expect(grid.style.gridTemplateColumns).toBe("repeat(3, 1fr)");
    });

    it("should set grid-template-columns for auto mode", () => {
      host.columns.set("auto");
      fixture.detectChanges();
      const grid = el.querySelector(".grid") as HTMLElement;
      expect(grid.style.gridTemplateColumns).toContain("auto-fill");
    });

    it("should set gap", () => {
      const grid = el.querySelector(".grid") as HTMLElement;
      expect(grid.style.gap).toBe("16px");
    });

    it("should update gap when input changes", () => {
      host.gap.set(24);
      fixture.detectChanges();
      const grid = el.querySelector(".grid") as HTMLElement;
      expect(grid.style.gap).toBe("24px");
    });

    it("should apply colSpan to panel host style", () => {
      const kpiPanel = el.querySelector('[data-panel-id="kpi"]') as HTMLElement;
      expect(kpiPanel.style.gridColumn).toBe("span 2");
    });

    it("should not set gridColumn for span 1", () => {
      const chartPanel = el.querySelector(
        '[data-panel-id="chart"]',
      ) as HTMLElement;
      expect(chartPanel.style.gridColumn).toBe("");
    });
  });

  describe("accessibility", () => {
    it("should have role=region on the grid", () => {
      const grid = el.querySelector(".grid");
      expect(grid?.getAttribute("role")).toBe("region");
    });

    it("should have aria-label on the grid", () => {
      const grid = el.querySelector(".grid");
      expect(grid?.getAttribute("aria-label")).toBe("Test dashboard");
    });

    it("should support custom ariaLabel", () => {
      host.ariaLabel.set("My dashboard");
      fixture.detectChanges();
      const grid = el.querySelector(".grid");
      expect(grid?.getAttribute("aria-label")).toBe("My dashboard");
    });
  });

  describe("panel collapse", () => {
    it("should show collapse button only for collapsible panels", () => {
      const panels = el.querySelectorAll("ui-dashboard-panel");
      // Only the "Activity Feed" panel (index 2) is collapsible
      const btns0 = panels[0].querySelectorAll(
        ".action:not(.action--remove)",
      );
      const btns2 = panels[2].querySelectorAll(
        ".action:not(.action--remove)",
      );
      expect(btns0.length).toBe(0);
      expect(btns2.length).toBe(1);
    });

    it("should collapse panel body on toggle click", () => {
      const feedPanel = el.querySelector(
        '[data-panel-id="feed"]',
      ) as HTMLElement;
      const toggleBtn = feedPanel.querySelector(
        ".action:not(.action--remove)",
      ) as HTMLElement;

      expect(feedPanel.querySelector(".body")).toBeTruthy();

      toggleBtn.click();
      fixture.detectChanges();

      expect(feedPanel.querySelector(".body")).toBeNull();
      expect(feedPanel.classList).toContain("collapsed");
    });

    it("should expand panel body on second toggle click", () => {
      const feedPanel = el.querySelector(
        '[data-panel-id="feed"]',
      ) as HTMLElement;
      const toggleBtn = feedPanel.querySelector(
        ".action:not(.action--remove)",
      ) as HTMLElement;

      toggleBtn.click();
      fixture.detectChanges();
      expect(feedPanel.querySelector(".body")).toBeNull();

      toggleBtn.click();
      fixture.detectChanges();
      expect(feedPanel.querySelector(".body")).toBeTruthy();
    });

    it("should have correct aria-expanded attribute", () => {
      const feedPanel = el.querySelector(
        '[data-panel-id="feed"]',
      ) as HTMLElement;
      const toggleBtn = feedPanel.querySelector(
        ".action:not(.action--remove)",
      ) as HTMLElement;

      expect(toggleBtn.getAttribute("aria-expanded")).toBe("true");

      toggleBtn.click();
      fixture.detectChanges();

      expect(toggleBtn.getAttribute("aria-expanded")).toBe("false");
    });
  });

  describe("panel remove", () => {
    it("should show remove button only for removable panels", () => {
      const panels = el.querySelectorAll("ui-dashboard-panel");
      const removeBtns0 = panels[0].querySelectorAll(
        ".action--remove",
      );
      const removeBtns2 = panels[2].querySelectorAll(
        ".action--remove",
      );
      expect(removeBtns0.length).toBe(0);
      expect(removeBtns2.length).toBe(1);
    });

    it("should hide panel on remove click", () => {
      const feedPanel = el.querySelector(
        '[data-panel-id="feed"]',
      ) as HTMLElement;
      const removeBtn = feedPanel.querySelector(
        ".action--remove",
      ) as HTMLElement;

      removeBtn.click();
      fixture.detectChanges();

      expect(feedPanel.classList).toContain("removed");
    });

    it("should emit panelRemoved on remove", () => {
      const feedPanel = el.querySelector(
        '[data-panel-id="feed"]',
      ) as HTMLElement;
      const removeBtn = feedPanel.querySelector(
        ".action--remove",
      ) as HTMLElement;

      removeBtn.click();
      fixture.detectChanges();

      expect(host.removedPanelId()).toBe("feed");
    });
  });

  describe("panel restore", () => {
    it("should restore a removed panel by id", () => {
      // Remove the panel first
      const feedPanel = el.querySelector(
        '[data-panel-id="feed"]',
      ) as HTMLElement;
      const removeBtn = feedPanel.querySelector(
        ".action--remove",
      ) as HTMLElement;
      removeBtn.click();
      fixture.detectChanges();
      expect(feedPanel.classList).toContain("removed");

      // Restore it
      const restored = host.dashboard().restorePanel("feed");
      fixture.detectChanges();

      expect(restored).toBe(true);
      expect(feedPanel.classList).not.toContain("removed");
    });

    it("should return false for unknown panel id", () => {
      const result = host.dashboard().restorePanel("nonexistent");
      expect(result).toBe(false);
    });

    it("should restore all removed panels", () => {
      // Remove the feed panel
      const feedPanel = el.querySelector(
        '[data-panel-id="feed"]',
      ) as HTMLElement;
      feedPanel
        .querySelector<HTMLElement>(".action--remove")!
        .click();
      fixture.detectChanges();
      expect(feedPanel.classList).toContain("removed");

      host.dashboard().restoreAll();
      fixture.detectChanges();

      expect(feedPanel.classList).not.toContain("removed");
    });
  });

  describe("contentChildren discovery", () => {
    it("should discover all projected panels", () => {
      expect(host.dashboard().panels().length).toBe(3);
    });

    it("should report removed panel ids", () => {
      const feedPanel = el.querySelector(
        '[data-panel-id="feed"]',
      ) as HTMLElement;
      feedPanel
        .querySelector<HTMLElement>(".action--remove")!
        .click();
      fixture.detectChanges();

      const removedIds = host.dashboard().removedPanelIds();
      expect(removedIds).toEqual(["feed"]);
    });
  });
});

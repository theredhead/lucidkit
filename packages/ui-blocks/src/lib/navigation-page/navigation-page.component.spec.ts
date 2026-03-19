import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal, viewChild } from "@angular/core";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  UINavigationPage,
  type NavigationGroupDef,
  type NavigationPageItem,
} from "./navigation-page.component";

// ── Test data ────────────────────────────────────────────────────────

const TEST_PAGES: NavigationPageItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "<circle />" },
  { id: "projects", label: "Projects", icon: "<rect />", badge: "5" },
  { id: "calendar", label: "Calendar" },
  { id: "general", label: "General", group: "settings" },
  { id: "security", label: "Security", group: "settings" },
  { id: "disabled-page", label: "Disabled", disabled: true },
];

const TEST_GROUPS: NavigationGroupDef[] = [
  { id: "settings", label: "Settings", icon: "<path />" },
];

// ── Test host ────────────────────────────────────────────────────────

@Component({
  selector: "ui-test-nav-host",
  standalone: true,
  imports: [UINavigationPage],
  template: `
    <div style="height: 400px">
      <ui-navigation-page
        [pages]="pages()"
        [groups]="groups()"
        [rootLabel]="rootLabel()"
        [sidebarPinned]="sidebarPinned()"
        [(activePage)]="activePage"
        (navigated)="onNavigated($event)"
      >
        <ng-template #content let-page>
          <h2 class="test-title">{{ page.label }}</h2>
        </ng-template>
      </ui-navigation-page>
    </div>
  `,
})
class TestNavHost {
  public readonly nav = viewChild.required(UINavigationPage);
  public readonly pages = signal<readonly NavigationPageItem[]>(TEST_PAGES);
  public readonly groups = signal<readonly NavigationGroupDef[]>(TEST_GROUPS);
  public readonly rootLabel = signal("Home");
  public readonly sidebarPinned = signal(true);
  public readonly activePage = signal("dashboard");
  public readonly onNavigated = vi.fn();
}

// ── Tests ────────────────────────────────────────────────────────────

describe("UINavigationPage", () => {
  let fixture: ComponentFixture<TestNavHost>;
  let host: TestNavHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestNavHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestNavHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(host.nav()).toBeTruthy();
  });

  // ── Defaults ──────────────────────────────────────────────────────

  describe("defaults", () => {
    it("should default rootLabel to 'Home'", () => {
      expect(host.nav().rootLabel()).toBe("Home");
    });

    it("should default sidebarPinned to true", () => {
      expect(host.nav().sidebarPinned()).toBe(true);
    });

    it("should default drawerPosition to 'left'", () => {
      expect(host.nav().drawerPosition()).toBe("left");
    });

    it("should default drawerWidth to 'medium'", () => {
      expect(host.nav().drawerWidth()).toBe("medium");
    });

    it("should default breadcrumbVariant to 'button'", () => {
      expect(host.nav().breadcrumbVariant()).toBe("button");
    });

    it("should default ariaLabel to 'Page navigation'", () => {
      expect(host.nav().ariaLabel()).toBe("Page navigation");
    });
  });

  // ── Host classes ──────────────────────────────────────────────────

  describe("host classes", () => {
    it("should have ui-navigation-page base class", () => {
      const el = fixture.nativeElement.querySelector("ui-navigation-page");
      expect(el.classList).toContain("ui-navigation-page");
    });
  });

  // ── Sidebar rendering ─────────────────────────────────────────────

  describe("sidebar (pinned)", () => {
    it("should render a pinned sidebar when sidebarPinned is true", () => {
      const sidebar = fixture.nativeElement.querySelector(".nav-page-sidebar");
      expect(sidebar).toBeTruthy();
    });

    it("should not render a drawer when sidebarPinned is true", () => {
      const drawer = fixture.nativeElement.querySelector("ui-drawer");
      expect(drawer).toBeFalsy();
    });

    it("should render all sidebar items (top-level and grouped)", () => {
      const items = fixture.nativeElement.querySelectorAll(
        ".nav-page-sidebar ui-sidebar-item",
      );
      // 4 top-level + 2 inside settings group = 6
      expect(items.length).toBe(6);
    });

    it("should render sidebar groups", () => {
      const groups = fixture.nativeElement.querySelectorAll(
        ".nav-page-sidebar ui-sidebar-group",
      );
      expect(groups.length).toBe(1);
    });

    it("should render items inside groups", () => {
      const groupItems = fixture.nativeElement.querySelectorAll(
        ".nav-page-sidebar ui-sidebar-group ui-sidebar-item",
      );
      // general + security = 2
      expect(groupItems.length).toBe(2);
    });

    it("should mark the active item", () => {
      const activeItem = fixture.nativeElement.querySelector(
        ".nav-page-sidebar ui-sidebar-item.ui-sidebar-item--active",
      );
      expect(activeItem).toBeTruthy();
    });
  });

  // ── Drawer mode ───────────────────────────────────────────────────

  describe("sidebar (drawer mode)", () => {
    beforeEach(() => {
      host.sidebarPinned.set(false);
      fixture.detectChanges();
    });

    it("should render a drawer when sidebarPinned is false", () => {
      const drawer = fixture.nativeElement.querySelector("ui-drawer");
      expect(drawer).toBeTruthy();
    });

    it("should not render pinned sidebar when sidebarPinned is false", () => {
      const sidebar = fixture.nativeElement.querySelector(".nav-page-sidebar");
      expect(sidebar).toBeFalsy();
    });
  });

  // ── Breadcrumb ────────────────────────────────────────────────────

  describe("breadcrumb", () => {
    it("should render a breadcrumb component", () => {
      const bc = fixture.nativeElement.querySelector("ui-breadcrumb");
      expect(bc).toBeTruthy();
    });

    it("should show root label and current page in breadcrumb", () => {
      const bcItems = fixture.nativeElement.querySelectorAll(
        "ui-breadcrumb .bc-item",
      );
      // Home > Dashboard = 2 items
      expect(bcItems.length).toBe(2);
    });

    it("should include group label in breadcrumb for grouped pages", () => {
      const generalPage = TEST_PAGES.find((p) => p.id === "general")!;
      host.nav().navigate(generalPage);
      fixture.detectChanges();

      const bcItems = fixture.nativeElement.querySelectorAll(
        "ui-breadcrumb .bc-item",
      );
      // Home > Settings > General = 3 items
      expect(bcItems.length).toBe(3);
    });
  });

  // ── Content area ──────────────────────────────────────────────────

  describe("content area", () => {
    it("should render the content template with current page", () => {
      const title = fixture.nativeElement.querySelector(
        ".nav-page-content .test-title",
      );
      expect(title).toBeTruthy();
      expect(title.textContent).toContain("Dashboard");
    });

    it("should update content when navigating", () => {
      host.nav().navigate(TEST_PAGES[1]);
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector(
        ".nav-page-content .test-title",
      );
      expect(title.textContent).toContain("Projects");
    });
  });

  // ── Navigation behaviour ──────────────────────────────────────────

  describe("navigation", () => {
    it("should update activePage on navigate()", () => {
      host.nav().navigate(TEST_PAGES[1]);
      expect(host.activePage()).toBe("projects");
    });

    it("should emit navigated on navigate()", () => {
      host.nav().navigate(TEST_PAGES[1]);
      expect(host.onNavigated).toHaveBeenCalledWith(TEST_PAGES[1]);
    });

    it("should not navigate to disabled pages", () => {
      const disabledPage = TEST_PAGES.find((p) => p.id === "disabled-page")!;
      host.nav().navigate(disabledPage);
      expect(host.activePage()).toBe("dashboard");
      expect(host.onNavigated).not.toHaveBeenCalled();
    });

    it("should navigate to root (first page) on navigateToRoot()", () => {
      host.nav().navigate(TEST_PAGES[2]); // go to calendar
      host.onNavigated.mockClear();

      host.nav().navigateToRoot();
      expect(host.activePage()).toBe("dashboard");
      expect(host.onNavigated).toHaveBeenCalledWith(TEST_PAGES[0]);
    });

    it("should close drawer on navigation when not pinned", () => {
      host.sidebarPinned.set(false);
      host.nav().drawerOpen.set(true);
      fixture.detectChanges();

      host.nav().navigate(TEST_PAGES[1]);
      expect(host.nav().drawerOpen()).toBe(false);
    });

    it("should not close drawer on navigation when pinned", () => {
      host.nav().drawerOpen.set(true);
      host.nav().navigate(TEST_PAGES[1]);
      expect(host.nav().drawerOpen()).toBe(true);
    });
  });

  // ── Computed properties ───────────────────────────────────────────

  describe("computed", () => {
    it("should resolve currentPage from activePage", () => {
      expect(host.nav().currentPage()?.id).toBe("dashboard");
    });

    it("should fallback to first page when activePage is invalid", () => {
      host.activePage.set("nonexistent");
      fixture.detectChanges();
      expect(host.nav().currentPage()?.id).toBe("dashboard");
    });

    it("should compute top-level pages (no group)", () => {
      const topLevel = host.nav()["topLevelPages"]();
      expect(topLevel.length).toBe(4); // dashboard, projects, calendar, disabled
      expect(topLevel.every((p: NavigationPageItem) => !p.group)).toBe(true);
    });

    it("should compute resolved groups with children", () => {
      const resolved = host.nav()["resolvedGroups"]();
      expect(resolved.length).toBe(1);
      expect(resolved[0].children.length).toBe(2);
      expect(resolved[0].children[0].id).toBe("general");
    });

    it("should build breadcrumb trail for top-level page", () => {
      const items = host.nav()["breadcrumbItems"]();
      expect(items.length).toBe(2);
      expect(items[0].label).toBe("Home");
      expect(items[1].label).toBe("Dashboard");
    });

    it("should build breadcrumb trail for grouped page", () => {
      host.activePage.set("security");
      fixture.detectChanges();

      const items = host.nav()["breadcrumbItems"]();
      expect(items.length).toBe(3);
      expect(items[0].label).toBe("Home");
      expect(items[1].label).toBe("Settings");
      expect(items[2].label).toBe("Security");
    });
  });
});

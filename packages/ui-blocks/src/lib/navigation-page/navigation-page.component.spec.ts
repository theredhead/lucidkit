import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal, viewChild } from "@angular/core";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UINavigationPage } from "./navigation-page.component";
import {
  navItem,
  navGroup,
  routesToNavigation,
  type NavigationNode,
  type NavigationRouteConfig,
} from "./navigation-page.utils";

// ── Test data ────────────────────────────────────────────────────────

const TEST_ITEMS: NavigationNode[] = [
  navItem("dashboard", "Dashboard", { icon: "<circle />" }),
  navItem("projects", "Projects", { icon: "<rect />", badge: "5" }),
  navItem("calendar", "Calendar"),
  navGroup(
    "settings",
    "Settings",
    [navItem("general", "General"), navItem("security", "Security")],
    { icon: "<path />" },
  ),
  navItem("disabled-page", "Disabled", { disabled: true }),
];

// ── Test host ────────────────────────────────────────────────────────

@Component({
  selector: "ui-test-nav-host",
  standalone: true,
  imports: [UINavigationPage],
  template: `
    <div style="height: 400px">
      <ui-navigation-page
        [items]="items()"
        [rootLabel]="rootLabel()"
        [sidebarPinned]="sidebarPinned()"
        [(activePage)]="activePage"
        (navigated)="onNavigated($event)"
      >
        <ng-template #content let-node>
          <h2 class="test-title">{{ node.data.label }}</h2>
        </ng-template>
      </ui-navigation-page>
    </div>
  `,
})
class TestNavHost {
  public readonly nav = viewChild.required(UINavigationPage);
  public readonly items = signal<readonly NavigationNode[]>(TEST_ITEMS);
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

    it("should default items to empty array", () => {
      const fresh = TestBed.createComponent(UINavigationPage);
      fresh.detectChanges();
      expect(fresh.componentInstance.items()).toEqual([]);
    });

    it("should default datasource to undefined", () => {
      const fresh = TestBed.createComponent(UINavigationPage);
      fresh.detectChanges();
      expect(fresh.componentInstance.datasource()).toBeUndefined();
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
      // 4 top-level (dashboard, projects, calendar, disabled) + 2 inside settings group = 6
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
      const generalNode = TEST_ITEMS[3].children![0]; // general inside settings
      host.nav().navigate(generalNode);
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
      host.nav().navigate(TEST_ITEMS[1]); // projects
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
      host.nav().navigate(TEST_ITEMS[1]); // projects
      expect(host.activePage()).toBe("projects");
    });

    it("should emit navigated on navigate()", () => {
      host.nav().navigate(TEST_ITEMS[1]); // projects
      expect(host.onNavigated).toHaveBeenCalledWith(TEST_ITEMS[1]);
    });

    it("should not navigate to disabled nodes", () => {
      const disabledNode = TEST_ITEMS[4]; // disabled-page
      host.nav().navigate(disabledNode);
      expect(host.activePage()).toBe("dashboard");
      expect(host.onNavigated).not.toHaveBeenCalled();
    });

    it("should navigate to root (first leaf) on navigateToRoot()", () => {
      host.nav().navigate(TEST_ITEMS[2]); // go to calendar
      host.onNavigated.mockClear();

      host.nav().navigateToRoot();
      expect(host.activePage()).toBe("dashboard");
      expect(host.onNavigated).toHaveBeenCalledWith(TEST_ITEMS[0]);
    });

    it("should close drawer on navigation when not pinned", () => {
      host.sidebarPinned.set(false);
      host.nav().drawerOpen.set(true);
      fixture.detectChanges();

      host.nav().navigate(TEST_ITEMS[1]);
      expect(host.nav().drawerOpen()).toBe(false);
    });

    it("should not close drawer on navigation when pinned", () => {
      host.nav().drawerOpen.set(true);
      host.nav().navigate(TEST_ITEMS[1]);
      expect(host.nav().drawerOpen()).toBe(true);
    });
  });

  // ── Computed properties ───────────────────────────────────────────

  describe("computed", () => {
    it("should resolve currentPage from activePage", () => {
      expect(host.nav().currentPage()?.id).toBe("dashboard");
    });

    it("should fallback to first leaf when activePage is invalid", () => {
      host.activePage.set("nonexistent");
      fixture.detectChanges();
      expect(host.nav().currentPage()?.id).toBe("dashboard");
    });

    it("should compute root nodes from items", () => {
      const roots = host.nav()["rootNodes"]();
      expect(roots.length).toBe(5); // dashboard, projects, calendar, settings, disabled
    });

    it("should detect groups (nodes with children)", () => {
      const roots = host.nav()["rootNodes"]();
      const groups = roots.filter(
        (n: NavigationNode) => (n.children?.length ?? 0) > 0,
      );
      expect(groups.length).toBe(1);
      expect(groups[0].data.label).toBe("Settings");
      expect(groups[0].children!.length).toBe(2);
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

// ── Factory helpers ─────────────────────────────────────────────────

describe("navItem", () => {
  it("should create a leaf node with label", () => {
    const node = navItem("test", "Test");
    expect(node.id).toBe("test");
    expect(node.data.label).toBe("Test");
    expect(node.children).toBeUndefined();
  });

  it("should include optional icon", () => {
    const node = navItem("test", "Test", { icon: "<svg/>" });
    expect(node.icon).toBe("<svg/>");
  });

  it("should include optional badge", () => {
    const node = navItem("test", "Test", { badge: "3" });
    expect(node.data.badge).toBe("3");
  });

  it("should include optional route", () => {
    const node = navItem("test", "Test", { route: "/test" });
    expect(node.data.route).toBe("/test");
  });

  it("should include optional disabled state", () => {
    const node = navItem("test", "Test", { disabled: true });
    expect(node.disabled).toBe(true);
  });
});

describe("navGroup", () => {
  it("should create a group node with children", () => {
    const group = navGroup("grp", "Group", [
      navItem("a", "A"),
      navItem("b", "B"),
    ]);
    expect(group.id).toBe("grp");
    expect(group.data.label).toBe("Group");
    expect(group.children).toHaveLength(2);
  });

  it("should default expanded to true", () => {
    const group = navGroup("grp", "Group", []);
    expect(group.expanded).toBe(true);
  });

  it("should allow overriding expanded", () => {
    const group = navGroup("grp", "Group", [], { expanded: false });
    expect(group.expanded).toBe(false);
  });

  it("should include optional icon", () => {
    const group = navGroup("grp", "Group", [], { icon: "<svg/>" });
    expect(group.icon).toBe("<svg/>");
  });
});

// ── routesToNavigation ──────────────────────────────────────────────

describe("routesToNavigation", () => {
  it("should skip routes without navLabel", () => {
    const routes: NavigationRouteConfig[] = [
      { path: "login" },
      { path: "dashboard", data: { navLabel: "Dashboard" } },
    ];
    const nodes = routesToNavigation(routes);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].data.label).toBe("Dashboard");
  });

  it("should set route to the full path", () => {
    const routes: NavigationRouteConfig[] = [
      { path: "dashboard", data: { navLabel: "Dashboard" } },
    ];
    const nodes = routesToNavigation(routes);
    expect(nodes[0].data.route).toBe("dashboard");
  });

  it("should map navIcon to node.icon", () => {
    const routes: NavigationRouteConfig[] = [
      { path: "home", data: { navLabel: "Home", navIcon: "<svg/>" } },
    ];
    const nodes = routesToNavigation(routes);
    expect(nodes[0].icon).toBe("<svg/>");
  });

  it("should map navBadge to data.badge", () => {
    const routes: NavigationRouteConfig[] = [
      { path: "alerts", data: { navLabel: "Alerts", navBadge: "7" } },
    ];
    const nodes = routesToNavigation(routes);
    expect(nodes[0].data.badge).toBe("7");
  });

  it("should recurse into child routes", () => {
    const routes: NavigationRouteConfig[] = [
      {
        path: "settings",
        data: { navLabel: "Settings" },
        children: [
          { path: "general", data: { navLabel: "General" } },
          { path: "security", data: { navLabel: "Security" } },
        ],
      },
    ];
    const nodes = routesToNavigation(routes);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].children).toHaveLength(2);
    expect(nodes[0].children![0].data.label).toBe("General");
    expect(nodes[0].children![0].data.route).toBe("settings/general");
  });

  it("should recurse through unlabeled parent routes", () => {
    const routes: NavigationRouteConfig[] = [
      {
        path: "admin",
        children: [{ path: "users", data: { navLabel: "Users" } }],
      },
    ];
    const nodes = routesToNavigation(routes);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].data.label).toBe("Users");
    expect(nodes[0].data.route).toBe("admin/users");
  });

  it("should handle empty routes", () => {
    expect(routesToNavigation([])).toEqual([]);
  });

  it("should handle navDisabled", () => {
    const routes: NavigationRouteConfig[] = [
      { path: "legacy", data: { navLabel: "Legacy", navDisabled: true } },
    ];
    const nodes = routesToNavigation(routes);
    expect(nodes[0].disabled).toBe(true);
  });
});

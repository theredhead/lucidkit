import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIIcons, UIIcon } from "@theredhead/ui-kit";

import { UINavigationPage } from "./navigation-page.component";
import {
  navItem,
  navGroup,
  routesToNavigation,
  type NavigationNode,
  type NavigationRouteConfig,
} from "./navigation-page.utils";

// ── Demo data ────────────────────────────────────────────────────────

const NAV_ITEMS: NavigationNode[] = [
  navItem("dashboard", "Dashboard", {
    icon: UIIcons.Lucide.Layout.LayoutDashboard,
  }),
  navItem("projects", "Projects", {
    icon: UIIcons.Lucide.Files.Folder,
    badge: "12",
  }),
  navItem("calendar", "Calendar", {
    icon: UIIcons.Lucide.Time.Calendar,
  }),
  navItem("analytics", "Analytics", {
    icon: UIIcons.Lucide.Charts.ChartLine,
  }),
  navGroup(
    "settings",
    "Settings",
    [
      navItem("general", "General", {
        icon: UIIcons.Lucide.Account.Settings,
      }),
      navItem("security", "Security", {
        icon: UIIcons.Lucide.Account.Shield,
      }),
      navItem("team", "Team Members", {
        icon: UIIcons.Lucide.Account.Users,
        badge: "3",
      }),
    ],
    { icon: UIIcons.Lucide.Account.Settings },
  ),
];

const PAGE_CONTENT: Record<string, string> = {
  dashboard:
    "Your personal dashboard with an overview of recent activity, " +
    "key metrics, and quick-access shortcuts to the most used features.",
  projects:
    "Browse and manage all your projects. Create new ones, archive " +
    "completed work, and track progress across your team.",
  calendar:
    "View upcoming meetings, deadlines, and events. Drag-and-drop " +
    "to reschedule and sync with external calendars.",
  analytics:
    "Dive into detailed analytics and reports. Visualise trends, " +
    "compare periods, and export data for presentations.",
  general:
    "General application settings — language, timezone, default views, " +
    "and notification preferences.",
  security:
    "Manage your security settings. Enable two-factor authentication, " +
    "review active sessions, and update your password.",
  team:
    "Invite team members, assign roles, and manage permissions. " +
    "View who has access to each project.",
};

// ── Router config demo data ──────────────────────────────────────────

const DEMO_ROUTES: NavigationRouteConfig[] = [
  {
    path: "dashboard",
    data: {
      navLabel: "Dashboard",
      navIcon: UIIcons.Lucide.Layout.LayoutDashboard,
    },
  },
  {
    path: "projects",
    data: {
      navLabel: "Projects",
      navIcon: UIIcons.Lucide.Files.Folder,
      navBadge: "5",
    },
  },
  {
    path: "settings",
    data: {
      navLabel: "Settings",
      navIcon: UIIcons.Lucide.Account.Settings,
    },
    children: [
      {
        path: "general",
        data: {
          navLabel: "General",
          navIcon: UIIcons.Lucide.Account.Settings,
        },
      },
      {
        path: "security",
        data: {
          navLabel: "Security",
          navIcon: UIIcons.Lucide.Account.Shield,
        },
      },
    ],
  },
  { path: "login" }, // skipped — no navLabel
  { path: "**" }, // skipped — no navLabel
];

// ── Demo components ──────────────────────────────────────────────────

@Component({
  selector: "ui-demo-nav-page-default",
  standalone: true,
  imports: [UINavigationPage, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        height: 500px;
        border: 1px solid #d7dce2;
        border-radius: 0.5rem;
        overflow: hidden;
      }
      .page-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin: 0 0 1rem;
      }
      .page-header h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
      }
      .page-description {
        font-size: 0.9rem;
        line-height: 1.6;
        color: #5a6470;
        max-width: 36rem;
      }
      .page-card {
        margin-top: 1rem;
        padding: 1.25rem;
        background: rgba(53, 132, 228, 0.08);
        border-radius: 0.5rem;
        font-size: 0.85rem;
      }
    `,
  ],
  template: `
    <ui-navigation-page
      [items]="items"
      [(activePage)]="activePage"
      (navigated)="onNavigated($event)"
    >
      <ng-template #content let-node>
        <div class="page-header">
          @if (node.icon) {
            <ui-icon [svg]="node.icon" [size]="28" />
          }
          <h2>{{ node.data.label }}</h2>
        </div>
        <p class="page-description">{{ contentFor(node.id) }}</p>
        <div class="page-card">
          ✅ You navigated to <strong>"{{ node.data.label }}"</strong>. Try
          clicking a different item in the sidebar.
        </div>
      </ng-template>
    </ui-navigation-page>
  `,
})
class DemoNavPageDefaultComponent {
  public readonly items = NAV_ITEMS;
  public readonly activePage = signal("dashboard");

  public onNavigated(_node: NavigationNode): void {
    // no-op for demo
  }

  public contentFor(id: string): string {
    return PAGE_CONTENT[id] ?? "";
  }
}

@Component({
  selector: "ui-demo-nav-page-drawer",
  standalone: true,
  imports: [UINavigationPage, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        height: 500px;
        border: 1px solid #d7dce2;
        border-radius: 0.5rem;
        overflow: hidden;
      }
      .open-btn {
        margin-bottom: 1rem;
        padding: 0.5rem 1rem;
        border: 1px solid #d7dce2;
        border-radius: 0.375rem;
        background: white;
        cursor: pointer;
        font-size: 0.85rem;
      }
      .open-btn:hover {
        background: #f5f7fa;
      }
      .page-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin: 0 0 1rem;
      }
      .page-header h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
      }
      .page-description {
        font-size: 0.9rem;
        line-height: 1.6;
        color: #5a6470;
        max-width: 36rem;
      }
    `,
  ],
  template: `
    <ui-navigation-page
      [items]="items"
      [sidebarPinned]="false"
      [(activePage)]="activePage"
      [(drawerOpen)]="drawerOpen"
    >
      <ng-template #content let-node>
        <button class="open-btn" (click)="drawerOpen.set(true)">
          ☰ Open Sidebar
        </button>
        <div class="page-header">
          @if (node.icon) {
            <ui-icon [svg]="node.icon" [size]="28" />
          }
          <h2>{{ node.data.label }}</h2>
        </div>
        <p class="page-description">{{ contentFor(node.id) }}</p>
      </ng-template>
    </ui-navigation-page>
  `,
})
class DemoNavPageDrawerComponent {
  public readonly items = NAV_ITEMS;
  public readonly activePage = signal("dashboard");
  public readonly drawerOpen = signal(false);

  public contentFor(id: string): string {
    return PAGE_CONTENT[id] ?? "";
  }
}

@Component({
  selector: "ui-demo-nav-page-custom-root",
  standalone: true,
  imports: [UINavigationPage, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        height: 500px;
        border: 1px solid #d7dce2;
        border-radius: 0.5rem;
        overflow: hidden;
      }
      .page-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin: 0 0 1rem;
      }
      .page-header h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
      }
      .page-description {
        font-size: 0.9rem;
        line-height: 1.6;
        color: #5a6470;
        max-width: 36rem;
      }
    `,
  ],
  template: `
    <ui-navigation-page
      [items]="items"
      rootLabel="App"
      breadcrumbVariant="link"
      [(activePage)]="activePage"
    >
      <ng-template #content let-node>
        <div class="page-header">
          @if (node.icon) {
            <ui-icon [svg]="node.icon" [size]="28" />
          }
          <h2>{{ node.data.label }}</h2>
        </div>
        <p class="page-description">{{ contentFor(node.id) }}</p>
      </ng-template>
    </ui-navigation-page>
  `,
})
class DemoNavPageCustomRootComponent {
  public readonly items = NAV_ITEMS;
  public readonly activePage = signal("dashboard");

  public contentFor(id: string): string {
    return PAGE_CONTENT[id] ?? "";
  }
}

@Component({
  selector: "ui-demo-nav-page-router",
  standalone: true,
  imports: [UINavigationPage, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        height: 500px;
        border: 1px solid #d7dce2;
        border-radius: 0.5rem;
        overflow: hidden;
      }
      .page-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin: 0 0 1rem;
      }
      .page-header h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
      }
      .route-badge {
        display: inline-block;
        margin-top: 0.5rem;
        padding: 0.25rem 0.75rem;
        background: rgba(53, 132, 228, 0.12);
        border-radius: 0.375rem;
        font-family: monospace;
        font-size: 0.85rem;
      }
      .page-description {
        margin-top: 0.75rem;
        font-size: 0.9rem;
        color: #5a6470;
      }
    `,
  ],
  template: `
    <ui-navigation-page
      [items]="items"
      rootLabel="Router Demo"
      [(activePage)]="activePage"
      (navigated)="onNavigated($event)"
    >
      <ng-template #content let-node>
        <div class="page-header">
          @if (node.icon) {
            <ui-icon [svg]="node.icon" [size]="28" />
          }
          <h2>{{ node.data.label }}</h2>
        </div>
        @if (node.data.route) {
          <div class="route-badge">Route: /{{ node.data.route }}</div>
        }
        <p class="page-description">
          Items generated from a route config via
          <code>routesToNavigation()</code>.
        </p>
      </ng-template>
    </ui-navigation-page>
  `,
})
class DemoNavPageRouterComponent {
  public readonly items = routesToNavigation(DEMO_ROUTES);
  public readonly activePage = signal("dashboard");

  public onNavigated(node: NavigationNode): void {
    // In a real app: this.router.navigate([node.data.route])
    void node;
  }
}

// ── Meta ─────────────────────────────────────────────────────────────

const meta: Meta<UINavigationPage> = {
  title: "@Theredhead/UI Blocks/Navigation Page",
  component: UINavigationPage,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        DemoNavPageDefaultComponent,
        DemoNavPageDrawerComponent,
        DemoNavPageCustomRootComponent,
        DemoNavPageRouterComponent,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "A full-page navigation layout that combines a sidebar " +
          "navigation, an automatic breadcrumb trail, and a content area.\n\n" +
          "### Features\n" +
          "- Pinned sidebar (desktop) or drawer-based sidebar (mobile)\n" +
          "- Automatic breadcrumb trail with group hierarchy\n" +
          "- Collapsible sidebar groups via tree nodes with children\n" +
          "- Icon and badge support on navigation items\n" +
          "- Two-way binding for active page and drawer state\n" +
          "- Projected content template with node context\n" +
          "- `routesToNavigation()` utility for Angular Router integration\n\n" +
          "### Data sources\n" +
          "| Input | Type | Default | Purpose |\n" +
          "|-------|------|---------|--------|\n" +
          "| `datasource` | `ITreeDatasource<NavigationNodeData>` | – | Dynamic tree data |\n" +
          "| `items` | `NavigationNode[]` | `[]` | Static in-memory tree |\n\n" +
          "When both are set, `datasource` takes precedence. Use `navItem()` / " +
          "`navGroup()` factory helpers to build the tree ergonomically.\n\n" +
          "### Other inputs\n" +
          "| Input | Type | Default | Purpose |\n" +
          "|-------|------|---------|--------|\n" +
          "| `rootLabel` | `string` | `'Home'` | First breadcrumb label |\n" +
          "| `sidebarPinned` | `boolean` | `true` | Pin sidebar vs drawer mode |\n" +
          "| `drawerPosition` | `DrawerPosition` | `'left'` | Drawer slide direction |\n" +
          "| `drawerWidth` | `DrawerWidth` | `'medium'` | Drawer panel width |\n" +
          "| `breadcrumbVariant` | `BreadcrumbVariant` | `'button'` | Breadcrumb style |\n\n" +
          "### Two-way bindings\n" +
          "| Model | Type | Purpose |\n" +
          "|-------|------|--------|\n" +
          "| `activePage` | `string` | Currently active node id |\n" +
          "| `drawerOpen` | `boolean` | Drawer open state (when not pinned) |",
      },
    },
  },
};

export default meta;
type Story = StoryObj<UINavigationPage>;

// ── Stories ──────────────────────────────────────────────────────────

/** Pinned sidebar with navigation groups, breadcrumb trail, and dynamic content. */
export const Default: Story = {
  render: () => ({
    template: `<ui-demo-nav-page-default />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-navigation-page
  [items]="navItems"
  [(activePage)]="activePage"
  (navigated)="onNavigated($event)"
>
  <ng-template #content let-node>
    <h2>{{ node.data.label }}</h2>
    <p>Page content here.</p>
  </ng-template>
</ui-navigation-page>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UINavigationPage,
  navItem,
  navGroup,
  type NavigationNode,
} from '@theredhead/ui-blocks';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UINavigationPage],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  readonly activePage = signal('dashboard');

  readonly navItems = [
    navItem('dashboard', 'Dashboard'),
    navItem('projects', 'Projects', { badge: '12' }),
    navItem('calendar', 'Calendar'),
    navGroup('settings', 'Settings', [
      navItem('general', 'General'),
      navItem('security', 'Security'),
    ]),
  ];

  onNavigated(node: NavigationNode): void {
    console.log('Navigated to', node.data.label);
  }
}

// ── SCSS ──
/* No custom styles needed — the component handles layout and theming. */
`,
      },
    },
  },
};

/** Drawer-based sidebar that slides in from the left, auto-closing after each navigation. */
export const DrawerMode: Story = {
  render: () => ({
    template: `<ui-demo-nav-page-drawer />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-navigation-page
  [items]="navItems"
  [sidebarPinned]="false"
  [(activePage)]="activePage"
  [(drawerOpen)]="drawerOpen"
>
  <ng-template #content let-node>
    <button (click)="drawerOpen.set(true)">☰ Open Sidebar</button>
    <h2>{{ node.data.label }}</h2>
  </ng-template>
</ui-navigation-page>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UINavigationPage,
  navItem,
  navGroup,
} from '@theredhead/ui-blocks';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UINavigationPage],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  readonly activePage = signal('dashboard');
  readonly drawerOpen = signal(false);

  readonly navItems = [
    navItem('dashboard', 'Dashboard'),
    navItem('projects', 'Projects'),
    navGroup('settings', 'Settings', [
      navItem('general', 'General'),
    ]),
  ];
}

// ── SCSS ──
/* No custom styles needed — the drawer and layout are handled by the component. */
`,
      },
    },
  },
};

/** Custom root label ("App") and link-style breadcrumb variant. */
export const CustomBreadcrumb: Story = {
  render: () => ({
    template: `<ui-demo-nav-page-custom-root />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-navigation-page
  [items]="navItems"
  rootLabel="App"
  breadcrumbVariant="link"
  [(activePage)]="activePage"
>
  <ng-template #content let-node>
    <h2>{{ node.data.label }}</h2>
  </ng-template>
</ui-navigation-page>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UINavigationPage,
  navItem,
  navGroup,
} from '@theredhead/ui-blocks';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UINavigationPage],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  readonly activePage = signal('dashboard');

  readonly navItems = [
    navItem('dashboard', 'Dashboard'),
    navGroup('settings', 'Settings', [
      navItem('general', 'General'),
      navItem('security', 'Security'),
    ]),
  ];
}

// ── SCSS ──
/* Customise tokens to change breadcrumb or sidebar appearance: */
ui-navigation-page {
  --ui-nav-page-sidebar-width: 14rem;
  --ui-nav-page-sidebar-bg: #f8f9fb;
}
`,
      },
    },
  },
};

/** Navigation items generated from an Angular Router config via routesToNavigation(). */
export const RouterIntegration: Story = {
  render: () => ({
    template: `<ui-demo-nav-page-router />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-navigation-page
  [items]="navItems"
  [(activePage)]="activePage"
  (navigated)="onNavigated($event)"
>
  <ng-template #content let-node>
    <h2>{{ node.data.label }}</h2>
    <p>Route: /{{ node.data.route }}</p>
  </ng-template>
</ui-navigation-page>

// ── TypeScript ──
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  UINavigationPage,
  routesToNavigation,
  type NavigationNode,
} from '@theredhead/ui-blocks';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [UINavigationPage],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  private readonly router = inject(Router);
  readonly activePage = signal('dashboard');

  // Automatically derive navigation from your route config.
  // Routes with data: { navLabel: '…' } are included;
  // the rest are silently skipped.
  readonly navItems = routesToNavigation(this.router.config);

  onNavigated(node: NavigationNode): void {
    if (node.data.route) {
      this.router.navigate([node.data.route]);
    }
  }
}

// In your route config:
// { path: 'dashboard', data: { navLabel: 'Dashboard', navIcon: '…' }, … }
// { path: 'settings', data: { navLabel: 'Settings' }, children: [
//   { path: 'general', data: { navLabel: 'General' }, … },
// ]}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

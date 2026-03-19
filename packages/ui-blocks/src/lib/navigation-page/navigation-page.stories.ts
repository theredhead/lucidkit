import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIIcons, UIIcon } from "@theredhead/ui-kit";

import {
  UINavigationPage,
  type NavigationGroupDef,
  type NavigationPageItem,
} from "./navigation-page.component";

// ── Demo data ────────────────────────────────────────────────────────

const PAGES: NavigationPageItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: UIIcons.Lucide.Layout.LayoutDashboard,
  },
  {
    id: "projects",
    label: "Projects",
    icon: UIIcons.Lucide.Files.Folder,
    badge: "12",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: UIIcons.Lucide.Time.Calendar,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: UIIcons.Lucide.Charts.ChartLine,
  },
  {
    id: "general",
    label: "General",
    icon: UIIcons.Lucide.Account.Settings,
    group: "settings",
  },
  {
    id: "security",
    label: "Security",
    icon: UIIcons.Lucide.Account.Shield,
    group: "settings",
  },
  {
    id: "team",
    label: "Team Members",
    icon: UIIcons.Lucide.Account.Users,
    group: "settings",
    badge: "3",
  },
];

const GROUPS: NavigationGroupDef[] = [
  {
    id: "settings",
    label: "Settings",
    icon: UIIcons.Lucide.Account.Settings,
    expanded: true,
  },
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
      [pages]="pages"
      [groups]="groups"
      [(activePage)]="activePage"
      (navigated)="onNavigated($event)"
    >
      <ng-template #content let-page>
        <div class="page-header">
          @if (page.icon) {
            <ui-icon [svg]="page.icon" [size]="28" />
          }
          <h2>{{ page.label }}</h2>
        </div>
        <p class="page-description">{{ contentFor(page.id) }}</p>
        <div class="page-card">
          ✅ You navigated to <strong>"{{ page.label }}"</strong>.
          Try clicking a different item in the sidebar.
        </div>
      </ng-template>
    </ui-navigation-page>
  `,
})
class DemoNavPageDefaultComponent {
  public readonly pages = PAGES;
  public readonly groups = GROUPS;
  public readonly activePage = signal("dashboard");

  public onNavigated(_page: NavigationPageItem): void {
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
      [pages]="pages"
      [groups]="groups"
      [sidebarPinned]="false"
      [(activePage)]="activePage"
      [(drawerOpen)]="drawerOpen"
    >
      <ng-template #content let-page>
        <button class="open-btn" (click)="drawerOpen.set(true)">
          ☰ Open Sidebar
        </button>
        <div class="page-header">
          @if (page.icon) {
            <ui-icon [svg]="page.icon" [size]="28" />
          }
          <h2>{{ page.label }}</h2>
        </div>
        <p class="page-description">{{ contentFor(page.id) }}</p>
      </ng-template>
    </ui-navigation-page>
  `,
})
class DemoNavPageDrawerComponent {
  public readonly pages = PAGES;
  public readonly groups = GROUPS;
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
      [pages]="pages"
      [groups]="groups"
      rootLabel="App"
      breadcrumbVariant="link"
      [(activePage)]="activePage"
    >
      <ng-template #content let-page>
        <div class="page-header">
          @if (page.icon) {
            <ui-icon [svg]="page.icon" [size]="28" />
          }
          <h2>{{ page.label }}</h2>
        </div>
        <p class="page-description">{{ contentFor(page.id) }}</p>
      </ng-template>
    </ui-navigation-page>
  `,
})
class DemoNavPageCustomRootComponent {
  public readonly pages = PAGES;
  public readonly groups = GROUPS;
  public readonly activePage = signal("dashboard");

  public contentFor(id: string): string {
    return PAGE_CONTENT[id] ?? "";
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
          "- Collapsible sidebar groups\n" +
          "- Icon and badge support on navigation items\n" +
          "- Two-way binding for active page and drawer state\n" +
          "- Projected content template with page context\n\n" +
          "### Inputs\n" +
          "| Input | Type | Default | Purpose |\n" +
          "|-------|------|---------|--------|\n" +
          "| `pages` | `NavigationPageItem[]` | *required* | Navigation items |\n" +
          "| `groups` | `NavigationGroupDef[]` | `[]` | Collapsible group definitions |\n" +
          "| `rootLabel` | `string` | `'Home'` | First breadcrumb label |\n" +
          "| `sidebarPinned` | `boolean` | `true` | Pin sidebar vs drawer mode |\n" +
          "| `drawerPosition` | `DrawerPosition` | `'left'` | Drawer slide direction |\n" +
          "| `drawerWidth` | `DrawerWidth` | `'medium'` | Drawer panel width |\n" +
          "| `breadcrumbVariant` | `BreadcrumbVariant` | `'button'` | Breadcrumb style |\n\n" +
          "### Two-way bindings\n" +
          "| Model | Type | Purpose |\n" +
          "|-------|------|--------|\n" +
          "| `activePage` | `string` | Currently active page id |\n" +
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
  [pages]="pages"
  [groups]="groups"
  [(activePage)]="activePage"
  (navigated)="onNavigated($event)"
>
  <ng-template #content let-page>
    <h2>{{ page.label }}</h2>
    <p>{{ page.description }}</p>
  </ng-template>
</ui-navigation-page>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UINavigationPage,
  type NavigationPageItem,
  type NavigationGroupDef,
} from '@theredhead/ui-blocks';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UINavigationPage],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  readonly activePage = signal('dashboard');

  readonly pages: NavigationPageItem[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'projects', label: 'Projects', badge: '12' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'general',  label: 'General',  group: 'settings' },
    { id: 'security', label: 'Security', group: 'settings' },
  ];

  readonly groups: NavigationGroupDef[] = [
    { id: 'settings', label: 'Settings', expanded: true },
  ];

  onNavigated(page: NavigationPageItem): void {
    console.log('Navigated to', page.label);
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
  [pages]="pages"
  [groups]="groups"
  [sidebarPinned]="false"
  [(activePage)]="activePage"
  [(drawerOpen)]="drawerOpen"
>
  <ng-template #content let-page>
    <button (click)="drawerOpen.set(true)">☰ Open Sidebar</button>
    <h2>{{ page.label }}</h2>
  </ng-template>
</ui-navigation-page>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UINavigationPage,
  type NavigationPageItem,
  type NavigationGroupDef,
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

  readonly pages: NavigationPageItem[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'projects', label: 'Projects' },
    { id: 'general',  label: 'General', group: 'settings' },
  ];

  readonly groups: NavigationGroupDef[] = [
    { id: 'settings', label: 'Settings' },
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
  [pages]="pages"
  [groups]="groups"
  rootLabel="App"
  breadcrumbVariant="link"
  [(activePage)]="activePage"
>
  <ng-template #content let-page>
    <h2>{{ page.label }}</h2>
  </ng-template>
</ui-navigation-page>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UINavigationPage,
  type NavigationPageItem,
  type NavigationGroupDef,
} from '@theredhead/ui-blocks';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UINavigationPage],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  readonly activePage = signal('dashboard');

  readonly pages: NavigationPageItem[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'general',  label: 'General',  group: 'settings' },
    { id: 'security', label: 'Security', group: 'settings' },
  ];

  readonly groups: NavigationGroupDef[] = [
    { id: 'settings', label: 'Settings' },
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

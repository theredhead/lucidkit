import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UIIcons } from "../icon/lucide-icons.generated";
import { UIIcon } from "../icon/icon.component";
import {
  UISidebarGroup,
  UISidebarItem,
  UISidebarNav,
} from "./sidebar-nav.component";

@Component({
  selector: "ui-demo-sidebar-basic",
  standalone: true,
  imports: [UISidebarNav, UISidebarItem, UISidebarGroup],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="width: 16rem; border: 1px solid #d7dce2; border-radius: 0.5rem; overflow: hidden;"
    >
      <ui-sidebar-nav>
        <ui-sidebar-item
          label="Dashboard"
          [icon]="icons.Dashboard"
          [active]="active() === 'dashboard'"
          (activated)="active.set('dashboard')"
        />
        <ui-sidebar-item
          label="Projects"
          [icon]="icons.Folder"
          badge="12"
          [active]="active() === 'projects'"
          (activated)="active.set('projects')"
        />
        <ui-sidebar-item
          label="Calendar"
          [icon]="icons.Calendar"
          [active]="active() === 'calendar'"
          (activated)="active.set('calendar')"
        />
        <ui-sidebar-group label="Management" [icon]="icons.Settings">
          <ui-sidebar-item
            label="Users"
            [icon]="icons.Users"
            [active]="active() === 'users'"
            (activated)="active.set('users')"
          />
          <ui-sidebar-item
            label="Roles"
            [icon]="icons.Key"
            [active]="active() === 'roles'"
            (activated)="active.set('roles')"
          />
          <ui-sidebar-item
            label="Permissions"
            [icon]="icons.Shield"
            [active]="active() === 'permissions'"
            (activated)="active.set('permissions')"
          />
        </ui-sidebar-group>
        <ui-sidebar-group label="Reports" [icon]="icons.ChartLine">
          <ui-sidebar-item
            label="Sales"
            [icon]="icons.DollarSign"
            [active]="active() === 'sales'"
            (activated)="active.set('sales')"
          />
          <ui-sidebar-item
            label="Analytics"
            [icon]="icons.ChartBar"
            [active]="active() === 'analytics'"
            (activated)="active.set('analytics')"
          />
        </ui-sidebar-group>
        <ui-sidebar-item
          label="Help"
          [icon]="icons.CircleHelp"
          [disabled]="true"
        />
      </ui-sidebar-nav>
    </div>
  `,
})
class DemoSidebarBasicComponent {
  public readonly active = signal("dashboard");
  public readonly icons = {
    Dashboard: UIIcons.Lucide.Layout.LayoutDashboard,
    Folder: UIIcons.Lucide.Files.Folder,
    Calendar: UIIcons.Lucide.Time.Calendar,
    Settings: UIIcons.Lucide.Account.Settings,
    Users: UIIcons.Lucide.Account.Users,
    Key: UIIcons.Lucide.Account.Key,
    Shield: UIIcons.Lucide.Account.Shield,
    ChartLine: UIIcons.Lucide.Charts.ChartLine,
    DollarSign: UIIcons.Lucide.Finance.DollarSign,
    ChartBar: UIIcons.Lucide.Charts.ChartBar,
    CircleHelp: UIIcons.Lucide.Accessibility.CircleQuestionMark,
  };
}

@Component({
  selector: "ui-demo-sidebar-collapsed-groups",
  standalone: true,
  imports: [UISidebarNav, UISidebarItem, UISidebarGroup],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="width: 16rem; border: 1px solid #d7dce2; border-radius: 0.5rem; overflow: hidden;"
    >
      <ui-sidebar-nav>
        <ui-sidebar-item label="Home" [icon]="houseIcon" [active]="true" />
        <ui-sidebar-group label="Section A" [expanded]="false">
          <ui-sidebar-item label="Item A1" />
          <ui-sidebar-item label="Item A2" />
        </ui-sidebar-group>
        <ui-sidebar-group label="Section B" [expanded]="false">
          <ui-sidebar-item label="Item B1" />
          <ui-sidebar-item label="Item B2" />
          <ui-sidebar-item label="Item B3" />
        </ui-sidebar-group>
      </ui-sidebar-nav>
    </div>
  `,
})
class DemoSidebarCollapsedComponent {
  public readonly houseIcon = UIIcons.Lucide.Buildings.House;
}

@Component({
  selector: "ui-demo-sidebar-badges",
  standalone: true,
  imports: [UISidebarNav, UISidebarItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="width: 16rem; border: 1px solid #d7dce2; border-radius: 0.5rem; overflow: hidden;"
    >
      <ui-sidebar-nav>
        <ui-sidebar-item
          label="Inbox"
          [icon]="icons.Inbox"
          badge="24"
          [active]="true"
        />
        <ui-sidebar-item label="Sent" [icon]="icons.Send" badge="3" />
        <ui-sidebar-item label="Drafts" [icon]="icons.PenLine" badge="1" />
        <ui-sidebar-item label="Spam" [icon]="icons.Ban" badge="99+" />
        <ui-sidebar-item label="Trash" [icon]="icons.Trash" />
      </ui-sidebar-nav>
    </div>
  `,
})
class DemoSidebarBadgesComponent {
  public readonly icons = {
    Inbox: UIIcons.Lucide.Account.Inbox,
    Send: UIIcons.Lucide.Communication.Send,
    PenLine: UIIcons.Lucide.Design.PenLine,
    Ban: UIIcons.Lucide.Account.Ban,
    Trash: UIIcons.Lucide.Files.Trash2,
  };
}

// ── Demo: Navigation with content ────────────────────────────────

interface NavPage {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly description: string;
  readonly badge?: string;
}

@Component({
  selector: "ui-demo-sidebar-navigation",
  standalone: true,
  imports: [UISidebarNav, UISidebarItem, UISidebarGroup, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .shell {
        display: flex;
        border: 1px solid var(--ui-sidebar-text, #d7dce2);
        border-radius: 0.5rem;
        overflow: hidden;
        height: 28rem;
        font-family:
          system-ui,
          -apple-system,
          sans-serif;
      }
      .sidebar {
        width: 15rem;
        flex-shrink: 0;
        border-right: 1px solid var(--ui-sidebar-text, #d7dce2);
        border-color: color-mix(in srgb, currentColor 15%, transparent);
        overflow-y: auto;
      }
      .content {
        flex: 1;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: auto;
        background: var(--ui-sidebar-hover, rgba(128, 128, 128, 0.04));
      }
      .content-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .content h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--ui-sidebar-text, #1d232b);
      }
      .content p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.6;
        color: var(--ui-sidebar-muted, #5a6470);
        max-width: 36rem;
      }
      .breadcrumb {
        font-size: 0.75rem;
        color: var(--ui-sidebar-muted, #5a6470);
      }
      .breadcrumb strong {
        color: var(--ui-sidebar-accent, #3584e4);
      }
      .content-card {
        padding: 1.25rem;
        background: var(--ui-sidebar-active-bg, rgba(53, 132, 228, 0.08));
        border-radius: 0.5rem;
        font-size: 0.85rem;
        color: var(--ui-sidebar-text, #1d232b);
      }
    `,
  ],
  template: `
    <div class="shell">
      <div class="sidebar">
        <ui-sidebar-nav ariaLabel="App navigation">
          @for (page of topPages; track page.id) {
            <ui-sidebar-item
              [label]="page.label"
              [icon]="page.icon"
              [badge]="page.badge ?? ''"
              [active]="active() === page.id"
              (activated)="active.set(page.id)"
            />
          }
          <ui-sidebar-group label="Settings" [icon]="settingsIcon">
            @for (page of settingsPages; track page.id) {
              <ui-sidebar-item
                [label]="page.label"
                [icon]="page.icon"
                [active]="active() === page.id"
                (activated)="active.set(page.id)"
              />
            }
          </ui-sidebar-group>
        </ui-sidebar-nav>
      </div>
      <div class="content">
        <div class="breadcrumb">
          Navigation / <strong>{{ currentPage().label }}</strong>
        </div>
        <div class="content-header">
          <ui-icon [svg]="currentPage().icon" [size]="28" />
          <h2>{{ currentPage().label }}</h2>
        </div>
        <p>{{ currentPage().description }}</p>
        <div class="content-card">
          ✅ You navigated here by clicking
          <strong>"{{ currentPage().label }}"</strong>
          in the sidebar. Try selecting a different item to see the content
          change.
        </div>
      </div>
    </div>
  `,
})
class DemoSidebarNavigationComponent {
  public readonly settingsIcon = UIIcons.Lucide.Account.Settings;

  public readonly topPages: NavPage[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: UIIcons.Lucide.Layout.LayoutDashboard,
      description:
        "Your personal dashboard with an overview of recent activity, " +
        "key metrics, and quick-access shortcuts to the most used features.",
    },
    {
      id: "projects",
      label: "Projects",
      icon: UIIcons.Lucide.Files.Folder,
      description:
        "Browse and manage all your projects. Create new ones, archive " +
        "completed work, and track progress across your team.",
      badge: "5",
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: UIIcons.Lucide.Time.Calendar,
      description:
        "View upcoming meetings, deadlines, and events. Drag-and-drop " +
        "to reschedule and sync with external calendars.",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: UIIcons.Lucide.Charts.ChartLine,
      description:
        "Dive into detailed analytics and reports. Visualise trends, " +
        "compare periods, and export data for presentations.",
    },
  ];

  public readonly settingsPages: NavPage[] = [
    {
      id: "general",
      label: "General",
      icon: UIIcons.Lucide.Account.Settings,
      description:
        "General application settings — language, timezone, default views, " +
        "and notification preferences.",
    },
    {
      id: "security",
      label: "Security",
      icon: UIIcons.Lucide.Account.Shield,
      description:
        "Manage your security settings. Enable two-factor authentication, " +
        "review active sessions, and update your password.",
    },
    {
      id: "team",
      label: "Team Members",
      icon: UIIcons.Lucide.Account.Users,
      description:
        "Invite team members, assign roles, and manage permissions. " +
        "View who has access to each project.",
      badge: "3",
    },
  ];

  public readonly active = signal("dashboard");

  public readonly currentPage = computed(() => {
    const all = [...this.topPages, ...this.settingsPages];
    return all.find((p) => p.id === this.active()) ?? this.topPages[0];
  });
}

const meta: Meta<UISidebarNav> = {
  title: "@Theredhead/UI Kit/Sidebar Nav",
  component: UISidebarNav,
  tags: ["autodocs"],
  argTypes: {
    collapsed: {
      control: "boolean",
      description: "Collapses the sidebar to icon-only mode.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the navigation landmark.",
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        DemoSidebarBasicComponent,
        DemoSidebarCollapsedComponent,
        DemoSidebarBadgesComponent,
        DemoSidebarNavigationComponent,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "A vertical sidebar navigation component with collapsible groups.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<UISidebarNav>;

export const Default: Story = {
  render: () => ({
    template: `<ui-demo-sidebar-basic />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "### Sub-components\n" +
          "| Component | Purpose |\n" +
          "|-----------|--------|\n" +
          "| `<ui-sidebar-nav>` | Container with `navigation` landmark role |\n" +
          "| `<ui-sidebar-item>` | Individual nav item with icon, label, badge |\n" +
          "| `<ui-sidebar-group>` | Collapsible group with header + children |\n\n" +
          "### Features\n" +
          "- Click-to-navigate with `(activated)` output\n" +
          "- Collapsible groups with `[(expanded)]` two-way binding\n" +
          "- SVG icons via `UIIcons` registry and `<ui-icon>` component\n" +
          "- Active item highlighting\n" +
          "- Disabled items\n" +
          "- Keyboard accessible (Enter, Space)\n" +
          "- Full dark-mode support",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-sidebar-nav>
  <ui-sidebar-item
    label="Dashboard" [icon]="dashboardIcon"
    [active]="active() === 'dashboard'"
    (activated)="active.set('dashboard')" />
  <ui-sidebar-item label="Projects" [icon]="folderIcon" badge="12" />

  <ui-sidebar-group label="Management" [icon]="settingsIcon">
    <ui-sidebar-item label="Users" [icon]="usersIcon" />
    <ui-sidebar-item label="Roles" [icon]="keyIcon" />
  </ui-sidebar-group>
</ui-sidebar-nav>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UISidebarNav, UISidebarItem, UISidebarGroup, UIIcons,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [UISidebarNav, UISidebarItem, UISidebarGroup],
  template: \`
    <ui-sidebar-nav>
      <ui-sidebar-item
        label="Dashboard" [icon]="dashboardIcon"
        [active]="active() === 'dashboard'"
        (activated)="active.set('dashboard')" />
      <ui-sidebar-item label="Projects" [icon]="folderIcon" badge="12" />
      <ui-sidebar-group label="Management" [icon]="settingsIcon">
        <ui-sidebar-item label="Users" [icon]="usersIcon" />
      </ui-sidebar-group>
    </ui-sidebar-nav>
  \`,
})
export class ShellComponent {
  readonly active = signal('dashboard');

  readonly dashboardIcon = UIIcons.Lucide.Layout.LayoutDashboard;
  readonly folderIcon = UIIcons.Lucide.Files.Folder;
  readonly settingsIcon = UIIcons.Lucide.Account.Settings;
  readonly usersIcon = UIIcons.Lucide.Account.Users;
}

// ── SCSS ──
/* No custom styles needed — sidebar tokens handle theming. */
`,
      },
    },
  },
};

export const CollapsedGroups: Story = {
  render: () => ({
    template: `<ui-demo-sidebar-collapsed-groups />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<!-- Groups start collapsed with [expanded]="false" -->
<ui-sidebar-nav>
  <ui-sidebar-item label="Home" [icon]="houseIcon" [active]="true" />
  <ui-sidebar-group label="Section A" [expanded]="false">
    <ui-sidebar-item label="Item A1" />
    <ui-sidebar-item label="Item A2" />
  </ui-sidebar-group>
</ui-sidebar-nav>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UISidebarNav, UISidebarItem, UISidebarGroup, UIIcons,
} from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UISidebarNav, UISidebarItem, UISidebarGroup],
  template: \`
    <ui-sidebar-nav>
      <ui-sidebar-item label="Home" [icon]="houseIcon" [active]="true" />
      <ui-sidebar-group label="Section A" [expanded]="false">
        <ui-sidebar-item label="Item A1" />
        <ui-sidebar-item label="Item A2" />
      </ui-sidebar-group>
    </ui-sidebar-nav>
  \`,
})
export class ExampleComponent {
  readonly houseIcon = UIIcons.Lucide.Buildings.House;
}

// ── SCSS ──
/* No custom styles needed — expanded state is declarative. */
`,
      },
    },
  },
};

export const WithBadges: Story = {
  render: () => ({
    template: `<ui-demo-sidebar-badges />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-sidebar-nav>
  <ui-sidebar-item label="Inbox"  [icon]="inboxIcon" badge="24" [active]="true" />
  <ui-sidebar-item label="Sent"   [icon]="sendIcon" badge="3" />
  <ui-sidebar-item label="Drafts" [icon]="penIcon" badge="1" />
  <ui-sidebar-item label="Trash"  [icon]="trashIcon" />
</ui-sidebar-nav>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UISidebarNav, UISidebarItem, UIIcons } from '@theredhead/ui-kit';

@Component({
  selector: 'app-mailbox',
  standalone: true,
  imports: [UISidebarNav, UISidebarItem],
  template: \`
    <ui-sidebar-nav>
      <ui-sidebar-item label="Inbox" [icon]="inboxIcon" badge="24" [active]="true" />
      <ui-sidebar-item label="Sent"  [icon]="sendIcon" badge="3" />
      <ui-sidebar-item label="Trash" [icon]="trashIcon" />
    </ui-sidebar-nav>
  \`,
})
export class MailboxComponent {
  readonly inboxIcon = UIIcons.Lucide.Account.Inbox;
  readonly sendIcon = UIIcons.Lucide.Communication.Send;
  readonly trashIcon = UIIcons.Lucide.Files.Trash2;
}

// ── SCSS ──
/* No custom styles needed — badges are built into sidebar items. */
`,
      },
    },
  },
};

/**
 * **Navigation** — A realistic app-shell layout where clicking sidebar items
 * updates the main content area. Demonstrates the `(activated)` output for
 * driving navigation, collapsible settings group, active-item tracking,
 * badges, and how the sidebar integrates into a full page layout.
 */
export const Navigation: Story = {
  render: () => ({
    template: `<ui-demo-sidebar-navigation />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<div class="app-shell">
  <aside class="sidebar">
    <ui-sidebar-nav ariaLabel="App navigation">
      <ui-sidebar-item
        label="Dashboard" [icon]="dashboardIcon"
        [active]="active() === 'dashboard'"
        (activated)="navigate('dashboard')" />
      <ui-sidebar-item
        label="Projects" [icon]="folderIcon" badge="5"
        [active]="active() === 'projects'"
        (activated)="navigate('projects')" />
      <ui-sidebar-group label="Settings" [icon]="settingsIcon">
        <ui-sidebar-item
          label="General" [icon]="settingsIcon"
          [active]="active() === 'general'"
          (activated)="navigate('general')" />
        <ui-sidebar-item
          label="Security" [icon]="shieldIcon"
          [active]="active() === 'security'"
          (activated)="navigate('security')" />
      </ui-sidebar-group>
    </ui-sidebar-nav>
  </aside>
  <main class="content">
    <h2>{{ activeLabel() }}</h2>
    <p>Page content for {{ activeLabel() }}.</p>
  </main>
</div>

// ── TypeScript ──
import { Component, signal, computed } from '@angular/core';
import {
  UISidebarNav, UISidebarItem, UISidebarGroup, UIIcons,
} from '@theredhead/ui-kit';

interface NavPage {
  id: string;
  label: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [UISidebarNav, UISidebarItem, UISidebarGroup],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  readonly pages: NavPage[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'projects',  label: 'Projects' },
    { id: 'general',   label: 'General' },
    { id: 'security',  label: 'Security' },
  ];

  readonly active = signal('dashboard');

  readonly activeLabel = computed(() =>
    this.pages.find(p => p.id === this.active())?.label ?? '',
  );

  readonly dashboardIcon = UIIcons.Lucide.Layout.LayoutDashboard;
  readonly folderIcon    = UIIcons.Lucide.Files.Folder;
  readonly settingsIcon  = UIIcons.Lucide.Account.Settings;
  readonly shieldIcon    = UIIcons.Lucide.Account.Shield;

  navigate(id: string): void {
    this.active.set(id);
  }
}

// ── SCSS ──
.app-shell {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 15rem;
  border-right: 1px solid #e5e7eb;
}
.content {
  flex: 1;
  padding: 2rem;
}
`,
      },
    },
  },
};

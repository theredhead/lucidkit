import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UIIcons } from "../icon/lucide-icons.generated";
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

const meta: Meta<UISidebarNav> = {
  title: "@theredhead/UI Kit/Sidebar Nav",
  component: UISidebarNav,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        DemoSidebarBasicComponent,
        DemoSidebarCollapsedComponent,
        DemoSidebarBadgesComponent,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "A vertical sidebar navigation component with collapsible groups.\n\n" +
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

import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UserManagementAppStorySource } from "./user-management-app.story";

const meta: Meta = {
  title: "@theredhead/Showcases/User Management App",
  component: UserManagementAppStorySource,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    hideThemeToggle: true,
    docs: {
      description: {
        component:
          "A fictional **User Management** application showcasing many components " +
          "composed together. Features a navigation page with sidebar, master-detail " +
          "views with filterable tables, tabbed detail panes, role cards, an invite " +
          "form, security policy toggles, and an audit log — all driven by in-memory data.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [UserManagementAppStorySource],
    }),
  ],
};

export default meta;
type Story = StoryObj;

/**
 * A fully interactive user management application. Navigate the sidebar
 * to explore different sections:
 *
 * - **Overview** — dashboard cards with progress indicators and a recent audit feed
 * - **All Users** — master-detail view with avatar columns, status badges, and tabbed user profiles
 * - **Invite User** — form with inputs, selects, and checkboxes
 * - **Roles & Privileges** — cards showing role hierarchy with chip-based permission lists
 * - **Security Policies** — accordion with toggle-driven policy settings
 * - **Audit Log** — tabbed master-detail view with separator between event categories
 * - **Settings** — tabbed configuration with a spacer-pushed danger zone
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-user-management-app-story-source />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-navigation-page [items]="nav" [(activePage)]="activePage" rootLabel="Admin" storageKey="storybook-nav-user-mgmt">
  <ng-template #content let-node>
    <!-- Route content based on node.id -->
    @if (node.id === 'users') {
      <ui-master-detail-view [datasource]="usersDs" title="Users" [showFilter]="true">
        <ui-template-column key="name" headerText="User">
          <ng-template let-row>
            <ui-avatar [email]="row.email" [name]="row.name" size="small" />
            {{ row.name }}
          </ng-template>
        </ui-template-column>
        <ui-badge-column key="status" headerText="Status" />

        <ng-template #detail let-person>
          <ui-tab-group panelStyle="flat">
            <ui-tab label="Profile" [icon]="icons.user">
              <!-- Profile details -->
            </ui-tab>
            <ui-tab label="Permissions" [icon]="icons.shield">
              <!-- Permission chips -->
            </ui-tab>
            <ui-tab-spacer />
            <ui-tab [icon]="icons.activity" ariaLabel="Activity">
              <!-- Activity log -->
            </ui-tab>
          </ui-tab-group>
        </ng-template>
      </ui-master-detail-view>
    }
  </ng-template>
</ui-navigation-page>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UINavigationPage, navItem, navGroup, type NavigationNode,
  UIMasterDetailView,
} from '@theredhead/lucid-blocks';
import {
  FilterableArrayDatasource, UITabGroup, UITab, UITabSpacer,
  UIAvatar, UIBadgeColumn, UITemplateColumn, UIChip, UIIcons,
} from '@theredhead/lucid-kit';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    UINavigationPage, UIMasterDetailView,
    UITabGroup, UITab, UITabSpacer,
    UIAvatar, UIBadgeColumn, UITemplateColumn, UIChip,
  ],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent {
  protected readonly activePage = signal('overview');
  protected readonly usersDs = new FilterableArrayDatasource(USERS);
  protected readonly nav: NavigationNode[] = [
    navItem('overview', 'Overview', { icon: UIIcons.Lucide.Layout.LayoutDashboard }),
    navGroup('users-section', 'Users', [
      navItem('users', 'All Users', { icon: UIIcons.Lucide.Account.Users }),
      navItem('invite', 'Invite User', { icon: UIIcons.Lucide.Account.UserPlus }),
    ], { icon: UIIcons.Lucide.Account.User }),
  ];
}
`,
      },
    },
  },
};

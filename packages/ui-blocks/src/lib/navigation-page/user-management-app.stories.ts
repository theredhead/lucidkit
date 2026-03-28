import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  FilterableArrayDatasource,
  UIAccordion,
  UIAccordionItem,
  UIAvatar,
  UIBadge,
  UIBadgeColumn,
  UIButton,
  UICard,
  UICardBody,
  UICardFooter,
  UICardHeader,
  UICheckbox,
  UIChip,
  UIIcon,
  UIIcons,
  UIInput,
  UIProgress,
  UISelect,
  UITabGroup,
  UITab,
  UITabSeparator,
  UITabSpacer,
  UITemplateColumn,
  UITextColumn,
  UIToggle,
} from "@theredhead/ui-kit";

import { UIMasterDetailView } from "../master-detail-view/master-detail-view.component";
import { UINavigationPage } from "./navigation-page.component";
import {
  navItem,
  navGroup,
  type NavigationNode,
} from "./navigation-page.utils";

// ── Domain types ─────────────────────────────────────────────────────

interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly department: string;
  readonly status: "active" | "inactive" | "suspended";
  readonly lastLogin: string;
  readonly mfaEnabled: boolean;
}

interface Role {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly userCount: number;
  readonly level: "critical" | "elevated" | "standard";
  readonly privileges: readonly string[];
}

interface AuditEntry {
  readonly id: number;
  readonly timestamp: string;
  readonly user: string;
  readonly action: string;
  readonly target: string;
  readonly status: "success" | "failure" | "warning";
}

// ── Seed data ────────────────────────────────────────────────────────

const USERS: User[] = [
  {
    id: 1,
    name: "Elena Vasquez",
    email: "elena.vasquez@acme.io",
    role: "Super Admin",
    department: "Engineering",
    status: "active",
    lastLogin: "2026-03-24 09:14",
    mfaEnabled: true,
  },
  {
    id: 2,
    name: "Marcus Chen",
    email: "marcus.chen@acme.io",
    role: "Admin",
    department: "Operations",
    status: "active",
    lastLogin: "2026-03-24 08:52",
    mfaEnabled: true,
  },
  {
    id: 3,
    name: "Priya Nair",
    email: "priya.nair@acme.io",
    role: "Editor",
    department: "Marketing",
    status: "active",
    lastLogin: "2026-03-23 17:30",
    mfaEnabled: false,
  },
  {
    id: 4,
    name: "James O'Brien",
    email: "james.obrien@acme.io",
    role: "Viewer",
    department: "Finance",
    status: "inactive",
    lastLogin: "2026-02-10 11:05",
    mfaEnabled: false,
  },
  {
    id: 5,
    name: "Aisha Kwame",
    email: "aisha.kwame@acme.io",
    role: "Editor",
    department: "Engineering",
    status: "active",
    lastLogin: "2026-03-24 07:45",
    mfaEnabled: true,
  },
  {
    id: 6,
    name: "Luca Moretti",
    email: "luca.moretti@acme.io",
    role: "Admin",
    department: "Engineering",
    status: "active",
    lastLogin: "2026-03-22 14:20",
    mfaEnabled: true,
  },
  {
    id: 7,
    name: "Sophie Andersen",
    email: "sophie.andersen@acme.io",
    role: "Viewer",
    department: "Human Resources",
    status: "suspended",
    lastLogin: "2026-01-15 09:00",
    mfaEnabled: false,
  },
  {
    id: 8,
    name: "Raj Patel",
    email: "raj.patel@acme.io",
    role: "Editor",
    department: "Product",
    status: "active",
    lastLogin: "2026-03-24 10:33",
    mfaEnabled: true,
  },
  {
    id: 9,
    name: "Nina Kowalski",
    email: "nina.kowalski@acme.io",
    role: "Viewer",
    department: "Design",
    status: "active",
    lastLogin: "2026-03-21 16:12",
    mfaEnabled: false,
  },
  {
    id: 10,
    name: "Diego Fuentes",
    email: "diego.fuentes@acme.io",
    role: "Admin",
    department: "Security",
    status: "active",
    lastLogin: "2026-03-24 06:58",
    mfaEnabled: true,
  },
  {
    id: 11,
    name: "Fatima Al-Rashid",
    email: "fatima.alrashid@acme.io",
    role: "Super Admin",
    department: "Security",
    status: "active",
    lastLogin: "2026-03-24 11:02",
    mfaEnabled: true,
  },
  {
    id: 12,
    name: "Tomasz Novak",
    email: "tomasz.novak@acme.io",
    role: "Viewer",
    department: "Finance",
    status: "inactive",
    lastLogin: "2026-01-28 13:44",
    mfaEnabled: false,
  },
];

const ROLES: Role[] = [
  {
    id: 1,
    name: "Super Admin",
    description:
      "Full system access. Can manage users, roles, security policies, and view audit logs.",
    userCount: 2,
    level: "critical",
    privileges: [
      "users.create",
      "users.delete",
      "users.edit",
      "roles.manage",
      "audit.view",
      "settings.all",
      "billing.manage",
    ],
  },
  {
    id: 2,
    name: "Admin",
    description:
      "Can manage users and edit content. Cannot modify roles or security policies.",
    userCount: 3,
    level: "elevated",
    privileges: [
      "users.create",
      "users.edit",
      "content.publish",
      "content.edit",
      "reports.view",
    ],
  },
  {
    id: 3,
    name: "Editor",
    description:
      "Can create and edit content across assigned departments. No user management access.",
    userCount: 3,
    level: "standard",
    privileges: ["content.create", "content.edit", "content.publish"],
  },
  {
    id: 4,
    name: "Viewer",
    description:
      "Read-only access to published content and dashboards. Cannot modify anything.",
    userCount: 4,
    level: "standard",
    privileges: ["content.read", "reports.view"],
  },
];

const AUDIT_LOG: AuditEntry[] = [
  {
    id: 1,
    timestamp: "2026-03-24 11:02",
    user: "Fatima Al-Rashid",
    action: "Role changed",
    target: "Sophie Andersen",
    status: "success",
  },
  {
    id: 2,
    timestamp: "2026-03-24 10:45",
    user: "Elena Vasquez",
    action: "User suspended",
    target: "Sophie Andersen",
    status: "warning",
  },
  {
    id: 3,
    timestamp: "2026-03-24 09:30",
    user: "Marcus Chen",
    action: "Password reset",
    target: "James O'Brien",
    status: "success",
  },
  {
    id: 4,
    timestamp: "2026-03-24 08:15",
    user: "Diego Fuentes",
    action: "MFA enforced",
    target: "All Editors",
    status: "success",
  },
  {
    id: 5,
    timestamp: "2026-03-23 22:10",
    user: "Unknown",
    action: "Login attempt",
    target: "admin@acme.io",
    status: "failure",
  },
  {
    id: 6,
    timestamp: "2026-03-23 18:00",
    user: "Luca Moretti",
    action: "User created",
    target: "Tomasz Novak",
    status: "success",
  },
  {
    id: 7,
    timestamp: "2026-03-23 14:22",
    user: "Elena Vasquez",
    action: "Role created",
    target: "Contractor",
    status: "success",
  },
  {
    id: 8,
    timestamp: "2026-03-22 11:05",
    user: "Priya Nair",
    action: "Login attempt",
    target: "priya.nair@acme.io",
    status: "failure",
  },
];

// ── Icon constants ───────────────────────────────────────────────────

const ICONS = {
  users: UIIcons.Lucide.Account.Users,
  user: UIIcons.Lucide.Account.User,
  userPlus: UIIcons.Lucide.Account.UserPlus,
  userCog: UIIcons.Lucide.Account.UserCog,
  shield: UIIcons.Lucide.Account.Shield,
  shieldCheck: UIIcons.Lucide.Account.ShieldCheck,
  shieldAlert: UIIcons.Lucide.Account.ShieldAlert,
  settings: UIIcons.Lucide.Account.Settings,
  key: UIIcons.Lucide.Account.Key,
  activity: UIIcons.Lucide.Account.Activity,
  history: UIIcons.Lucide.Arrows.History,
  layout: UIIcons.Lucide.Layout.LayoutDashboard,
  clipboardList: UIIcons.Lucide.Text.ClipboardList,
} as const;

// ── Navigation structure ─────────────────────────────────────────────

const NAV: NavigationNode[] = [
  navItem("overview", "Overview", { icon: ICONS.layout }),
  navGroup(
    "users-section",
    "Users",
    [
      navItem("users", "All Users", {
        icon: ICONS.users,
        badge: String(USERS.length),
      }),
      navItem("invite", "Invite User", { icon: ICONS.userPlus }),
    ],
    { icon: ICONS.user, expanded: true },
  ),
  navGroup(
    "access-section",
    "Access Control",
    [
      navItem("roles", "Roles & Privileges", {
        icon: ICONS.shieldCheck,
        badge: String(ROLES.length),
      }),
      navItem("policies", "Security Policies", { icon: ICONS.shield }),
    ],
    { icon: ICONS.key },
  ),
  navItem("audit", "Audit Log", { icon: ICONS.history }),
  navItem("settings", "Settings", { icon: ICONS.settings }),
];

// ── Helper functions ─────────────────────────────────────────────────

function statusColor(
  status: string,
): "success" | "warning" | "danger" | "neutral" {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "neutral";
    case "suspended":
      return "danger";
    case "success":
      return "success";
    case "failure":
      return "danger";
    case "warning":
      return "warning";
    default:
      return "neutral";
  }
}

function levelColor(level: string): "danger" | "warning" | "neutral" {
  switch (level) {
    case "critical":
      return "danger";
    case "elevated":
      return "warning";
    default:
      return "neutral";
  }
}

// ── Demo component ───────────────────────────────────────────────────

@Component({
  selector: "ui-demo-user-management-app",
  standalone: true,
  imports: [
    UINavigationPage,
    UIMasterDetailView,
    UITabGroup,
    UITab,
    UITabSeparator,
    UITabSpacer,
    UIButton,
    UIIcon,
    UIInput,
    UISelect,
    UICheckbox,
    UIToggle,
    UIBadge,
    UIChip,
    UIAvatar,
    UICard,
    UICardHeader,
    UICardBody,
    UICardFooter,
    UIAccordion,
    UIAccordionItem,
    UIProgress,
    UITextColumn,
    UITemplateColumn,
    UIBadgeColumn,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: grid;
        height: 100vh;
        overflow: hidden;
      }

      .page-fill {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .page-fill > ui-tab-group {
        flex: 1;
        min-height: 0;
      }

      .page-fill > ui-tab-group ::ng-deep .panel {
        display: flex;
        flex-direction: column;
      }

      .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 0 1.25rem;
      }
      .page-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .page-title h2 {
        margin: 0;
        font-size: 1.35rem;
        font-weight: 700;
      }
      .page-actions {
        display: flex;
        gap: 0.5rem;
      }

      /* Overview */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .stat-value {
        font-size: 1.75rem;
        font-weight: 800;
        margin: 0.25rem 0;
      }
      .stat-label {
        font-size: 0.78rem;
        opacity: 0.65;
      }

      /* Master-detail wrapper */
      .mdv-wrap {
        flex: 1;
        min-height: 0;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
        overflow: hidden;
      }

      /* Detail pane */
      .detail-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .detail-name {
        font-size: 1.15rem;
        font-weight: 700;
        margin: 0;
      }
      .detail-email {
        font-size: 0.82rem;
        opacity: 0.65;
        margin: 0.15rem 0 0;
      }
      .detail-grid {
        display: grid;
        grid-template-columns: 8rem 1fr;
        gap: 0.35rem 1rem;
        font-size: 0.88rem;
      }
      .detail-grid dt {
        font-weight: 600;
        margin: 0;
      }
      .detail-grid dd {
        margin: 0;
      }

      /* Role cards */
      .role-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
      .role-meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.82rem;
        margin-top: 0.5rem;
      }
      .priv-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-top: 0.75rem;
      }

      /* Invite form */
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        max-width: 36rem;
      }
      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .field-label {
        font-size: 0.82rem;
        font-weight: 600;
      }
      .form-field-full {
        grid-column: 1 / -1;
      }
      .form-actions {
        grid-column: 1 / -1;
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }

      /* Audit table */
      .audit-wrap {
        flex: 1;
        min-height: 0;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
        overflow: hidden;
      }

      /* Policies / Settings */
      .policies-grid {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 36rem;
      }
      .policy-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 0.5rem;
        font-size: 0.88rem;
      }
      .policy-label {
        font-weight: 600;
      }
      .policy-desc {
        font-size: 0.78rem;
        opacity: 0.65;
        margin-top: 0.15rem;
      }
    `,
  ],
  template: `
    <ui-navigation-page
      [items]="nav"
      [(activePage)]="activePage"
      rootLabel="Admin"
    >
      <ng-template #content let-node>
        <!-- ─── Overview ─── -->
        @if (node.id === "overview") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.layout" [size]="24" />
                <h2>Overview</h2>
              </div>
            </div>

            <div class="stats-grid">
              <ui-card variant="outlined">
                <ui-card-body>
                  <div class="stat-label">Total Users</div>
                  <div class="stat-value">{{ totalUsers }}</div>
                  <ui-progress [value]="100" ariaLabel="Users" />
                </ui-card-body>
              </ui-card>
              <ui-card variant="outlined">
                <ui-card-body>
                  <div class="stat-label">Active</div>
                  <div class="stat-value">{{ activeUsers }}</div>
                  <ui-progress
                    [value]="(activeUsers / totalUsers) * 100"
                    ariaLabel="Active users"
                  />
                </ui-card-body>
              </ui-card>
              <ui-card variant="outlined">
                <ui-card-body>
                  <div class="stat-label">MFA Enabled</div>
                  <div class="stat-value">{{ mfaUsers }}</div>
                  <ui-progress
                    [value]="(mfaUsers / totalUsers) * 100"
                    ariaLabel="MFA coverage"
                  />
                </ui-card-body>
              </ui-card>
              <ui-card variant="outlined">
                <ui-card-body>
                  <div class="stat-label">Roles</div>
                  <div class="stat-value">{{ roles.length }}</div>
                  <ui-progress [value]="100" ariaLabel="Roles" />
                </ui-card-body>
              </ui-card>
            </div>

            <h3 style="margin: 0 0 0.75rem; font-size: 1rem">
              Recent Activity
            </h3>
            <div class="audit-wrap">
              <ui-master-detail-view
                [datasource]="auditDs"
                title="Audit Events"
                placeholder="Select an event to view details"
              >
                <ui-text-column key="timestamp" headerText="Time" />
                <ui-text-column key="action" headerText="Action" />
                <ui-badge-column key="status" headerText="Status" />

                <ng-template #detail let-entry>
                  <dl class="detail-grid">
                    <dt>Time</dt>
                    <dd>{{ entry.timestamp }}</dd>
                    <dt>User</dt>
                    <dd>{{ entry.user }}</dd>
                    <dt>Action</dt>
                    <dd>{{ entry.action }}</dd>
                    <dt>Target</dt>
                    <dd>{{ entry.target }}</dd>
                    <dt>Status</dt>
                    <dd>
                      <ui-chip [color]="statusColor(entry.status)">
                        {{ entry.status }}
                      </ui-chip>
                    </dd>
                  </dl>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── All Users (master-detail + tabs) ─── -->
        @if (node.id === "users") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.users" [size]="24" />
                <h2>All Users</h2>
                <ui-badge
                  variant="count"
                  [count]="totalUsers"
                  color="primary"
                />
              </div>
              <div class="page-actions">
                <ui-button
                  variant="outlined"
                  size="small"
                  (click)="activePage.set('invite')"
                >
                  Add User
                </ui-button>
              </div>
            </div>

            <div class="mdv-wrap">
              <ui-master-detail-view
                [datasource]="usersDs"
                title="Users"
                [showFilter]="true"
                placeholder="Select a user to view their profile"
                (selectedChange)="selectedUser.set($event)"
              >
                <ui-template-column key="name" headerText="User">
                  <ng-template let-row>
                    <div
                      style="display: flex; align-items: center; gap: 0.5rem"
                    >
                      <ui-avatar
                        [email]="row.email"
                        [name]="row.name"
                        size="small"
                      />
                      <span style="font-weight: 600">{{ row.name }}</span>
                    </div>
                  </ng-template>
                </ui-template-column>
                <ui-text-column key="role" headerText="Role" />
                <ui-badge-column key="status" headerText="Status" />

                <ng-template #detail let-person>
                  <div class="detail-header">
                    <ui-avatar
                      [email]="person.email"
                      [name]="person.name"
                      size="large"
                    />
                    <div>
                      <h3 class="detail-name">{{ person.name }}</h3>
                      <p class="detail-email">{{ person.email }}</p>
                    </div>
                    <div style="margin-left: auto">
                      <ui-chip [color]="statusColor(person.status)">
                        {{ person.status }}
                      </ui-chip>
                    </div>
                  </div>

                  <ui-tab-group panelStyle="flat">
                    <ui-tab label="Profile" [icon]="icons.user">
                      <dl class="detail-grid" style="padding-top: 0.75rem">
                        <dt>Department</dt>
                        <dd>{{ person.department }}</dd>
                        <dt>Role</dt>
                        <dd>{{ person.role }}</dd>
                        <dt>Last Login</dt>
                        <dd>{{ person.lastLogin }}</dd>
                        <dt>MFA</dt>
                        <dd>
                          <ui-chip
                            [color]="person.mfaEnabled ? 'success' : 'warning'"
                          >
                            {{ person.mfaEnabled ? "Enabled" : "Disabled" }}
                          </ui-chip>
                        </dd>
                      </dl>
                    </ui-tab>
                    <ui-tab label="Permissions" [icon]="icons.shieldCheck">
                      <div style="padding-top: 0.75rem">
                        <p style="font-size: 0.88rem; margin: 0 0 0.5rem">
                          Permissions inherited from role:
                          <strong>{{ person.role }}</strong>
                        </p>
                        <div class="priv-list">
                          @for (
                            priv of privilegesForRole(person.role);
                            track priv
                          ) {
                            <ui-chip color="neutral">{{ priv }}</ui-chip>
                          }
                        </div>
                      </div>
                    </ui-tab>
                    <ui-tab-spacer />
                    <ui-tab [icon]="icons.activity" ariaLabel="Activity">
                      <div style="padding-top: 0.75rem; font-size: 0.88rem">
                        <p style="margin: 0 0 0.25rem">
                          Last sign-in: {{ person.lastLogin }}
                        </p>
                        <p style="margin: 0; opacity: 0.65">
                          Account created on initial provisioning.
                        </p>
                      </div>
                    </ui-tab>
                  </ui-tab-group>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        <!-- ─── Invite User ─── -->
        @if (node.id === "invite") {
          <div class="page-header">
            <div class="page-title">
              <ui-icon [svg]="icons.userPlus" [size]="24" />
              <h2>Invite User</h2>
            </div>
          </div>

          <ui-card variant="outlined">
            <ui-card-header>
              <h3 style="margin: 0; font-size: 1rem">New User Details</h3>
            </ui-card-header>
            <ui-card-body>
              <div class="form-grid">
                <div class="form-field">
                  <span class="field-label">First Name</span>
                  <ui-input placeholder="Jane" ariaLabel="First name" />
                </div>
                <div class="form-field">
                  <span class="field-label">Last Name</span>
                  <ui-input placeholder="Doe" ariaLabel="Last name" />
                </div>
                <div class="form-field form-field-full">
                  <span class="field-label">Email Address</span>
                  <ui-input
                    type="email"
                    placeholder="jane.doe@acme.io"
                    ariaLabel="Email address"
                  />
                </div>
                <div class="form-field">
                  <span class="field-label">Department</span>
                  <ui-select
                    [options]="departmentOptions"
                    placeholder="Select department"
                    ariaLabel="Department"
                  />
                </div>
                <div class="form-field">
                  <span class="field-label">Role</span>
                  <ui-select
                    [options]="roleOptions"
                    placeholder="Select role"
                    ariaLabel="Role"
                  />
                </div>
                <div class="form-field form-field-full">
                  <ui-checkbox ariaLabel="Send welcome email">
                    Send welcome email with temporary credentials
                  </ui-checkbox>
                </div>
                <div class="form-field form-field-full">
                  <ui-checkbox ariaLabel="Require MFA">
                    Require MFA setup on first login
                  </ui-checkbox>
                </div>
                <div class="form-actions">
                  <ui-button variant="filled">Send Invitation</ui-button>
                  <ui-button variant="ghost" (click)="activePage.set('users')">
                    Cancel
                  </ui-button>
                </div>
              </div>
            </ui-card-body>
          </ui-card>
        }

        <!-- ─── Roles & Privileges ─── -->
        @if (node.id === "roles") {
          <div class="page-header">
            <div class="page-title">
              <ui-icon [svg]="icons.shieldCheck" [size]="24" />
              <h2>Roles &amp; Privileges</h2>
            </div>
            <div class="page-actions">
              <ui-button variant="outlined" size="small">Create Role</ui-button>
            </div>
          </div>

          <div class="role-grid">
            @for (role of roles; track role.id) {
              <ui-card variant="outlined">
                <ui-card-header>
                  <div
                    style="display: flex; align-items: center; justify-content: space-between; width: 100%"
                  >
                    <span style="font-weight: 700">{{ role.name }}</span>
                    <ui-badge
                      variant="label"
                      [color]="levelColor(role.level)"
                      [ariaLabel]="role.level"
                    >
                      {{ role.level }}
                    </ui-badge>
                  </div>
                </ui-card-header>
                <ui-card-body>
                  <p style="margin: 0; font-size: 0.85rem; line-height: 1.5">
                    {{ role.description }}
                  </p>
                  <div class="role-meta">
                    <ui-icon [svg]="icons.users" [size]="14" />
                    <span>{{ role.userCount }} users</span>
                  </div>
                  <div class="priv-list">
                    @for (priv of role.privileges; track priv) {
                      <ui-chip color="neutral">{{ priv }}</ui-chip>
                    }
                  </div>
                </ui-card-body>
                <ui-card-footer>
                  <div style="display: flex; gap: 0.5rem">
                    <ui-button variant="ghost" size="small">Edit</ui-button>
                    <ui-button variant="ghost" size="small"
                      >Duplicate</ui-button
                    >
                  </div>
                </ui-card-footer>
              </ui-card>
            }
          </div>
        }

        <!-- ─── Security Policies ─── -->
        @if (node.id === "policies") {
          <div class="page-header">
            <div class="page-title">
              <ui-icon [svg]="icons.shield" [size]="24" />
              <h2>Security Policies</h2>
            </div>
          </div>

          <ui-accordion mode="single">
            <ui-accordion-item label="Authentication" [expanded]="true">
              <div class="policies-grid">
                <div class="policy-row">
                  <div>
                    <div class="policy-label">
                      Enforce Multi-Factor Authentication
                    </div>
                    <div class="policy-desc">
                      Require all users to set up MFA before accessing the
                      application.
                    </div>
                  </div>
                  <ui-toggle [value]="true" ariaLabel="Enforce MFA" />
                </div>
                <div class="policy-row">
                  <div>
                    <div class="policy-label">Password Minimum Length</div>
                    <div class="policy-desc">
                      Set the minimum number of characters required for
                      passwords.
                    </div>
                  </div>
                  <ui-select
                    [options]="passwordLengthOptions"
                    ariaLabel="Minimum password length"
                  />
                </div>
                <div class="policy-row">
                  <div>
                    <div class="policy-label">Session Timeout (minutes)</div>
                    <div class="policy-desc">
                      Automatically log out inactive users after this duration.
                    </div>
                  </div>
                  <ui-select
                    [options]="sessionTimeoutOptions"
                    ariaLabel="Session timeout"
                  />
                </div>
              </div>
            </ui-accordion-item>
            <ui-accordion-item label="Account Lockout">
              <div class="policies-grid">
                <div class="policy-row">
                  <div>
                    <div class="policy-label">Lock After Failed Attempts</div>
                    <div class="policy-desc">
                      Lock user accounts after consecutive failed login
                      attempts.
                    </div>
                  </div>
                  <ui-toggle
                    [value]="true"
                    ariaLabel="Enable account lockout"
                  />
                </div>
                <div class="policy-row">
                  <div>
                    <div class="policy-label">Max Failed Attempts</div>
                    <div class="policy-desc">
                      Number of consecutive failures before lockout.
                    </div>
                  </div>
                  <ui-select
                    [options]="maxAttemptsOptions"
                    ariaLabel="Max failed attempts"
                  />
                </div>
              </div>
            </ui-accordion-item>
            <ui-accordion-item label="IP Restrictions">
              <div class="policies-grid">
                <div class="policy-row">
                  <div>
                    <div class="policy-label">Enable IP Allow-List</div>
                    <div class="policy-desc">
                      Restrict access to approved IP addresses only.
                    </div>
                  </div>
                  <ui-toggle [value]="false" ariaLabel="Enable IP allow-list" />
                </div>
              </div>
            </ui-accordion-item>
          </ui-accordion>
        }

        <!-- ─── Audit Log ─── -->
        @if (node.id === "audit") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.history" [size]="24" />
                <h2>Audit Log</h2>
              </div>
            </div>

            <ui-tab-group panelStyle="outline">
              <ui-tab label="All Events">
                <div class="audit-wrap" style="margin-top: 0.75rem">
                  <ui-master-detail-view
                    [datasource]="auditDs"
                    title="Events"
                    placeholder="Select an event for details"
                  >
                    <ui-text-column key="timestamp" headerText="Timestamp" />
                    <ui-text-column key="user" headerText="Actor" />
                    <ui-text-column key="action" headerText="Action" />
                    <ui-text-column key="target" headerText="Target" />
                    <ui-badge-column key="status" headerText="Status" />

                    <ng-template #detail let-entry>
                      <dl class="detail-grid">
                        <dt>Timestamp</dt>
                        <dd>{{ entry.timestamp }}</dd>
                        <dt>Actor</dt>
                        <dd>{{ entry.user }}</dd>
                        <dt>Action</dt>
                        <dd>{{ entry.action }}</dd>
                        <dt>Target</dt>
                        <dd>{{ entry.target }}</dd>
                        <dt>Result</dt>
                        <dd>
                          <ui-chip [color]="statusColor(entry.status)">
                            {{ entry.status }}
                          </ui-chip>
                        </dd>
                      </dl>
                    </ng-template>
                  </ui-master-detail-view>
                </div>
              </ui-tab>
              <ui-tab-separator />
              <ui-tab label="Failures Only">
                <div class="audit-wrap" style="margin-top: 0.75rem">
                  <ui-master-detail-view
                    [datasource]="failedAuditDs"
                    title="Failed Events"
                    placeholder="Select a failed event"
                  >
                    <ui-text-column key="timestamp" headerText="Timestamp" />
                    <ui-text-column key="user" headerText="Actor" />
                    <ui-text-column key="action" headerText="Action" />
                    <ui-badge-column key="status" headerText="Status" />

                    <ng-template #detail let-entry>
                      <dl class="detail-grid">
                        <dt>Timestamp</dt>
                        <dd>{{ entry.timestamp }}</dd>
                        <dt>Actor</dt>
                        <dd>{{ entry.user }}</dd>
                        <dt>Action</dt>
                        <dd>{{ entry.action }}</dd>
                        <dt>Target</dt>
                        <dd>{{ entry.target }}</dd>
                      </dl>
                    </ng-template>
                  </ui-master-detail-view>
                </div>
              </ui-tab>
            </ui-tab-group>
          </div>
        }

        <!-- ─── Settings ─── -->
        @if (node.id === "settings") {
          <div class="page-fill">
            <div class="page-header">
              <div class="page-title">
                <ui-icon [svg]="icons.settings" [size]="24" />
                <h2>Settings</h2>
              </div>
            </div>

            <ui-tab-group>
              <ui-tab label="General" [icon]="icons.settings">
                <div style="padding-top: 0.75rem">
                  <div class="form-grid">
                    <div class="form-field form-field-full">
                      <span class="field-label">Organisation Name</span>
                      <ui-input
                        placeholder="Acme Corp"
                        ariaLabel="Organisation name"
                      />
                    </div>
                    <div class="form-field">
                      <span class="field-label"
                        >Default Role for New Users</span
                      >
                      <ui-select
                        [options]="roleOptions"
                        ariaLabel="Default role"
                      />
                    </div>
                    <div class="form-field">
                      <span class="field-label">Default Department</span>
                      <ui-select
                        [options]="departmentOptions"
                        ariaLabel="Default department"
                      />
                    </div>
                    <div class="form-field form-field-full">
                      <ui-checkbox ariaLabel="Auto-provision">
                        Auto-provision users from SSO
                      </ui-checkbox>
                    </div>
                    <div class="form-actions">
                      <ui-button variant="filled">Save Changes</ui-button>
                    </div>
                  </div>
                </div>
              </ui-tab>
              <ui-tab label="Notifications" [icon]="icons.activity">
                <div style="padding-top: 0.75rem">
                  <div class="policies-grid">
                    <div class="policy-row">
                      <div>
                        <div class="policy-label">
                          Email on New User Registration
                        </div>
                        <div class="policy-desc">
                          Notify admins when a new user account is created.
                        </div>
                      </div>
                      <ui-toggle
                        [value]="true"
                        ariaLabel="New user notification"
                      />
                    </div>
                    <div class="policy-row">
                      <div>
                        <div class="policy-label">
                          Alert on Suspicious Login
                        </div>
                        <div class="policy-desc">
                          Send an alert when a login attempt from an
                          unrecognised location is detected.
                        </div>
                      </div>
                      <ui-toggle
                        [value]="true"
                        ariaLabel="Suspicious login alert"
                      />
                    </div>
                    <div class="policy-row">
                      <div>
                        <div class="policy-label">Weekly Security Summary</div>
                        <div class="policy-desc">
                          Send a weekly digest of security events to all admins.
                        </div>
                      </div>
                      <ui-toggle [value]="false" ariaLabel="Weekly summary" />
                    </div>
                  </div>
                </div>
              </ui-tab>
              <ui-tab-spacer />
              <ui-tab [icon]="icons.shieldAlert" ariaLabel="Danger zone">
                <div style="padding-top: 0.75rem">
                  <ui-card variant="outlined">
                    <ui-card-header>
                      <span
                        style="font-weight: 700; color: var(--ui-danger, #dc2626)"
                      >
                        Danger Zone
                      </span>
                    </ui-card-header>
                    <ui-card-body>
                      <p
                        style="margin: 0 0 1rem; font-size: 0.88rem; line-height: 1.5"
                      >
                        These actions are irreversible and affect the entire
                        organisation. Proceed with extreme caution.
                      </p>
                      <div style="display: flex; gap: 0.5rem">
                        <ui-button variant="outlined" size="small">
                          Export All Data
                        </ui-button>
                        <ui-button variant="outlined" size="small">
                          Purge Inactive Users
                        </ui-button>
                      </div>
                    </ui-card-body>
                  </ui-card>
                </div>
              </ui-tab>
            </ui-tab-group>
          </div>
        }
      </ng-template>
    </ui-navigation-page>
  `,
})
class UserManagementAppDemo {
  protected readonly icons = ICONS;
  protected readonly nav = NAV;
  protected readonly roles = ROLES;
  protected readonly activePage = signal("overview");
  protected readonly selectedUser = signal<User | undefined>(undefined);

  protected readonly usersDs = new FilterableArrayDatasource(USERS);
  protected readonly auditDs = new FilterableArrayDatasource(AUDIT_LOG);
  protected readonly failedAuditDs = new FilterableArrayDatasource(
    AUDIT_LOG.filter((e) => e.status === "failure"),
  );

  protected readonly totalUsers = USERS.length;
  protected readonly activeUsers = USERS.filter((u) => u.status === "active")
    .length;
  protected readonly mfaUsers = USERS.filter((u) => u.mfaEnabled).length;

  protected readonly roleOptions = ROLES.map((r) => ({
    label: r.name,
    value: r.name,
  }));

  protected readonly departmentOptions = [
    ...new Set(USERS.map((u) => u.department)),
  ].map((d) => ({ label: d, value: d }));

  protected readonly passwordLengthOptions = [
    { label: "8 characters", value: "8" },
    { label: "10 characters", value: "10" },
    { label: "12 characters", value: "12" },
    { label: "16 characters", value: "16" },
  ];

  protected readonly sessionTimeoutOptions = [
    { label: "15 min", value: "15" },
    { label: "30 min", value: "30" },
    { label: "60 min", value: "60" },
    { label: "120 min", value: "120" },
  ];

  protected readonly maxAttemptsOptions = [
    { label: "3 attempts", value: "3" },
    { label: "5 attempts", value: "5" },
    { label: "10 attempts", value: "10" },
  ];

  protected statusColor(
    status: string,
  ): "success" | "warning" | "danger" | "neutral" {
    return statusColor(status);
  }

  protected levelColor(level: string): "danger" | "warning" | "neutral" {
    return levelColor(level);
  }

  protected privilegesForRole(roleName: string): readonly string[] {
    return ROLES.find((r) => r.name === roleName)?.privileges ?? [];
  }
}

// ── Story meta ───────────────────────────────────────────────────────

const meta: Meta = {
  title: "@theredhead/Showcases/User Management App",
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
      imports: [UserManagementAppDemo],
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
    template: `<ui-demo-user-management-app />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-navigation-page [items]="nav" [(activePage)]="activePage" rootLabel="Admin">
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
} from '@theredhead/ui-blocks';
import {
  FilterableArrayDatasource, UITabGroup, UITab, UITabSpacer,
  UIAvatar, UIBadgeColumn, UITemplateColumn, UIChip, UIIcons,
} from '@theredhead/ui-kit';

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

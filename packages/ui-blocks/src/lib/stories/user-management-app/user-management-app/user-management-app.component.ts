import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import userManagementData from "./user-management-app.data.json";

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
  UIDropdownList,
  UITabGroup,
  UITab,
  UITabSeparator,
  UITabSpacer,
  UITemplateColumn,
  UITextColumn,
  UIToggle,
} from "@theredhead/lucid-kit";

import { UIMasterDetailView } from "../../../master-detail-view/master-detail-view.component";
import { UINavigationPage } from "../../../navigation-page/navigation-page.component";
import {
  navItem,
  navGroup,
  type NavigationNode,
} from "../../../navigation-page/navigation-page.utils";
import { UIUserManagementPageHeader } from "./user-management-page-header.component";
import { UIUserManagementFormField } from "./user-management-form-field.component";
import { UIUserManagementPolicyRow } from "./user-management-policy-row.component";
import { UIUserManagementProfileHeader } from "./user-management-profile-header.component";
import { UIUserManagementRoleCard } from "./user-management-role-card.component";
import { UIUserManagementStatCard } from "./user-management-stat-card.component";

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

// ── External data ───────────────────────────────────────────────────

const USERS = userManagementData.users as User[];
const ROLES = userManagementData.roles as Role[];
const AUDIT_LOG = userManagementData.auditLog as AuditEntry[];

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
    UIUserManagementPageHeader,
    UIUserManagementFormField,
    UIUserManagementPolicyRow,
    UIUserManagementProfileHeader,
    UIUserManagementRoleCard,
    UIUserManagementStatCard,
    UINavigationPage,
    UIMasterDetailView,
    UITabGroup,
    UITab,
    UITabSeparator,
    UITabSpacer,
    UIButton,
    UIIcon,
    UIInput,
    UIDropdownList,
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
  templateUrl: "./user-management-app.component.html",
  styleUrl: "./user-management-app.component.scss",
})
export class UserManagementAppDemo {
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

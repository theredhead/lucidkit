import {
  DOCUMENT,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  inject,
  signal,
} from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  ArrayCalendarDatasource,
  type CalendarEvent,
  FilterableArrayDatasource,
  UIAvatar,
  UIBadge,
  UIBadgeColumn,
  UIButton,
  UICalendarMonthView,
  UICarousel,
  UICard,
  UICardBody,
  UICardFooter,
  UICardHeader,
  UIChart,
  UIChip,
  UICheckbox,
  UIDropdownList,
  UIIcon,
  UIIcons,
  UIInput,
  UIIndicatesTouch,
  UIProgress,
  SingleCarouselStrategy,
  UITab,
  UITabGroup,
  UITextColumn,
  UIToggle,
  type SelectOption,
  BarGraphStrategy,
} from "@theredhead/lucid-kit";

import { UIChatView } from "../chat-view/chat-view.component";
import type {
  ChatMessage,
  ChatParticipant,
} from "../chat-view/chat-view.types";
import { UIMasterDetailView } from "../master-detail-view/master-detail-view.component";
import { UINavigationPage } from "./navigation-page.component";
import { navItem, type NavigationNode } from "./navigation-page.utils";

interface WorkspaceMetric {
  readonly label: string;
  readonly value: number;
}

interface WorkflowItem {
  readonly id: number;
  readonly title: string;
  readonly owner: string;
  readonly status: "planned" | "active" | "review" | "done";
  readonly area: string;
  readonly summary: string;
  readonly impact: string;
  readonly nextStep: string;
}

interface CalendarSession {
  readonly title: string;
  readonly kind: "focus" | "review" | "handoff";
}

interface StoryIndexResponse {
  readonly entries: Record<string, StoryIndexEntry>;
}

interface StoryIndexEntry {
  readonly id: string;
  readonly name: string;
  readonly title: string;
  readonly type: "story" | "docs";
  readonly tags?: readonly string[];
}

interface StoryCatalogCard {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly href: string;
  readonly storyCount: number;
  readonly screenshots: readonly StoryScreenshot[];
  readonly hasScreenshots: boolean;
}

interface StoryCatalogGroup {
  readonly key: string;
  readonly label: string;
  readonly stories: readonly StoryCatalogCard[];
}

interface ScreenshotManifest {
  readonly components: readonly ScreenshotManifestComponent[];
}

interface ScreenshotManifestComponent {
  readonly title: string;
  readonly category: string;
  readonly primaryStoryId: string;
  readonly screenshots: readonly ScreenshotManifestEntry[];
}

interface ScreenshotManifestEntry {
  readonly storyId: string;
  readonly storyName: string;
  readonly theme: "light" | "dark";
  readonly filePath: string;
}

interface StoryScreenshot {
  readonly id: string;
  readonly label: string;
  readonly theme: "light" | "dark";
  readonly src: string;
}

const CURRENT_USER: ChatParticipant = {
  id: "kris",
  name: "Kris Thompson",
  avatarEmail: "kris@lucidkit.dev",
};

const TEAMMATES: Record<string, ChatParticipant> = {
  "Mina Patel": {
    id: "mina",
    name: "Mina Patel",
    avatarEmail: "mina@lucidkit.dev",
  },
  "Jules Carter": {
    id: "jules",
    name: "Jules Carter",
    avatarEmail: "jules@lucidkit.dev",
  },
  "Ava Nguyen": {
    id: "ava",
    name: "Ava Nguyen",
    avatarEmail: "ava@lucidkit.dev",
  },
};

const NAV: NavigationNode[] = [
  navItem("overview", "Overview", {
    icon: UIIcons.Lucide.Layout.LayoutDashboard,
  }),
  navItem("workflows", "Data Views", {
    icon: UIIcons.Lucide.Text.ListFilter,
  }),
  navItem("messages", "Messages", {
    icon: UIIcons.Lucide.Social.MessagesSquare,
  }),
  navItem("schedule", "Schedule", {
    icon: UIIcons.Lucide.Time.CalendarDays,
  }),
  navItem("setup", "Forms & Settings", {
    icon: UIIcons.Lucide.Account.Settings,
  }),
];

const METRICS: readonly WorkspaceMetric[] = [
  { label: "UI kit primitives", value: 70 },
  { label: "Composite blocks", value: 14 },
  { label: "Form & workspace flows", value: 5 },
  { label: "Showcase apps", value: 5 },
];

const WORKFLOWS: readonly WorkflowItem[] = [
  {
    id: 1,
    title: "Launch Workspace",
    owner: "Mina Patel",
    status: "active",
    area: "Navigation + cards",
    summary:
      "A homepage that makes the product feel understandable in 10 seconds.",
    impact: "Great first-impression flow for dashboards and internal tools.",
    nextStep: "Wire CTA cards to your real routes and data sources.",
  },
  {
    id: 2,
    title: "Approvals Inbox",
    owner: "Jules Carter",
    status: "review",
    area: "Master-detail + badges",
    summary:
      "Review items quickly with a browsable list and a rich detail pane.",
    impact: "Useful for tickets, CRM records, order queues, and admin tools.",
    nextStep: "Replace mock rows with your datasource and projected columns.",
  },
  {
    id: 3,
    title: "Team Comms",
    owner: "Ava Nguyen",
    status: "planned",
    area: "Chat + composer",
    summary:
      "A compact threaded conversation area for product and support teams.",
    impact: "Lets users message without leaving the workflow context.",
    nextStep: "Hook the send event into your API and persistence layer.",
  },
  {
    id: 4,
    title: "Release Checklist",
    owner: "Kris Thompson",
    status: "done",
    area: "Inputs + toggles",
    summary:
      "A small settings and checklist surface for repeatable operational work.",
    impact: "Great for onboarding, preferences, and runbook-style screens.",
    nextStep: "Bind fields to signals or forms and keep the styling tokens.",
  },
];

const CHART_DATA: readonly WorkspaceMetric[] = [
  { label: "Navigation", value: 92 },
  { label: "Data views", value: 87 },
  { label: "Communication", value: 78 },
  { label: "Scheduling", value: 73 },
  { label: "Forms", value: 84 },
];

const CHAT_MESSAGES: readonly ChatMessage[] = [
  {
    id: "1",
    content:
      "This is the kind of starter screen I wish every component library had.",
    timestamp: new Date("2026-04-26T09:05:00"),
    sender: TEAMMATES["Mina Patel"],
  },
  {
    id: "2",
    content:
      "Exactly. Users can see navigation, lists, chat, calendar, charts, and forms in one pass.",
    timestamp: new Date("2026-04-26T09:06:00"),
    sender: TEAMMATES["Jules Carter"],
  },
  {
    id: "3",
    content:
      "And the composer can stay lightweight for team workflows instead of looking like a full document editor.",
    timestamp: new Date("2026-04-26T09:07:00"),
    sender: CURRENT_USER,
    type: "rich-text",
  },
  {
    id: "4",
    content: "Ship this as the first stop before the deeper app showcases.",
    timestamp: new Date("2026-04-26T09:08:00"),
    sender: TEAMMATES["Ava Nguyen"],
  },
];

const CALENDAR_EVENTS: readonly CalendarEvent<CalendarSession>[] = [
  {
    id: "ev-1",
    title: "Design crit",
    start: new Date("2026-04-27T10:00:00"),
    end: new Date("2026-04-27T11:00:00"),
    color: "#d97706",
    data: { title: "Design crit", kind: "review" },
  },
  {
    id: "ev-2",
    title: "Deep work block",
    start: new Date("2026-04-28T13:00:00"),
    end: new Date("2026-04-28T16:00:00"),
    color: "#2563eb",
    data: { title: "Deep work block", kind: "focus" },
  },
  {
    id: "ev-3",
    title: "Engineering handoff",
    start: new Date("2026-04-29T15:30:00"),
    end: new Date("2026-04-29T16:15:00"),
    color: "#059669",
    data: { title: "Engineering handoff", kind: "handoff" },
  },
  {
    id: "ev-4",
    title: "Launch rehearsal",
    start: new Date("2026-04-30T11:00:00"),
    end: new Date("2026-04-30T12:00:00"),
    color: "#7c3aed",
    data: { title: "Launch rehearsal", kind: "review" },
  },
];

const CADENCE_OPTIONS: readonly SelectOption[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "milestones", label: "Milestones only" },
];

const THEME_OPTIONS: readonly SelectOption[] = [
  { value: "adaptive", label: "Adaptive theme" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const NEXT_STEPS: readonly string[] = [
  "Start with blocks for navigation-heavy screens.",
  "Drop to primitives when you need tighter control.",
  "Keep tokens and surfaces, replace only your data and content.",
];

const STORY_CATALOG_GROUP_ORDER = [
  "UI Kit",
  "UI Blocks",
  "UI Forms",
  "Showcases",
] as const;

function workflowStatusColor(
  status: WorkflowItem["status"],
): "primary" | "warning" | "success" | "neutral" {
  switch (status) {
    case "active":
      return "primary";
    case "review":
      return "warning";
    case "done":
      return "success";
    default:
      return "neutral";
  }
}

@Component({
  selector: "ui-demo-quick-tour-showcase",
  standalone: true,
  imports: [
    UINavigationPage,
    UIMasterDetailView,
    UIChatView,
    UICalendarMonthView,
    UIAvatar,
    UIBadge,
    UIBadgeColumn,
    UIButton,
    UICard,
    UICardBody,
    UICardFooter,
    UICardHeader,
    UIChart,
    UIChip,
    UICheckbox,
    UICarousel,
    UIDropdownList,
    UIIcon,
    UIIndicatesTouch,
    UIInput,
    UIProgress,
    UITab,
    UITabGroup,
    UITextColumn,
    UIToggle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        --tour-accent: var(--ui-accent, #1f6feb);
        --tour-accent-soft: color-mix(
          in srgb,
          var(--tour-accent) 14%,
          transparent
        );
        --tour-hero-text: var(--ui-text, #1d232b);
        --tour-hero-bg:
          radial-gradient(
            circle at top left,
            color-mix(in srgb, var(--tour-accent) 24%, transparent),
            transparent 36%
          ),
          linear-gradient(
            135deg,
            var(--ui-surface, #f7f8fa),
            color-mix(
              in srgb,
              var(--tour-accent) 8%,
              var(--ui-surface, #f7f8fa)
            )
          );
        display: block;
        height: 100vh;
        color: var(--ui-text, #1d232b);
        background: var(--ui-surface, #f7f8fa);
      }

      .page-fill {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        height: 100%;
        min-height: 0;
      }

      .hero {
        color: var(--tour-hero-text);
        background: var(--tour-hero-bg);
        border: 1px solid
          color-mix(in srgb, var(--tour-accent) 22%, var(--ui-border, #d7dce2));
        border-radius: 18px;
        padding: 1.5rem;
        display: grid;
        grid-template-columns: minmax(0, 1.4fr) minmax(18rem, 0.9fr);
        gap: 1rem;
      }

      .hero-copy {
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        width: fit-content;
        padding: 0.35rem 0.7rem;
        border-radius: 999px;
        color: var(--tour-hero-text);
        background: color-mix(
          in srgb,
          var(--tour-accent) 12%,
          var(--ui-surface, #f7f8fa)
        );
        font-size: 0.76rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .hero h2 {
        margin: 0;
        font-size: clamp(1.9rem, 2.8vw, 2.8rem);
        line-height: 1.05;
      }

      .hero p {
        margin: 0;
        max-width: 42rem;
        font-size: 0.98rem;
        line-height: 1.65;
        opacity: 0.86;
      }

      .hero-actions,
      .chip-row,
      .panel-actions,
      .settings-actions,
      .catalog-header {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
      }

      .hero-side {
        display: grid;
        gap: 0.75rem;
        align-content: start;
      }

      .note-card {
        border-radius: 14px;
        padding: 0.95rem 1rem;
        color: var(--ui-text, #1d232b);
        background: color-mix(
          in srgb,
          var(--tour-accent) 8%,
          var(--ui-surface, #f7f8fa)
        );
        border: 1px solid
          color-mix(in srgb, var(--tour-accent) 14%, var(--ui-border, #d7dce2));
      }

      .note-card strong {
        display: block;
        margin-bottom: 0.35rem;
      }

      .metrics-grid,
      .mini-grid,
      .schedule-grid,
      .settings-grid {
        display: grid;
        gap: 1rem;
      }

      .metrics-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .mini-grid {
        grid-template-columns: minmax(0, 1.2fr) minmax(17rem, 0.8fr);
        min-height: 0;
      }

      .schedule-grid {
        grid-template-columns: minmax(0, 1.15fr) minmax(19rem, 0.85fr);
        min-height: 0;
      }

      .settings-grid {
        grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.8fr);
      }

      .stat-value {
        margin: 0.25rem 0;
        font-size: 1.7rem;
        font-weight: 800;
      }

      .muted,
      .subtle,
      .list-copy {
        color: var(--ui-text, #1d232b);
        background: transparent;
      }

      .muted {
        font-size: 0.8rem;
        opacity: 0.68;
      }

      .subtle {
        font-size: 0.88rem;
        line-height: 1.55;
        opacity: 0.82;
      }

      .panel-title {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        margin-bottom: 0.8rem;
      }

      .panel-title h3,
      .card-title {
        margin: 0;
        font-size: 1rem;
      }

      .master-detail-wrap,
      .calendar-wrap,
      .chat-wrap {
        min-height: 0;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 14px;
        overflow: hidden;
        color: var(--ui-text, #1d232b);
        background: var(--ui-surface, #f7f8fa);
      }

      .master-detail-wrap,
      .chat-wrap {
        height: 100%;
      }

      .master-detail-wrap ui-master-detail-view,
      .chat-wrap ui-chat-view {
        height: 100%;
      }

      .detail-stack {
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
        padding: 0.25rem 0;
      }

      .detail-grid {
        display: grid;
        grid-template-columns: 7rem 1fr;
        gap: 0.45rem 1rem;
        font-size: 0.88rem;
      }

      .detail-grid dt {
        margin: 0;
        font-weight: 700;
        opacity: 0.75;
      }

      .detail-grid dd {
        margin: 0;
      }

      .list-copy {
        margin: 0;
        font-size: 0.88rem;
        line-height: 1.55;
        opacity: 0.85;
      }

      .upcoming-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .upcoming-item {
        padding: 0.9rem 1rem;
        border-radius: 12px;
        color: var(--ui-text, #1d232b);
        background: var(--ui-surface, #f7f8fa);
        border: 1px solid var(--ui-border, #d7dce2);
      }

      .upcoming-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
      }

      .settings-stack {
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
      }

      .setting-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.85rem 1rem;
        border-radius: 12px;
        color: var(--ui-text, #1d232b);
        background: var(--ui-surface, #f7f8fa);
        border: 1px solid var(--ui-border, #d7dce2);
      }

      .setting-copy {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }

      .next-steps {
        margin: 0;
        padding-left: 1.1rem;
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
      }

      .next-steps li {
        line-height: 1.5;
      }

      .catalog-shell {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .catalog-header {
        align-items: baseline;
        justify-content: space-between;
      }

      .catalog-groups {
        display: grid;
        gap: 1rem;
      }

      .catalog-group {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        padding: 1rem;
        border-radius: 16px;
        color: var(--ui-text, #1d232b);
        background: color-mix(
          in srgb,
          var(--tour-accent) 4%,
          var(--ui-surface, #f7f8fa)
        );
        border: 1px solid var(--ui-border, #d7dce2);
      }

      .catalog-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
        gap: 0.9rem;
      }

      .catalog-grid.compact {
        grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      }

      .catalog-card,
      .catalog-state {
        display: flex;
        flex-direction: column;
        gap: 0.55rem;
        min-height: 10.5rem;
        padding: 1rem;
        border-radius: 14px;
        color: var(--ui-text, #1d232b);
        background: var(--ui-surface, #f7f8fa);
        border: 1px solid var(--ui-border, #d7dce2);
      }

      .catalog-state {
        justify-content: center;
      }

      .catalog-kicker {
        font-size: 0.74rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        opacity: 0.7;
      }

      .catalog-card h4,
      .catalog-group h4 {
        margin: 0;
      }

      .catalog-link {
        width: fit-content;
        margin-top: auto;
        padding: 0.45rem 0.75rem;
        border-radius: 999px;
        color: var(--ui-surface, #f7f8fa);
        background: var(--tour-accent, #1f6feb);
        font-size: 0.82rem;
        font-weight: 700;
        text-decoration: none;
      }

      .catalog-link:hover {
        color: var(--ui-surface, #f7f8fa);
        background: color-mix(in srgb, var(--tour-accent) 88%, black);
      }

      .catalog-preview {
        display: block;
        width: 100%;
        aspect-ratio: 16 / 10;
      }

      .catalog-preview-link {
        display: block;
        width: 100%;
        height: 100%;
        color: inherit;
        background: transparent;
        text-decoration: none;
      }

      .catalog-preview-frame {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        border-radius: 12px;
        color: var(--ui-text, #1d232b);
        background: color-mix(
          in srgb,
          var(--tour-accent) 5%,
          var(--ui-surface, #f7f8fa)
        );
        border: 1px solid var(--ui-border, #d7dce2);
      }

      .catalog-preview-frame img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .catalog-preview-caption {
        position: absolute;
        inset: auto 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.75rem 0.85rem;
        color: #f7f8fa;
        background: linear-gradient(transparent, rgba(15, 23, 42, 0.78));
      }

      .catalog-preview-label {
        font-size: 0.82rem;
        font-weight: 700;
      }

      .catalog-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 10rem;
        padding: 1rem;
        border-radius: 12px;
        text-align: center;
        color: var(--ui-text, #1d232b);
        background: color-mix(
          in srgb,
          var(--tour-accent) 5%,
          var(--ui-surface, #f7f8fa)
        );
        border: 1px dashed var(--ui-border, #d7dce2);
      }

      .catalog-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .overview-stack {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        min-height: 0;
        overflow: auto;
        padding-right: 0.2rem;
      }

      @media (max-width: 1100px) {
        .hero,
        .metrics-grid,
        .mini-grid,
        .schedule-grid,
        .settings-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 720px) {
        .hero {
          padding: 1.1rem;
        }

        .page-fill {
          gap: 0.8rem;
        }
      }
    `,
  ],
  template: `
    <ui-navigation-page
      [items]="nav"
      [(activePage)]="activePage"
      rootLabel="LucidKit"
      storageKey="storybook-nav-quick-tour"
    >
      <ng-template #content let-node>
        @if (node.id === "overview") {
          <div class="page-fill">
            <div class="overview-stack">
              <section class="hero">
                <div class="hero-copy">
                  <div class="eyebrow">
                    <ui-icon [svg]="icons.sparkles" [size]="14" />
                    Start here
                  </div>
                  <h2>
                    See what LucidKit can build before you dive into the deep
                    end.
                  </h2>
                  <p>
                    This quick tour is intentionally shallow: one polished
                    workspace, five pages, and enough real interaction to show
                    how the library handles navigation, data-heavy screens,
                    messaging, scheduling, charts, and forms.
                  </p>
                  <div class="hero-actions">
                    <ui-button variant="filled">Browse the tour</ui-button>
                    <ui-button variant="outlined"
                      >Jump to full showcases</ui-button
                    >
                  </div>
                  <div class="chip-row">
                    <ui-chip color="primary">Primitives</ui-chip>
                    <ui-chip color="success">Composite blocks</ui-chip>
                    <ui-chip color="warning">Dashboards</ui-chip>
                    <ui-chip color="neutral">Internal tools</ui-chip>
                  </div>
                </div>

                <div class="hero-side">
                  <div class="note-card">
                    <strong>Immediate value</strong>
                    <div class="subtle">
                      Use this as the mental model: keep the surfaces and
                      interaction patterns, then replace the demo data with your
                      own domain.
                    </div>
                  </div>
                  <div class="note-card">
                    <strong>Best next click</strong>
                    <div class="subtle">
                      Move left to right through the sidebar. Each page
                      highlights one cluster of capabilities without forcing a
                      full app narrative first.
                    </div>
                  </div>
                </div>
              </section>

              <div class="metrics-grid">
                @for (metric of metrics; track metric.label) {
                  <ui-card variant="outlined">
                    <ui-card-body>
                      <div class="muted">{{ metric.label }}</div>
                      <div class="stat-value">{{ metric.value }}</div>
                      <ui-progress
                        [value]="metric.value"
                        [ariaLabel]="metric.label"
                      />
                    </ui-card-body>
                  </ui-card>
                }
              </div>

              <div class="mini-grid">
                <ui-card variant="outlined">
                  <ui-card-header>
                    <div class="panel-title">
                      <ui-icon [svg]="icons.barChart" [size]="18" />
                      <h3>Where the library is strongest</h3>
                    </div>
                  </ui-card-header>
                  <ui-card-body>
                    <ui-chart
                      [source]="chartData"
                      labelProperty="label"
                      valueProperty="value"
                      [strategy]="chartStrategy"
                      [showLegend]="false"
                      [width]="520"
                      [height]="260"
                      ariaLabel="LucidKit capability overview"
                    />
                  </ui-card-body>
                  <ui-card-footer>
                    <div class="subtle">
                      The point is not a single hero component. It is how well
                      the pieces compose into a usable product surface.
                    </div>
                  </ui-card-footer>
                </ui-card>

                <ui-card variant="outlined">
                  <ui-card-header>
                    <div class="panel-title">
                      <ui-icon [svg]="icons.checkCircle" [size]="18" />
                      <h3>Three useful ways to approach it</h3>
                    </div>
                  </ui-card-header>
                  <ui-card-body>
                    <ol class="next-steps">
                      @for (step of nextSteps; track step) {
                        <li>{{ step }}</li>
                      }
                    </ol>
                  </ui-card-body>
                </ui-card>
              </div>

              <section class="catalog-shell">
                <div class="catalog-header">
                  <div>
                    <div class="panel-title">
                      <ui-icon [svg]="icons.compass" [size]="18" />
                      <h3>Browse the library through live screenshots</h3>
                    </div>
                    <p class="subtle">
                      These cards merge Storybook's runtime index with the
                      generated screenshot manifest, so the links stay dynamic
                      and captured components get visual previews automatically.
                    </p>
                  </div>
                  <ui-badge color="primary">
                    {{ storyCatalogCount() }} elements discovered
                  </ui-badge>
                </div>

                @if (storyCatalogState() === "loading") {
                  <div class="catalog-state">
                    <strong>Loading story index…</strong>
                    <div class="subtle">
                      Reading Storybook metadata and screenshot previews.
                    </div>
                  </div>
                }

                @if (storyCatalogState() === "error") {
                  <div class="catalog-state">
                    <strong>Story catalog unavailable.</strong>
                    <div class="subtle">
                      The quick tour can still render, but the dynamic catalog
                      could not fetch Storybook metadata in this environment.
                    </div>
                  </div>
                }

                @if (storyCatalogState() === "ready") {
                  <div class="catalog-groups">
                    @for (
                      group of themedStoryCatalogGroups();
                      track group.key
                    ) {
                      <section class="catalog-group">
                        <div class="catalog-meta">
                          <h4>{{ group.label }}</h4>
                          <ui-badge color="neutral"
                            >{{ group.stories.length }} elements</ui-badge
                          >
                        </div>

                        <div class="catalog-grid compact">
                          @for (story of group.stories; track story.id) {
                            <article class="catalog-card">
                              <div class="catalog-kicker">
                                {{ story.category }}
                              </div>
                              <h4>{{ story.title }}</h4>
                              <div class="muted">
                                {{ story.storyCount }}
                                {{
                                  story.storyCount === 1 ? "entry" : "entries"
                                }}
                              </div>

                              @if (story.hasScreenshots) {
                                <ui-carousel
                                  class="catalog-preview"
                                  [items]="story.screenshots"
                                  [strategy]="screenshotCarouselStrategy"
                                  [showIndicators]="false"
                                  [wrap]="story.screenshots.length > 1"
                                  [ariaLabel]="
                                    story.title + ' screenshot carousel'
                                  "
                                >
                                  <ng-template let-screenshot>
                                    <a
                                      uiIndicatesTouch
                                      class="catalog-preview-link"
                                      [href]="story.href"
                                      target="_top"
                                      rel="noreferrer"
                                    >
                                      <div class="catalog-preview-frame">
                                        <img
                                          [src]="screenshot.src"
                                          [alt]="
                                            story.title +
                                            ' ' +
                                            screenshot.label +
                                            ' preview'
                                          "
                                          loading="lazy"
                                        />
                                        <div class="catalog-preview-caption">
                                          <div class="catalog-preview-label">
                                            {{ screenshot.label }}
                                          </div>
                                          <ui-badge color="neutral">
                                            {{ screenshot.theme }}
                                          </ui-badge>
                                        </div>
                                      </div>
                                    </a>
                                  </ng-template>
                                </ui-carousel>
                              } @else {
                                <div class="catalog-empty">
                                  <div class="subtle">
                                    No preview yet. Capture this component to
                                    replace the placeholder with a live
                                    carousel.
                                  </div>
                                </div>
                              }

                              <a
                                uiIndicatesTouch
                                class="catalog-link"
                                [href]="story.href"
                                target="_top"
                                rel="noreferrer"
                              >
                                Open story
                              </a>
                            </article>
                          }
                        </div>
                      </section>
                    }
                  </div>
                }
              </section>
            </div>
          </div>
        }

        @if (node.id === "workflows") {
          <div class="page-fill">
            <div class="panel-title">
              <ui-icon [svg]="icons.layers" [size]="18" />
              <h3>Data views that feel like product screens, not raw demos</h3>
            </div>

            <div class="master-detail-wrap">
              <ui-master-detail-view
                [datasource]="workflowDatasource"
                title="Workflow patterns"
                [showFilter]="true"
                placeholder="Select a workflow"
              >
                <ui-text-column key="title" headerText="Workflow" />
                <ui-text-column key="owner" headerText="Owner" />
                <ui-badge-column key="status" headerText="Status" />

                <ng-template #detail let-item>
                  <div class="detail-stack">
                    <div class="panel-title">
                      <ui-icon [svg]="icons.workflow" [size]="18" />
                      <h3 class="card-title">{{ item.title }}</h3>
                    </div>
                    <dl class="detail-grid">
                      <dt>Owner</dt>
                      <dd>{{ item.owner }}</dd>
                      <dt>Area</dt>
                      <dd>{{ item.area }}</dd>
                      <dt>Status</dt>
                      <dd>
                        <ui-chip [color]="workflowStatusColor(item.status)">
                          {{ item.status }}
                        </ui-chip>
                      </dd>
                    </dl>
                    <p class="list-copy">{{ item.summary }}</p>
                    <ui-tab-group panelStyle="flat">
                      <ui-tab label="Why it matters">
                        <p class="list-copy" style="padding-top: 0.75rem;">
                          {{ item.impact }}
                        </p>
                      </ui-tab>
                      <ui-tab label="Next step">
                        <p class="list-copy" style="padding-top: 0.75rem;">
                          {{ item.nextStep }}
                        </p>
                      </ui-tab>
                    </ui-tab-group>
                    <div class="panel-actions">
                      <ui-button variant="filled" size="small"
                        >Use this pattern</ui-button
                      >
                      <ui-button variant="outlined" size="small"
                        >See a bigger app</ui-button
                      >
                    </div>
                  </div>
                </ng-template>
              </ui-master-detail-view>
            </div>
          </div>
        }

        @if (node.id === "messages") {
          <div class="page-fill">
            <div class="panel-title">
              <ui-icon [svg]="icons.messages" [size]="18" />
              <h3>
                Communication blocks stay useful even in small workflow surfaces
              </h3>
            </div>

            <div class="chat-wrap">
              <ui-chat-view
                [messages]="chatMessages"
                [currentUser]="currentUser"
                composerMode="rich-text"
                composerPresentation="compact"
                placeholder="Leave a crisp handoff note..."
                ariaLabel="Quick tour chat"
              />
            </div>
          </div>
        }

        @if (node.id === "schedule") {
          <div class="page-fill">
            <div class="panel-title">
              <ui-icon [svg]="icons.calendar" [size]="18" />
              <h3>
                Scheduling and planning components can sit beside operational
                context
              </h3>
            </div>

            <div class="schedule-grid">
              <div class="calendar-wrap">
                <ui-calendar-month-view
                  [datasource]="calendarDatasource"
                  [(selectedDate)]="selectedDate"
                  ariaLabel="Quick tour calendar"
                />
              </div>

              <ui-card variant="outlined">
                <ui-card-header>
                  <div class="panel-title">
                    <ui-icon [svg]="icons.clock" [size]="18" />
                    <h3>Upcoming this week</h3>
                  </div>
                </ui-card-header>
                <ui-card-body>
                  <div class="upcoming-list">
                    @for (event of calendarEvents; track event.id) {
                      <div class="upcoming-item">
                        <div class="upcoming-row">
                          <strong>{{ event.title }}</strong>
                          <ui-badge color="primary">
                            {{ event.data?.kind ?? "session" }}
                          </ui-badge>
                        </div>
                        <div class="muted" style="margin-top: 0.35rem;">
                          {{ event.start | date: "EEE d MMM, HH:mm" }}
                        </div>
                      </div>
                    }
                  </div>
                </ui-card-body>
              </ui-card>
            </div>
          </div>
        }

        @if (node.id === "setup") {
          <div class="page-fill">
            <div class="panel-title">
              <ui-icon [svg]="icons.sliders" [size]="18" />
              <h3>
                Primitives cover the small screens that make products feel
                finished
              </h3>
            </div>

            <div class="settings-grid">
              <ui-card variant="outlined">
                <ui-card-header>
                  <div class="panel-title">
                    <ui-icon [svg]="icons.wand" [size]="18" />
                    <h3>Workspace setup</h3>
                  </div>
                </ui-card-header>
                <ui-card-body>
                  <div class="settings-stack">
                    <div>
                      <div class="muted">Project name</div>
                      <ui-input
                        placeholder="Launch workspace"
                        ariaLabel="Project name"
                      />
                    </div>
                    <div>
                      <div class="muted">Review cadence</div>
                      <ui-dropdown-list
                        [options]="cadenceOptions"
                        ariaLabel="Review cadence"
                      />
                    </div>
                    <div>
                      <div class="muted">Theme mode</div>
                      <ui-dropdown-list
                        [options]="themeOptions"
                        ariaLabel="Theme mode"
                      />
                    </div>
                    <ui-checkbox ariaLabel="Enable updates">
                      Notify collaborators when the scope changes
                    </ui-checkbox>
                  </div>
                </ui-card-body>
                <ui-card-footer>
                  <div class="settings-actions">
                    <ui-button variant="filled">Save setup</ui-button>
                    <ui-button variant="ghost">Reset</ui-button>
                  </div>
                </ui-card-footer>
              </ui-card>

              <div class="settings-stack">
                <div class="setting-row">
                  <div class="setting-copy">
                    <strong>Compact composer</strong>
                    <span class="muted"
                      >Great for support, handoffs, and chat-adjacent
                      work.</span
                    >
                  </div>
                  <ui-toggle [value]="true" ariaLabel="Compact composer" />
                </div>
                <div class="setting-row">
                  <div class="setting-copy">
                    <strong>Saved preferences</strong>
                    <span class="muted"
                      >Many blocks can persist state with a storage key.</span
                    >
                  </div>
                  <ui-toggle [value]="true" ariaLabel="Saved preferences" />
                </div>
                <div class="setting-row">
                  <div class="setting-copy">
                    <strong>Accessibility-first defaults</strong>
                    <span class="muted"
                      >Labels, keyboard flow, and contrast should be the
                      baseline.</span
                    >
                  </div>
                  <ui-badge color="success">Built in</ui-badge>
                </div>
              </div>
            </div>
          </div>
        }
      </ng-template>
    </ui-navigation-page>
  `,
})
class UIDemoQuickTourShowcase implements OnDestroy {
  protected readonly nav = NAV;

  protected readonly activePage = signal("overview");

  protected readonly selectedDate = signal(new Date("2026-04-27T00:00:00"));

  protected readonly metrics = METRICS;

  protected readonly nextSteps = NEXT_STEPS;

  protected readonly chartData = CHART_DATA;

  protected readonly chartStrategy = new BarGraphStrategy({
    barWidthRatio: 0.72,
    borderRadius: 10,
  });

  protected readonly screenshotCarouselStrategy = new SingleCarouselStrategy();

  protected readonly activeScreenshotTheme = signal<"light" | "dark">("dark");

  protected readonly workflowDatasource = new FilterableArrayDatasource([
    ...WORKFLOWS,
  ]);

  protected readonly chatMessages = CHAT_MESSAGES;

  protected readonly currentUser = CURRENT_USER;

  protected readonly calendarEvents = CALENDAR_EVENTS;

  protected readonly calendarDatasource = new ArrayCalendarDatasource(
    CALENDAR_EVENTS,
  );

  protected readonly cadenceOptions = CADENCE_OPTIONS;

  protected readonly themeOptions = THEME_OPTIONS;

  protected readonly storyCatalogState = signal<"loading" | "ready" | "error">(
    "loading",
  );

  protected readonly storyCatalogGroups = signal<readonly StoryCatalogGroup[]>(
    [],
  );

  protected readonly storyCatalogCount = computed(() =>
    this.storyCatalogGroups().reduce(
      (count, group) => count + group.stories.length,
      0,
    ),
  );

  protected readonly themedStoryCatalogGroups = computed(() => {
    const activeTheme = this.activeScreenshotTheme();

    return this.storyCatalogGroups().map((group) => ({
      ...group,
      stories: group.stories.map((story) => {
        const screenshots = this.filterScreenshotsForTheme(
          story.screenshots,
          activeTheme,
        );

        return {
          ...story,
          screenshots,
          hasScreenshots: screenshots.length > 0,
        };
      }),
    }));
  });

  protected readonly icons = {
    sparkles: UIIcons.Lucide.Design.WandSparkles,
    barChart: UIIcons.Lucide.Charts.ChartColumn,
    checkCircle: UIIcons.Lucide.Notifications.CircleCheckBig,
    compass: UIIcons.Lucide.Navigation.Compass,
    layers: UIIcons.Lucide.Design.Layers,
    workflow: UIIcons.Lucide.Account.Waypoints,
    messages: UIIcons.Lucide.Social.MessagesSquare,
    calendar: UIIcons.Lucide.Time.CalendarDays,
    clock: UIIcons.Lucide.Time.Clock3,
    sliders: UIIcons.Lucide.Account.Settings2,
    wand: UIIcons.Lucide.Design.WandSparkles,
  } as const;

  private readonly document = inject(DOCUMENT);

  private themeObserver: MutationObserver | null = null;

  public constructor() {
    this.syncActiveScreenshotTheme();
    this.observeThemeChanges();
    void this.loadStoryCatalog();
  }

  public ngOnDestroy(): void {
    this.themeObserver?.disconnect();
  }

  private async loadStoryCatalog(): Promise<void> {
    try {
      const [indexResponse, manifestResponse] = await Promise.all([
        fetch("./index.json", { cache: "no-cache" }),
        fetch("./storybook-screenshots/manifest.json", { cache: "no-cache" }),
      ]);

      if (!indexResponse.ok) {
        throw new Error(
          `Failed to load Storybook index: ${indexResponse.status}`,
        );
      }

      const index = (await indexResponse.json()) as StoryIndexResponse;
      const manifest = manifestResponse.ok
        ? ((await manifestResponse.json()) as ScreenshotManifest)
        : null;

      this.storyCatalogGroups.set(
        this.buildStoryCatalogGroups(index, manifest),
      );
      this.storyCatalogState.set("ready");
    } catch {
      this.storyCatalogState.set("error");
    }
  }

  private buildStoryCatalogGroups(
    index: StoryIndexResponse,
    manifest: ScreenshotManifest | null,
  ): readonly StoryCatalogGroup[] {
    const groupedStories = new Map<string, StoryCatalogCard[]>();
    const manifestEntries = this.buildScreenshotLookup(manifest);
    const titleEntries = new Map<
      string,
      {
        category: string;
        title: string;
        href: string;
        storyCount: number;
        screenshots: readonly StoryScreenshot[];
      }
    >();

    for (const entry of Object.values(index.entries)) {
      if (entry.type !== "story") {
        continue;
      }

      const titleParts = entry.title.split("/").map((part) => part.trim());
      const category = titleParts[1] ?? titleParts[0] ?? "Stories";
      const title =
        titleParts.slice(2).join(" / ") || titleParts.at(-1) || entry.title;
      const titleKey = `${category}::${title}`;
      const existing = titleEntries.get(titleKey);

      if (existing) {
        titleEntries.set(titleKey, {
          ...existing,
          storyCount: existing.storyCount + 1,
        });
        continue;
      }

      titleEntries.set(titleKey, {
        category,
        title,
        href: `./?path=/story/${entry.id}`,
        storyCount: 1,
        screenshots: manifestEntries.get(titleKey) ?? [],
      });
    }

    for (const [id, entry] of titleEntries.entries()) {
      const stories = groupedStories.get(entry.category) ?? [];
      stories.push({
        id,
        title: entry.title,
        category: entry.category,
        href: entry.href,
        storyCount: entry.storyCount,
        screenshots: entry.screenshots,
        hasScreenshots: entry.screenshots.length > 0,
      });
      groupedStories.set(entry.category, stories);
    }

    return [...groupedStories.entries()]
      .sort(([categoryA], [categoryB]) => {
        const indexA = STORY_CATALOG_GROUP_ORDER.indexOf(
          categoryA as (typeof STORY_CATALOG_GROUP_ORDER)[number],
        );
        const indexB = STORY_CATALOG_GROUP_ORDER.indexOf(
          categoryB as (typeof STORY_CATALOG_GROUP_ORDER)[number],
        );

        if (indexA !== -1 || indexB !== -1) {
          return (
            (indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA) -
            (indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB)
          );
        }

        return categoryA.localeCompare(categoryB);
      })
      .map(([category, stories]) => ({
        key: category.toLowerCase().replace(/\s+/g, "-"),
        label: category,
        stories: [...stories].sort((storyA, storyB) =>
          storyA.title.localeCompare(storyB.title),
        ),
      }));
  }

  private buildScreenshotLookup(
    manifest: ScreenshotManifest | null,
  ): ReadonlyMap<string, readonly StoryScreenshot[]> {
    const lookup = new Map<string, readonly StoryScreenshot[]>();

    if (!manifest) {
      return lookup;
    }

    for (const component of manifest.components) {
      const titleParts = component.title.split("/").map((part) => part.trim());
      const category = titleParts[1] ?? component.category ?? "Stories";
      const title =
        titleParts.slice(2).join(" / ") || titleParts.at(-1) || component.title;
      const titleKey = `${category}::${title}`;

      lookup.set(
        titleKey,
        component.screenshots.map((screenshot) => ({
          id: `${screenshot.storyId}-${screenshot.theme}`,
          label: screenshot.storyName,
          theme: screenshot.theme,
          src: this.toScreenshotSrc(screenshot.filePath),
        })),
      );
    }

    return lookup;
  }

  private toScreenshotSrc(filePath: string): string {
    return `./${filePath.replace(/^artifacts\//, "")}`;
  }

  private filterScreenshotsForTheme(
    screenshots: readonly StoryScreenshot[],
    theme: "light" | "dark",
  ): readonly StoryScreenshot[] {
    const themed = screenshots.filter(
      (screenshot) => screenshot.theme === theme,
    );
    return themed.length > 0 ? themed : screenshots;
  }

  private observeThemeChanges(): void {
    const root = this.document.documentElement;

    this.themeObserver = new MutationObserver(() => {
      this.syncActiveScreenshotTheme();
    });

    this.themeObserver.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  private syncActiveScreenshotTheme(): void {
    this.activeScreenshotTheme.set(this.detectActiveScreenshotTheme());
  }

  private detectActiveScreenshotTheme(): "light" | "dark" {
    const root = this.document.documentElement;

    if (root.classList.contains("light-theme")) {
      return "light";
    }

    if (root.classList.contains("dark-theme")) {
      return "dark";
    }

    return typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
}

const meta: Meta = {
  title: "@theredhead/Showcases/A Quick Tour",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    hideThemeToggle: true,
    docs: {
      description: {
        component:
          "A fast first-stop showcase that introduces LucidKit through a single friendly workspace instead of a full enterprise app. " +
          "It samples `UINavigationPage`, `UIMasterDetailView`, `UIChatView`, `UICalendarMonthView`, `UIChart`, cards, tabs, badges, inputs, and toggles in one shallow tour.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [UIDemoQuickTourShowcase],
    }),
  ],
};

export default meta;
type Story = StoryObj;

/**
 * A short, welcoming overview of the library before the larger app showcases.
 *
 * Use the sidebar to move through five small product surfaces:
 *
 * - **Overview** — hero messaging, cards, chips, progress, and a chart
 * - **Data Views** — a filterable master-detail layout with tabs in the detail pane
 * - **Messages** — chat view with the compact rich-text composer
 * - **Schedule** — calendar month view plus upcoming sessions
 * - **Forms & Settings** — inputs, dropdowns, checkbox, toggle, and small settings rows
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-demo-quick-tour-showcase />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-navigation-page [items]="nav" [(activePage)]="activePage" rootLabel="LucidKit">
  <ng-template #content let-node>
    @if (node.id === 'workflows') {
      <ui-master-detail-view [datasource]="workflowDatasource" title="Workflow patterns" [showFilter]="true">
        <ui-text-column key="title" headerText="Workflow" />
        <ui-text-column key="owner" headerText="Owner" />
        <ui-badge-column key="status" headerText="Status" />
      </ui-master-detail-view>
    }

    @if (node.id === 'messages') {
      <ui-chat-view
        [messages]="chatMessages"
        [currentUser]="currentUser"
        composerMode="rich-text"
        composerPresentation="compact"
      />
    }

    @if (node.id === 'schedule') {
      <ui-calendar-month-view
        [datasource]="calendarDatasource"
        [(selectedDate)]="selectedDate"
      />
    }
  </ng-template>
</ui-navigation-page>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  ArrayCalendarDatasource,
  FilterableArrayDatasource,
  UIBadgeColumn,
  UITextColumn,
} from '@theredhead/lucid-kit';
import {
  UIChatView,
  UIMasterDetailView,
  UINavigationPage,
  navItem,
} from '@theredhead/lucid-blocks';

@Component({
  selector: 'app-quick-tour',
  standalone: true,
  imports: [
    UINavigationPage,
    UIMasterDetailView,
    UIChatView,
    UITextColumn,
    UIBadgeColumn,
  ],
  templateUrl: './quick-tour.component.html',
})
export class QuickTourComponent {
  readonly activePage = signal('overview');
  readonly selectedDate = signal(new Date());
  readonly nav = [
    navItem('overview', 'Overview'),
    navItem('workflows', 'Data Views'),
    navItem('messages', 'Messages'),
    navItem('schedule', 'Schedule'),
  ];

  readonly workflowDatasource = new FilterableArrayDatasource(workflows);
  readonly calendarDatasource = new ArrayCalendarDatasource(events);
  readonly chatMessages = messages;
  readonly currentUser = me;
}

// ── SCSS ──
/* Start with a friendly hero, then combine navigation,
   data views, communication, scheduling, and small
   settings surfaces into one shallow guided tour. */
`,
      },
    },
  },
};

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  viewChild,
  viewChildren,
} from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { UIDashboard } from "./dashboard.component";
import { UIDashboardPanel } from "./dashboard-panel.component";
import type { DashboardPanelConfig } from "./dashboard.types";
import { UIIcon, UIIcons, UIChart, BarGraphStrategy } from "@theredhead/ui-kit";

// ── Shared fixtures ──────────────────────────────────────────────

const SAMPLE_PANELS: DashboardPanelConfig[] = [
  {
    id: "kpi",
    title: "KPI Overview",
    icon: UIIcons.Lucide.Science.Gauge,
    placement: { colSpan: 5 },
    collapsible: true,
  },
  {
    id: "revenue",
    title: "Revenue",
    icon: UIIcons.Lucide.Charts.ChartColumn,
    placement: { colSpan: 3 },
    collapsible: true,
  },
  {
    id: "users",
    title: "Active Users",
    icon: UIIcons.Lucide.Account.Users,
    placement: { colSpan: 3 },
  },
  {
    id: "feed",
    title: "Activity Feed",
    icon: UIIcons.Lucide.Account.Activity,
    placement: { colSpan: 5 },
    collapsible: true,
    removable: true,
  },
  {
    id: "tasks",
    title: "Tasks",
    icon: UIIcons.Lucide.Text.ListTodo,
    placement: { colSpan: 8 },
    collapsible: true,
    removable: true,
  },
];

// ── Demo: Default (3-column fixed) ───────────────────────────────

@Component({
  selector: "ui-dashboard-default-demo",
  standalone: true,
  imports: [UIDashboard, UIDashboardPanel, UIIcon, UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .demo-widget {
        padding: 1rem;
        font-size: 0.85rem;
        opacity: 0.6;
      }
      .demo-kpi {
        display: flex;
        gap: 2rem;
        padding: 1rem;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        height: 100%;
        box-sizing: border-box;
      }
      .demo-kpi-item {
        text-align: center;
        min-width: 0;
      }
      .demo-kpi-value {
        font-size: 2.2rem;
        font-weight: 700;
        white-space: nowrap;
      }
      .demo-kpi-label {
        font-size: 0.8rem;
        opacity: 0.55;
        margin-top: 0.25rem;
      }
      .demo-chart-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        box-sizing: border-box;
      }
      .demo-chart-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 160px;
        border: 2px dashed currentColor;
        border-radius: 8px;
        opacity: 0.35;
        font-size: 0.8rem;
      }
      ui-dashboard-panel {
        overflow: hidden;
      }
      .demo-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .demo-list li {
        padding: 0.5rem 0;
        border-bottom: 1px solid currentColor;
        border-bottom-color: color-mix(in srgb, currentColor 15%, transparent);
        font-size: 0.8rem;
      }
      .demo-list li:last-child {
        border-bottom: none;
      }
    `,
  ],
  template: `
    <ui-dashboard
      [columns]="8"
      [gap]="16"
      [dockMenuIcon]="menuIcon"
    >
      <ng-container dockMenuItem>
        <hr />
        <button class="dock-menu-item dock-menu-item--disabled" disabled aria-disabled="true">
          <ui-icon [svg]="icons.Account.Settings" [size]="14" class="dock-menu-item-icon" />
          <span class="dock-menu-item-label">Configure…</span>
        </button>
      </ng-container>

      <ui-dashboard-panel [config]="panels[0]">
        <div class="demo-kpi">
          <div class="demo-kpi-item">
            <div class="demo-kpi-value">$42.5k</div>
            <div class="demo-kpi-label">Revenue</div>
          </div>
          <div class="demo-kpi-item">
            <div class="demo-kpi-value">1,284</div>
            <div class="demo-kpi-label">Orders</div>
          </div>
          <div class="demo-kpi-item">
            <div class="demo-kpi-value">94.2%</div>
            <div class="demo-kpi-label">Satisfaction</div>
          </div>
          <div class="demo-kpi-item">
            <div class="demo-kpi-value">387</div>
            <div class="demo-kpi-label">New Users</div>
          </div>
        </div>
      </ui-dashboard-panel>

      <ui-dashboard-panel [config]="panels[1]">
        <div class="demo-chart-wrapper">
          <ui-chart
            [source]="revenueData"
            labelProperty="month"
            valueProperty="revenue"
            [strategy]="barStrategy"
            [width]="280"
            [height]="180"
            [showLegend]="false"
            ariaLabel="Monthly revenue"
          />
        </div>
      </ui-dashboard-panel>

      <ui-dashboard-panel [config]="panels[2]">
        <ul class="demo-list">
          <li>
            <ui-icon
              [svg]="icons.Shapes.CircleDot"
              [size]="14"
              style="color: #22c55e"
            />
            142 active now
          </li>
          <li>
            <ui-icon
              [svg]="icons.Shapes.CircleDot"
              [size]="14"
              style="color: #3b82f6"
            />
            1,847 today
          </li>
          <li>
            <ui-icon
              [svg]="icons.Shapes.Circle"
              [size]="14"
              style="color: #9ca3af"
            />
            12,409 this week
          </li>
        </ul>
      </ui-dashboard-panel>

      <ui-dashboard-panel [config]="panels[3]">
        <ul class="demo-list">
          <li>Alice deployed v2.4.1</li>
          <li>Bob merged PR #312</li>
          <li>Charlie added 3 tests</li>
          <li>Diana updated docs</li>
          <li>Eve resolved issue #87</li>
        </ul>
      </ui-dashboard-panel>

      <ui-dashboard-panel [config]="panels[4]">
        <ul class="demo-list">
          <li>
            <ui-icon
              [svg]="icons.Notifications.CircleCheck"
              [size]="14"
              style="color: #22c55e"
            />
            Review calendar component
          </li>
          <li>
            <ui-icon
              [svg]="icons.Shapes.Square"
              [size]="14"
              style="color: #9ca3af"
            />
            Update CI pipeline
          </li>
          <li>
            <ui-icon
              [svg]="icons.Shapes.Square"
              [size]="14"
              style="color: #9ca3af"
            />
            Write dashboard docs
          </li>
        </ul>
      </ui-dashboard-panel>
    </ui-dashboard>
  `,
})
class DashboardDefaultDemo {
  protected readonly icons = UIIcons.Lucide;
  protected readonly menuIcon = UIIcons.Lucide.Layout.Menu;
  public readonly panels = SAMPLE_PANELS;
  protected readonly barStrategy = new BarGraphStrategy();
  protected readonly revenueData = [
    { month: "Jul", revenue: 24500 },
    { month: "Aug", revenue: 21800 },
    { month: "Sep", revenue: 26300 },
    { month: "Oct", revenue: 28900 },
    { month: "Nov", revenue: 31200 },
    { month: "Dec", revenue: 42500 },
  ];
}

// ── Demo: Auto-fill responsive ───────────────────────────────────

@Component({
  selector: "ui-dashboard-auto-demo",
  standalone: true,
  imports: [UIDashboard, UIDashboardPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 120px;
        font-size: 0.8rem;
        border: 2px dashed currentColor;
        border-radius: 8px;
        opacity: 0.35;
      }
    `,
  ],
  template: `
    <ui-dashboard columns="auto" [gap]="20" [minColumnWidth]="240">
      @for (i of items; track i) {
        <ui-dashboard-panel
          [config]="{
            id: 'panel-' + i,
            title: 'Panel ' + i,
            collapsible: true,
            removable: true,
          }"
        >
          <div class="placeholder">Widget {{ i }}</div>
        </ui-dashboard-panel>
      }
    </ui-dashboard>
  `,
})
class DashboardAutoDemo {
  public readonly items = [1, 2, 3, 4, 5, 6];
}

// ── Demo: With restore ───────────────────────────────────────────

@Component({
  selector: "ui-dashboard-restore-demo",
  standalone: true,
  imports: [UIDashboard, UIDashboardPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        --demo-ctrl-bg: #f9fafb;
        --demo-ctrl-bg-hover: #e5e7eb;
        --demo-ctrl-border: #d1d5db;
      }
      :host-context(html.dark-theme) {
        --demo-ctrl-bg: #2a3040;
        --demo-ctrl-bg-hover: #3a3f47;
        --demo-ctrl-border: #4a5060;
      }
      @media (prefers-color-scheme: dark) {
        :host-context(html:not(.light-theme):not(.dark-theme)) {
          --demo-ctrl-bg: #2a3040;
          --demo-ctrl-bg-hover: #3a3f47;
          --demo-ctrl-border: #4a5060;
        }
      }
      .controls {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
      }
      .controls button {
        padding: 0.4rem 0.8rem;
        border: 1px solid var(--demo-ctrl-border);
        border-radius: 4px;
        background: var(--demo-ctrl-bg);
        color: inherit;
        cursor: pointer;
        font-size: 0.8rem;
      }
      .controls button:hover {
        background: var(--demo-ctrl-bg-hover);
      }
      .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
        font-size: 0.8rem;
        border: 2px dashed currentColor;
        border-radius: 8px;
        opacity: 0.35;
      }
      .removed-info {
        margin-top: 1rem;
        font-size: 0.8rem;
        opacity: 0.6;
      }
    `,
  ],
  template: `
    <div class="controls">
      <button (click)="dashboard().restoreAll()">Restore all panels</button>
    </div>

    <ui-dashboard [columns]="3" [gap]="16" (panelRemoved)="onRemoved($event)">
      @for (cfg of configs; track cfg.id) {
        <ui-dashboard-panel [config]="cfg">
          <div class="placeholder">{{ cfg.title }} content</div>
        </ui-dashboard-panel>
      }
    </ui-dashboard>

    @if (lastRemoved()) {
      <div class="removed-info">
        Last removed: <strong>{{ lastRemoved() }}</strong>
      </div>
    }
  `,
})
class DashboardRestoreDemo {
  public readonly dashboard = viewChild.required(UIDashboard);
  public readonly lastRemoved = signal<string | null>(null);

  public readonly configs: DashboardPanelConfig[] = [
    { id: "a", title: "Panel A", removable: true, collapsible: true },
    { id: "b", title: "Panel B", removable: true, collapsible: true },
    { id: "c", title: "Panel C", removable: true, collapsible: true },
    { id: "d", title: "Panel D", removable: true, collapsible: true },
    { id: "e", title: "Panel E", removable: true, collapsible: true },
    { id: "f", title: "Panel F", removable: true, collapsible: true },
  ];

  public onRemoved(id: string): void {
    this.lastRemoved.set(id);
  }
}

// ── Demo: Spanning layout ────────────────────────────────────────

@Component({
  selector: "ui-dashboard-spanning-demo",
  standalone: true,
  imports: [UIDashboard, UIDashboardPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 120px;
        font-size: 0.8rem;
        border: 2px dashed currentColor;
        border-radius: 8px;
        opacity: 0.35;
      }
      .tall {
        height: 260px;
      }
    `,
  ],
  template: `
    <ui-dashboard [columns]="4" [gap]="12">
      <ui-dashboard-panel
        [config]="{
          id: 'hero',
          title: 'Hero Banner',
          placement: { colSpan: 4 },
        }"
      >
        <div class="placeholder">Full-width hero panel (4 columns)</div>
      </ui-dashboard-panel>

      <ui-dashboard-panel
        [config]="{
          id: 'sidebar',
          title: 'Sidebar',
          placement: { rowSpan: 2 },
        }"
      >
        <div class="placeholder tall">Tall sidebar (2 rows)</div>
      </ui-dashboard-panel>

      <ui-dashboard-panel
        [config]="{
          id: 'main',
          title: 'Main Content',
          placement: { colSpan: 2 },
        }"
      >
        <div class="placeholder">Wide main area (2 columns)</div>
      </ui-dashboard-panel>

      <ui-dashboard-panel [config]="{ id: 'aside', title: 'Aside' }">
        <div class="placeholder">Standard cell</div>
      </ui-dashboard-panel>

      <ui-dashboard-panel
        [config]="{
          id: 'bottom',
          title: 'Bottom Bar',
          placement: { colSpan: 3 },
        }"
      >
        <div class="placeholder">Bottom bar spanning 3 columns</div>
      </ui-dashboard-panel>
    </ui-dashboard>
  `,
})
class DashboardSpanningDemo {}

// ── Demo: Notifications ──────────────────────────────────────────

@Component({
  selector: "ui-dashboard-notification-demo",
  standalone: true,
  imports: [UIDashboard, UIDashboardPanel, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        --demo-ctrl-bg: #f9fafb;
        --demo-ctrl-bg-hover: #e5e7eb;
        --demo-ctrl-border: #d1d5db;
        --demo-ctrl-text: #1d232b;
      }
      :host-context(html.dark-theme) {
        --demo-ctrl-bg: #2a3040;
        --demo-ctrl-bg-hover: #3a3f47;
        --demo-ctrl-border: #4a5060;
        --demo-ctrl-text: #f2f6fb;
      }
      @media (prefers-color-scheme: dark) {
        :host-context(html:not(.light-theme):not(.dark-theme)) {
          --demo-ctrl-bg: #2a3040;
          --demo-ctrl-bg-hover: #3a3f47;
          --demo-ctrl-border: #4a5060;
          --demo-ctrl-text: #f2f6fb;
        }
      }
      .controls {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
      }
      .controls button {
        padding: 0.4rem 0.8rem;
        border: 1px solid var(--demo-ctrl-border);
        border-radius: 4px;
        background: var(--demo-ctrl-bg);
        color: var(--demo-ctrl-text);
        cursor: pointer;
        font-size: 0.8rem;
      }
      .controls button:hover {
        background: var(--demo-ctrl-bg-hover);
      }
      .demo-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .demo-list li {
        padding: 0.5rem 0;
        border-bottom: 1px solid currentColor;
        border-bottom-color: color-mix(in srgb, currentColor 15%, transparent);
        font-size: 0.8rem;
      }
      .demo-list li:last-child {
        border-bottom: none;
      }
    `,
  ],
  template: `
    <div class="controls">
      <button (click)="notifyFeed()">Notify Activity (persists)</button>
      <button (click)="notifyTasks()">Notify Tasks (5 s timeout)</button>
      <button (click)="clearAll()">Clear all</button>
    </div>

    <ui-dashboard [columns]="3" [gap]="16">
      <ui-dashboard-panel
        [config]="{
          id: 'inbox',
          title: 'Inbox',
          icon: icons.Mail.Mail,
          collapsible: true,
        }"
      >
        <ul class="demo-list">
          <li>Welcome aboard!</li>
          <li>Your trial starts today</li>
        </ul>
      </ui-dashboard-panel>

      <ui-dashboard-panel
        #feedPanel
        [config]="{
          id: 'feed',
          title: 'Activity Feed',
          icon: icons.Account.Activity,
          collapsible: true,
        }"
      >
        <ul class="demo-list">
          <li>Alice deployed v2.4.1</li>
          <li>Bob merged PR #312</li>
          <li>Charlie added 3 tests</li>
        </ul>
      </ui-dashboard-panel>

      <ui-dashboard-panel
        #tasksPanel
        [config]="{
          id: 'tasks',
          title: 'Tasks',
          icon: icons.Text.ListTodo,
          collapsible: true,
        }"
      >
        <ul class="demo-list">
          <li>Update CI pipeline</li>
          <li>Write dashboard docs</li>
        </ul>
      </ui-dashboard-panel>
    </ui-dashboard>
  `,
})
class DashboardNotificationDemo {
  protected readonly icons = UIIcons.Lucide;

  private readonly feedPanel =
    viewChild.required<UIDashboardPanel>("feedPanel");
  private readonly tasksPanel =
    viewChild.required<UIDashboardPanel>("tasksPanel");

  protected notifyFeed(): void {
    this.feedPanel().notify();
  }

  protected notifyTasks(): void {
    this.tasksPanel().notify(5000);
  }

  protected clearAll(): void {
    this.feedPanel().clearNotification();
    this.tasksPanel().clearNotification();
  }
}

// ── Meta ─────────────────────────────────────────────────────────

const meta: Meta<UIDashboard> = {
  title: "@theredhead/UI Blocks/Dashboard",
  component: UIDashboard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIDashboard` is a CSS-grid–based layout host for building " +
          "data dashboards. It renders projected `<ui-dashboard-panel>` " +
          "children in a responsive (or fixed-column) grid.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        DashboardDefaultDemo,
        DashboardAutoDemo,
        DashboardRestoreDemo,
        DashboardSpanningDemo,
        DashboardNotificationDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIDashboard>;

// ── Stories ──────────────────────────────────────────────────────

/**
 * **Default** — A 3-column fixed dashboard with KPI cards, charts,
 * activity feed, and task list. Panels span multiple columns and
 * support collapse.
 */
export const Default: Story = {
  render: () => ({ template: `<ui-dashboard-default-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-dashboard [columns]="3" [gap]="16">
  <ui-dashboard-panel [config]="panels[0]">
    <div class="kpi-row">
      <div class="kpi-item">
        <div class="kpi-value">$42.5k</div>
        <div class="kpi-label">Revenue</div>
      </div>
      <div class="kpi-item">
        <div class="kpi-value">1,284</div>
        <div class="kpi-label">Orders</div>
      </div>
    </div>
  </ui-dashboard-panel>

  <ui-dashboard-panel [config]="panels[1]">
    <my-chart-widget />
  </ui-dashboard-panel>

  <ui-dashboard-panel [config]="panels[2]">
    <ul class="activity-list">
      <li>Alice deployed v2.4.1</li>
      <li>Bob merged PR #312</li>
    </ul>
  </ui-dashboard-panel>
</ui-dashboard>

// ── TypeScript ────────────────────────────────────────────────
import {
  UIDashboard, UIDashboardPanel,
  DashboardPanelConfig,
} from '@theredhead/ui-blocks';

export class MyDashboard {
  readonly panels: DashboardPanelConfig[] = [
    {
      id: 'kpi',
      title: 'KPI Overview',
      placement: { colSpan: 2 },
      collapsible: true,
    },
    { id: 'revenue', title: 'Revenue', collapsible: true },
    { id: 'activity', title: 'Activity Feed' },
  ];
}

// ── SCSS ──────────────────────────────────────────────────────
.kpi-row {
  display: flex;
  gap: 2rem;
  padding: 1rem;
}
.kpi-item { text-align: center; }
.kpi-value { font-size: 1.8rem; font-weight: 700; }
.kpi-label { font-size: 0.75rem; opacity: 0.55; }
.activity-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.activity-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid color-mix(in srgb, currentColor 15%, transparent);
  font-size: 0.8rem;
}
`,
        language: "html",
      },
    },
  },
};

/**
 * **Auto-fill responsive** — Uses `columns="auto"` for a fluid
 * layout that adapts to the available width. Resize the viewport
 * to see panels reflow.
 */
export const AutoFill: Story = {
  render: () => ({ template: `<ui-dashboard-auto-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-dashboard columns="auto" [gap]="20" [minColumnWidth]="240">
  @for (panel of panels; track panel.id) {
    <ui-dashboard-panel
      [config]="panel"
    >
      <my-widget [data]="panel" />
    </ui-dashboard-panel>
  }
</ui-dashboard>

// ── TypeScript ────────────────────────────────────────────────
import {
  UIDashboard, UIDashboardPanel,
  DashboardPanelConfig,
} from '@theredhead/ui-blocks';

export class MyDashboard {
  // columns="auto" uses CSS auto-fill with minColumnWidth.
  // Panels reflow automatically as the viewport resizes.
  readonly panels: DashboardPanelConfig[] = [
    { id: 'a', title: 'Panel A', collapsible: true, removable: true },
    { id: 'b', title: 'Panel B', collapsible: true, removable: true },
    { id: 'c', title: 'Panel C', collapsible: true, removable: true },
  ];
}
`,
        language: "html",
      },
    },
  },
};

/**
 * **Removable with restore** — All panels are removable. Click the
 * ✕ button to hide a panel, then use "Restore all panels" to bring
 * them back.
 */
export const RemovableWithRestore: Story = {
  render: () => ({ template: `<ui-dashboard-restore-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──────────────────────────────────────────────────────
<button (click)="dashboard().restoreAll()">
  Restore all panels
</button>

<ui-dashboard
  [columns]="3"
  [gap]="16"
  (panelRemoved)="onRemoved($event)"
>
  @for (cfg of configs; track cfg.id) {
    <ui-dashboard-panel [config]="cfg">
      <p>{{ cfg.title }} content</p>
    </ui-dashboard-panel>
  }
</ui-dashboard>

@if (lastRemoved()) {
  <p>Last removed: <strong>{{ lastRemoved() }}</strong></p>
}

// ── TypeScript ────────────────────────────────────────────────
import { signal, viewChild } from '@angular/core';
import {
  UIDashboard, UIDashboardPanel,
  DashboardPanelConfig,
} from '@theredhead/ui-blocks';

export class MyDashboard {
  readonly dashboard = viewChild.required(UIDashboard);
  readonly lastRemoved = signal<string | null>(null);

  readonly configs: DashboardPanelConfig[] = [
    { id: 'a', title: 'Panel A', removable: true, collapsible: true },
    { id: 'b', title: 'Panel B', removable: true, collapsible: true },
    { id: 'c', title: 'Panel C', removable: true, collapsible: true },
  ];

  onRemoved(id: string): void {
    this.lastRemoved.set(id);
  }
}
`,
        language: "html",
      },
    },
  },
};

/**
 * **Spanning layout** — Demonstrates `colSpan` and `rowSpan` for
 * complex grid arrangements: full-width hero, tall sidebar, and
 * multi-column rows.
 */
export const SpanningLayout: Story = {
  render: () => ({ template: `<ui-dashboard-spanning-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-dashboard [columns]="4" [gap]="12">
  <!-- Full-width hero spanning all 4 columns -->
  <ui-dashboard-panel
    [config]="{
      id: 'hero',
      title: 'Hero Banner',
      placement: { colSpan: 4 },
    }"
  >
    <div class="hero">Full-width content</div>
  </ui-dashboard-panel>

  <!-- Tall sidebar spanning 2 rows -->
  <ui-dashboard-panel
    [config]="{
      id: 'sidebar',
      title: 'Sidebar',
      placement: { rowSpan: 2 },
    }"
  >
    <div class="sidebar">Tall sidebar</div>
  </ui-dashboard-panel>

  <!-- Wide main area spanning 2 columns -->
  <ui-dashboard-panel
    [config]="{
      id: 'main',
      title: 'Main Content',
      placement: { colSpan: 2 },
    }"
  >
    <div>Wide content area</div>
  </ui-dashboard-panel>

  <!-- Standard single-cell panel -->
  <ui-dashboard-panel
    [config]="{ id: 'aside', title: 'Aside' }"
  >
    <div>Standard cell</div>
  </ui-dashboard-panel>
</ui-dashboard>

// ── TypeScript ────────────────────────────────────────────────
import {
  UIDashboard, UIDashboardPanel,
} from '@theredhead/ui-blocks';

// Use placement.colSpan and placement.rowSpan in the
// DashboardPanelConfig to create complex grid layouts.

// ── SCSS ──────────────────────────────────────────────────────
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}
.sidebar {
  height: 260px;
}
`,
        language: "html",
      },
    },
  },
};

/**
 * **Notifications** — Panels can signal notifications via `notify()`.
 * The accent persists until the panel is expanded or an optional
 * timeout elapses. Collapse a panel, then click "Notify" to see
 * the accent on both the panel and its dock chip.
 */
export const Notifications: Story = {
  render: () => ({ template: `<ui-dashboard-notification-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──────────────────────────────────────────────────────
<ui-dashboard-panel #feedPanel [config]="feedConfig">
  <my-activity-feed />
</ui-dashboard-panel>

<!-- In your component class -->
<button (click)="feedPanel.notify()">Notify (persist)</button>
<button (click)="feedPanel.notify(5000)">Notify (5 s timeout)</button>
<button (click)="feedPanel.clearNotification()">Clear</button>

// ── TypeScript ────────────────────────────────────────────────
import { viewChild } from '@angular/core';
import { UIDashboardPanel } from '@theredhead/ui-blocks';

export class MyDashboard {
  private readonly feedPanel = viewChild.required<UIDashboardPanel>('feedPanel');

  notifyFeed(): void {
    // Persist until expanded
    this.feedPanel().notify();
  }

  notifyFeedWithTimeout(): void {
    // Auto-clear after 5 seconds
    this.feedPanel().notify(5000);
  }
}

// ── SCSS ──────────────────────────────────────────────────────
/* No custom styles needed — notification tokens handle theming. */
`,
      },
    },
  },
};

/**
 * _API Reference_ — features, dashboard inputs, and panel configuration.
 */
export const Documentation: Story = {
  tags: ["!dev"],
  render: () => ({ template: " " }),
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **Grid layout** — fixed column count or responsive `auto-fill`",
          "- **Panel spanning** — `colSpan` and `rowSpan` per panel",
          "- **Collapsible panels** — toggle panel body visibility",
          "- **Removable panels** — hide panels, restore via API",
          "- **Notifications** — `notify(timeoutMs?)` accent on panel + dock chip, auto-clears on expand or timeout",
          "- **Content-agnostic** — project any widget via `<ng-content>`",
          "- **Dark-mode ready** — three-tier CSS custom property theming",
          "- **Accessible** — `role=region`, `aria-label`, `aria-expanded`",
          "",
          "## Inputs (UIDashboard)",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `columns` | `number \\| 'auto'` | `'auto'` | Grid column count |",
          "| `gap` | `number` | `16` | Gap between cells (px) |",
          "| `minColumnWidth` | `number` | `280` | Min column width for auto mode (px) |",
          '| `ariaLabel` | `string` | `"Dashboard"` | Accessible region label |',
          "",
          "## Inputs (UIDashboardPanel)",
          "",
          "| Input | Type | Description |",
          "|-------|------|-------------|",
          "| `config` | `DashboardPanelConfig` | Panel id, title, placement, flags |",
          "",
          "## Panel methods",
          "",
          "| Method | Description |",
          "|--------|-------------|",
          "| `notify(timeoutMs?: number)` | Activates notification accent. Clears on expand or after `timeoutMs` (0 = persist). |",
          "| `clearNotification()` | Manually clears the notification accent. |",
        ].join("\n"),
      },
      source: { code: " " },
    },
  },
};

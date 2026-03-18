import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
} from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { UIDashboard } from "./dashboard.component";
import { UIDashboardPanel } from "./dashboard-panel.component";
import type { DashboardPanelConfig } from "./dashboard.types";
import { UIIcon, UIIcons } from "@theredhead/ui-kit";

// ── Shared fixtures ──────────────────────────────────────────────

const SAMPLE_PANELS: DashboardPanelConfig[] = [
  {
    id: "kpi",
    title: "KPI Overview",
    placement: { colSpan: 2 },
    collapsible: true,
  },
  { id: "revenue", title: "Revenue", collapsible: true },
  { id: "users", title: "Active Users" },
  {
    id: "feed",
    title: "Activity Feed",
    placement: { colSpan: 2 },
    collapsible: true,
    removable: true,
  },
  {
    id: "tasks",
    title: "Tasks",
    collapsible: true,
    removable: true,
  },
];

// ── Demo: Default (3-column fixed) ───────────────────────────────

@Component({
  selector: "ui-dashboard-default-demo",
  standalone: true,
  imports: [UIDashboard, UIDashboardPanel, UIIcon],
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
      }
      .demo-kpi-item {
        text-align: center;
      }
      .demo-kpi-value {
        font-size: 1.8rem;
        font-weight: 700;
      }
      .demo-kpi-label {
        font-size: 0.75rem;
        opacity: 0.55;
        margin-top: 0.25rem;
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
    <ui-dashboard [columns]="3" [gap]="16">
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
        <div class="demo-chart-placeholder">
          <ui-icon [svg]="icons.Charts.ChartBar" [size]="16" /> Revenue chart
          goes here
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
  public readonly panels = SAMPLE_PANELS;
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

// ── Meta ─────────────────────────────────────────────────────────

const meta: Meta<UIDashboard> = {
  title: "@theredhead/UI Blocks/Dashboard",
  component: UIDashboard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UIDashboard` is a CSS-grid–based layout host for building",
          "data dashboards. It renders projected `<ui-dashboard-panel>`",
          "children in a responsive (or fixed-column) grid.",
          "",
          "## Key Features",
          "",
          "- **Grid layout** — fixed column count or responsive `auto-fill`",
          "- **Panel spanning** — `colSpan` and `rowSpan` per panel",
          "- **Collapsible panels** — toggle panel body visibility",
          "- **Removable panels** — hide panels, restore via API",
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
        ].join("\n"),
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
};

/**
 * **Auto-fill responsive** — Uses `columns="auto"` for a fluid
 * layout that adapts to the available width. Resize the viewport
 * to see panels reflow.
 */
export const AutoFill: Story = {
  render: () => ({ template: `<ui-dashboard-auto-demo />` }),
};

/**
 * **Removable with restore** — All panels are removable. Click the
 * ✕ button to hide a panel, then use "Restore all panels" to bring
 * them back.
 */
export const RemovableWithRestore: Story = {
  render: () => ({ template: `<ui-dashboard-restore-demo />` }),
};

/**
 * **Spanning layout** — Demonstrates `colSpan` and `rowSpan` for
 * complex grid arrangements: full-width hero, tall sidebar, and
 * multi-column rows.
 */
export const SpanningLayout: Story = {
  render: () => ({ template: `<ui-dashboard-spanning-demo />` }),
};

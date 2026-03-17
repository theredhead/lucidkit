import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { LoggerFactory } from "@theredhead/foundation";
import type { DashboardPanelConfig } from "./dashboard.types";

/**
 * A single panel inside a {@link UIDashboard}.
 *
 * The panel renders a header bar (title + optional collapse / remove
 * controls) and projects arbitrary content via `<ng-content>`.
 *
 * @example
 * ```html
 * <ui-dashboard-panel [config]="{ id: 'sales', title: 'Sales KPI', collapsible: true }">
 *   <p>Revenue chart goes here</p>
 * </ui-dashboard-panel>
 * ```
 */
@Component({
  selector: "ui-dashboard-panel",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./dashboard-panel.component.html",
  styleUrl: "./dashboard-panel.component.scss",
  host: {
    class: "ui-dashboard-panel",
    "[class.ui-dashboard-panel--collapsed]": "collapsed()",
    "[class.ui-dashboard-panel--removed]": "removed()",
    "[style.grid-column]": "gridColumn()",
    "[style.grid-row]": "gridRow()",
    "[attr.data-panel-id]": "config().id",
  },
})
export class UIDashboardPanel {
  // ── Inputs ──────────────────────────────────────────────────────

  /** Panel configuration (id, title, grid placement, flags). */
  public readonly config = input.required<DashboardPanelConfig>();

  // ── Outputs ─────────────────────────────────────────────────────

  /** Emitted when the user removes (hides) this panel. */
  public readonly panelRemoved = output<string>();

  /** Emitted when the collapsed state changes. */
  public readonly collapsedChange = output<boolean>();

  // ── Computed ────────────────────────────────────────────────────

  /** CSS `grid-column` value derived from placement config. */
  protected readonly gridColumn = computed(() => {
    const span = this.config().placement?.colSpan ?? 1;
    return span > 1 ? `span ${span}` : undefined;
  });

  /** CSS `grid-row` value derived from placement config. */
  protected readonly gridRow = computed(() => {
    const span = this.config().placement?.rowSpan ?? 1;
    return span > 1 ? `span ${span}` : undefined;
  });

  /** Whether the panel header shows a collapse toggle. */
  protected readonly isCollapsible = computed(
    () => this.config().collapsible === true,
  );

  /** Whether the panel header shows a remove button. */
  protected readonly isRemovable = computed(
    () => this.config().removable === true,
  );

  // ── Public fields ───────────────────────────────────────────────

  /** Whether the panel body is currently collapsed. */
  public readonly collapsed = signal(false);

  /** Whether the panel has been removed (hidden) by the user. */
  public readonly removed = signal(false);

  // ── Private fields ──────────────────────────────────────────────

  private readonly log = inject(LoggerFactory).createLogger("UIDashboardPanel");

  // ── Public methods ──────────────────────────────────────────────

  /** Toggle the collapsed state. */
  public toggleCollapse(): void {
    if (!this.isCollapsible()) return;
    this.collapsed.update((v) => !v);
    this.collapsedChange.emit(this.collapsed());
    this.log.log("Panel collapse toggled", [
      this.config().id,
      this.collapsed(),
    ]);
  }

  /** Remove (hide) the panel. */
  public remove(): void {
    if (!this.isRemovable()) return;
    this.removed.set(true);
    this.panelRemoved.emit(this.config().id);
    this.log.log("Panel removed", [this.config().id]);
  }

  /** Restore a previously removed panel. */
  public restore(): void {
    this.removed.set(false);
    this.log.log("Panel restored", [this.config().id]);
  }
}

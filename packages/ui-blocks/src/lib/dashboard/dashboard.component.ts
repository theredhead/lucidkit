import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  untracked,
} from "@angular/core";
import { LoggerFactory } from "@theredhead/foundation";
import { UIDashboardPanel } from "./dashboard-panel.component";
import type { DashboardColumns } from "./dashboard.types";

/**
 * Dashboard host component.
 *
 * Lays out projected {@link UIDashboardPanel} children on a CSS grid.
 * The grid column count is configurable via the `columns` input — either
 * a fixed number or `'auto'` for responsive auto-fill.
 *
 * Panels declare their own grid span via their `config.placement`
 * property. The host is intentionally *content-agnostic*: it provides
 * the grid shell and panel management (collapse, remove, restore)
 * while consumers project whatever widgets they need.
 *
 * @example
 * ```html
 * <ui-dashboard [columns]="3" [gap]="16">
 *   <ui-dashboard-panel [config]="{ id: 'kpi', title: 'KPI', placement: { colSpan: 2 } }">
 *     <my-kpi-widget />
 *   </ui-dashboard-panel>
 *
 *   <ui-dashboard-panel [config]="{ id: 'chart', title: 'Revenue' }">
 *     <my-chart />
 *   </ui-dashboard-panel>
 *
 *   <ui-dashboard-panel [config]="{ id: 'feed', title: 'Activity', placement: { colSpan: 3 } }">
 *     <my-activity-feed />
 *   </ui-dashboard-panel>
 * </ui-dashboard>
 * ```
 */
@Component({
  selector: "ui-dashboard",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
  host: {
    class: "ui-dashboard",
  },
})
export class UIDashboard {
  // ── Inputs ──────────────────────────────────────────────────────

  /**
   * Number of grid columns.
   *
   * - A number (e.g. `3`) creates a fixed column layout.
   * - `'auto'` uses responsive `auto-fill` with `minmax(280px, 1fr)`.
   *
   * Defaults to `'auto'`.
   */
  public readonly columns = input<DashboardColumns>("auto");

  /**
   * Gap between grid cells in pixels.
   * Defaults to `16`.
   */
  public readonly gap = input<number>(16);

  /**
   * Minimum column width in pixels (only used when `columns` is `'auto'`).
   * Defaults to `280`.
   */
  public readonly minColumnWidth = input<number>(280);

  /** Accessible label for the dashboard region. */
  public readonly ariaLabel = input<string>("Dashboard");

  // ── Outputs ─────────────────────────────────────────────────────

  /** Emitted when any panel is removed by the user. */
  public readonly panelRemoved = output<string>();

  // ── Content queries ─────────────────────────────────────────────

  /** All projected dashboard panels. */
  public readonly panels = contentChildren(UIDashboardPanel);

  // ── Computed ────────────────────────────────────────────────────

  /** CSS value for `grid-template-columns`. */
  protected readonly gridTemplateColumns = computed(() => {
    const cols = this.columns();
    if (cols === "auto") {
      return `repeat(auto-fill, minmax(${this.minColumnWidth()}px, 1fr))`;
    }
    return `repeat(${cols}, 1fr)`;
  });

  /** CSS value for `gap`. */
  protected readonly gridGap = computed(() => `${this.gap()}px`);

  /** Panels that have been removed by the user. */
  public readonly removedPanelIds = computed(() =>
    this.panels()
      .filter((p) => p.removed())
      .map((p) => p.config().id),
  );

  // ── Private fields ──────────────────────────────────────────────

  private readonly log = inject(LoggerFactory).createLogger("UIDashboard");
  private readonly destroyRef = inject(DestroyRef);

  /** Subscriptions to panel `panelRemoved` outputs. */
  private panelSubs: (() => void)[] = [];

  // ── Constructor ─────────────────────────────────────────────────

  public constructor() {
    // Whenever the projected panels change, subscribe to their
    // panelRemoved outputs so the host can re-emit them.
    effect(() => {
      const panels = this.panels();

      untracked(() => {
        // Tear down previous subscriptions
        for (const unsub of this.panelSubs) {
          unsub();
        }
        this.panelSubs = [];

        for (const panel of panels) {
          const sub = panel.panelRemoved.subscribe((id) => {
            this.panelRemoved.emit(id);
          });
          this.panelSubs.push(() => sub.unsubscribe());
        }
      });
    });

    // Clean up on destroy
    this.destroyRef.onDestroy(() => {
      for (const unsub of this.panelSubs) {
        unsub();
      }
      this.panelSubs = [];
    });
  }

  // ── Public methods ──────────────────────────────────────────────

  /**
   * Restore a previously removed panel by its id.
   *
   * @param panelId - The `config.id` of the panel to restore.
   * @returns `true` if the panel was found and restored.
   */
  public restorePanel(panelId: string): boolean {
    const panel = this.panels().find((p) => p.config().id === panelId);
    if (panel) {
      panel.restore();
      this.log.log("Panel restored via host", [panelId]);
      return true;
    }
    return false;
  }

  /**
   * Restore all removed panels.
   */
  public restoreAll(): void {
    for (const panel of this.panels()) {
      if (panel.removed()) {
        panel.restore();
      }
    }
    this.log.log("All panels restored");
  }
}

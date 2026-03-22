import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  untracked,
} from "@angular/core";
import { LoggerFactory } from "@theredhead/foundation";
import { UIDashboardPanel } from "./dashboard-panel.component";
import { UIIcon, UIIcons } from "@theredhead/ui-kit";
import type {
  DashboardColumns,
  DashboardDockPosition,
} from "./dashboard.types";

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
  imports: [UIIcon],
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

  /**
   * Where the collapsed-panel dock is rendered.
   * Defaults to `'bottom'`.
   */
  public readonly dockPosition = input<DashboardDockPosition>("bottom");

  /**
   * Whether dock chips show the panel title alongside the icon.
   * Defaults to `false` (icon-only with title in tooltip).
   */
  public readonly dockShowTitles = input<boolean>(false);

  /**
   * Default SVG icon for panels that don't declare their own `icon`.
   * Defaults to the Lucide `LayoutDashboard` icon.
   */
  public readonly defaultDockIcon = input<string>(
    UIIcons.Lucide.Layout.LayoutDashboard,
  );

  /**
   * SVG icon for the optional dock menu button.
   * When set, a menu button is rendered at the leading edge of the dock.
   * When omitted (`undefined`), no menu button is shown.
   */
  public readonly dockMenuIcon = input<string | undefined>(undefined);

  // ── Outputs ─────────────────────────────────────────────────────

  /** Emitted when any panel is removed by the user. */
  public readonly panelRemoved = output<string>();

  /** Emitted when the dock menu button is clicked. */
  public readonly dockMenuClicked = output<void>();

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

  /** Panels that are currently collapsed (shown in the dock). */
  public readonly collapsedPanels = computed(() =>
    this.panels().filter((p) => p.collapsed() && !p.removed()),
  );

  // ── Public fields ───────────────────────────────────────────────

  /** Whether the dock panel-picker menu is open. */
  public readonly dockMenuOpen = signal(false);

  // ── Protected fields ────────────────────────────────────────────

  // ── Private fields ──────────────────────────────────────────────

  private readonly log = inject(LoggerFactory).createLogger("UIDashboard");
  private readonly destroyRef = inject(DestroyRef);
  private readonly elRef = inject(ElementRef<HTMLElement>);

  /** Subscriptions to panel `panelRemoved` outputs. */
  private panelSubs: (() => void)[] = [];

  // ── Constructor ─────────────────────────────────────────────────

  public constructor() {
    // Close dock menu on outside click
    const onDocClick = (e: Event) => {
      if (
        this.dockMenuOpen() &&
        !this.elRef.nativeElement
          .querySelector(".dock-menu-anchor")
          ?.contains(e.target as Node)
      ) {
        this.dockMenuOpen.set(false);
      }
    };
    document.addEventListener("pointerdown", onDocClick);
    this.destroyRef.onDestroy(() =>
      document.removeEventListener("pointerdown", onDocClick),
    );

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
      this.log.debug("Panel restored via host", [panelId]);
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
    this.log.debug("All panels restored");
  }

  /**
   * Resolve the icon SVG for a panel, falling back to the default.
   *
   * @param panelIcon - The panel's own icon, if any.
   * @returns SVG inner-content string.
   */
  protected resolveIcon(panelIcon: string | undefined): string {
    return panelIcon ?? this.defaultDockIcon();
  }

  /** Toggle the dock panel-picker menu. */
  public toggleDockMenu(): void {
    this.dockMenuOpen.update((v) => !v);
    this.dockMenuClicked.emit();
  }

  /** Close the dock panel-picker menu. */
  public closeDockMenu(): void {
    this.dockMenuOpen.set(false);
  }

  /**
   * Toggle a panel's collapsed state from the menu.
   * If removed, restore it first.
   */
  protected menuTogglePanel(panel: UIDashboardPanel): void {
    if (panel.removed()) {
      panel.restore();
    } else if (panel.collapsed()) {
      panel.toggleCollapse();
    } else if (panel.config().collapsible) {
      panel.toggleCollapse();
    }
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  inject,
  InjectionToken,
  input,
  makeEnvironmentProviders,
  signal,
} from "@angular/core";
import type { EnvironmentProviders } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import { UIIcon } from "../icon/icon.component";
import { UITab } from "./tab.component";
import { TAB_HEADER_ITEM, type TabAlignment } from "./tab-header-item";
import { UITabSeparator } from "./tab-separator.component";
import { UITabSpacer } from "./tab-spacer.component";

/** Position of the tab headers relative to the content panel. */
export type TabPosition = "top" | "bottom" | "left" | "right";

/** Visual style of the content panel. */
export type TabPanelStyle = "flat" | "outline" | "raised";

/** Injectable defaults for UITabGroup. */
export interface TabGroupDefaults {
  /** Default tab header position. */
  readonly tabPosition: TabPosition;
  /** Default content panel style. */
  readonly panelStyle: TabPanelStyle;
}

/** Default configuration when no provider is registered. */
export const DEFAULT_TAB_GROUP_DEFAULTS: TabGroupDefaults = {
  tabPosition: "top",
  panelStyle: "raised",
};

/** Injection token for UITabGroup default configuration. */
export const TAB_GROUP_DEFAULTS = new InjectionToken<TabGroupDefaults>(
  "TAB_GROUP_DEFAULTS",
  {
    providedIn: "root",
    factory: () => DEFAULT_TAB_GROUP_DEFAULTS,
  },
);

/**
 * Provide custom defaults for all UITabGroup instances.
 *
 * @example
 * ```ts
 * // app.config.ts
 * export const appConfig = {
 *   providers: [
 *     provideTabDefaults({ tabPosition: 'left', panelStyle: 'flat' }),
 *   ],
 * };
 * ```
 */
export function provideTabDefaults(
  defaults: Partial<TabGroupDefaults>,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: TAB_GROUP_DEFAULTS,
      useValue: { ...DEFAULT_TAB_GROUP_DEFAULTS, ...defaults },
    },
  ]);
}

/**
 * A tabbed container that manages tab headers and lazy-renders
 * the active tab's content panel.
 *
 * @example
 * ```html
 * <ui-tab-group>
 *   <ui-tab label="Overview">Overview content</ui-tab>
 *   <ui-tab label="Details">Details content</ui-tab>
 *   <ui-tab label="History" [disabled]="true">Disabled</ui-tab>
 * </ui-tab-group>
 * ```
 */
@Component({
  selector: "ui-tab-group",
  standalone: true,
  imports: [NgTemplateOutlet, UIIcon],
  templateUrl: "./tab-group.component.html",
  styleUrl: "./tab-group.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-tab-group",
    "[class.ui-tab-group--disabled]": "disabled()",
    "[class.ui-tab-group--top]": "resolvedTabPosition() === 'top'",
    "[class.ui-tab-group--bottom]": "resolvedTabPosition() === 'bottom'",
    "[class.ui-tab-group--left]": "resolvedTabPosition() === 'left'",
    "[class.ui-tab-group--right]": "resolvedTabPosition() === 'right'",
    "[class.ui-tab-group--flat]": "resolvedPanelStyle() === 'flat'",
    "[class.ui-tab-group--outline]": "resolvedPanelStyle() === 'outline'",
    "[class.ui-tab-group--raised]": "resolvedPanelStyle() === 'raised'",
    "[class.ui-tab-group--align-start]": "tabAlign() === 'start'",
    "[class.ui-tab-group--align-center]": "tabAlign() === 'center'",
    "[class.ui-tab-group--align-end]": "tabAlign() === 'end'",
  },
})
export class UITabGroup {
  /** Position of the tab headers: top, bottom, left, or right. */
  public readonly tabPosition = input<TabPosition | undefined>(undefined);

  /** Visual style of the content panel: flat, outline, or raised. */
  public readonly panelStyle = input<TabPanelStyle | undefined>(undefined);

  /** Alignment of the tab headers within their strip. */
  public readonly tabAlign = input<TabAlignment>("start");

  /** Whether the tab group is disabled. */
  public readonly disabled = input<boolean>(false);

  /** Index of the initially selected tab. */
  public readonly selectedIndex = input(0);

  /** Accessible label for the tab list. */
  public readonly ariaLabel = input<string | undefined>(undefined);

  /** @internal — projected tab children. */
  public readonly tabs = contentChildren(UITab);

  /** @internal — all header items (tabs + separators + spacers) in DOM order. */
  public readonly headerItems = contentChildren(TAB_HEADER_ITEM);

  /** Resolved tab position (input wins, then injected default). */
  public readonly resolvedTabPosition = computed(
    () => this.tabPosition() ?? this.defaults.tabPosition,
  );

  /** Resolved panel style (input wins, then injected default). */
  public readonly resolvedPanelStyle = computed(
    () => this.panelStyle() ?? this.defaults.panelStyle,
  );

  /** The currently active tab index. */
  public readonly activeIndex = signal(0);

  /** The currently active tab. */
  protected readonly activeTab = computed(() => {
    const tabs = this.tabs();
    const idx = this.activeIndex();
    return tabs[idx] ?? tabs[0];
  });

  /** @internal — type guard helper for the template. */
  protected isTab(item: unknown): item is UITab {
    return item instanceof UITab;
  }

  /** @internal — type guard helper for the template. */
  protected isSeparator(item: unknown): item is UITabSeparator {
    return item instanceof UITabSeparator;
  }

  /** @internal — type guard helper for the template. */
  protected isSpacer(item: unknown): item is UITabSpacer {
    return item instanceof UITabSpacer;
  }

  /** @internal — get the tab index within the tabs array for a header item. */
  protected tabIndex(tab: UITab): number {
    return this.tabs().indexOf(tab);
  }

  private readonly defaults = inject(TAB_GROUP_DEFAULTS);

  public constructor() {
    // Sync initial selectedIndex input to activeIndex
    effect(() => {
      const idx = this.selectedIndex();
      if (idx >= 0) {
        this.activeIndex.set(idx);
      }
    });
  }

  /** Select a tab by index. */
  public selectTab(index: number): void {
    const tabs = this.tabs();
    if (index < 0 || index >= tabs.length) {
      return;
    }
    const tab = tabs[index];
    if (tab.disabled()) {
      return;
    }
    this.activeIndex.set(index);
  }

  /** @internal — Handle keyboard navigation in the tab list. */
  protected onTabKeyDown(event: KeyboardEvent, currentIndex: number): void {
    const tabs = this.tabs();
    let nextIndex: number;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        nextIndex = this.findNextEnabledTab(currentIndex, 1, tabs.length);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        nextIndex = this.findNextEnabledTab(currentIndex, -1, tabs.length);
        break;
      case "Home":
        event.preventDefault();
        nextIndex = this.findNextEnabledTab(-1, 1, tabs.length);
        break;
      case "End":
        event.preventDefault();
        nextIndex = this.findNextEnabledTab(tabs.length, -1, tabs.length);
        break;
      default:
        return;
    }

    if (nextIndex !== currentIndex) {
      this.selectTab(nextIndex);
      // Focus the new tab header
      const tabHeaders =
        (event.target as HTMLElement)
          .closest("[role='tablist']")
          ?.querySelectorAll<HTMLElement>("[role='tab']") ?? [];
      tabHeaders[nextIndex]?.focus();
    }
  }

  /** Find next enabled tab in a direction. */
  private findNextEnabledTab(
    fromIndex: number,
    direction: 1 | -1,
    length: number,
  ): number {
    const tabs = this.tabs();
    let idx = fromIndex + direction;
    while (idx >= 0 && idx < length) {
      if (!tabs[idx].disabled()) {
        return idx;
      }
      idx += direction;
    }
    return fromIndex;
  }
}

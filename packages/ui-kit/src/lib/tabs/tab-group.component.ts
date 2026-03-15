import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  signal,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import { UITab } from "./tab.component";

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
  imports: [NgTemplateOutlet],
  templateUrl: "./tab-group.component.html",
  styleUrl: "./tab-group.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-tab-group",
  },
})
export class UITabGroup {
  /** Index of the initially selected tab. */
  public readonly selectedIndex = input(0);

  /** Accessible label for the tab list. */
  public readonly ariaLabel = input<string | undefined>(undefined);

  /** @internal — projected tab children. */
  public readonly tabs = contentChildren(UITab);

  /** The currently active tab index. */
  public readonly activeIndex = signal(0);

  /** The currently active tab. */
  protected readonly activeTab = computed(() => {
    const tabs = this.tabs();
    const idx = this.activeIndex();
    return tabs[idx] ?? tabs[0];
  });

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

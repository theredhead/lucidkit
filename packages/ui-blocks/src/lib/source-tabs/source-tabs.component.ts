import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import { UITab, UITabGroup } from "@theredhead/lucid-kit";

/**
 * A single source pane rendered within {@link UISourceTabs}.
 */
export interface UISourceTab {
  /** Visible tab label. */
  readonly label: string;

  /** Raw code content shown inside the tab panel. */
  readonly code: string;

  /** Optional filename shown above the code block. */
  readonly filename?: string;

  /** Optional language label shown as a small badge. */
  readonly language?: string;
}

/**
 * A themed, tabbed code viewer for examples that need separate panes
 * for markup, TypeScript, styles, or other implementation slices.
 *
 * The component intentionally renders plain escaped code rather than a
 * syntax-highlighting pipeline so it stays light-weight and follows the
 * workspace's existing theme tokens.
 */
@Component({
  selector: "ui-source-tabs",
  standalone: true,
  imports: [UITabGroup, UITab],
  templateUrl: "./source-tabs.component.html",
  styleUrl: "./source-tabs.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-source-tabs",
  },
})
export class UISourceTabs {
  /** Ordered source panes to display. Empty code panes are hidden. */
  public readonly tabs = input<readonly UISourceTab[]>([]);

  /** Accessible label forwarded to the underlying tab group. */
  public readonly ariaLabel = input<string>("Source code tabs");

  /** Message shown when no non-empty panes are available. */
  public readonly emptyMessage = input<string>("No source available.");

  /** @internal */
  protected readonly visibleTabs = computed(() =>
    this.tabs().filter((tab) => tab.code.trim().length > 0),
  );

  /** @internal */
  protected trackTab(index: number, tab: UISourceTab): string {
    return `${tab.label}:${tab.language ?? ""}:${index}`;
  }
}

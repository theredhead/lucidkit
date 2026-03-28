import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  TemplateRef,
  viewChild,
} from "@angular/core";
import { LoggerFactory, UISurface } from "@theredhead/foundation";

import { TAB_HEADER_ITEM } from "./tab-header-item";

/**
 * A single tab panel within a `<ui-tab-group>`.
 *
 * Content is lazily rendered — only the active tab's content
 * is stamped into the DOM.
 *
 * At least one of `label` or `icon` must be provided. When only
 * an `icon` is set, provide an `ariaLabel` so the tab remains
 * accessible to screen readers.
 *
 * @example
 * ```html
 * <ui-tab label="Settings" [icon]="UIIcons.Lucide.Actions.Settings">
 *   <p>Settings content here</p>
 * </ui-tab>
 *
 * <!-- Icon-only tab (ariaLabel required for accessibility) -->
 * <ui-tab [icon]="UIIcons.Lucide.Actions.Settings" ariaLabel="Settings">
 *   <p>Settings content here</p>
 * </ui-tab>
 * ```
 */
@Component({
  selector: "ui-tab",
  standalone: true,
  templateUrl: "./tab.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  providers: [{ provide: TAB_HEADER_ITEM, useExisting: UITab }],
})
export class UITab {
  /** @internal — discriminant for the tab header item union. */
  public readonly kind = "tab" as const;
  /** The text label displayed in the tab header. Optional when `icon` is set. */
  public readonly label = input<string | undefined>(undefined);

  /** Optional SVG icon content displayed before the label. */
  public readonly icon = input<string | undefined>(undefined);

  /**
   * Accessible label for the tab button. Required when no visible
   * `label` is provided (icon-only tabs).
   */
  public readonly ariaLabel = input<string | undefined>(undefined);

  /** Whether this tab is disabled. */
  public readonly disabled = input(false);

  /** @internal — content template reference for lazy rendering. */
  public readonly contentTemplate =
    viewChild.required<TemplateRef<unknown>>("content");

  /**
   * Resolved accessible label: explicit `ariaLabel` wins,
   * then falls back to `label`.
   * @internal
   */
  public readonly resolvedAriaLabel = computed(
    () => this.ariaLabel() ?? this.label(),
  );

  private readonly log = inject(LoggerFactory).createLogger("UITab");

  public constructor() {
    // Validate that at least one of label or icon is set
    const label = this.label;
    const icon = this.icon;
    const ariaLabel = this.ariaLabel;
    const log = this.log;
    queueMicrotask(() => {
      if (!label() && !icon()) {
        log.warn("UITab requires at least one of [label] or [icon]");
      }
      if (!label() && icon() && !ariaLabel()) {
        log.warn(
          "Icon-only UITab should have an [ariaLabel] for accessibility",
        );
      }
    });
  }
}

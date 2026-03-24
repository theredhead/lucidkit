import { ChangeDetectionStrategy, Component } from "@angular/core";

import { TAB_HEADER_ITEM } from "./tab-header-item";

/**
 * A flexible spacer in the `<ui-tab-group>` header that pushes
 * surrounding tabs apart by consuming all available space.
 *
 * @example
 * ```html
 * <ui-tab-group>
 *   <ui-tab label="Home">…</ui-tab>
 *   <ui-tab-spacer />
 *   <ui-tab label="Settings">…</ui-tab>
 * </ui-tab-group>
 * ```
 */
@Component({
  selector: "ui-tab-spacer",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: "",
  providers: [
    { provide: TAB_HEADER_ITEM, useExisting: UITabSpacer },
  ],
  host: {
    class: "ui-tab-spacer",
  },
})
export class UITabSpacer {
  /** @internal — discriminant for the tab header item union. */
  public readonly kind = "spacer" as const;
}

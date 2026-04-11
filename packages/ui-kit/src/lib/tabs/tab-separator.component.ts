import { ChangeDetectionStrategy, Component } from "@angular/core";

import { TAB_HEADER_ITEM } from "./tab-header-item";
import { UISurface } from '@theredhead/lucid-foundation';

/**
 * A small visual gap between tabs in a `<ui-tab-group>` header.
 *
 * Place between `<ui-tab>` elements to add a fixed gap.
 *
 * @example
 * ```html
 * <ui-tab-group>
 *   <ui-tab label="File">…</ui-tab>
 *   <ui-tab label="Edit">…</ui-tab>
 *   <ui-tab-separator />
 *   <ui-tab label="Help">…</ui-tab>
 * </ui-tab-group>
 * ```
 */
@Component({
  selector: "ui-tab-separator",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  template: "",
  providers: [{ provide: TAB_HEADER_ITEM, useExisting: UITabSeparator }],
  host: {
    class: "ui-tab-separator",
  },
})
export class UITabSeparator {
  /** @internal — discriminant for the tab header item union. */
  public readonly kind = "separator" as const;
}

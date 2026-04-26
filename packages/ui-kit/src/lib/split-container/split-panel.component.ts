import {
  ChangeDetectionStrategy,
  Component,
  input,
  TemplateRef,
  viewChild,
} from "@angular/core";

import type { SplitPanelConstraints } from "./split-container.types";

/**
 * A single panel inside a `<ui-split-container>`. Project any content
 * as child nodes — the container handles sizing and divider rendering.
 *
 * ### Basic usage
 * ```html
 * <ui-split-container>
 *   <ui-split-panel>Left</ui-split-panel>
 *   <ui-split-panel>Right</ui-split-panel>
 * </ui-split-container>
 * ```
 *
 * ### With size constraints
 * ```html
 * <ui-split-container>
 *   <ui-split-panel [min]="150" [max]="400">Sidebar</ui-split-panel>
 *   <ui-split-panel [min]="200">Main</ui-split-panel>
 * </ui-split-container>
 * ```
 */
@Component({
  selector: "ui-split-panel",
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: "display: none",
  },
  template: `<ng-template><ng-content /></ng-template>`,
})
export class UISplitPanel {

  /**
   * Minimum panel size in pixels.
   * Forwarded to the container's constraint logic.
   */
  public readonly min = input<number | undefined>(undefined);

  /**
   * Maximum panel size in pixels.
   * Forwarded to the container's constraint logic.
   */
  public readonly max = input<number | undefined>(undefined);

  /**
   * Template reference for this panel's projected content.
   * Used by the container to render the panel via `ngTemplateOutlet`.
   * @internal
   */
  public readonly tpl = viewChild.required(TemplateRef);

  /**
   * Returns the constraints object for this panel.
   * @internal
   */
  public get constraints(): SplitPanelConstraints {
    return { min: this.min(), max: this.max() };
  }
}

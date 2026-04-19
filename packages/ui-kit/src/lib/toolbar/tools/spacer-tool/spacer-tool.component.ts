import { ChangeDetectionStrategy, Component, forwardRef } from "@angular/core";
import { UIToolbarItem } from "../../toolbar-item.directive";

/**
 * A flexible spacer that pushes subsequent toolbar items to the
 * trailing edge.  Renders as an invisible element with
 * `flex: 1 1 auto` so it absorbs all remaining space in the
 * toolbar's flex row.
 *
 * @example
 * ```html
 * <ui-toolbar>
 *   <ui-button-tool id="cut" label="Cut" />
 *   <ui-spacer-tool id="spacer" />
 *   <ui-button-tool id="fullscreen" label="Fullscreen" />
 * </ui-toolbar>
 * ```
 */
@Component({
  selector: "ui-spacer-tool",
  standalone: true,
  providers: [
    { provide: UIToolbarItem, useExisting: forwardRef(() => UISpacerTool) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: "",
  styleUrl: "./spacer-tool.component.scss",
  host: {
    class: "ui-spacer-tool",
    role: "none",
  },
})
export class UISpacerTool extends UIToolbarItem {}

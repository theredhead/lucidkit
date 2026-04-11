import { ChangeDetectionStrategy, Component, forwardRef } from "@angular/core";
import { UIToolbarItem } from "../../toolbar-item.directive";

/**
 * A visual separator between toolbar items. Does not emit any action events.
 *
 * @example
 * ```html
 * <ui-toolbar>
 *   <ui-button-tool id="cut" label="Cut" />
 *   <ui-separator-tool id="sep1" />
 *   <ui-button-tool id="paste" label="Paste" />
 * </ui-toolbar>
 * ```
 */
@Component({
  selector: "ui-separator-tool",
  standalone: true,
  providers: [
    { provide: UIToolbarItem, useExisting: forwardRef(() => UISeparatorTool) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: "",
  styleUrl: "./separator-tool.component.scss",
  host: {
    class: "ui-separator-tool",
    role: "separator",
    "aria-orientation": "vertical",
  },
})
export class UISeparatorTool extends UIToolbarItem {}

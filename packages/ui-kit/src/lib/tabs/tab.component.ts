import {
  ChangeDetectionStrategy,
  Component,
  input,
  TemplateRef,
  viewChild,
} from "@angular/core";

/**
 * A single tab panel within a `<ui-tab-group>`.
 *
 * Content is lazily rendered — only the active tab's content
 * is stamped into the DOM.
 *
 * @example
 * ```html
 * <ui-tab label="Settings">
 *   <p>Settings content here</p>
 * </ui-tab>
 * ```
 */
@Component({
  selector: "ui-tab",
  standalone: true,
  templateUrl: "./tab.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UITab {
  /** The label displayed in the tab header. */
  public readonly label = input.required<string>();

  /** Whether this tab is disabled. */
  public readonly disabled = input(false);

  /** @internal — content template reference for lazy rendering. */
  public readonly contentTemplate =
    viewChild.required<TemplateRef<unknown>>("content");
}

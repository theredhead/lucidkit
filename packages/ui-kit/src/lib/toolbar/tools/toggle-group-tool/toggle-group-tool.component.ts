import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  DestroyRef,
  effect,
  forwardRef,
  inject,
} from "@angular/core";
import { UIToolbarItem } from "../../toolbar-item.directive";

/**
 * A radio-style grouping container for toggle toolbar items.
 *
 * When a child item emits an action, all other children are deactivated
 * via their `deactivate()` method, effectively enforcing single-selection.
 *
 * Re-emits the activated child's `itemAction` event so the parent
 * {@link UIToolbar} receives it seamlessly.
 *
 * @example
 * ```html
 * <ui-toolbar (toolAction)="onAction($event)">
 *   <ui-toggle-group-tool id="alignment">
 *     <ui-toggle-tool id="left" label="Left" />
 *     <ui-toggle-tool id="center" label="Center" />
 *     <ui-toggle-tool id="right" label="Right" />
 *   </ui-toggle-group-tool>
 * </ui-toolbar>
 * ```
 */
@Component({
  selector: "ui-toggle-group-tool",
  standalone: true,
  providers: [
    {
      provide: UIToolbarItem,
      useExisting: forwardRef(() => UIToggleGroupTool),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./toggle-group-tool.component.html",
  styleUrl: "./toggle-group-tool.component.scss",
  host: { class: "ui-toggle-group-tool" },
})
export class UIToggleGroupTool extends UIToolbarItem {

  /**
   * Direct {@link UIToolbarItem} content children of this group.
   * Expected to be {@link UIToggleTool} instances.
   */
  public readonly childItems = contentChildren(UIToolbarItem);

  /** @internal */
  private readonly _childSubs: { unsubscribe(): void }[] = [];

  public constructor() {
    super();
    effect(() => {
      this._childSubs.forEach((s) => s.unsubscribe());
      this._childSubs.length = 0;
      for (const item of this.childItems()) {
        if (!item) continue;
        this._childSubs.push(
          item.itemAction.subscribe((e) => {
            this.childItems().filter(Boolean).forEach((t) => {
              if (t !== item) {
                t.deactivate();
              }
            });
            this.itemAction.emit(e);
          }),
        );
      }
    });
    inject(DestroyRef).onDestroy(() =>
      this._childSubs.forEach((s) => s.unsubscribe()),
    );
  }
}

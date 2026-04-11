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
 * A visual grouping container for toolbar items.
 *
 * Re-emits its direct children's `itemAction` events through its own
 * `itemAction` output, so the parent {@link UIToolbar} receives them
 * seamlessly. The `itemId` and `itemRef` in the re-emitted event
 * refer to the **child** item that was activated.
 *
 * @example
 * ```html
 * <ui-toolbar (toolAction)="onAction($event)">
 *   <ui-button-group-tool id="text-format">
 *     <ui-button-tool id="bold" label="Bold" />
 *     <ui-button-tool id="italic" label="Italic" />
 *   </ui-button-group-tool>
 * </ui-toolbar>
 * ```
 */
@Component({
  selector: "ui-button-group-tool",
  standalone: true,
  providers: [
    {
      provide: UIToolbarItem,
      useExisting: forwardRef(() => UIButtonGroupTool),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./button-group-tool.component.html",
  styleUrl: "./button-group-tool.component.scss",
  host: { class: "ui-button-group-tool" },
})
export class UIButtonGroupTool extends UIToolbarItem {
  /** Direct {@link UIToolbarItem} content children of this group. */
  public readonly childItems = contentChildren(UIToolbarItem);

  /** @internal */
  private readonly _childSubs: { unsubscribe(): void }[] = [];

  public constructor() {
    super();
    effect(() => {
      this._childSubs.forEach((s) => s.unsubscribe());
      this._childSubs.length = 0;
      for (const item of this.childItems()) {
        this._childSubs.push(
          item.itemAction.subscribe((e) => this.itemAction.emit(e)),
        );
      }
    });
    inject(DestroyRef).onDestroy(() =>
      this._childSubs.forEach((s) => s.unsubscribe()),
    );
  }
}

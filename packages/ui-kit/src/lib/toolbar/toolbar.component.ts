import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  DestroyRef,
  effect,
  inject,
  input,
  output,
} from "@angular/core";
import { UI_DEFAULT_SURFACE_TYPE, UISurface } from "@theredhead/lucid-foundation";
import type { ToolActionEvent } from "./toolbar-action";
import { UIToolbarItem } from "./toolbar-item.directive";

/** Layout orientation for {@link UIToolbar}. */
export type ToolbarOrientation = "horizontal" | "vertical";

/**
 * Container component that collects {@link UIToolbarItem} content children
 * and re-emits their `itemAction` events through its own `toolAction` output.
 *
 * Items are discovered via DI token forwarding — each concrete tool
 * component provides `{ provide: UIToolbarItem, useExisting: forwardRef(...) }`.
 *
 * @example
 * ```html
 * <ui-toolbar (toolAction)="onAction($event)">
 *   <ui-button-tool id="save" label="Save" [icon]="UIIcons.Lucide.File.Save" />
 *   <ui-separator-tool id="sep1" />
 *   <ui-toggle-tool id="bold" label="Bold" [(checked)]="isBold" />
 * </ui-toolbar>
 * ```
 */
@Component({
  selector: "ui-toolbar",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "panel" }],
  templateUrl: "./toolbar.component.html",
  styleUrl: "./toolbar.component.scss",
  host: {
    class: "ui-toolbar",
    "[class.vertical]": "orientation() === 'vertical'",
  },
})
export class UIToolbar {
  /** Layout orientation of the toolbar. */
  public readonly orientation = input<ToolbarOrientation>("horizontal");

  /** Emitted when any direct toolbar item fires an action. */
  public readonly toolAction = output<ToolActionEvent>();

  /**
   * All direct {@link UIToolbarItem} content children discovered via DI token.
   * Descendants inside group tools are not included (default `descendants: false`).
   */
  public readonly items = contentChildren(UIToolbarItem);

  /** @internal */
  private readonly _subs: { unsubscribe(): void }[] = [];

  public constructor() {
    effect(() => {
      this._subs.forEach((s) => s.unsubscribe());
      this._subs.length = 0;
      for (const item of this.items()) {
        this._subs.push(
          item.itemAction.subscribe((e) => this.toolAction.emit(e)),
        );
      }
    });
    inject(DestroyRef).onDestroy(() =>
      this._subs.forEach((s) => s.unsubscribe()),
    );
  }
}

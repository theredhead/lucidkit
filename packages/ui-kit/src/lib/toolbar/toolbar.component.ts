import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from "@angular/core";
import {
  UI_DEFAULT_SURFACE_TYPE,
  UISurface,
} from "@theredhead/lucid-foundation";
import { UIIcon } from "../icon/icon.component";
import { UIIcons } from "../icon/lucide-icons.generated";
import type { ToolActionEvent } from "./toolbar-action";
import { UIToolbarItem } from "./toolbar-item.directive";

/** Layout orientation for {@link UIToolbar}. */
export type ToolbarOrientation = "horizontal" | "vertical";

/** Presentation mode for {@link UIToolbar}. */
export type ToolbarDisplayMode = "inline" | "floating-toggle";

/** @internal */
type ToolbarFloatingState =
  | "expanded"
  | "expanding"
  | "collapsing"
  | "collapsed";

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
  imports: [UIIcon, UISurface],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "transparent" }],
  templateUrl: "./toolbar.component.html",
  styleUrl: "./toolbar.component.scss",
  host: {
    class: "ui-toolbar",
    "[class.vertical]": "orientation() === 'vertical'",
    "[class.floating-toggle]": "displayMode() === 'floating-toggle'",
    "[class.collapsed]": "displayMode() === 'floating-toggle' && collapsed()",
    "[class.collapsing]":
      "displayMode() === 'floating-toggle' && floatingState() === 'collapsing'",
    "[class.expanding]":
      "displayMode() === 'floating-toggle' && floatingState() === 'expanding'",
  },
})
export class UIToolbar {

  /** Layout orientation of the toolbar. */
  public readonly orientation = input<ToolbarOrientation>("horizontal");

  /** Visual presentation mode of the toolbar container. */
  public readonly displayMode = input<ToolbarDisplayMode>("inline");

  /** Accessible label applied to the internal toolbar region. */
  public readonly ariaLabel = input<string>("Toolbar");

  /** Whether the toolbar is currently collapsed in floating-toggle mode. */
  public readonly collapsed = model<boolean>(false);

  /** Emitted when any direct toolbar item fires an action. */
  public readonly toolAction = output<ToolActionEvent>();

  /**
   * All direct {@link UIToolbarItem} content children discovered via DI token.
   * Descendants inside group tools are not included (default `descendants: false`).
   */
  public readonly items = contentChildren(UIToolbarItem);

  /** @internal */
  protected readonly isFloatingToggleMode = computed(
    () => this.displayMode() === "floating-toggle",
  );

  /** @internal */
  protected readonly shellSurfaceType = computed(() =>
    this.isFloatingToggleMode() ? "toolbar-floating" : "",
  );

  /** @internal */
  protected readonly floatingState = signal<ToolbarFloatingState>("expanded");

  /** @internal */
  private readonly _subs: { unsubscribe(): void }[] = [];

  /** @internal */
  private _hasSyncedFloatingState = false;

  /** @internal */
  private readonly _toggleIcons = {
    show: UIIcons.Lucide.Layout.PanelTopOpen,
    hide: UIIcons.Lucide.Layout.PanelTopClose,
  } as const;

  public constructor() {
    effect(() => {
      this._subs.forEach((s) => s.unsubscribe());
      this._subs.length = 0;
      for (const item of this.items()) {
        if (!item) continue;
        this._subs.push(
          item.itemAction.subscribe((e) => this.toolAction.emit(e)),
        );
      }
    });

    effect(() => {
      if (!this.isFloatingToggleMode()) {
        this._hasSyncedFloatingState = false;
        this.floatingState.set("expanded");
        return;
      }

      const nextState = this.collapsed() ? "collapsed" : "expanded";

      if (!this._hasSyncedFloatingState) {
        this.floatingState.set(nextState);
        this._hasSyncedFloatingState = true;
        return;
      }

      if (this.collapsed()) {
        if (
          this.floatingState() === "expanded" ||
          this.floatingState() === "expanding"
        ) {
          this.floatingState.set("collapsing");
        }
        return;
      }

      if (
        this.floatingState() === "collapsed" ||
        this.floatingState() === "collapsing"
      ) {
        this.floatingState.set("expanding");
      }
    });

    inject(DestroyRef).onDestroy(() =>
      this._subs.forEach((s) => s.unsubscribe()),
    );
  }

  /** @internal */
  protected getFloatingToggleIcon(): string {
    return this.collapsed() ? this._toggleIcons.show : this._toggleIcons.hide;
  }

  /** @internal */
  protected getFloatingToggleLabel(): string {
    return this.collapsed() ? "Show toolbar" : "Hide toolbar";
  }

  /** @internal */
  protected toggleCollapsed(): void {
    if (!this.isFloatingToggleMode()) {
      return;
    }

    this.collapsed.update((value) => !value);
  }

  /** @internal */
  protected handleShellAnimationEnd(): void {
    if (!this.isFloatingToggleMode()) {
      return;
    }

    if (this.floatingState() === "collapsing") {
      this.floatingState.set("collapsed");
      return;
    }

    if (this.floatingState() === "expanding") {
      this.floatingState.set("expanded");
    }
  }
}

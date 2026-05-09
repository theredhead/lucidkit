import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from "@angular/core";
import { UIIcon } from "../../../icon/icon.component";
import { UIIcons } from "../../../icon/lucide-icons.generated";
import { PopoverService } from "../../../popover/popover.service";
import {
  PopoverRef,
  type UIPopoverContent,
} from "../../../popover/popover.types";
import type {
  DropdownToolDisplayMode,
  DropdownToolItem,
} from "../../toolbar-action";
import { UIToolbarItem } from "../../toolbar-item.directive";

/**
 * Popover panel that renders the items list for {@link UIDropdownTool}.
 *
 * @internal — not intended for direct use.
 */
@Component({
  selector: "ui-dropdown-tool-panel",
  standalone: true,
  imports: [UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }

      /* ── List mode ───────────────────────────────────────── */
      .panel {
        display: flex;
        flex-flow: column nowrap;
        padding: 0.25rem 0;
        min-width: 10rem;
      }
      .item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.4rem 0.75rem;
        font-size: var(--ui-font-body, 0.875rem);
        font-family: var(--ui-font, inherit);
        background: none;
        color: inherit;
        border: none;
        cursor: var(--ui-cursor-click, pointer);
        text-align: left;
        white-space: nowrap;
        width: 100%;
      }
      .item:hover:not(:disabled) {
        background: var(--ui-accent, #4f46e5);
        color: var(--ui-text-on-accent, #fff);
      }
      .item.selected {
        font-weight: 600;
      }
      .item:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }

      /* ── Icon-grid mode ──────────────────────────────────── */
      .icon-grid {
        display: grid;
        grid-template-columns: repeat(var(--_cols, 4), 2.25rem);
        gap: 0.25rem;
        padding: 0.375rem;
        width: fit-content;
      }
      .grid-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;
        padding: 0;
        background: none;
        color: inherit;
        border: 1px solid transparent;
        border-radius: var(--ui-radius-sm, 0.25rem);
        cursor: var(--ui-cursor-click, pointer);
      }
      .grid-item:hover:not(:disabled) {
        background: var(--ui-accent, #4f46e5);
        color: var(--ui-text-on-accent, #fff);
      }
      .grid-item.selected {
        border-color: var(--ui-accent, #4f46e5);
      }
      .grid-item:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .fallback-label {
        font-size: 0.6875rem;
        font-weight: 600;
        color: inherit;
        background: transparent;
      }
    `,
  ],
  template: `
    @if (displayMode() === "icon-grid") {
      <div class="icon-grid" role="menu" [style.--_cols]="gridCols()">
        @for (item of items(); track item.id) {
          <button
            class="grid-item"
            [class.selected]="item.id === selectedItemId()"
            role="menuitem"
            [disabled]="item.disabled ?? false"
            [title]="item.label"
            [attr.aria-label]="item.label"
            (click)="pick(item)"
          >
            @if (item.icon) {
              <ui-icon [svg]="item.icon" [size]="16" />
            } @else {
              <span class="fallback-label">{{ item.label.charAt(0) }}</span>
            }
          </button>
        }
      </div>
    } @else {
      <div class="panel" role="menu">
        @for (item of items(); track item.id) {
          <button
            class="item"
            [class.selected]="item.id === selectedItemId()"
            role="menuitem"
            [disabled]="item.disabled ?? false"
            (click)="pick(item)"
          >
            @if (item.icon) {
              <ui-icon [svg]="item.icon" [size]="16" />
            }
            {{ item.label }}
          </button>
        }
      </div>
    }
  `,
})
export class UIDropdownToolPanel implements UIPopoverContent<DropdownToolItem> {
  /** @internal */
  public readonly popoverRef = inject(PopoverRef<DropdownToolItem>);

  /** Items to render in the panel. */
  public readonly items = input<DropdownToolItem[]>([]);

  /** Id of the currently selected item (used for visual highlight). */
  public readonly selectedItemId = input<string | undefined>(undefined);

  /**
   * How items are rendered inside the panel.
   *
   * - `'icon-grid'` *(default)* — compact grid of icon-only buttons; labels
   *   appear as native tooltips on hover.
   * - `'list'` — icon + label in a vertical list, like a traditional menu.
   */
  public readonly displayMode = input<DropdownToolDisplayMode>("icon-grid");

  /** @internal */
  protected readonly gridCols = computed(() =>
    Math.ceil(Math.sqrt(this.items().length || 1)),
  );

  /** @internal */
  protected pick(item: DropdownToolItem): void {
    this.popoverRef.close(item);
  }
}

/**
 * A toolbar **command menu** — the trigger label is always fixed and the
 * panel lists discrete actions to invoke. Picking an item fires a
 * `toolAction` event; nothing is "selected" in a persistent sense.
 *
 * **When to use `UIDropdownTool` vs `UISelectTool`:**
 *
 * | | `UIDropdownTool` | `UISelectTool` |
 * |---|---|---|
 * | Purpose | Execute a command | Choose a value |
 * | Trigger label | Always fixed (e.g. "Insert") | Updates to show current value |
 * | Persistent state | None — emits an action | `value` model holds the selection |
 * | Analogy | Menu button / split button | `<select>` element |
 *
 * Use `UIDropdownTool` for things like an "Insert" menu, a "Format" menu,
 * or any other list of commands the user invokes one at a time.
 * Use {@link UISelectTool} when the user needs to pick a value that stays
 * selected (e.g. font size, colour mode).
 *
 * Panel items are rendered as an icon grid by default
 * (`displayMode="icon-grid"`). Switch to `displayMode="list"` for a
 * traditional menu layout with icon + label per row.
 *
 * The panel is rendered via {@link PopoverService} (fixed-position, outside
 * the toolbar DOM) so it is never clipped by `overflow: hidden` ancestors.
 *
 * @example
 * ```html
 * <!-- Command menu (icon-grid, default) -->
 * <ui-toolbar (toolAction)="onInsert($event)">
 *   <ui-dropdown-tool id="insert" label="Insert" [items]="insertItems" />
 * </ui-toolbar>
 *
 * <!-- Traditional list layout -->
 * <ui-dropdown-tool id="format" label="Format" displayMode="list"
 *   [items]="formatItems" />
 * ```
 */
@Component({
  selector: "ui-dropdown-tool",
  standalone: true,
  imports: [UIIcon],
  providers: [
    { provide: UIToolbarItem, useExisting: forwardRef(() => UIDropdownTool) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./dropdown-tool.component.html",
  styleUrl: "./dropdown-tool.component.scss",
  host: {
    class: "ui-dropdown-tool",
    "[class.open]": "isOpen()",
    "[class.disabled]": "disabled()",
  },
})
export class UIDropdownTool extends UIToolbarItem {
  /** Items to display in the dropdown panel. */
  public readonly items = input<DropdownToolItem[]>([]);

  /**
   * How items are rendered inside the panel.
   *
   * - `'icon-grid'` *(default)* — compact grid of icon-only buttons; labels
   *   appear as native tooltips on hover. Best when every item has an icon.
   * - `'list'` — icon + label in a vertical list (traditional menu style).
   */
  public readonly displayMode = input<DropdownToolDisplayMode>("icon-grid");

  /** The id of the most recently triggered dropdown item. */
  public readonly selectedItemId = signal<string | undefined>(undefined);

  /** @internal */
  protected readonly isOpen = signal(false);

  /** @internal */
  protected readonly chevronIcon = UIIcons.Lucide.Arrows.ChevronDown;

  /** @internal */
  private readonly _triggerRef =
    viewChild.required<ElementRef<HTMLButtonElement>>("trigger");

  /** @internal */
  private readonly _popover = inject(PopoverService);

  /** @internal */
  protected toggleOpen(): void {
    if (this.disabled() || this.isOpen()) return;
    this.isOpen.set(true);

    const ref = this._popover.openPopover<
      UIDropdownToolPanel,
      DropdownToolItem
    >({
      component: UIDropdownToolPanel,
      anchor: this._triggerRef().nativeElement,
      verticalAxisAlignment: "bottom",
      horizontalAxisAlignment: "match-start",
      showArrow: false,
      ariaLabel: this.ariaLabel() || this.label() || "Options",
      inputs: {
        items: this.items(),
        selectedItemId: this.selectedItemId(),
        displayMode: this.displayMode(),
      },
    });

    ref.closed.subscribe((result) => {
      this.isOpen.set(false);
      if (result !== undefined) {
        this.selectedItemId.set(result.id);
        this.emitAction(null);
      }
    });
  }
}

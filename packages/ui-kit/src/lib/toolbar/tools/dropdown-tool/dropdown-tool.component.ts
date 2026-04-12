import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
} from "@angular/core";
import { UIIcon } from "../../../icon/icon.component";
import { UIIcons } from "../../../icon/lucide-icons.generated";
import type { DropdownToolItem } from "../../toolbar-action";
import { UIToolbarItem } from "../../toolbar-item.directive";

/**
 * A toolbar tool that renders a trigger button and a dropdown panel.
 *
 * Items can be supplied via the `items` input (takes priority) or as
 * projected content. Read the selected item id via the `selectedItemId`
 * signal on the `itemRef` after a `toolAction` event fires.
 *
 * @example
 * ```html
 * <ui-toolbar (toolAction)="onAction($event)">
 *   <ui-dropdown-tool id="insert" label="Insert"
 *     [items]="[{ id: 'table', label: 'Table' }, { id: 'image', label: 'Image' }]"
 *   />
 * </ui-toolbar>
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

  /** Items to display in the dropdown panel (takes priority over projected content). */
  public readonly items = input<DropdownToolItem[]>([]);

  /** The id of the most recently selected dropdown item. */
  public readonly selectedItemId = signal<string | undefined>(undefined);

  /** @internal */
  protected readonly isOpen = signal(false);

  /** @internal */
  protected readonly chevronIcon = UIIcons.Lucide.Arrows.ChevronDown;

  /** @internal */
  private readonly _elRef = inject(ElementRef<HTMLElement>);

  /** @internal */
  private readonly _onDocumentClick = (e: MouseEvent): void => {
    if (!this._elRef.nativeElement.contains(e.target as Node)) {
      this.isOpen.set(false);
    }
  };

  public constructor() {
    super();
    document.addEventListener("click", this._onDocumentClick);
    inject(DestroyRef).onDestroy(() => {
      document.removeEventListener("click", this._onDocumentClick);
    });
  }

  /** @internal */
  protected toggleOpen(): void {
    if (!this.disabled()) {
      this.isOpen.update((v) => !v);
    }
  }

  /** @internal */
  protected onItemClick(item: DropdownToolItem, event: MouseEvent): void {
    this.selectedItemId.set(item.id);
    this.isOpen.set(false);
    this.emitAction(event);
  }
}

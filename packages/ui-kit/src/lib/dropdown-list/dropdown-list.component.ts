import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";

import { UIButton } from "../button/button.component";
import { UIIcon } from "../icon/icon.component";
import { UIIcons } from "../icon/lucide-icons.generated";
import { PopoverRef, type UIPopoverContent } from "../popover/popover.types";
import { PopoverService } from "../popover/popover.service";
import type { SelectOption } from "../select/select.component";
import { UISurface } from "@theredhead/foundation";

/**
 * Popover content that renders the option list for {@link UIDropdownList}.
 *
 * @internal — not intended for direct use.
 */
@Component({
  selector: "ui-dropdown-list-panel",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  styles: [
    `
      :host {
        display: block;
      }
      .dropdown-panel {
        list-style: none;
        margin: 0;
        padding: 0.25rem 0;
        min-width: 8rem;
      }
      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.4rem 0.75rem;
        font-size: var(--ui-font-body, 0.875rem);
        font-family: var(--ui-font, inherit);
        cursor: pointer;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        color: inherit;
        border-radius: 0;
      }
      .dropdown-item:hover,
      .dropdown-item:focus-visible {
        background: var(--theredhead-primary, #4f46e5);
        color: #fff;
        outline: none;
      }
      .dropdown-item--selected {
        font-weight: 600;
      }
    `,
  ],
  template: `
    <ul class="dropdown-panel" role="listbox" [attr.aria-label]="ariaLabel()">
      @for (option of options(); track option.value) {
        <li>
          <button
            class="dropdown-item"
            [class.dropdown-item--selected]="option.value === selectedValue()"
            role="option"
            [attr.aria-selected]="option.value === selectedValue()"
            (click)="pick(option.value)"
          >
            {{ option.label }}
          </button>
        </li>
      }
    </ul>
  `,
})
export class UIDropdownListPanel implements UIPopoverContent<string> {
  public readonly popoverRef = inject(PopoverRef<string>);

  /** Available options. */
  public readonly options = input<SelectOption[]>([]);

  /** Currently selected value (used for visual highlight). */
  public readonly selectedValue = input<string>("");

  /** Accessible label for the listbox. */
  public readonly ariaLabel = input<string>("Options");

  /** @internal */
  protected pick(value: string): void {
    this.popoverRef.close(value);
  }
}

/**
 * A custom dropdown that renders an outlined button with a chevron
 * indicator. Clicking the button opens a popover (no arrow pointer)
 * containing a list of selectable options.
 *
 * API-compatible with {@link UISelect} — uses the same
 * {@link SelectOption} items and two-way `value` binding.
 *
 * @example
 * ```html
 * <ui-dropdown-list
 *   [options]="fieldOptions"
 *   [(value)]="selectedField"
 *   ariaLabel="Choose field"
 * />
 * ```
 */
@Component({
  selector: "ui-dropdown-list",
  standalone: true,
  imports: [UIButton, UIIcon],
  templateUrl: "./dropdown-list.component.html",
  styleUrl: "./dropdown-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-dropdown-list",
    "[class.open]": "isOpen()",
    "[class.disabled]": "disabled()",
    "[attr.aria-label]": "ariaLabel()",
  },
})
export class UIDropdownList {
  // ── Inputs ──────────────────────────────────────────────────────────

  /** Available options. */
  public readonly options = input.required<SelectOption[]>();

  /** Placeholder text shown when no value is selected. */
  public readonly placeholder = input<string>("— Select —");

  /** Whether the control is disabled. */
  public readonly disabled = input(false);

  /**
   * Accessible label forwarded to the trigger button.
   *
   * Required when no visible `<label>` is associated with the control.
   */
  public readonly ariaLabel = input<string | undefined>(undefined);

  // ── Model ───────────────────────────────────────────────────────────

  /** Currently selected value (two-way bindable via `[(value)]`). */
  public readonly value = model("");

  // ── Outputs ─────────────────────────────────────────────────────────

  /** Emits the selected value when the user picks an option. */
  public readonly valueChange = this.value;

  // ── Queries ─────────────────────────────────────────────────────────

  /** @internal */
  private readonly triggerRef =
    viewChild.required<ElementRef<HTMLElement>>("trigger");

  // ── Computed ────────────────────────────────────────────────────────

  /**
   * Display label for the current selection. Shows the matching
   * option's label, or the placeholder if nothing is selected.
   * @internal
   */
  protected readonly displayLabel = computed(() => {
    const v = this.value();
    const match = this.options().find((o) => o.value === v);
    return match ? match.label : this.placeholder();
  });

  /**
   * Whether the placeholder is currently shown (no valid selection).
   * @internal
   */
  protected readonly isPlaceholder = computed(() => {
    const v = this.value();
    return !v || !this.options().some((o) => o.value === v);
  });

  // ── Internal state ──────────────────────────────────────────────────

  /** @internal — tracks whether the popover is open. */
  protected readonly isOpen = signal(false);

  /** @internal */
  protected readonly chevronIcon = UIIcons.Lucide.Arrows.ChevronDown;

  // ── Private ─────────────────────────────────────────────────────────

  private readonly popover = inject(PopoverService);

  // ── Public methods ──────────────────────────────────────────────────

  /** Opens the dropdown popover. @internal */
  protected toggle(): void {
    if (this.disabled() || this.isOpen()) return;
    this.isOpen.set(true);

    const ref = this.popover.openPopover<UIDropdownListPanel, string>({
      component: UIDropdownListPanel,
      anchor: this.triggerRef().nativeElement,
      verticalAxisAlignment: "bottom",
      horizontalAxisAlignment: "auto",
      showArrow: false,
      ariaLabel: this.ariaLabel() ?? "Options",
      inputs: {
        options: this.options(),
        selectedValue: this.value(),
        ariaLabel: this.ariaLabel() ?? "Options",
      },
    });

    ref.closed.subscribe((result) => {
      this.isOpen.set(false);
      if (result !== undefined) {
        this.value.set(result);
      }
    });
  }
}

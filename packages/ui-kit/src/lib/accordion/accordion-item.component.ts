import {
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
  input,
  model,
  output,
} from "@angular/core";
import { UISurface } from "@theredhead/lucid-foundation";

/** @internal — DI token for the parent accordion controller. */
export const ACCORDION_CONTROLLER = new InjectionToken<AccordionController>(
  "AccordionController",
);

/** @internal — interface implemented by UIAccordion to coordinate single-mode expansion. */
export interface AccordionController {
  notifyExpanded(item: UIAccordionItem): void;
  canCollapse(item: UIAccordionItem): boolean;
}

/**
 * A single collapsible panel inside a `<ui-accordion>`.
 *
 * @example
 * ```html
 * <ui-accordion>
 *   <ui-accordion-item label="Section 1">
 *     Panel content here
 *   </ui-accordion-item>
 * </ui-accordion>
 * ```
 */
@Component({
  selector: "ui-accordion-item",
  standalone: true,
  templateUrl: "./accordion-item.component.html",
  styleUrl: "./accordion-item.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: {
    class: "ui-accordion-item",
    "[class.expanded]": "expanded()",
    "[class.disabled]": "disabled()",
  },
})
export class UIAccordionItem {
  /** Header label text. */
  public readonly label = input.required<string>();

  /** Whether this panel is expanded. Supports two-way binding. */
  public readonly expanded = model(false);

  /** Whether this panel is disabled (cannot toggle). */
  public readonly disabled = input(false);

  /** Whether the panel content keeps the default inset padding. */
  public readonly contentPadding = input<"default" | "none">("default");

  /** Accessible label override. */
  public readonly ariaLabel = input<string | undefined>(undefined);

  /** Emitted when the panel is toggled. */
  public readonly expandedChange = output<boolean>();

  /** @internal */
  private readonly accordion = inject(ACCORDION_CONTROLLER, { optional: true });

  /** Toggle the expanded state. */
  public toggle(): void {
    if (this.disabled()) {
      return;
    }
    if (this.expanded()) {
      if (this.accordion?.canCollapse(this) === false) {
        return;
      }
      this.collapse();
    } else {
      this.expand();
    }
  }

  /** Expand the panel. */
  public expand(): void {
    if (this.disabled() || this.expanded()) {
      return;
    }
    this.expanded.set(true);
    this.expandedChange.emit(true);
    this.accordion?.notifyExpanded(this);
  }

  /** Collapse the panel. */
  public collapse(): void {
    if (this.disabled() || !this.expanded()) {
      return;
    }
    this.expanded.set(false);
    this.expandedChange.emit(false);
  }

  /** @internal — keyboard handler for the header. */
  protected onHeaderKeyDown(event: KeyboardEvent): void {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      this.toggle();
    }
  }
}

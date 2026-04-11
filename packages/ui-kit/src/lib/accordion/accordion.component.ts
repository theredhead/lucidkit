import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
} from "@angular/core";

import {
  ACCORDION_CONTROLLER,
  type AccordionController,
  UIAccordionItem,
} from "./accordion-item.component";
import { UISurface } from "@theredhead/foundation";

/** Expansion mode for the accordion. */
export type AccordionMode = "single" | "multi";

/**
 * A container that manages multiple collapsible panels.
 *
 * In `single` mode (default), expanding one panel collapses all others.
 * In `multi` mode, any number of panels can be expanded simultaneously.
 *
 * @example
 * ```html
 * <ui-accordion mode="single">
 *   <ui-accordion-item label="Section 1">Content A</ui-accordion-item>
 *   <ui-accordion-item label="Section 2">Content B</ui-accordion-item>
 * </ui-accordion>
 * ```
 */
@Component({
  selector: "ui-accordion",
  standalone: true,
  templateUrl: "./accordion.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: ACCORDION_CONTROLLER, useExisting: UIAccordion }],
  host: {
    class: "ui-accordion",
    "[class.disabled]": "disabled()",
  },
  styleUrl: "./accordion.component.scss",
})
export class UIAccordion implements AccordionController {
  /** Whether the accordion is disabled. */
  public readonly disabled = input<boolean>(false);

  /** Expansion mode: `single` collapses siblings, `multi` allows any combination. */
  public readonly mode = input<AccordionMode>("single");

  /** Whether at least one panel must always remain open in `single` mode. Has no effect in `multi` mode. */
  public readonly requireOpen = input(true);

  /** Accessible label for the accordion. */
  public readonly ariaLabel = input<string | undefined>(undefined);

  /** @internal — projected accordion items. */
  public readonly items = contentChildren(UIAccordionItem);

  /** @internal — returns false in single mode when `requireOpen` is true. */
  public canCollapse(_item: UIAccordionItem): boolean {
    if (this.mode() !== "single") {
      return true;
    }
    return !this.requireOpen();
  }

  /** @internal — called by accordion items when they expand. */
  public notifyExpanded(expandedItem: UIAccordionItem): void {
    if (this.mode() !== "single") {
      return;
    }
    for (const item of this.items()) {
      if (item !== expandedItem && item.expanded()) {
        item.collapse();
      }
    }
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { UISurface } from "@theredhead/foundation";

/** A single item in the breadcrumb trail. */
export interface BreadcrumbItem {
  /** Display label. */
  readonly label: string;
  /** Optional route or URL. When absent, the item is non-clickable. */
  readonly url?: string;
  /** Optional icon identifier. */
  readonly icon?: string;
}

/** Visual style for the breadcrumb trail. */
export type BreadcrumbVariant = "link" | "button";

/**
 * A navigation breadcrumb trail.
 *
 * @example
 * ```html
 * <ui-breadcrumb [items]="[
 *   { label: 'Home', url: '/' },
 *   { label: 'Products', url: '/products' },
 *   { label: 'Widget' }
 * ]" />
 * ```
 */
@Component({
  selector: "ui-breadcrumb",
  standalone: true,
  templateUrl: "./breadcrumb.component.html",
  styleUrl: "./breadcrumb.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: {
    class: "ui-breadcrumb",
    "[class.button]": "variant() === 'button'",
    "[class.disabled]": "disabled()",
  },
})
export class UIBreadcrumb {
  /** Whether the breadcrumb is disabled. */
  public readonly disabled = input<boolean>(false);

  /** The breadcrumb items to display. */
  public readonly items = input.required<readonly BreadcrumbItem[]>();

  /** Visual style: `link` (default) renders anchors, `button` renders styled buttons with chevron separators. */
  public readonly variant = input<BreadcrumbVariant>("link");

  /** Separator character between items. Only used in `link` variant. */
  public readonly separator = input("/");

  /** Accessible label for the nav element. */
  public readonly ariaLabel = input("Breadcrumb");

  /** Emitted when a breadcrumb item is clicked. */
  public readonly itemClicked = output<BreadcrumbItem>();

  /** @internal — handle click on a breadcrumb item. */
  protected onItemClick(
    event: Event,
    item: BreadcrumbItem,
    isLast: boolean,
  ): void {
    event.preventDefault();
    if (isLast) {
      return;
    }
    this.itemClicked.emit(item);
  }
}

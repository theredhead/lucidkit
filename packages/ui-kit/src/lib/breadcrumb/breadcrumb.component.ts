import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

/** A single item in the breadcrumb trail. */
export interface BreadcrumbItem {
  /** Display label. */
  readonly label: string;
  /** Optional route or URL. When absent, the item is non-clickable. */
  readonly url?: string;
  /** Optional icon identifier. */
  readonly icon?: string;
}

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
  host: {
    class: "ui-breadcrumb",
  },
})
export class UIBreadcrumb {
  /** The breadcrumb items to display. */
  public readonly items = input.required<readonly BreadcrumbItem[]>();

  /** Separator character between items. Defaults to `/`. */
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
    if (isLast || !item.url) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    this.itemClicked.emit(item);
  }
}

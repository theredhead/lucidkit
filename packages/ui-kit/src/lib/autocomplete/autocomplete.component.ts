import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import type { AutocompleteDatasource } from "@theredhead/foundation";

// Re-export so consumers importing from @theredhead/ui-kit keep working.
export type { AutocompleteDatasource } from "@theredhead/foundation";

// ── Component ──────────────────────────────────────────────────────

/**
 * Autocomplete / type-ahead component with optional custom item template.
 *
 * Renders a text input that, on every keystroke, queries the supplied
 * {@link AutocompleteDatasource} and shows a popup list of matching items.
 *
 * Consumers project an `<ng-template let-item>` to control how each
 * suggestion is rendered. When no template is provided the component
 * falls back to `String(item)`.
 *
 * Selection is exposed as a two-way `[(value)]` binding carrying the
 * currently selected items.
 *
 * Zero external dependencies — only Angular core + `@angular/common`.
 *
 * @example
 * ```html
 * <ui-autocomplete [datasource]="ds" [(value)]="picked">
 *   <ng-template let-item>
 *     <strong>{{ item.name }}</strong>
 *     <small>{{ item.email }}</small>
 *   </ng-template>
 * </ui-autocomplete>
 * ```
 */
@Component({
  selector: "ui-autocomplete",
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./autocomplete.component.html",
  styleUrl: "./autocomplete.component.scss",
  host: {
    class: "ui-autocomplete",
    "(document:click)": "onDocumentClick($event)",
    "(document:keydown.escape)": "closePopup()",
  },
})
export class UIAutocomplete<T> {
  private static _nextId = 0;

  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  // ── Content query ──────────────────────────────────────────

  /** Consumer-projected template for rendering each suggestion item. */
  readonly itemTemplate =
    contentChild<TemplateRef<{ $implicit: T }>>(TemplateRef);

  // ── Inputs ─────────────────────────────────────────────────

  /** Datasource that provides completion suggestions. */
  readonly datasource = input.required<AutocompleteDatasource<T>>();

  /** Whether the control is disabled. */
  readonly disabled = input<boolean>(false);

  /** Placeholder text shown when the input is empty. */
  readonly placeholder = input<string>("Search…");

  /**
   * Accessible label forwarded to the native `<input>` as `aria-label`.
   */
  readonly ariaLabel = input<string>("Autocomplete");

  /**
   * Minimum number of characters before a query is executed.
   * Defaults to `1`.
   */
  readonly minChars = input<number>(1);

  /**
   * Whether to allow multiple selections. When `false` (default),
   * picking an item closes the popup and replaces the value.
   * When `true`, picked items accumulate as chips above the input.
   */
  readonly multiple = input<boolean>(false);

  /**
   * Function that returns a display string for a selected item.
   * Used for chips (multiple mode) and the input value (single mode).
   * Defaults to `String(item)`.
   */
  readonly displayWith = input<(item: T) => string>((item: T) => String(item));

  /**
   * Optional trackBy function for identity comparison.
   * When provided, duplicate-checks use this key.
   */
  readonly trackBy = input<((item: T) => unknown) | undefined>(undefined);

  // ── Two-way value ──────────────────────────────────────────

  /** Currently selected item(s). Two-way bindable via `[(value)]`. */
  readonly value = model<readonly T[]>([]);

  // ── Outputs ────────────────────────────────────────────────

  /** Fired when a suggestion is picked from the popup. */
  readonly itemSelected = output<T>();

  /** Fired when a chip / item is removed in multiple mode. */
  readonly itemRemoved = output<T>();

  // ── Internal state ─────────────────────────────────────────

  /** Raw text in the input. */
  protected readonly query = signal("");

  /** Whether the suggestion popup is visible. */
  protected readonly isOpen = signal(false);

  /** Keyboard-highlighted index inside the suggestions list. */
  protected readonly activeIndex = signal(-1);

  /** The list of current suggestions from the datasource. */
  protected readonly suggestions = computed(() => {
    const q = this.query();
    if (q.length < this.minChars()) return [];
    return this.datasource().completeFor(q, this.value());
  });

  /** Unique listbox id for ARIA. */
  protected readonly listboxId = `ui-ac-listbox-${UIAutocomplete._nextId++}`;

  // ── Input handler ──────────────────────────────────────────

  /** @internal */
  protected onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.query.set(text);
    this.activeIndex.set(-1);
    this.isOpen.set(text.length >= this.minChars());
  }

  // ── Item picking ───────────────────────────────────────────

  /** @internal */
  protected pickItem(item: T): void {
    if (this.multiple()) {
      const tb = this.trackBy();
      const key = tb ? tb(item) : item;
      const alreadySelected = this.value().some(
        (v) => (tb ? tb(v) : v) === key,
      );
      if (!alreadySelected) {
        this.value.set([...this.value(), item]);
      }
    } else {
      this.value.set([item]);
      this.query.set(this.displayWith()(item));
    }
    this.itemSelected.emit(item);
    this.closePopup();
  }

  /** @internal – remove a chip in multiple mode. */
  protected removeItem(item: T): void {
    const tb = this.trackBy();
    const key = tb ? tb(item) : item;
    this.value.set(this.value().filter((v) => (tb ? tb(v) : v) !== key));
    this.itemRemoved.emit(item);
  }

  // ── Keyboard navigation ────────────────────────────────────

  /** @internal */
  protected onKeydown(event: KeyboardEvent): void {
    const items = this.suggestions();
    if (!items.length) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
        }
        this.activeIndex.set(
          Math.min(this.activeIndex() + 1, items.length - 1),
        );
        break;

      case "ArrowUp":
        event.preventDefault();
        this.activeIndex.set(Math.max(this.activeIndex() - 1, 0));
        break;

      case "Enter":
        event.preventDefault();
        if (this.activeIndex() >= 0 && this.activeIndex() < items.length) {
          this.pickItem(items[this.activeIndex()]);
        }
        break;

      case "Tab":
        this.closePopup();
        break;
    }
  }

  // ── Popup management ───────────────────────────────────────

  /** @internal */
  protected openPopup(): void {
    if (this.disabled()) return;
    if (this.query().length >= this.minChars()) {
      this.isOpen.set(true);
    }
  }

  /** @internal */
  protected closePopup(): void {
    this.isOpen.set(false);
    this.activeIndex.set(-1);
  }

  /** @internal – close when clicking outside. */
  protected onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target as Node)) {
      this.closePopup();
    }
  }

  /** @internal – default fallback string representation. */
  protected itemToString(item: T): string {
    return this.displayWith()(item);
  }
}

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
  viewChild,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import type { AutocompleteDatasource } from "@theredhead/lucid-foundation";
import {
  UISurface,
  UI_DEFAULT_SURFACE_TYPE,
} from "@theredhead/lucid-foundation";
import { UIIcon } from "../icon/icon.component";
import { UIIcons } from "../icon/lucide-icons.generated";

// Re-export so consumers importing from @theredhead/lucid-kit keep working.
export type { AutocompleteDatasource } from "@theredhead/lucid-foundation";

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
  imports: [NgTemplateOutlet, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "input" }],
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
  private readonly inputEl =
    viewChild.required<ElementRef<HTMLInputElement>>("inputEl");

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
   * Optional function that returns a CSS background colour string for a chip.
   * Accepts a CSS named colour, hex, `rgb()`, `var(--my-token)` etc.
   * When the value starts with `var(` it is used as-is for both background and
   * the foreground is left at the default `--ui-accent-fg`.
   * For literal colour values a light/dark foreground is computed automatically.
   * Return `null` or `undefined` to use the default accent colour.
   */
  readonly chipColor = input<
    ((item: T, index: number) => string | null | undefined) | undefined
  >(undefined);

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

  /** @internal Fired when a chip / item is removed. */
  readonly itemRemoved = output<T>();

  // ── Internal state ─────────────────────────────────────────

  /** @internal Icons used in the template. */
  protected readonly icons = { close: UIIcons.Lucide.Math.X } as const;

  /** @internal Returns the background colour style value for a chip, or null for default. */
  protected chipColorBg(item: T, index: number): string | null {
    return this.chipColor()?.(item, index) ?? null;
  }

  /**
   * @internal Returns a foreground colour that contrasts with the chip background.
   * For CSS variable references we cannot compute contrast, so we return null
   * (letting the CSS default `--ui-accent-fg` take over).
   */
  protected chipColorFg(item: T, index: number): string | null {
    const bg = this.chipColor()?.(item, index);
    if (!bg) return null;
    if (bg.startsWith("var(")) return null;
    return UIAutocomplete._contrastColor(bg);
  }

  /**
   * Compute whether white or dark text gives better contrast on a given colour.
   * Supports hex (`#rgb`, `#rrggbb`) and `rgb()` / `rgba()` syntax.
   */
  private static _contrastColor(color: string): string {
    let r: number;
    let g: number;
    let b: number;
    const hex = color.trim();
    const hexMatch = hex.match(/^#([0-9a-f]{3,8})$/i);
    if (hexMatch) {
      const h = hexMatch[1];
      if (h.length === 3 || h.length === 4) {
        r = parseInt(h[0] + h[0], 16);
        g = parseInt(h[1] + h[1], 16);
        b = parseInt(h[2] + h[2], 16);
      } else {
        r = parseInt(h.slice(0, 2), 16);
        g = parseInt(h.slice(2, 4), 16);
        b = parseInt(h.slice(4, 6), 16);
      }
    } else {
      const rgbMatch = hex.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
      if (rgbMatch) {
        r = parseInt(rgbMatch[1]);
        g = parseInt(rgbMatch[2]);
        b = parseInt(rgbMatch[3]);
      } else {
        // Named colour: use a hidden canvas to resolve
        try {
          const canvas = document.createElement("canvas");
          canvas.width = canvas.height = 1;
          const ctx = canvas.getContext("2d")!;
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, 1, 1);
          const d = ctx.getImageData(0, 0, 1, 1).data;
          r = d[0];
          g = d[1];
          b = d[2];
        } catch {
          return "#fff";
        }
      }
    }
    // WCAG relative luminance
    const toLinear = (c: number) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    const L =
      0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    return L > 0.179 ? "#1d232b" : "#ffffff";
  }

  /** Raw text in the input. */
  protected readonly query = signal("");

  /** Whether the suggestion popup is visible. */
  protected readonly isOpen = signal(false);

  /** Keyboard-highlighted index inside the suggestions list. */
  protected readonly activeIndex = signal(-1);

  /**
   * @internal
   * Cursor position within the chip zone, or `null` when the native text
   * input holds the cursor.
   *
   * Semantics: position `k` means the cursor sits in the gap *before*
   * chip[k] (0 = before the first chip, chips.length = after the last chip /
   * immediately before the text input).  `null` = cursor is inside the text
   * input.
   */
  protected readonly chipCursorPos = signal<number | null>(null);

  /**
   * @internal
   * Anchor for shift-selection in the chip zone.  Uses the same coordinate
   * space as `chipCursorPos`.  `null` means no selection is active.
   */
  protected readonly chipCursorAnchor = signal<number | null>(null);

  /** The list of current suggestions from the datasource. */
  protected readonly suggestions = computed(() => {
    const q = this.query();
    if (q.length < this.minChars()) return [];
    return this.datasource().completeFor(q, this.value());
  });

  /**
   * @internal
   * Returns `true` when the cursor is currently inside the chip zone
   * (i.e. not in the native text input).
   */
  protected readonly inChipZone = computed(() => this.chipCursorPos() !== null);

  /**
   * @internal
   * Whether chip at `index` falls inside the current selection range.
   * Chip `i` is selected when `min(anchor, cursor) <= i < max(anchor, cursor)`.
   */
  protected isChipSelected(index: number): boolean {
    const pos = this.chipCursorPos();
    const anchor = this.chipCursorAnchor();
    if (pos === null || anchor === null) return false;
    const lo = Math.min(anchor, pos);
    const hi = Math.max(anchor, pos);
    return index >= lo && index < hi;
  }

  /** Unique listbox id for ARIA. */
  protected readonly listboxId = `ui-ac-listbox-${UIAutocomplete._nextId++}`;

  /** @internal Focus the native input when the container is clicked. */
  protected focusInput(): void {
    this.exitChipZone(0);
    this.inputEl().nativeElement.focus();
  }

  /**
   * @internal
   * Mouse-up on a chip selects that chip (anchor = gap before, pos = gap after).
   * Shift-click extends an existing selection from the current anchor.
   */
  protected onChipMouseUp(
    index: number,
    event: MouseEvent | KeyboardEvent,
  ): void {
    event.stopPropagation();
    if (event.shiftKey && this.chipCursorPos() !== null) {
      // Extend selection: move cursor to the far side of the clicked chip
      // relative to the anchor.
      const anchor = this.chipCursorAnchor() ?? this.chipCursorPos()!;
      this.chipCursorAnchor.set(anchor);
      this.chipCursorPos.set(anchor <= index ? index + 1 : index);
    } else {
      // Plain click: select just this chip
      this.chipCursorAnchor.set(index);
      this.chipCursorPos.set(index + 1);
    }
    this.inputEl().nativeElement.focus();
  }

  /** @internal */
  protected onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.query.set(text);
    this.exitChipZone(0);
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
    }
    this.query.set(this.multiple() ? "" : this.displayWith()(item));
    this.itemSelected.emit(item);
    this.closePopup();
  }

  /** @internal – remove a chip in single or multiple mode. */
  protected removeItem(item: T): void {
    const tb = this.trackBy();
    const key = tb ? tb(item) : item;
    this.value.set(this.value().filter((v) => (tb ? tb(v) : v) !== key));
    this.itemRemoved.emit(item);
  }

  // ── Keyboard navigation ────────────────────────────────────

  /** @internal */
  protected onKeydown(event: KeyboardEvent): void {
    const input = this.inputEl().nativeElement;
    const chips = this.value();
    const chipCount = chips.length;
    const pos = this.chipCursorPos();
    const inChipZone = pos !== null;

    if (event.key === "ArrowLeft") {
      if (inChipZone) {
        event.preventDefault();
        const next = pos! - 1;
        if (event.shiftKey) {
          if (this.chipCursorAnchor() === null) this.chipCursorAnchor.set(pos);
        } else {
          this.chipCursorAnchor.set(null);
        }
        if (next < 0) {
          // Exit chip zone to the left — stay at pos 0 (can't go further)
          this.chipCursorPos.set(0);
        } else {
          this.chipCursorPos.set(next);
        }
        return;
      }
      // Enter chip zone when text cursor is at position 0
      if (
        chipCount > 0 &&
        input.selectionStart === 0 &&
        input.selectionEnd === 0
      ) {
        event.preventDefault();
        // Enter at gap chipCount (after the last chip), so the visual cursor
        // lands between the last chip and the text input.
        // Shift+Left from here immediately selects the last chip.
        if (event.shiftKey) {
          this.chipCursorAnchor.set(chipCount);
        }
        this.chipCursorPos.set(chipCount);
        return;
      }
    }

    if (event.key === "ArrowRight") {
      if (inChipZone) {
        event.preventDefault();
        const next = pos! + 1;
        if (event.shiftKey) {
          if (this.chipCursorAnchor() === null) this.chipCursorAnchor.set(pos);
        } else {
          this.chipCursorAnchor.set(null);
        }
        if (pos !== null && pos === chipCount) {
          // Already at the last gap (after all chips) — exit to text input.
          this.exitChipZone(0);
          input.setSelectionRange(0, 0);
        } else {
          // Move one gap right; gap chipCount (after last chip) is still in-zone.
          this.chipCursorPos.set(Math.min(next, chipCount));
        }
        return;
      }
    }

    if (event.key === "Backspace") {
      if (inChipZone) {
        event.preventDefault();
        const anchor = this.chipCursorAnchor();
        if (anchor !== null && anchor !== pos) {
          // Delete selected range
          this.deleteChipRange(Math.min(anchor, pos!), Math.max(anchor, pos!));
        } else if (pos! > 0) {
          // Delete chip to the left of cursor
          this.deleteSingleChip(pos! - 1, false);
        }
        return;
      }
      if (
        chipCount > 0 &&
        input.selectionStart === 0 &&
        input.selectionEnd === 0
      ) {
        event.preventDefault();
        const last = chips[chipCount - 1];
        this.value.update((v) => v.slice(0, -1));
        this.itemRemoved.emit(last);
        return;
      }
    }

    if (event.key === "Delete") {
      if (inChipZone) {
        event.preventDefault();
        const anchor = this.chipCursorAnchor();
        if (anchor !== null && anchor !== pos) {
          this.deleteChipRange(Math.min(anchor, pos!), Math.max(anchor, pos!));
        } else if (pos! < chipCount) {
          // Delete chip to the right of cursor
          this.deleteSingleChip(pos!, true);
        }
        return;
      }
    }

    // Any printable key or Escape while in chip zone — exit to text input
    if (
      inChipZone &&
      (event.key.length === 1 || event.key === "Escape" || event.key === "Tab")
    ) {
      // If there is an active selection, delete the selected chips first so
      // the typed character replaces them (matching normal text-editor behaviour).
      const anchor = this.chipCursorAnchor();
      if (event.key.length === 1 && anchor !== null && anchor !== pos) {
        this.deleteChipRange(
          Math.min(anchor, pos!),
          Math.max(anchor, pos!),
          true,
        );
      } else {
        this.exitChipZone(0);
      }
      // Let the event proceed naturally so the character lands in the input
    }

    // ── Suggestion popup navigation ─────────────────────────
    const items = this.suggestions();

    switch (event.key) {
      case "ArrowDown":
        if (!items.length) break;
        event.preventDefault();
        this.isOpen.set(true);
        this.activeIndex.set(
          Math.min(this.activeIndex() + 1, items.length - 1),
        );
        break;

      case "ArrowUp":
        if (!items.length) break;
        event.preventDefault();
        this.activeIndex.set(Math.max(this.activeIndex() - 1, 0));
        break;

      case "Enter": {
        if (!items.length) break;
        event.preventDefault();
        const idx = this.activeIndex();
        if (idx >= 0 && idx < items.length) {
          this.pickItem(items[idx]);
        } else if (items.length === 1) {
          this.pickItem(items[0]);
        }
        break;
      }

      case "Tab":
        this.closePopup();
        break;
    }
  }

  // ── Chip helpers ───────────────────────────────────────────

  private exitChipZone(textPos: number): void {
    this.chipCursorPos.set(null);
    this.chipCursorAnchor.set(null);
    // Restore native input cursor on next tick so the DOM is ready
    queueMicrotask(() => {
      this.inputEl().nativeElement.setSelectionRange(textPos, textPos);
    });
  }

  private deleteSingleChip(index: number, forward: boolean): void {
    const chips = [...this.value()];
    const removed = chips[index];
    chips.splice(index, 1);
    this.itemRemoved.emit(removed);
    this.value.set(chips);
    // Move cursor: after forward-delete keep pos, after backward-delete move left
    if (chips.length === 0) {
      this.exitChipZone(0);
    } else {
      this.chipCursorPos.set(
        forward ? Math.min(index, chips.length) : Math.max(0, index - 1),
      );
      this.chipCursorAnchor.set(null);
    }
  }

  private deleteChipRange(lo: number, hi: number, thenExit = false): void {
    // lo..hi are gap positions; chips between them are lo..(hi-1)
    const chips = [...this.value()];
    const removed = chips.slice(lo, hi);
    const kept = chips.filter((_, i) => i < lo || i >= hi);
    removed.forEach((item) => this.itemRemoved.emit(item));
    this.value.set(kept);
    this.chipCursorAnchor.set(null);
    if (kept.length === 0 || thenExit) {
      this.exitChipZone(0);
    } else {
      this.chipCursorPos.set(Math.min(lo, kept.length));
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

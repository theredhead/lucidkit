import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";

import { UIIcon, UIIcons } from "@theredhead/lucid-kit";

import type {
  CommandExecuteEvent,
  CommandGroup,
  CommandPaletteItem,
} from "./command-palette.types";
import { UISurface } from "@theredhead/lucid-foundation";

/**
 * A keyboard-triggered command palette that provides quick access
 * to application actions through a searchable, grouped list.
 *
 * Open with `Cmd+K` / `Ctrl+K` (when {@link globalShortcut} is
 * enabled) or by setting the `open` model to `true`.
 *
 * ### Basic usage
 * ```html
 * <ui-command-palette
 *   [commands]="commands"
 *   [(open)]="paletteOpen"
 *   (execute)="onExecute($event)"
 * />
 * ```
 *
 * ### With recent items
 * ```html
 * <ui-command-palette
 *   [commands]="commands"
 *   [maxRecent]="5"
 *   [(open)]="paletteOpen"
 *   (execute)="onExecute($event)"
 * />
 * ```
 */
@Component({
  selector: "ui-command-palette",
  standalone: true,
  imports: [UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  templateUrl: "./command-palette.component.html",
  styleUrl: "./command-palette.component.scss",
  host: {
    class: "ui-command-palette",
  },
})
export class UICommandPalette<C = unknown> {
  // ── Inputs ────────────────────────────────────────────────────────

  /** The full list of available commands. */
  public readonly commands = input.required<readonly CommandPaletteItem<C>[]>();

  /** Placeholder text for the search input. */
  public readonly placeholder = input<string>("Type a command…");

  /** Accessible label for the palette. */
  public readonly ariaLabel = input<string>("Command palette");

  /**
   * Whether the global `Cmd+K` / `Ctrl+K` keyboard shortcut is
   * active. Defaults to `true`.
   */
  public readonly globalShortcut = input<boolean>(true);

  /**
   * Maximum number of recent commands to track. Set to `0` to
   * disable the recent-items section. Defaults to `5`.
   */
  public readonly maxRecent = input<number>(5);

  // ── Models ────────────────────────────────────────────────────────

  /** Whether the palette is open (two-way bindable). */
  public readonly open = model<boolean>(false);

  // ── Outputs ───────────────────────────────────────────────────────

  /** Emitted when a command is executed. */
  public readonly execute = output<CommandExecuteEvent<C>>();

  // ── View queries ──────────────────────────────────────────────────

  /** @internal */
  private readonly searchInputRef =
    viewChild<ElementRef<HTMLInputElement>>("searchInput");

  // ── Internal state ────────────────────────────────────────────────

  /** @internal — current search query. */
  protected readonly query = signal("");

  /** @internal — index of the active (highlighted) item. */
  protected readonly activeIndex = signal(0);

  /** @internal — IDs of recently executed commands (most recent first). */
  protected readonly recentIds = signal<readonly string[]>([]);

  // ── Icons ─────────────────────────────────────────────────────────

  /** @internal */
  protected readonly searchIcon = UIIcons.Lucide.Social.Search;
  /** @internal */
  protected readonly returnIcon = UIIcons.Lucide.Arrows.CornerDownLeft;
  /** @internal */
  protected readonly arrowUpIcon = UIIcons.Lucide.Arrows.ArrowUp;
  /** @internal */
  protected readonly arrowDownIcon = UIIcons.Lucide.Arrows.ArrowDown;

  // ── Computed ──────────────────────────────────────────────────────

  /** @internal — filtered and grouped commands based on the query. */
  protected readonly filteredGroups = computed<readonly CommandGroup<C>[]>(
    () => {
      const q = this.query().toLowerCase().trim();
      const all = this.commands();

      const matching = q
        ? all.filter(
            (cmd) =>
              cmd.label.toLowerCase().includes(q) ||
              (cmd.keywords ?? []).some((k) => k.toLowerCase().includes(q)) ||
              (cmd.group ?? "").toLowerCase().includes(q),
          )
        : all;

      return this.groupCommands(matching);
    },
  );

  /** @internal — recent commands that are still in the full commands list. */
  protected readonly recentCommands = computed<
    readonly CommandPaletteItem<C>[]
  >(() => {
    const ids = this.recentIds();
    const max = this.maxRecent();
    if (max === 0 || ids.length === 0) return [];

    const all = this.commands();
    const lookup = new Map(all.map((c) => [c.id, c]));
    return ids
      .map((id) => lookup.get(id))
      .filter((c): c is CommandPaletteItem<C> => c !== undefined)
      .slice(0, max);
  });

  /** @internal — whether to show the recent section. */
  protected readonly showRecent = computed(
    () =>
      this.maxRecent() > 0 &&
      this.recentCommands().length > 0 &&
      !this.query().trim(),
  );

  /** @internal — flat list of all currently visible items for keyboard nav. */
  protected readonly flatItems = computed<readonly CommandPaletteItem<C>[]>(
    () => {
      const items: CommandPaletteItem<C>[] = [];
      if (this.showRecent()) {
        items.push(...this.recentCommands());
      }
      for (const group of this.filteredGroups()) {
        items.push(...group.items);
      }
      return items;
    },
  );

  // ── Constructor ───────────────────────────────────────────────────

  public constructor() {
    // Register global keyboard shortcut
    const onKeydown = (e: KeyboardEvent) => {
      if (!this.globalShortcut()) return;
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        this.open.update((v) => !v);
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("keydown", onKeydown);
    }

    // Focus the search input when the palette opens
    effect(() => {
      if (this.open()) {
        this.query.set("");
        this.activeIndex.set(0);
        // Allow DOM to render before focusing
        queueMicrotask(() => {
          this.searchInputRef()?.nativeElement.focus();
        });
      }
    });

    // Reset active index when query changes
    effect(() => {
      this.query();
      this.activeIndex.set(0);
    });
  }

  // ── Public methods ────────────────────────────────────────────────

  /** Programmatically open the palette. */
  public show(): void {
    this.open.set(true);
  }

  /** Programmatically close the palette. */
  public close(): void {
    this.open.set(false);
  }

  // ── Protected methods ─────────────────────────────────────────────

  /** @internal */
  protected onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.query.set(input.value);
  }

  /** @internal */
  protected onKeydown(event: KeyboardEvent): void {
    const items = this.flatItems();
    const len = items.length;
    if (len === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.activeIndex.update((i) => (i + 1) % len);
        this.scrollActiveIntoView();
        break;
      case "ArrowUp":
        event.preventDefault();
        this.activeIndex.update((i) => (i - 1 + len) % len);
        this.scrollActiveIntoView();
        break;
      case "Enter": {
        event.preventDefault();
        const item = items[this.activeIndex()];
        if (item && !item.disabled) {
          this.executeCommand(item);
        }
        break;
      }
      case "Escape":
        event.preventDefault();
        this.close();
        break;
    }
  }

  /** @internal */
  protected onItemClick(item: CommandPaletteItem<C>): void {
    if (item.disabled) return;
    this.executeCommand(item);
  }

  /** @internal */
  protected onBackdropClick(): void {
    this.close();
  }

  /** @internal — compute the flat index for a group item. */
  protected getFlatIndex(groupIndex: number, itemIndex: number): number {
    const groups = this.filteredGroups();
    let offset = this.showRecent() ? this.recentCommands().length : 0;
    for (let g = 0; g < groupIndex; g++) {
      offset += groups[g].items.length;
    }
    return offset + itemIndex;
  }

  /** @internal — compute the flat index for a recent item. */
  protected getRecentFlatIndex(index: number): number {
    return index;
  }

  // ── Private methods ───────────────────────────────────────────────

  private executeCommand(item: CommandPaletteItem<C>): void {
    this.execute.emit({
      command: item,
      executedAt: new Date().toISOString(),
    });
    this.addToRecent(item.id);
    this.close();
  }

  private addToRecent(id: string): void {
    const max = this.maxRecent();
    if (max === 0) return;
    this.recentIds.update((ids) => {
      const filtered = ids.filter((i) => i !== id);
      return [id, ...filtered].slice(0, max);
    });
  }

  private groupCommands(
    items: readonly CommandPaletteItem<C>[],
  ): readonly CommandGroup<C>[] {
    const map = new Map<string, CommandPaletteItem<C>[]>();
    for (const item of items) {
      const group = item.group ?? "";
      let list = map.get(group);
      if (!list) {
        list = [];
        map.set(group, list);
      }
      list.push(item);
    }
    const result: CommandGroup<C>[] = [];
    for (const [name, groupItems] of map) {
      result.push({ name, items: groupItems });
    }
    return result;
  }

  private scrollActiveIntoView(): void {
    queueMicrotask(() => {
      const active = this.searchInputRef()
        ?.nativeElement.closest(".cp-dialog")
        ?.querySelector(".cp-item--active");
      active?.scrollIntoView?.({ block: "nearest" });
    });
  }
}

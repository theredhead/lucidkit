import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
  untracked,
  viewChild,
} from "@angular/core";

import {
  getRegisteredTextTemplateBlockProviders,
  LoggerFactory,
  UISurface,
  type TemplateBlockProvider,
} from "@theredhead/lucid-foundation";

import {
  UIEmojiPicker,
  UIIcon,
  UIIcons,
  UIRichTextView,
  UIToolbar,
  UIButtonTool,
  UIToggleTool,
  UISeparatorTool,
  UISpacerTool,
  UIDropdownTool,
  UIButtonGroupTool,
  UIToggleGroupTool,
  type ToolActionEvent,
  type DropdownToolItem,
  type ToolbarDisplayMode,
  type EmojiCategory,
  PopoverService,
} from "@theredhead/lucid-kit";
import {
  UILinkDialog,
  type LinkDialogResult,
} from "./link-dialog/link-dialog.component";

import {
  UIImageDialog,
  type ImageDialogResult,
} from "./image-dialog/image-dialog.component";

import {
  DEFAULT_TOOLBAR_ACTIONS,
  FLAT_TOOLBAR_GROUPS,
  TOOLBAR_BUTTON_REGISTRY,
  TOOLBAR_GROUP_META,
  getRichTextTemplateBlockUiProvider,
  getRichTextTemplateBlockUiProviders,
  type RichTextFormatAction,
  type RichTextImageHandler,
  type RichTextPlaceholder,
  type RichTextTemplateBlockAttributeDefinition,
  type RichTextTemplateBlockUiProvider,
  type ToolbarButtonMeta,
  type ToolbarGroupMeta,
} from "./rich-text-editor.types";

import type {
  RichTextEditorContext,
  RichTextEditorMode,
  RichTextEditorStrategy,
} from "./rich-text-editor.strategy";

import { HtmlEditingStrategy } from "./strategies/html-editing.strategy";
import { MarkdownEditingStrategy } from "./strategies/markdown-editing.strategy";
import { MARKDOWN_PARSER, type MarkdownParser } from "./markdown-parser";
import {
  UITemplateBlockDialog,
  type TemplateBlockDialogResult,
} from "./template-block-dialog/template-block-dialog.component";

/**
 * The CSS class applied to placeholder chips inside the editable area.
 * @internal
 */
const PLACEHOLDER_CLASS = "rte-placeholder";

/** @internal */
const TEMPLATE_BLOCK_CARET_EDGE_CLASS = "rte-caret-edge";

/** @internal */
const TEMPLATE_BLOCK_CARET_EDGE_ATTR = "data-rte-caret-edge";

/** @internal */
const TEMPLATE_BLOCK_CARET_EDGE_DISPLAY_ATTR = "data-rte-caret-edge-display";

/** @internal */
const ZERO_WIDTH_SPACE = "\u200b";

/** @internal */
const RICH_CONTENT_BLOCK_NAMES = new Set([
  "a",
  "article",
  "b",
  "blockquote",
  "br",
  "caption",
  "code",
  "del",
  "div",
  "dl",
  "dt",
  "dd",
  "em",
  "figcaption",
  "figure",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "i",
  "img",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "s",
  "section",
  "span",
  "strike",
  "strong",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
]);

/** @internal */
interface PlaceholderPickerGroup {
  readonly category: string;
  readonly items: readonly PlaceholderPickerItem[];
}

/** @internal */
interface PlaceholderPickerItem extends RichTextPlaceholder {
  readonly id: string;
  readonly path: string;
  readonly depth: number;
  readonly isGroup: boolean;
  readonly showPath: boolean;
  readonly searchText: string;
}

// ── Component ──────────────────────────────────────────────────────

/**
 * Rich-text editor supporting basic formatting and placeholder
 * insertion.
 *
 * Supports two editing modes controlled by the `mode` input:
 *
 * - **`'html'`** (default) — WYSIWYG editing with a native
 *   `contenteditable` div and `document.execCommand` for
 *   formatting.  Content is stored as HTML.
 *
 * - **`'markdown'`** — Plain-text Markdown editing in a
 *   `<textarea>` with a live HTML preview below.  Formatting
 *   actions insert Markdown syntax.  Content is stored as
 *   Markdown.
 *
 * **Placeholders** are self-closing XML template blocks (e.g.
 * `<placeholder key="firstName" />`) rendered as non-editable inline chips.
 * A downstream template engine resolves them through the same block-provider
 * path used by all other template blocks.
 *
 * The editor exposes its content as a two-way `[(value)]` binding.
 *
 * @example
 * ```html
 * <ui-rich-text-editor
 *   [(value)]="emailBody"
 *   [placeholders]="availablePlaceholders"
 *   ariaLabel="Email body"
 * />
 *
 * <ui-rich-text-editor
 *   mode="markdown"
 *   [(value)]="readmeContent"
 *   ariaLabel="README editor"
 * />
 * ```
 */
@Component({
  selector: "ui-rich-text-editor",
  standalone: true,
  imports: [
    UIIcon,
    UIEmojiPicker,
    UIToolbar,
    UIButtonTool,
    UIToggleTool,
    UISeparatorTool,
    UISpacerTool,
    UIDropdownTool,
    UIButtonGroupTool,
    UIToggleGroupTool,
    UIRichTextView,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  templateUrl: "./rich-text-editor.component.html",
  styleUrl: "./rich-text-editor.component.scss",
  host: {
    class: "ui-rich-text-editor",
    "[class.disabled]": "disabled()",
    "[class.readonly]": "readonly()",
    "[class.markdown]": "mode() === 'markdown'",
    "[class.compact]": "presentation() === 'compact'",
    "[class.fullscreen]": "isFullscreen()",
    "[class.split-horizontal]":
      "isMarkdownMode() && effectiveSplitDirection() === 'horizontal'",
    "[class.split-vertical]":
      "isMarkdownMode() && effectiveSplitDirection() === 'vertical'",
  },
})
export class UIRichTextEditor implements OnInit, AfterViewInit {
  /** @internal Compact editor toolbar actions for chat-style composition. */
  private static readonly COMPACT_TOOLBAR_ACTIONS: readonly RichTextFormatAction[] =
    ["bold", "italic", "underline"];

  /** @internal Prefix for context-derived placeholder entries in the block menu. */
  private static readonly TEMPLATE_PLACEHOLDER_ITEM_PREFIX = "placeholder:";

  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly popoverService = inject(PopoverService);
  private readonly log = inject(LoggerFactory).createLogger("UIRichTextEditor");

  /**
   * Optional external Markdown parser injected via
   * {@link MARKDOWN_PARSER}.  When provided, the
   * {@link MarkdownEditingStrategy} delegates its Markdown → HTML
   * conversion to this parser instead of using the built-in
   * lightweight converter.
   */
  private readonly markdownParser = inject(MARKDOWN_PARSER, {
    optional: true,
  }) as MarkdownParser | null;

  // ── View queries ───────────────────────────────────────────

  /** @internal */
  public readonly editorRef =
    viewChild.required<ElementRef<HTMLDivElement>>("editorEl");

  /**
   * Optional reference to the Markdown textarea, present only
   * when `mode === 'markdown'`.
   * @internal
   */
  public readonly mdTextareaRef =
    viewChild<ElementRef<HTMLTextAreaElement>>("mdTextarea");

  /**
   * Syncs the Markdown textarea element reference into the
   * active strategy whenever it appears or disappears.
   * @internal
   */
  private readonly mdTextareaSync = effect(() => {
    const ref = this.mdTextareaRef();
    const strat = this.strategy();
    if (strat instanceof MarkdownEditingStrategy) {
      strat.textareaEl = ref?.nativeElement ?? null;
    }
  });

  // ── Inputs ─────────────────────────────────────────────────

  /**
   * Editing mode.
   *
   * - `'html'`     — WYSIWYG editing (default)
   * - `'markdown'` — Markdown source editing with live preview
   */
  public readonly mode = input<RichTextEditorMode>("html");

  /** Whether the editor is disabled (non-interactive). */
  public readonly disabled = input<boolean>(false);

  /**
   * Presentation style of the editor chrome.
   *
   * - `'default'` — full editor chrome with the standard toolbar.
   * - `'compact'` — chat-style editor with a minimal floating toolbar.
   */
  public readonly presentation = input<"default" | "compact">("default");

  /** Whether the editor is read-only (content visible but not editable). */
  public readonly readonly = input<boolean>(false);

  /**
   * Accessible label forwarded to the editable region via
   * `aria-label`.
   */
  public readonly ariaLabel = input<string>("Rich text editor");

  /**
   * Placeholder text shown when the editor is empty.
   */
  public readonly placeholder = input<string>("Type here…");

  /**
   * Which formatting actions to show in the toolbar.
   * Defaults to {@link DEFAULT_TOOLBAR_ACTIONS}.
   */
  public readonly toolbarActions = input<readonly RichTextFormatAction[]>(
    DEFAULT_TOOLBAR_ACTIONS,
  );

  /**
   * Optional compact-mode toolbar actions.
   *
   * When omitted, compact presentation falls back to the built-in
   * minimal toolbar set.
   */
  public readonly compactToolbarActions = input<
    readonly RichTextFormatAction[] | undefined
  >(undefined);

  /**
   * Available placeholder definitions.
   * When non-empty a placeholder picker appears in the toolbar.
   */
  public readonly placeholders = input<readonly RichTextPlaceholder[]>([]);

  /**
   * Sample context data used to derive the placeholder picker's shape.
   *
   * When provided, the picker shows object keys and array item fields from
   * this value instead of requiring a flat placeholder list. Array item fields
   * are displayed with their collection path, e.g. `lines[].description`.
   */
  public readonly placeholderContext = input<unknown | undefined>(undefined);

  /**
   * Layout of the markdown editor + preview split pane.
   * Only meaningful when `mode === 'markdown'`.
   *
   * - `'vertical'`   — textarea above, preview below (default).
   * - `'horizontal'` — textarea left, preview right (side-by-side).
   */
  public readonly splitDirection = input<"horizontal" | "vertical">("vertical");

  /**
   * Whether to sanitise HTML content before rendering.
   *
   * When `true` (default) the editor strips dangerous elements
   * (`<script>`, `<iframe>`, etc.), `on*` event handlers,
   * `javascript:` URIs, and `style` attributes from all content
   * — whether pasted, set via `value()`, or typed in source mode.
   *
   * Set to `false` to allow arbitrary HTML. **Only disable this
   * for trusted users/roles** (e.g. developers crafting
   * bookmarklets or embed snippets).
   *
   * @default true
   */
  public readonly sanitise = input<boolean>(true);

  /**
   * Optional maximum character count.  When set, a character
   * counter is shown below the editor.  The count is based on
   * the plain-text length of the content (HTML tags and Markdown
   * syntax are excluded).
   *
   * A value of `0` or `undefined` disables the limit.
   */
  public readonly maxLength = input<number | undefined>(undefined);

  /**
   * Optional callback for handling pasted images.
   *
   * When provided, the function receives the pasted image `File`
   * and should return a `Promise<string>` resolving to a URL.
   * The URL is then inserted as an `<img>` (HTML mode) or
   * `![image](url)` (Markdown mode).
   *
   * When not provided, pasted images are embedded inline as
   * base64 `data:` URIs.
   *
   * @example
   * ```html
   * <ui-rich-text-editor [imageHandler]="uploadToS3" />
   * ```
   */
  public readonly imageHandler = input<RichTextImageHandler | undefined>(
    undefined,
  );

  /**
   * Optional custom emoji categories for the inline emoji
   * picker.  When not provided the picker uses the default
   * comprehensive emoji set.
   */
  public readonly emojiCategories = input<readonly EmojiCategory[]>([]);

  // ── Two-way value ──────────────────────────────────────────

  /**
   * Content of the editor.  Two-way bindable via `[(value)]`.
   *
   * In HTML mode this is an HTML string.  In Markdown mode this
   * is a Markdown string.  Placeholder chips are serialised as
   * self-closing XML template blocks in both modes.
   */
  public readonly value = model<string>("");

  // ── Outputs ────────────────────────────────────────────────

  /** Fired when a placeholder chip is inserted. */
  public readonly placeholderInserted = output<RichTextPlaceholder>();

  // ── Strategy ───────────────────────────────────────────────

  /**
   * The active editing strategy, derived from the `mode` input.
   * @internal
   */
  protected readonly strategy = computed<RichTextEditorStrategy>(() => {
    const m = this.mode();
    if (m === "markdown") {
      return new MarkdownEditingStrategy(this.markdownParser);
    }
    return new HtmlEditingStrategy();
  });

  // ── Internal state ─────────────────────────────────────────

  /** Whether the placeholder picker dropdown is open. */
  protected readonly isPlaceholderPickerOpen = signal(false);

  /** Whether the table size picker dropdown is open. */
  protected readonly isTablePickerOpen = signal(false);

  /** Rows currently highlighted in the table size picker. */
  protected readonly tablePickerRows = signal(2);

  /** Columns currently highlighted in the table size picker. */
  protected readonly tablePickerCols = signal(3);

  /** @internal Whether the compact floating toolbar is collapsed. */
  protected readonly isCompactToolbarCollapsed = signal(false);

  /** Search term for filtering the placeholder picker. */
  protected readonly placeholderSearchTerm = signal("");

  /** Whether the editor area is currently focused. */
  protected readonly isFocused = signal(false);

  /** Whether the editor is in raw source editing mode. */
  protected readonly isSourceMode = signal(false);

  /**
   * Whether the Markdown preview pane is visible.
   * Toggled by the preview toolbar button in Markdown mode.
   */
  public readonly showMarkdownPreview = signal(true);

  /** @internal Row choices shown by the table picker. */
  protected readonly tablePickerRowOptions = [1, 2, 3, 4, 5, 6] as const;

  /** @internal Column choices shown by the table picker. */
  protected readonly tablePickerColumnOptions = [1, 2, 3, 4, 5, 6] as const;

  /** @internal True when the editor uses compact chat-style chrome. */
  protected readonly isCompactPresentation = computed(
    () => this.presentation() === "compact",
  );

  /** @internal Effective toolbar actions after applying presentation defaults. */
  protected readonly effectiveToolbarActions = computed<
    readonly RichTextFormatAction[]
  >(() =>
    this.isCompactPresentation()
      ? (this.compactToolbarActions() ??
        UIRichTextEditor.COMPACT_TOOLBAR_ACTIONS)
      : this.toolbarActions(),
  );

  /** @internal Toolbar display mode for the current presentation. */
  protected readonly toolbarDisplayMode = computed<ToolbarDisplayMode>(() =>
    this.isCompactPresentation() ? "floating-toggle" : "inline",
  );

  /**
   * Whether the current value is valid (non-empty) Markdown.
   * Used to show a validity indicator in the Markdown toolbar.
   * @internal
   */
  protected readonly isValidMarkdown = computed(() => {
    if (!this.isMarkdownMode()) return true;
    return this.value().trim().length > 0;
  });

  /** Whether the emoji picker dropdown is open. */
  protected readonly isEmojiPickerOpen = signal(false);

  /** Whether the editor is in full-screen (full-window) mode. */
  public readonly isFullscreen = signal(false);

  /**
   * Internal override for the split-pane direction, set by the toolbar
   * toggle button.  Takes precedence over the `splitDirection` input.
   * @internal
   */
  private readonly _splitDirectionOverride = signal<
    "horizontal" | "vertical" | null
  >(null);

  /**
   * The effective split-pane direction — the internal override if set,
   * otherwise the `splitDirection` input value.
   * @internal
   */
  public readonly effectiveSplitDirection = computed(
    () => this._splitDirectionOverride() ?? this.splitDirection(),
  );

  /** SVG content for the source-toggle toolbar button. @internal */
  protected readonly sourceIcon = UIIcons.Lucide.Development.CodeXml;

  /** SVG content for the emoji toolbar button. @internal */
  protected readonly emojiIcon = UIIcons.Lucide.Emoji.Smile;

  /** @internal Icon registry for the rich-text toolbar. */
  protected readonly teIcons = {
    Undo: UIIcons.Lucide.Arrows.Undo2,
    Redo: UIIcons.Lucide.Arrows.Redo2,
    Bold: UIIcons.Lucide.Text.Bold,
    Italic: UIIcons.Lucide.Text.Italic,
    Underline: UIIcons.Lucide.Text.Underline,
    Strikethrough: UIIcons.Lucide.Text.Strikethrough,
    Styles: UIIcons.Lucide.Text.Pilcrow,
    List: UIIcons.Lucide.Text.List,
    AlignLeft: UIIcons.Lucide.Text.TextAlignStart,
    AlignCenter: UIIcons.Lucide.Text.TextAlignCenter,
    AlignRight: UIIcons.Lucide.Text.TextAlignEnd,
    AlignJustify: UIIcons.Lucide.Text.TextAlignJustify,
    HorizontalRule: UIIcons.Lucide.Development.Minus,
    Table: UIIcons.Lucide.Files.Table,
    RowBefore: UIIcons.Lucide.Layout.BetweenHorizontalStart,
    RowAfter: UIIcons.Lucide.Layout.BetweenHorizontalEnd,
    ColumnBefore: UIIcons.Lucide.Layout.BetweenVerticalStart,
    ColumnAfter: UIIcons.Lucide.Layout.BetweenVerticalEnd,
    LoopRows: UIIcons.Lucide.Files.TableRowsSplit,
    Image: UIIcons.Lucide.Files.ImagePlus,
    Link: UIIcons.Lucide.Text.Link,
    RemoveFormat: UIIcons.Lucide.Text.RemoveFormatting,
    Fullscreen: UIIcons.Lucide.Layout.Maximize2,
    ExitFullscreen: UIIcons.Lucide.Layout.Minimize2,
    SplitHorizontal: UIIcons.Lucide.Layout.Columns2,
    SplitVertical: UIIcons.Lucide.Layout.Rows2,
    PreviewShow: UIIcons.Lucide.Accessibility.Eye,
    PreviewHide: UIIcons.Lucide.Accessibility.EyeOff,
    ValidMarkdown: UIIcons.Lucide.Notifications.CircleCheck,
    InvalidMarkdown: UIIcons.Lucide.Notifications.CircleAlert,
  } as const;

  /**
   * Whether the editor is in Markdown mode.  In this mode the
   * textarea is always visible as the primary editing surface.
   * @internal
   */
  public readonly isMarkdownMode = computed(() => this.mode() === "markdown");

  /**
   * Current character count of the editor content, computed
   * from the plain-text representation (strips HTML/Markdown
   * syntax).
   * @internal
   */
  protected readonly charCount = computed(() => {
    const raw = this.value();
    if (!raw) return 0;
    if (this.isMarkdownMode()) {
      // Strip Markdown syntax: headers, bold, italic, links, images, code
      return raw
        .replace(/[#*_`~[\]()!>|-]/g, "")
        .replace(/\n+/g, " ")
        .trim().length;
    }
    // Strip HTML tags and decode entities
    const tmp = document.createElement("div");
    tmp.innerHTML = raw;
    return (tmp.textContent ?? "").replace(/\u200b/g, "").trim().length;
  });

  /**
   * Whether the character count exceeds the max length.
   * @internal
   */
  protected readonly isOverMaxLength = computed(() => {
    const max = this.maxLength();
    return max != null && max > 0 && this.charCount() > max;
  });

  /**
   * Saved selection range captured when the link dialog opens,
   * so we can restore it when applying the link.
   * @internal
   */
  private savedRange: Range | null = null;

  /** Last selection range captured inside the editable document. */
  private lastEditorRange: Range | null = null;

  /** Last table cell that contained the editor caret. */
  private lastActiveTableCell: HTMLTableCellElement | null = null;

  /** @internal Triggers context recomputation when the caret moves. */
  private readonly selectionContextRevision = signal(0);

  /**
   * Set of formatting actions currently active at the caret
   * position.  Updated on every selection change, keypress,
   * and formatting command.
   *
   * @internal
   */
  protected readonly activeFormats = signal<ReadonlySet<RichTextFormatAction>>(
    new Set(),
  );

  /** @internal Whether the editor is non-interactive (disabled or readonly). */
  protected readonly isEditorDisabled = computed(
    () => this.disabled() || this.readonly(),
  );

  /** @internal Dropdown items for the block-styles dropdown. */
  protected readonly blockDropdownItems = computed<DropdownToolItem[]>(() => {
    const actions = this.effectiveToolbarActions();
    return (
      [
        "paragraph",
        "heading1",
        "heading2",
        "heading3",
        "blockquote",
        "codeBlock",
      ] as RichTextFormatAction[]
    )
      .filter((a) => actions.includes(a))
      .map((a) => ({
        id: a,
        label: TOOLBAR_BUTTON_REGISTRY[a].label,
        icon: TOOLBAR_BUTTON_REGISTRY[a].icon,
      }));
  });

  /** @internal Dropdown items for the lists dropdown. */
  protected readonly listDropdownItems = computed<DropdownToolItem[]>(() => {
    const actions = this.effectiveToolbarActions();
    return (
      [
        "unorderedList",
        "orderedList",
        "indent",
        "outdent",
      ] as RichTextFormatAction[]
    )
      .filter((a) => actions.includes(a))
      .map((a) => ({
        id: a,
        label: TOOLBAR_BUTTON_REGISTRY[a].label,
        icon: TOOLBAR_BUTTON_REGISTRY[a].icon,
      }));
  });

  /** @internal Dropdown items for contextual table editing. */
  protected readonly tableDropdownItems = computed<DropdownToolItem[]>(() => {
    if (!this.canEditActiveTable()) return [];
    return (
      [
        "insertTableRowBefore",
        "insertTableRowAfter",
        "insertTableColumnBefore",
        "insertTableColumnAfter",
        "wrapRowsLoop",
      ] as RichTextFormatAction[]
    ).map((a) => ({
      id: a,
      label: TOOLBAR_BUTTON_REGISTRY[a].label,
      icon: TOOLBAR_BUTTON_REGISTRY[a].icon,
    }));
  });

  /** @internal True when at least one history action is in the toolbar. */
  protected readonly showHistoryGroup = computed(() =>
    this.effectiveToolbarActions().some((a) => a === "undo" || a === "redo"),
  );

  /** @internal True when at least one inline-format action is in the toolbar. */
  protected readonly showInlineGroup = computed(() =>
    this.effectiveToolbarActions().some(
      (a) =>
        a === "bold" ||
        a === "italic" ||
        a === "underline" ||
        a === "strikethrough",
    ),
  );

  /** @internal True when at least one alignment action is in the toolbar. */
  protected readonly showAlignGroup = computed(() =>
    this.effectiveToolbarActions().some(
      (a) =>
        a === "alignLeft" ||
        a === "alignCenter" ||
        a === "alignRight" ||
        a === "alignJustify",
    ),
  );

  /** @internal True when at least one insert action is in the toolbar. */
  protected readonly showInsertGroup = computed(() =>
    this.effectiveToolbarActions().some(
      (a) =>
        a === "horizontalRule" ||
        a === "insertTable" ||
        a === "insertTableRowBefore" ||
        a === "insertTableRowAfter" ||
        a === "insertTableColumnBefore" ||
        a === "insertTableColumnAfter" ||
        a === "wrapRowsLoop" ||
        a === "image",
    ),
  );

  /** @internal Human-readable dimensions for the table picker. */
  protected readonly tablePickerSizeLabel = computed(
    () => `${this.tablePickerCols()} columns, ${this.tablePickerRows()} rows`,
  );

  /** @internal The active table cell under the saved editor caret. */
  protected readonly activeTableCell = computed(() => {
    this.selectionContextRevision();
    return this.getActiveTableCell();
  });

  /** @internal Whether contextual table editing commands can run. */
  protected readonly canEditActiveTable = computed(
    () =>
      !this.isMarkdownMode() &&
      !this.isSourceMode() &&
      this.activeTableCell() !== null,
  );

  /** Resolved toolbar button metadata from the actions list. */
  protected readonly toolbarButtons = computed<ToolbarButtonMeta[]>(() =>
    this.effectiveToolbarActions()
      .map((a) => TOOLBAR_BUTTON_REGISTRY[a])
      .filter(Boolean),
  );

  /**
   * Actions that are hidden in Markdown mode because they have
   * no meaningful effect on plain-text Markdown.
   * @internal
   */
  private static readonly MARKDOWN_HIDDEN_GROUPS: ReadonlySet<string> = new Set(
    ["align"],
  );

  /**
   * Grouped toolbar buttons for rendering separators between
   * groups.
   *
   * In Markdown mode the `align` group is excluded because
   * text alignment is not supported in Markdown.
   *
   * @internal
   */
  protected readonly groupedToolbarButtons = computed(() => {
    const buttons = this.toolbarButtons();
    const isMarkdown = this.isMarkdownMode();
    const groups: {
      group: string;
      buttons: ToolbarButtonMeta[];
      flat: boolean;
      meta: ToolbarGroupMeta | null;
    }[] = [];
    let currentGroup = "";
    for (const btn of buttons) {
      const g = btn.group ?? "";
      if (isMarkdown && UIRichTextEditor.MARKDOWN_HIDDEN_GROUPS.has(g)) {
        continue;
      }
      if (g !== currentGroup) {
        currentGroup = g;
        const isFlat = FLAT_TOOLBAR_GROUPS.has(g);
        groups.push({
          group: g,
          buttons: [],
          flat: isFlat,
          meta: isFlat ? null : (TOOLBAR_GROUP_META[g] ?? null),
        });
      }
      groups[groups.length - 1].buttons.push(btn);
    }
    return groups;
  });

  /**
   * Placeholder categories for the picker dropdown, filtered
   * by the current search term.
   *
   * @internal
   */
  protected readonly placeholderPickerGroups = computed<
    readonly PlaceholderPickerGroup[]
  >(() => {
    const context = this.placeholderContext();
    if (context !== undefined && context !== null) {
      return this.buildPlaceholderGroupsFromContext(context);
    }

    const ph = this.placeholders();
    if (!ph.length) return [];
    const term = this.placeholderSearchTerm().toLowerCase().trim();
    const filtered = term
      ? ph.filter(
          (p) =>
            p.label.toLowerCase().includes(term) ||
            p.key.toLowerCase().includes(term),
        )
      : ph;
    if (!filtered.length) return [];
    const catMap = new Map<string, PlaceholderPickerItem[]>();
    for (const p of filtered) {
      const cat = p.category ?? "";
      if (!catMap.has(cat)) catMap.set(cat, []);
      catMap.get(cat)!.push({
        ...p,
        id: p.key,
        path: p.key,
        depth: 0,
        isGroup: false,
        showPath: false,
        searchText: `${p.label} ${p.key} ${p.category ?? ""}`.toLowerCase(),
      });
    }
    return Array.from(catMap.entries()).map(([category, items]) => ({
      category,
      items,
    }));
  });

  /**
   * Whether the placeholder picker has any source data to show.
   *
   * @internal
   */
  protected readonly hasPlaceholderPickerItems = computed(() => {
    const context = this.placeholderContext();
    if (context !== undefined && context !== null) {
      return this.buildScopedPlaceholderItemsFromContext(context).length > 0;
    }
    return this.placeholders().length > 0;
  });

  /**
   * Whether the unified template insert picker has anything to show.
   *
   * @internal
   */
  protected hasTemplateInsertItems(): boolean {
    return (
      this.hasPlaceholderPickerItems() ||
      this.templateBlockProviderItems().length > 0
    );
  }

  /**
   * Insertable template block providers for the toolbar dropdown.
   *
   * @internal
   */
  protected templateBlockDropdownItems(): DropdownToolItem[] {
    const placeholderItems = this.templateBlockPlaceholderItems().map(
      (item) => ({
        id: `${UIRichTextEditor.TEMPLATE_PLACEHOLDER_ITEM_PREFIX}${item.id}`,
        label: `Placeholder: ${item.showPath ? item.path : item.label}`,
        icon: UIIcons.Lucide.Development.CodeXml,
      }),
    );
    const uiProviders = getRichTextTemplateBlockUiProviders();
    const providerItems = uiProviders
      .filter((provider) => provider.name !== "placeholder")
      .map((provider) => ({
        id: provider.name,
        label: provider.label,
        icon:
          provider.display === "block"
            ? UIIcons.Lucide.Layout.PanelTop
            : UIIcons.Lucide.Development.CodeXml,
      }));
    const uiProviderNames = new Set(
      uiProviders.map((provider) => provider.name),
    );
    const genericProviderItems = getRegisteredTextTemplateBlockProviders()
      .filter(
        (provider) =>
          provider.name !== "placeholder" &&
          !uiProviderNames.has(provider.name) &&
          !RICH_CONTENT_BLOCK_NAMES.has(provider.name),
      )
      .map((provider) => ({
        id: provider.name,
        label: this.humanizeTemplateBlockName(provider.name),
        icon:
          provider.contentModel === "container"
            ? UIIcons.Lucide.Layout.PanelTop
            : UIIcons.Lucide.Development.CodeXml,
      }));
    return [...placeholderItems, ...providerItems, ...genericProviderItems];
  }

  /**
   * Insertable non-placeholder template blocks for the unified picker.
   *
   * @internal
   */
  protected templateBlockProviderItems(): DropdownToolItem[] {
    return this.templateBlockDropdownItems().filter(
      (item) =>
        !item.id.startsWith(UIRichTextEditor.TEMPLATE_PLACEHOLDER_ITEM_PREFIX),
    );
  }

  /**
   * Placeholder leaves exposed in the unified XML block dropdown.
   *
   * @internal
   */
  protected readonly templateBlockPlaceholderItems = computed<
    readonly PlaceholderPickerItem[]
  >(() => {
    const context = this.placeholderContext();
    if (context !== undefined && context !== null) {
      return this.buildScopedPlaceholderItemsFromContext(context).filter(
        (item) => !item.isGroup,
      );
    }
    return this.buildPlaceholderItemsFromPlaceholders(this.placeholders());
  });

  /**
   * The source-toggle button label, from the active strategy.
   * @internal
   */
  protected readonly sourceToggleLabel = computed(
    () => this.strategy().sourceToggleLabel,
  );

  /** Tracks whether init has happened to avoid premature reads. */
  private initialised = false;

  /**
   * The last value that was synced to/from the editor,
   * used to distinguish internal edits from external
   * model changes and avoid feedback loops.
   */
  private lastSyncedValue = "";

  /**
   * Watches the `value` model signal and re-renders the
   * editor whenever the value changes externally (i.e. not
   * from the editor itself).
   */
  private readonly valueChangeEffect = effect(() => {
    const val = this.value();
    if (this.initialised && val !== this.lastSyncedValue) {
      untracked(() => {
        this.lastSyncedValue = val;
        this.renderToEditor(val);
      });
    }
  });

  /**
   * Watches the `strategy` computed (derived from `mode`) and
   * re-renders the editor content whenever the mode changes.
   * Also resets transient UI state that is mode-specific.
   */
  private readonly modeChangeEffect = effect(() => {
    // Track the strategy signal — it changes when mode() changes
    this.strategy();
    if (!this.initialised) return;
    untracked(() => {
      this.isSourceMode.set(false);
      this.isPlaceholderPickerOpen.set(false);
      this.isTablePickerOpen.set(false);
      this.isEmojiPickerOpen.set(false);
      this.activeFormats.set(new Set());
      this.renderToEditor(this.value());
    });
  });

  /** Resets compact-only UI state when presentation or mode changes. */
  private readonly compactPresentationEffect = effect(() => {
    const isCompact = this.isCompactPresentation();
    const isMarkdown = this.isMarkdownMode();

    untracked(() => {
      this.isCompactToolbarCollapsed.set(isCompact);
      this.showMarkdownPreview.set(!(isCompact && isMarkdown));
    });
  });

  // ── Lifecycle ──────────────────────────────────────────────

  public ngOnInit(): void {
    const onSelectionChange = () => {
      this.captureEditorSelectionFromWindow();
      if (this.isFocused()) {
        this.doRefreshActiveFormats();
      }
    };
    document.addEventListener("selectionchange", onSelectionChange);
    this.destroyRef.onDestroy(() => {
      document.removeEventListener("selectionchange", onSelectionChange);
    });

    // Close toolbar pickers on outside click
    const onDocumentClick = (event: MouseEvent) => {
      if (
        !this.isPlaceholderPickerOpen() &&
        !this.isTablePickerOpen() &&
        !this.isEmojiPickerOpen()
      ) {
        return;
      }
      const target = event.target as HTMLElement;
      const host = this.elRef.nativeElement as HTMLElement;
      if (!host.contains(target)) {
        this.isPlaceholderPickerOpen.set(false);
        this.isTablePickerOpen.set(false);
        this.isEmojiPickerOpen.set(false);
        return;
      }
      const inDropdown = target.closest(
        ".placeholder-picker, .table-picker-wrapper, .emoji-picker-wrapper",
      );
      if (!inDropdown) {
        this.isPlaceholderPickerOpen.set(false);
        this.isTablePickerOpen.set(false);
        this.isEmojiPickerOpen.set(false);
      }
    };
    document.addEventListener("click", onDocumentClick, true);
    this.destroyRef.onDestroy(() => {
      document.removeEventListener("click", onDocumentClick, true);
    });
  }

  public ngAfterViewInit(): void {
    const val = this.value();
    this.lastSyncedValue = val;
    this.renderToEditor(val);
    this.initialised = true;

    // Exit full-screen when Escape is pressed anywhere in the document
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && this.isFullscreen()) {
        this.isFullscreen.set(false);
      }
    };
    document.addEventListener("keydown", onEscape, { capture: true });
    this.destroyRef.onDestroy(() =>
      document.removeEventListener("keydown", onEscape, { capture: true }),
    );
  }

  // ── Context factory ────────────────────────────────────────

  /**
   * Builds the {@link RichTextEditorContext} for strategy methods.
   * @internal
   */
  private buildContext(): RichTextEditorContext {
    return {
      editorEl: this.editorRef().nativeElement,
      hostEl: this.elRef.nativeElement,
      placeholders: this.placeholders(),
      sanitise: this.sanitise(),
      restoreFocus: () => this.restoreFocus(),
    };
  }

  // ── Formatting commands ────────────────────────────────────

  /**
   * Executes a formatting action.
   *
   * @internal
   */
  /** @internal Routes toolbar tool-action events to the appropriate handler. */
  protected onToolAction(event: ToolActionEvent): void {
    const id = event.itemId;
    if (id === "source-mode") {
      this.toggleSourceMode();
      return;
    }
    if (id === "fullscreen") {
      this.toggleFullscreen();
      return;
    }
    if (id === "split-direction") {
      this.cycleSplitDirection();
      return;
    }
    if (id === "toggle-preview") {
      this.showMarkdownPreview.update((v) => !v);
      return;
    }
    if (id === "template-block") {
      const tool = event.itemRef as UIDropdownTool;
      const blockName = tool.selectedItemId();
      if (blockName) {
        if (
          blockName.startsWith(
            UIRichTextEditor.TEMPLATE_PLACEHOLDER_ITEM_PREFIX,
          )
        ) {
          const placeholderId = blockName.slice(
            UIRichTextEditor.TEMPLATE_PLACEHOLDER_ITEM_PREFIX.length,
          );
          const placeholder = this.templateBlockPlaceholderItems().find(
            (item) => item.id === placeholderId,
          );
          if (placeholder) this.insertPlaceholder(placeholder);
          return;
        }
        this.openTemplateBlockDialog(
          blockName,
          event.event?.target as Element | undefined,
        );
      }
      return;
    }
    if (id === "block" || id === "list" || id === "table") {
      const tool = event.itemRef as UIDropdownTool;
      const actionId = tool.selectedItemId() as
        | RichTextFormatAction
        | undefined;
      if (actionId) {
        this.execAction(actionId, event.event?.target as Element | undefined);
      }
      return;
    }
    this.execAction(
      id as RichTextFormatAction,
      event.event?.target as Element | undefined,
    );
  }

  /** @internal Returns true when the given action is in the toolbar. */
  protected hasToolbarAction(action: RichTextFormatAction): boolean {
    return this.effectiveToolbarActions().includes(action);
  }

  /** @internal Syncs the compact floating toolbar collapsed state. */
  protected onToolbarCollapsedChange(value: boolean): void {
    this.isCompactToolbarCollapsed.set(value);
  }

  protected execAction(action: RichTextFormatAction, anchorEl?: Element): void {
    if (this.disabled() || this.readonly()) return;

    // In HTML mode, restore focus to the contenteditable element
    // before executing the action.  In Markdown mode the textarea
    // handles its own focus.
    if (!this.isMarkdownMode()) {
      const savedRange = this.lastEditorRange?.cloneRange() ?? null;
      this.restoreFocus();
      this.restoreLastEditorSelection(savedRange);
    }

    const ctx = this.buildContext();
    const strat = this.strategy();

    if (action === "link") {
      this.openLinkDialog(anchorEl ?? null);
      return;
    }

    if (action === "image") {
      this.openImageDialog(anchorEl ?? null);
      return;
    }

    if (action === "insertTable") {
      this.insertTable();
      return;
    }

    if (action === "insertTableRowBefore") {
      this.insertTableRowAtCursor("before");
      return;
    }

    if (action === "insertTableRowAfter") {
      this.insertTableRowAtCursor("after");
      return;
    }

    if (action === "insertTableColumnBefore") {
      this.insertTableColumnAtCursor("before");
      return;
    }

    if (action === "insertTableColumnAfter") {
      this.insertTableColumnAtCursor("after");
      return;
    }

    if (action === "wrapRowsLoop") {
      this.openWrapTableRowsLoopDialog(anchorEl ?? null);
      return;
    }

    const handled = strat.execAction(action, ctx);
    if (handled) {
      this.syncValueFromEditor();
      this.doRefreshActiveFormats();
    }
  }

  // ── Placeholder insertion ──────────────────────────────────

  /**
   * Inserts a placeholder at the current caret position.
   *
   * In HTML mode this inserts a chip DOM element.
   * In Markdown mode this inserts a self-closing XML block string.
   *
   * @internal
   */
  protected insertPlaceholder(placeholder: RichTextPlaceholder): void {
    if (this.disabled() || this.readonly()) return;

    const insertedPlaceholder: RichTextPlaceholder = {
      key: placeholder.key,
      label: placeholder.label,
      ...(placeholder.category ? { category: placeholder.category } : {}),
    };

    if (this.isMarkdownMode()) {
      this.insertPlaceholderMarkdown(insertedPlaceholder);
    } else {
      this.insertPlaceholderHtml(insertedPlaceholder);
    }

    this.isPlaceholderPickerOpen.set(false);
    this.placeholderInserted.emit(insertedPlaceholder);
  }

  /**
   * Inserts a placeholder chip into the contenteditable editor
   * (HTML mode).
   * @internal
   */
  private insertPlaceholderHtml(placeholder: RichTextPlaceholder): void {
    this.restoreFocus();
    this.restoreLastEditorSelection();
    const strat = this.strategy();
    const chip = strat.createPlaceholderChip(placeholder);
    const before = this.createTemplateBlockCaretEdge("before", "block");
    const after = this.createTemplateBlockCaretEdge("after");

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      this.insertNodesAtSelection([before, chip, after]);
    } else {
      this.editorRef().nativeElement.append(before, chip, after);
    }

    this.syncValueFromEditor();
  }

  /**
   * Inserts a self-closing placeholder block into the Markdown
   * textarea.
   * @internal
   */
  private insertPlaceholderMarkdown(placeholder: RichTextPlaceholder): void {
    const strat = this.strategy();
    if (strat instanceof MarkdownEditingStrategy && strat.textareaEl) {
      const textarea = strat.textareaEl;
      const token = `<placeholder key="${this.escapeXmlAttribute(placeholder.key)}" />`;
      const { selectionStart, selectionEnd, value } = textarea;
      textarea.value =
        value.substring(0, selectionStart) +
        token +
        value.substring(selectionEnd);
      textarea.selectionStart = selectionStart + token.length;
      textarea.selectionEnd = selectionStart + token.length;
      textarea.focus();
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
    this.syncValueFromEditor();
  }

  /** @internal */
  private buildPlaceholderGroupsFromContext(
    context: unknown,
  ): readonly PlaceholderPickerGroup[] {
    const items = this.buildScopedPlaceholderItemsFromContext(context);
    const term = this.placeholderSearchTerm().toLowerCase().trim();
    const filtered = term
      ? items.filter((item) => item.searchText.includes(term))
      : items;
    return filtered.length ? [{ category: "Context", items: filtered }] : [];
  }

  /** @internal */
  private buildScopedPlaceholderItemsFromContext(
    context: unknown,
  ): readonly PlaceholderPickerItem[] {
    this.selectionContextRevision();
    const rootItems = this.buildPlaceholderItemsFromContext(context, {
      depth: 0,
      pathPrefix: "",
      keyPrefix: "",
      insideArray: false,
      includeArrayChildren: false,
    });
    const loopItemsKey = this.getActiveLoopItemsKey();
    if (!loopItemsKey || !this.isInspectableObject(context)) return rootItems;

    const loopItems = context[loopItemsKey];
    if (!Array.isArray(loopItems)) return rootItems;

    const sample = loopItems.find(
      (item) => item !== null && item !== undefined,
    );
    if (!this.isInspectableObject(sample)) return rootItems;

    const localItems = this.buildPlaceholderItemsFromContext(sample, {
      depth: 0,
      pathPrefix: `${loopItemsKey}[]`,
      keyPrefix: "",
      insideArray: true,
      includeArrayChildren: false,
    })
      .filter((item) => !item.isGroup)
      .map((item) => ({
        ...item,
        path: item.key,
        showPath: false,
        searchText:
          `${item.searchText} ${loopItemsKey}[].${item.key}`.toLowerCase(),
      }));

    return [...localItems, ...rootItems];
  }

  /** @internal */
  private buildPlaceholderItemsFromPlaceholders(
    placeholders: readonly RichTextPlaceholder[],
  ): readonly PlaceholderPickerItem[] {
    return placeholders.map((placeholder) => ({
      ...placeholder,
      id: placeholder.key,
      path: placeholder.key,
      depth: 0,
      isGroup: false,
      showPath: false,
      searchText:
        `${placeholder.label} ${placeholder.key} ${placeholder.category ?? ""}`.toLowerCase(),
    }));
  }

  /** @internal */
  private buildPlaceholderItemsFromContext(
    value: unknown,
    options: {
      readonly depth: number;
      readonly pathPrefix: string;
      readonly keyPrefix: string;
      readonly insideArray: boolean;
      readonly includeArrayChildren: boolean;
    },
  ): readonly PlaceholderPickerItem[] {
    if (!this.isInspectableObject(value)) return [];

    const items: PlaceholderPickerItem[] = [];
    for (const [key, child] of Object.entries(value)) {
      const path = options.pathPrefix ? `${options.pathPrefix}.${key}` : key;
      const insertionKey = options.insideArray
        ? key
        : options.keyPrefix
          ? `${options.keyPrefix}.${key}`
          : key;

      if (Array.isArray(child)) {
        items.push(
          ...this.buildPlaceholderItemsFromArray(child, {
            depth: options.depth,
            key,
            path,
            includeChildren: options.includeArrayChildren,
          }),
        );
        continue;
      }

      if (this.isInspectableObject(child)) {
        items.push({
          key: insertionKey,
          label: key,
          id: `group:${path}`,
          path,
          depth: options.depth,
          isGroup: true,
          showPath: path !== key,
          searchText: `${key} ${path}`.toLowerCase(),
        });
        items.push(
          ...this.buildPlaceholderItemsFromContext(child, {
            depth: options.depth + 1,
            pathPrefix: path,
            keyPrefix: insertionKey,
            insideArray: options.insideArray,
            includeArrayChildren: options.includeArrayChildren,
          }),
        );
        continue;
      }

      items.push({
        key: insertionKey,
        label: key,
        id: `leaf:${path}`,
        path,
        depth: options.depth,
        isGroup: false,
        showPath: path !== key,
        searchText: `${key} ${path} ${insertionKey}`.toLowerCase(),
      });
    }
    return items;
  }

  /** @internal */
  private buildPlaceholderItemsFromArray(
    value: readonly unknown[],
    options: {
      readonly depth: number;
      readonly key: string;
      readonly path: string;
      readonly includeChildren: boolean;
    },
  ): readonly PlaceholderPickerItem[] {
    const arrayPath = `${options.path}[]`;
    const items: PlaceholderPickerItem[] = [
      {
        key: options.key,
        label: `${options.key}[]`,
        id: `group:${arrayPath}`,
        path: arrayPath,
        depth: options.depth,
        isGroup: true,
        showPath: false,
        searchText: `${options.key} ${arrayPath}`.toLowerCase(),
      },
    ];
    if (!options.includeChildren) return items;
    const sample = value.find((item) => item !== null && item !== undefined);
    if (this.isInspectableObject(sample)) {
      items.push(
        ...this.buildPlaceholderItemsFromContext(sample, {
          depth: options.depth + 1,
          pathPrefix: arrayPath,
          keyPrefix: "",
          insideArray: true,
          includeArrayChildren: options.includeChildren,
        }),
      );
    }
    return items;
  }

  /** @internal */
  private isInspectableObject(
    value: unknown,
  ): value is Record<string, unknown> {
    return (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    );
  }

  /**
   * Opens the generic template-block editor for inserting a block.
   *
   * @internal
   */
  private openTemplateBlockDialog(blockName: string, anchorEl?: Element): void {
    if (this.disabled() || this.readonly()) return;
    const provider = this.getTemplateBlockUiProvider(blockName);
    if (!provider) return;
    const ref = this.popoverService.openPopover<
      UITemplateBlockDialog,
      TemplateBlockDialogResult
    >({
      component: UITemplateBlockDialog,
      anchor: anchorEl ?? this.elRef.nativeElement,
      inputs: {
        blockName,
        blockLabel: provider.label,
        initialAttributes: this.defaultTemplateBlockAttributes(provider),
        attributeDefinitions:
          this.getTemplateBlockAttributeDefinitions(provider),
        editMode: false,
      },
      ariaLabel: `Insert ${provider.label} block`,
      closeOnOutsideClick: false,
    });
    ref.closed.subscribe((result) => {
      if (!result) return;
      this.insertTemplateBlock(result, provider);
    });
  }

  /**
   * Inserts a new template block into the active editor.
   *
   * @internal
   */
  private insertTemplateBlock(
    result: TemplateBlockDialogResult,
    provider: RichTextTemplateBlockUiProvider,
  ): void {
    const xml = this.buildTemplateBlockXml(result, provider);
    if (this.isMarkdownMode()) {
      const strat = this.strategy();
      if (strat instanceof MarkdownEditingStrategy && strat.textareaEl) {
        this.insertTextIntoTextarea(strat.textareaEl, xml);
      }
      this.syncValueFromEditor();
      return;
    }
    if (this.isSourceMode()) {
      const host = this.elRef.nativeElement as HTMLElement;
      const source = host.querySelector<HTMLTextAreaElement>(".source-editor");
      if (source) {
        this.insertTextIntoTextarea(source, xml);
      }
      return;
    }
    this.restoreFocus();
    this.restoreLastEditorSelection();
    const nodes = this.renderTemplateBlockNodes(xml);
    this.insertNodesAtSelection(nodes);
    this.syncValueFromEditor();
  }

  /**
   * Inserts an XML-compatible HTML table at the current caret.
   *
   * @internal
   */
  private insertTable(columns = 3, rows = 2): void {
    const colCount = Math.max(1, columns);
    const rowCount = Math.max(1, rows);
    const headerCells = Array.from(
      { length: colCount },
      (_, index) => `<th>Column ${index + 1}</th>`,
    ).join("");
    const bodyRows = Array.from(
      { length: rowCount },
      () =>
        `<tr>${Array.from({ length: colCount }, () => "<td>Value</td>").join("")}</tr>`,
    ).join("");
    const tableXml = [
      "<table>",
      "<thead>",
      `<tr>${headerCells}</tr>`,
      "</thead>",
      "<tbody>",
      bodyRows,
      "</tbody>",
      "</table>",
    ].join("");

    if (this.isMarkdownMode()) {
      const strat = this.strategy();
      if (strat instanceof MarkdownEditingStrategy && strat.textareaEl) {
        this.insertTextIntoTextarea(strat.textareaEl, tableXml);
      }
      this.syncValueFromEditor();
      return;
    }

    if (this.isSourceMode()) {
      const host = this.elRef.nativeElement as HTMLElement;
      const source = host.querySelector<HTMLTextAreaElement>(".source-editor");
      if (source) this.insertTextIntoTextarea(source, tableXml);
      return;
    }

    this.restoreFocus();
    this.restoreLastEditorSelection();
    const nodes = this.renderTemplateBlockNodes(tableXml);
    this.insertNodesAtSelection(nodes);
    this.syncValueFromEditor();
  }

  /**
   * Inserts a row before or after the current table row.
   *
   * @internal
   */
  private insertTableRowAtCursor(position: "before" | "after"): void {
    if (this.isMarkdownMode() || this.isSourceMode()) return;

    this.restoreLastEditorSelection();
    const cell = this.getActiveTableCell();
    const row = cell?.closest<HTMLTableRowElement>("tr");
    if (!row?.parentElement) return;

    const newRow = this.createTableRowLike(row);
    if (position === "before") {
      row.before(newRow);
    } else {
      row.after(newRow);
    }
    this.syncValueFromEditor();
    this.doRefreshActiveFormats();
  }

  /**
   * Inserts a column before or after the current table column.
   *
   * @internal
   */
  private insertTableColumnAtCursor(position: "before" | "after"): void {
    if (this.isMarkdownMode() || this.isSourceMode()) return;

    this.restoreLastEditorSelection();
    const cell = this.getActiveTableCell();
    const row = cell?.closest<HTMLTableRowElement>("tr");
    const table = cell?.closest<HTMLTableElement>("table");
    if (!cell || !row || !table) return;

    const cellIndex = Array.from(row.cells).indexOf(cell);
    if (cellIndex < 0) return;

    for (const tableRow of this.getDirectTableRows(table)) {
      if (tableRow.classList.contains("rte-template-block")) continue;
      const cells = Array.from(tableRow.cells);
      const tagName = this.getTableCellTagName(tableRow);
      const newCell = this.createTableCell(tagName);
      const insertionIndex = position === "before" ? cellIndex : cellIndex + 1;
      const referenceCell = cells[insertionIndex] ?? null;
      tableRow.insertBefore(newCell, referenceCell);
    }

    this.syncValueFromEditor();
    this.doRefreshActiveFormats();
  }

  /**
   * Opens the loop property sheet and wraps the selected/current table rows.
   *
   * @internal
   */
  private openWrapTableRowsLoopDialog(anchorEl: Element | null): void {
    if (this.isMarkdownMode() || this.isSourceMode()) return;

    this.restoreLastEditorSelection();
    const rows = this.getSelectedWrappableTableRows(anchorEl);
    if (!rows.length) return;

    const provider = this.getTemplateBlockUiProvider("loop");
    if (!provider) return;

    const ref = this.popoverService.openPopover<
      UITemplateBlockDialog,
      TemplateBlockDialogResult
    >({
      component: UITemplateBlockDialog,
      anchor: anchorEl ?? this.elRef.nativeElement,
      inputs: {
        blockName: "loop",
        blockLabel: provider.label,
        initialAttributes: this.defaultTemplateBlockAttributes(provider),
        attributeDefinitions:
          this.getTemplateBlockAttributeDefinitions(provider),
        editMode: false,
      },
      ariaLabel: "Loop table rows",
      closeOnOutsideClick: false,
    });

    ref.closed.subscribe((result) => {
      if (!result) return;
      this.wrapTableRowsInTemplateBlock(rows, result, provider);
    });
  }

  /**
   * Handles browser caret edge cases before the native selection settles.
   *
   * @internal
   */
  protected onEditorMouseDown(event: MouseEvent): void {
    if (this.disabled() || this.readonly() || this.isMarkdownMode()) return;
    const target = event.target as HTMLElement;
    const clickedTemplateUi = target.closest("[data-template-block], .header");
    if (clickedTemplateUi) return;

    const cell = target.closest<HTMLTableCellElement>("td, th");
    if (!cell || !this.editorRef().nativeElement.contains(cell)) return;
    if (!cell.querySelector("[data-template-block]")) return;

    event.preventDefault();
    this.placeCaretAtEndOfTableCell(cell);
  }

  /**
   * Handles clicks on rendered template block chips and headers.
   *
   * @internal
   */
  protected onEditorClick(event: MouseEvent): void {
    if (this.disabled() || this.readonly() || this.isMarkdownMode()) return;
    const target = event.target as HTMLElement;
    const selfClosingBlock = target.closest<HTMLElement>(
      "[data-template-block][data-template-self-closing='true']",
    );
    const header = target.closest<HTMLElement>(".rte-template-block .header");
    const block =
      selfClosingBlock ?? header?.closest<HTMLElement>("[data-template-block]");
    if (!block) return;
    event.preventDefault();
    this.openExistingTemplateBlockDialog(block, target);
  }

  /**
   * Opens the generic template-block editor for an existing rendered block.
   *
   * @internal
   */
  private openExistingTemplateBlockDialog(
    block: HTMLElement,
    anchorEl: Element,
  ): void {
    const blockName = block.dataset["templateBlock"] ?? "";
    const provider =
      getRichTextTemplateBlockUiProvider(blockName) ??
      this.createGenericTemplateBlockUiProvider(block);
    const ref = this.popoverService.openPopover<
      UITemplateBlockDialog,
      TemplateBlockDialogResult
    >({
      component: UITemplateBlockDialog,
      anchor: anchorEl,
      inputs: {
        blockName,
        blockLabel: provider.label,
        initialAttributes: this.readTemplateDatasetAttributes(block),
        attributeDefinitions:
          this.getTemplateBlockAttributeDefinitions(provider),
        editMode: true,
      },
      ariaLabel: `Edit ${provider.label} block`,
      closeOnOutsideClick: false,
    });
    ref.closed.subscribe((result) => {
      if (!result) return;
      this.replaceTemplateBlock(block, result, provider);
    });
  }

  /** @internal */
  protected togglePlaceholderPicker(): void {
    if (this.disabled() || this.readonly()) return;
    this.isEmojiPickerOpen.set(false);
    this.isTablePickerOpen.set(false);
    this.isPlaceholderPickerOpen.update((v) => {
      if (v) this.placeholderSearchTerm.set("");
      return !v;
    });
  }

  /** @internal */
  protected closePlaceholderPicker(): void {
    this.isPlaceholderPickerOpen.set(false);
    this.placeholderSearchTerm.set("");
  }

  /** @internal */
  protected toggleTablePicker(): void {
    if (this.disabled() || this.readonly()) return;
    this.isPlaceholderPickerOpen.set(false);
    this.isEmojiPickerOpen.set(false);
    this.isTablePickerOpen.update((value) => !value);
  }

  /** @internal */
  protected setTablePickerSize(row: number, col: number): void {
    this.tablePickerRows.set(row);
    this.tablePickerCols.set(col);
  }

  /** @internal */
  protected isTablePickerCellActive(row: number, col: number): boolean {
    return row <= this.tablePickerRows() && col <= this.tablePickerCols();
  }

  /** @internal */
  protected insertSelectedTable(): void {
    this.insertTable(this.tablePickerCols(), this.tablePickerRows());
    this.isTablePickerOpen.set(false);
  }

  /**
   * Opens the block property sheet from the unified template insert picker.
   *
   * @internal
   */
  protected insertTemplateBlockFromPicker(
    blockName: string,
    event: MouseEvent,
  ): void {
    const anchor = event.currentTarget as Element | null;
    this.openTemplateBlockDialog(blockName, anchor ?? undefined);
    this.closePlaceholderPicker();
  }

  // ── Emoji picker ──────────────────────────────────────────

  /**
   * Toggles the emoji picker dropdown.
   * @internal
   */
  protected toggleEmojiPicker(): void {
    if (this.disabled() || this.readonly()) return;
    this.isPlaceholderPickerOpen.set(false);
    this.isTablePickerOpen.set(false);
    this.isEmojiPickerOpen.update((v) => !v);
  }

  /**
   * Inserts the selected emoji at the current caret position.
   * @internal
   */
  protected insertEmoji(emoji: string): void {
    if (this.disabled() || this.readonly()) return;
    this.isEmojiPickerOpen.set(false);

    if (this.isMarkdownMode()) {
      this.insertEmojiMarkdown(emoji);
    } else {
      this.insertEmojiHtml(emoji);
    }
  }

  /**
   * Inserts an emoji character into the contenteditable editor
   * (HTML mode).
   * @internal
   */
  private insertEmojiHtml(emoji: string): void {
    this.restoreFocus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(emoji);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      this.editorRef().nativeElement.appendChild(
        document.createTextNode(emoji),
      );
    }
    this.syncValueFromEditor();
  }

  /**
   * Inserts an emoji character into the Markdown textarea.
   * @internal
   */
  private insertEmojiMarkdown(emoji: string): void {
    const strat = this.strategy();
    if (strat instanceof MarkdownEditingStrategy && strat.textareaEl) {
      const textarea = strat.textareaEl;
      const { selectionStart, selectionEnd, value } = textarea;
      textarea.value =
        value.substring(0, selectionStart) +
        emoji +
        value.substring(selectionEnd);
      textarea.selectionStart = selectionStart + emoji.length;
      textarea.selectionEnd = selectionStart + emoji.length;
      textarea.focus();
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
    this.syncValueFromEditor();
  }

  /**
   * Updates the placeholder picker search term.
   * @internal
   */
  protected onPlaceholderSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.placeholderSearchTerm.set(input.value);
  }

  // ── Hyperlink dialog ───────────────────────────────────────

  /**
   * Opens the hyperlink popover.
   * @internal
   */
  private openLinkDialog(anchorEl: Element | null): void {
    if (this.disabled() || this.readonly()) return;
    this.isPlaceholderPickerOpen.set(false);
    this.isTablePickerOpen.set(false);
    this.isEmojiPickerOpen.set(false);

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      this.savedRange = sel.getRangeAt(0).cloneRange();
    }

    const existingAnchor = this.findAncestorAnchor();
    const isEdit = !!existingAnchor;
    const initialUrl = existingAnchor?.getAttribute("href") ?? "";
    const initialText = existingAnchor
      ? (existingAnchor.textContent ?? "")
      : (sel?.toString() ?? "");

    const anchor = anchorEl ?? this.elRef.nativeElement;

    const ref = this.popoverService.openPopover<UILinkDialog, LinkDialogResult>(
      {
        component: UILinkDialog,
        anchor,
        verticalAxisAlignment: "bottom",
        horizontalAxisAlignment: "center",
        verticalOffset: 4,
        closeOnOutsideClick: true,
        inputs: {
          initialUrl,
          initialText,
          editMode: isEdit,
        },
      },
    );

    ref.closed.subscribe((result) => {
      if (result) {
        this.applyLinkResult(result, existingAnchor);
      } else {
        this.savedRange = null;
        this.restoreFocus();
      }
    });
  }

  /**
   * Applies the link result returned by the popover.
   * @internal
   */
  private applyLinkResult(
    result: LinkDialogResult,
    existingAnchor: HTMLAnchorElement | null,
  ): void {
    const ctx = this.buildContext();
    const strat = this.strategy();

    strat.applyLink(result, existingAnchor, this.savedRange, ctx);

    this.savedRange = null;
    this.syncValueFromEditor();
    this.doRefreshActiveFormats();
  }

  /**
   * Finds the closest `<a>` ancestor of the current selection.
   * @internal
   */
  private findAncestorAnchor(): HTMLAnchorElement | null {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    let node: Node | null = sel.anchorNode;
    while (node && node !== this.editorRef().nativeElement) {
      if (node instanceof HTMLAnchorElement) return node;
      node = node.parentNode;
    }
    return null;
  }

  // ── Image dialog ───────────────────────────────────────────

  /**
   * Opens the image insertion popover.
   * @internal
   */
  private openImageDialog(anchorEl: Element | null): void {
    if (this.disabled() || this.readonly()) return;
    this.isPlaceholderPickerOpen.set(false);
    this.isTablePickerOpen.set(false);
    this.isEmojiPickerOpen.set(false);

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      this.savedRange = sel.getRangeAt(0).cloneRange();
    }

    const anchor = anchorEl ?? this.elRef.nativeElement;

    const ref = this.popoverService.openPopover<
      UIImageDialog,
      ImageDialogResult
    >({
      component: UIImageDialog,
      anchor,
      verticalAxisAlignment: "bottom",
      horizontalAxisAlignment: "center",
      verticalOffset: 4,
      closeOnOutsideClick: true,
      inputs: {
        initialSrc: "",
        initialAlt: "",
      },
    });

    ref.closed.subscribe((result) => {
      if (result) {
        this.applyImageResult(result);
      } else {
        this.savedRange = null;
        this.restoreFocus();
      }
    });
  }

  /**
   * Applies the image result returned by the popover.
   * @internal
   */
  private applyImageResult(result: ImageDialogResult): void {
    const ctx = this.buildContext();
    const strat = this.strategy();

    if (this.isMarkdownMode()) {
      // Insert Markdown image syntax into the textarea
      if (strat instanceof MarkdownEditingStrategy && strat.textareaEl) {
        const textarea = strat.textareaEl;
        const imgMarkdown = `![${result.alt}](${result.src})`;
        const { selectionStart, selectionEnd, value } = textarea;
        textarea.value =
          value.substring(0, selectionStart) +
          imgMarkdown +
          value.substring(selectionEnd);
        textarea.selectionStart = selectionStart + imgMarkdown.length;
        textarea.selectionEnd = selectionStart + imgMarkdown.length;
        textarea.focus();
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } else {
      // Restore selection range and insert <img> in HTML mode
      if (this.savedRange) {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(this.savedRange);
        }
      }
      this.restoreFocus();
      const img = document.createElement("img");
      img.src = result.src;
      img.alt = result.alt;
      img.style.maxWidth = "100%";

      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
        range.setStartAfter(img);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        ctx.editorEl.appendChild(img);
      }
    }

    this.savedRange = null;
    this.syncValueFromEditor();
    this.doRefreshActiveFormats();
  }

  /**
   * Returns `true` when the given formatting action is currently
   * active at the caret position.
   * @internal
   */
  protected isActionActive(action: RichTextFormatAction): boolean {
    return this.activeFormats().has(action);
  }

  // ── Source mode ────────────────────────────────────────────

  /**
   * Toggles between WYSIWYG-only and split source + preview mode.
   *
   * In Markdown mode this toggles the preview visibility.
   * In HTML mode this shows the raw HTML textarea.
   *
   * @internal
   */
  protected toggleSourceMode(): void {
    if (this.disabled() || this.readonly()) return;
    this.isPlaceholderPickerOpen.set(false);
    this.isTablePickerOpen.set(false);
    this.isEmojiPickerOpen.set(false);
    const next = !this.isSourceMode();
    this.isSourceMode.set(next);
    if (!next) {
      this.renderToEditor(this.value());
      this.doRefreshActiveFormats();
    }
  }

  /**
   * Toggles the editor between full-screen (full-window overlay) and
   * normal inline mode.
   *
   * @internal
   */
  protected toggleFullscreen(): void {
    this.isFullscreen.update((v) => !v);
  }

  /**
   * Cycles the markdown split-pane direction between `'vertical'` and
   * `'horizontal'`.  Has no effect unless `mode === 'markdown'`.
   *
   * @internal
   */
  protected cycleSplitDirection(): void {
    const next =
      this.effectiveSplitDirection() === "horizontal"
        ? "vertical"
        : "horizontal";
    this._splitDirectionOverride.set(next);
  }

  /**
   * Begins a drag-resize interaction on the split pane handle.
   * Tracks `pointermove` on `document` until `pointerup`/`pointercancel`,
   * adjusting the flex-basis of the textarea pane.
   *
   * @internal
   */
  protected onSplitPointerDown(event: PointerEvent): void {
    const handle = event.target as HTMLElement;
    if (!handle.classList.contains("split-handle")) return;
    event.preventDefault();

    const host = this.elRef.nativeElement;
    const isHorizontal = this.effectiveSplitDirection() === "horizontal";
    const textarea = host.querySelector(
      ".markdown-editor",
    ) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const startPos = isHorizontal ? event.clientX : event.clientY;
    const startSize = isHorizontal
      ? textarea.offsetWidth
      : textarea.offsetHeight;

    const onMove = (e: PointerEvent) => {
      const delta = (isHorizontal ? e.clientX : e.clientY) - startPos;
      const hostSize = isHorizontal ? host.offsetWidth : host.offsetHeight;
      const newSize = Math.min(Math.max(startSize + delta, 80), hostSize - 80);
      textarea.style.flexBasis = `${newSize}px`;
      textarea.style.flexGrow = "0";
      textarea.style.flexShrink = "0";
    };

    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
  }

  /**
   * Handles input events from the source-mode `<textarea>`.
   *
   * In HTML mode: writes raw HTML to `value` and live-renders
   * the preview.
   *
   * In Markdown mode: writes Markdown to `value` and live-renders
   * the HTML preview.
   *
   * @internal
   */
  protected onSourceInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.lastSyncedValue = textarea.value;
    this.value.set(textarea.value);
    if (this.isMarkdownMode()) {
      this.renderToEditor(textarea.value);
    }
    this.doRefreshActiveFormats();
  }

  // ── Editor event handlers ──────────────────────────────────

  /** @internal */
  protected onEditorInput(): void {
    if (!this.isMarkdownMode()) {
      this.syncValueFromEditor();
    }
  }

  /** @internal */
  protected onEditorFocus(): void {
    this.isFocused.set(true);
    this.doRefreshActiveFormats();
  }

  /** @internal */
  protected onEditorBlur(): void {
    this.isFocused.set(false);
    this.activeFormats.set(new Set());
  }

  /**
   * Handles paste events.
   *
   * When the clipboard contains an image file, the image is
   * processed first:
   * - If an `imageHandler` is provided, it is called and the
   *   returned URL is inserted.
   * - Otherwise the image is embedded inline as a base64
   *   `data:` URI.
   *
   * For non-image paste data, delegates to the active strategy.
   *
   * @internal
   */
  protected onEditorPaste(event: ClipboardEvent): void {
    const imageFile = this.extractImageFile(event);
    if (imageFile) {
      event.preventDefault();
      this.handleImagePaste(imageFile);
      return;
    }
    const ctx = this.buildContext();
    this.strategy().handlePaste(event, ctx);
    this.syncValueFromEditor();
  }

  /**
   * Extracts the first image `File` from a paste event's
   * clipboard data, or `null` if none is present.
   * @internal
   */
  private extractImageFile(event: ClipboardEvent): File | null {
    const items = event.clipboardData?.items;
    if (!items) return null;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) return file;
      }
    }
    return null;
  }

  /**
   * Processes a pasted image file.
   *
   * When an `imageHandler` is provided, it is called with the
   * file and the resulting URL is inserted.  Otherwise the image
   * is read as a base64 data URI and embedded inline.
   *
   * @internal
   */
  private handleImagePaste(file: File): void {
    const handler = this.imageHandler();
    if (handler) {
      handler(file).then(
        (url) => this.insertPastedImage(url, file.name),
        (err) => this.log.error("Image upload failed", [err]),
      );
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        this.insertPastedImage(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Inserts an image at the current caret position.
   *
   * In HTML mode, inserts an `<img>` element.
   * In Markdown mode, inserts `![alt](url)` syntax.
   *
   * @internal
   */
  private insertPastedImage(src: string, alt: string): void {
    if (this.isMarkdownMode()) {
      const strat = this.strategy();
      if (strat instanceof MarkdownEditingStrategy && strat.textareaEl) {
        const textarea = strat.textareaEl;
        const imgMarkdown = `![${alt}](${src})`;
        const { selectionStart, selectionEnd, value } = textarea;
        textarea.value =
          value.substring(0, selectionStart) +
          imgMarkdown +
          value.substring(selectionEnd);
        textarea.selectionStart = selectionStart + imgMarkdown.length;
        textarea.selectionEnd = selectionStart + imgMarkdown.length;
        textarea.focus();
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } else {
      this.restoreFocus();
      const img = document.createElement("img");
      img.src = src;
      img.alt = alt;
      img.style.maxWidth = "100%";

      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
        range.setStartAfter(img);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        this.editorRef().nativeElement.appendChild(img);
      }
    }
    this.syncValueFromEditor();
  }

  /**
   * Handles keyboard shortcuts and prevents deletion of
   * placeholder chip interiors.  Applies to both HTML and
   * Markdown modes.
   *
   * @internal
   */
  protected onEditorKeydown(event: KeyboardEvent): void {
    if (this.handleKeyboardShortcut(event)) return;

    // Placeholder chip protection — HTML mode only
    if (this.isMarkdownMode()) return;

    if (this.handleTableTabNavigation(event)) return;

    if (this.handleTableVerticalNavigation(event)) return;

    if (this.handleTemplateBlockCaretNavigation(event)) return;

    if (this.handleTemplateBlockCaretDeletion(event)) return;

    if (event.key === "Backspace" || event.key === "Delete") {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      const range = sel.getRangeAt(0);
      if (!range.collapsed) return;

      const node =
        event.key === "Backspace"
          ? this.previousNode(range.startContainer, range.startOffset)
          : this.nextNode(range.startContainer, range.startOffset);

      if (
        node instanceof HTMLElement &&
        node.classList.contains(PLACEHOLDER_CLASS)
      ) {
        event.preventDefault();
        node.remove();
        this.syncValueFromEditor();
      }
    }
  }

  /** @internal */
  private handleTableTabNavigation(event: KeyboardEvent): boolean {
    if (event.key !== "Tab") return false;
    if (event.altKey || event.ctrlKey || event.metaKey) return false;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const range = this.normaliseTemplateBlockCaretEdgeRange(
      selection.getRangeAt(0),
    );
    if (!this.isRangeInsideEditor(range)) return false;

    const currentCell = this.getTableCellFromRange(range);
    if (!currentCell) return false;

    const currentRow = currentCell.closest<HTMLTableRowElement>("tr");
    const table = currentCell.closest<HTMLTableElement>("table");
    if (!currentRow || !table) return false;

    const rows = this.getDirectTableRows(table).filter(
      (row) => !row.classList.contains("rte-template-block"),
    );
    const rowIndex = rows.indexOf(currentRow);
    if (rowIndex < 0) return false;

    const columnIndex = Array.from(currentRow.cells).indexOf(currentCell);
    if (columnIndex < 0) return false;

    const movingBackward = event.shiftKey;
    let targetRow = currentRow;
    let targetColumnIndex = movingBackward ? columnIndex - 1 : columnIndex + 1;

    if (targetColumnIndex < 0) {
      targetRow = rows[rowIndex - 1] ?? null;
      if (!targetRow) return false;
      targetColumnIndex = targetRow.cells.length - 1;
    } else if (targetColumnIndex >= currentRow.cells.length) {
      targetRow = rows[rowIndex + 1] ?? null;
      if (!targetRow) return false;
      targetColumnIndex = 0;
    }

    const targetCell = targetRow.cells[targetColumnIndex] ?? null;
    if (!targetCell) return false;

    event.preventDefault();
    this.selectTableCellContents(targetCell);
    return true;
  }

  /** @internal */
  private handleTableVerticalNavigation(event: KeyboardEvent): boolean {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return false;
    if (event.altKey || event.ctrlKey || event.metaKey) return false;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const range = this.normaliseTemplateBlockCaretEdgeRange(
      selection.getRangeAt(0),
    );
    if (!this.isRangeInsideEditor(range)) return false;

    const currentCell = this.getTableCellFromRange(range);
    if (!currentCell) return false;

    const currentRow = currentCell.closest<HTMLTableRowElement>("tr");
    const table = currentCell.closest<HTMLTableElement>("table");
    if (!currentRow || !table) return false;

    const rows = this.getDirectTableRows(table).filter(
      (row) => !row.classList.contains("rte-template-block"),
    );
    const rowIndex = rows.indexOf(currentRow);
    if (rowIndex < 0) return false;

    const targetIndex = event.key === "ArrowUp" ? rowIndex - 1 : rowIndex + 1;
    const targetRow = rows[targetIndex] ?? null;
    if (!targetRow) return false;

    const columnIndex = Array.from(currentRow.cells).indexOf(currentCell);
    if (columnIndex < 0) return false;

    const targetCell =
      targetRow.cells[Math.min(columnIndex, targetRow.cells.length - 1)] ??
      null;
    if (!targetCell) return false;

    event.preventDefault();
    this.selectTableCellContents(targetCell);
    return true;
  }

  /** @internal */
  private handleTemplateBlockCaretNavigation(event: KeyboardEvent): boolean {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return false;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const range = this.normaliseTemplateBlockCaretEdgeRange(
      selection.getRangeAt(0),
    );
    if (!range.collapsed || !this.isRangeInsideEditor(range)) return false;

    const edgeNode =
      event.key === "ArrowLeft"
        ? this.previousNode(range.startContainer, range.startOffset)
        : this.nextNode(range.startContainer, range.startOffset);
    const edge =
      edgeNode instanceof HTMLElement
        ? this.findTemplateBlockCaretEdge(edgeNode)
        : null;
    if (!edge) return false;

    const cluster = this.getTemplateBlockCaretCluster(edge);
    if (!cluster) return false;

    if (event.key === "ArrowRight" && edge === cluster.leadingEdge) {
      event.preventDefault();
      this.setCollapsedSelectionAfterNode(cluster.trailingEdge);
      return true;
    }

    if (event.key === "ArrowLeft" && edge === cluster.trailingEdge) {
      event.preventDefault();
      this.setCollapsedSelectionBeforeNode(cluster.leadingEdge);
      return true;
    }

    return false;
  }

  /** @internal */
  private handleTemplateBlockCaretDeletion(event: KeyboardEvent): boolean {
    if (event.key !== "Backspace" && event.key !== "Delete") return false;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const range = this.normaliseTemplateBlockCaretEdgeRange(
      selection.getRangeAt(0),
    );
    if (!range.collapsed || !this.isRangeInsideEditor(range)) return false;

    const edgeNode =
      event.key === "Backspace"
        ? this.previousNode(range.startContainer, range.startOffset)
        : this.nextNode(range.startContainer, range.startOffset);
    const edge =
      edgeNode instanceof HTMLElement
        ? this.findTemplateBlockCaretEdge(edgeNode)
        : null;
    if (!edge) return false;

    const cluster = this.getTemplateBlockCaretCluster(edge);
    if (!cluster) return false;

    event.preventDefault();
    this.removeTemplateBlockCaretCluster(cluster);
    this.syncValueFromEditor();
    this.doRefreshActiveFormats();
    return true;
  }

  /**
   * Maps common keyboard shortcuts to formatting actions.
   * Returns `true` if the event was handled.
   *
   * | Shortcut             | Action        |
   * | -------------------- | ------------- |
   * | Ctrl/⌘+B             | bold          |
   * | Ctrl/⌘+I             | italic        |
   * | Ctrl/⌘+U             | underline     |
   * | Ctrl/⌘+Shift+S       | strikethrough |
   * | Ctrl/⌘+Shift+X       | strikethrough |
   * | Ctrl/⌘+K             | link          |
   * | Ctrl/⌘+Z             | undo          |
   * | Ctrl/⌘+Shift+Z / Y   | redo          |
   *
   * @internal
   */
  private handleKeyboardShortcut(event: KeyboardEvent): boolean {
    if (this.disabled() || this.readonly()) return false;

    const mod = event.metaKey || event.ctrlKey;
    if (!mod) return false;

    const key = event.key.toLowerCase();
    let action: RichTextFormatAction | null = null;

    if (!event.shiftKey) {
      switch (key) {
        case "b":
          action = "bold";
          break;
        case "i":
          action = "italic";
          break;
        case "u":
          action = "underline";
          break;
        case "k":
          action = "link";
          break;
        case "z":
          action = "undo";
          break;
        case "y":
          action = "redo";
          break;
      }
    } else {
      switch (key) {
        case "s":
        case "x":
          action = "strikethrough";
          break;
        case "z":
          action = "redo";
          break;
      }
    }

    if (action) {
      event.preventDefault();
      this.execAction(action);
      return true;
    }
    return false;
  }

  // ── Markdown textarea hookup ──────────────────────────────

  /**
   * Called from the template when the Markdown textarea is
   * created, to pass a reference to the strategy.
   * @internal
   */
  protected onMarkdownTextareaCreated(textarea: HTMLTextAreaElement): void {
    const strat = this.strategy();
    if (strat instanceof MarkdownEditingStrategy) {
      strat.textareaEl = textarea;
    }
  }

  // ── Internal helpers ───────────────────────────────────────

  /**
   * Builds default attributes for a newly inserted template block.
   *
   * @internal
   */
  private defaultTemplateBlockAttributes(
    provider: RichTextTemplateBlockUiProvider,
  ): Readonly<Record<string, string>> {
    if (provider.attributes?.length) {
      return Object.fromEntries(
        provider.attributes.map((field) => [
          field.key,
          field.type === "boolean" ? "false" : "",
        ]),
      );
    }
    if (provider.name === "if") return { test: "" };
    if (provider.name === "loop") return { items: "" };
    if (provider.name === "placeholder") return { key: "" };
    return {};
  }

  /**
   * Returns block attribute editor metadata, enriched with contextual choices
   * where the current editor state can provide them.
   *
   * @internal
   */
  private getTemplateBlockAttributeDefinitions(
    provider: RichTextTemplateBlockUiProvider,
  ): readonly RichTextTemplateBlockAttributeDefinition[] {
    const attributes = provider.attributes ?? [];
    if (provider.name === "placeholder") {
      const placeholderOptions = this.getCurrentContextPlaceholderOptions();
      if (!placeholderOptions.length) return attributes;

      return attributes.map((field) =>
        field.key === "key"
          ? {
              ...field,
              type: "select",
              options: placeholderOptions,
            }
          : field,
      );
    }

    if (provider.name === "email") {
      const placeholderOptions = this.getCurrentContextPlaceholderOptions();
      if (!placeholderOptions.length) return attributes;

      return attributes.map((field) =>
        field.key === "email" || field.key === "text"
          ? {
              ...field,
              type: "select",
              options: placeholderOptions,
            }
          : field,
      );
    }

    if (provider.name !== "loop") return attributes;

    const arrayOptions = this.getCurrentContextArrayOptions();
    if (!arrayOptions.length) return attributes;

    return attributes.map((field) =>
      field.key === "items"
        ? {
            ...field,
            type: "select",
            options: arrayOptions,
          }
        : field,
    );
  }

  /** @internal */
  private getCurrentContextPlaceholderOptions(): readonly {
    readonly value: string;
    readonly label: string;
  }[] {
    const context = this.placeholderContext();
    if (context === undefined || context === null) {
      return this.placeholders().map((placeholder) => ({
        value: placeholder.key,
        label: placeholder.label,
      }));
    }
    return this.buildScopedPlaceholderItemsFromContext(context)
      .filter((item) => !item.isGroup)
      .map((item) => ({
        value: item.key,
        label: item.showPath ? item.path : item.label,
      }));
  }

  /** @internal */
  private getCurrentContextArrayOptions(): readonly {
    readonly value: string;
    readonly label: string;
  }[] {
    const context = this.getCurrentTemplateContextRecord();
    if (!context) return [];
    return Object.entries(context)
      .filter(([, value]) => Array.isArray(value))
      .map(([key]) => ({ value: key, label: key }));
  }

  /** @internal */
  private getCurrentTemplateContextRecord():
    | Record<string, unknown>
    | undefined {
    const context = this.placeholderContext();
    if (!this.isInspectableObject(context)) return undefined;

    const loopItemsKey = this.getActiveLoopItemsKey();
    if (!loopItemsKey) return context;

    const loopItems = context[loopItemsKey];
    if (!Array.isArray(loopItems)) return context;

    const sample = loopItems.find(
      (item) => item !== null && item !== undefined,
    );
    if (!this.isInspectableObject(sample)) return context;

    return { ...context, ...sample };
  }

  /**
   * Builds canonical XML for a template block edit result.
   *
   * @internal
   */
  private buildTemplateBlockXml(
    result: TemplateBlockDialogResult,
    provider: RichTextTemplateBlockUiProvider,
  ): string {
    const attrs = Object.entries(result.attributes)
      .map(([key, value]) => ` ${key}="${this.escapeXmlAttribute(value)}"`)
      .join("");
    if (provider.selfClosing) return `<${result.name}${attrs} />`;
    return `<${result.name}${attrs}>${this.defaultTemplateBlockBody(
      result.name,
    )}</${result.name}>`;
  }

  /**
   * Default body inserted for new container blocks.
   *
   * @internal
   */
  private defaultTemplateBlockBody(name: string): string {
    if (name === "loop") return "<p>Repeated content</p>";
    if (name === "if") return "<p>Conditional content</p>";
    return "<p>Block content</p>";
  }

  /**
   * Inserts text into a textarea and dispatches an input event.
   *
   * @internal
   */
  private insertTextIntoTextarea(
    textarea: HTMLTextAreaElement,
    text: string,
  ): void {
    const { selectionStart, selectionEnd, value } = textarea;
    textarea.value =
      value.substring(0, selectionStart) + text + value.substring(selectionEnd);
    textarea.selectionStart = selectionStart + text.length;
    textarea.selectionEnd = selectionStart + text.length;
    textarea.focus();
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  /**
   * Finds the table cell that contains the saved editor caret.
   *
   * @internal
   */
  private getActiveTableCell(): HTMLTableCellElement | null {
    const range = this.lastEditorRange;
    const rangeCell =
      range && this.isRangeInsideEditor(range)
        ? this.getTableCellFromRange(range)
        : null;
    if (rangeCell) return rangeCell;
    if (
      this.lastActiveTableCell &&
      this.editorRef().nativeElement.contains(this.lastActiveTableCell)
    ) {
      return this.lastActiveTableCell;
    }
    return null;
  }

  /** @internal */
  private getTableCellFromRange(range: Range): HTMLTableCellElement | null {
    const node = range.commonAncestorContainer;
    const element =
      node instanceof Element ? node : (node.parentElement ?? null);
    const cell = element?.closest<HTMLTableCellElement>("th, td") ?? null;
    if (!cell || !this.editorRef().nativeElement.contains(cell)) return null;
    return cell;
  }

  /**
   * Creates a new editable table row matching the current row shape.
   *
   * @internal
   */
  private createTableRowLike(row: HTMLTableRowElement): HTMLTableRowElement {
    const newRow = document.createElement("tr");
    const tagName = this.getTableCellTagName(row);
    const cellCount = Math.max(1, row.cells.length);
    for (let index = 0; index < cellCount; index += 1) {
      newRow.append(this.createTableCell(tagName));
    }
    return newRow;
  }

  /**
   * Creates a default table cell for editor-side table commands.
   *
   * @internal
   */
  private createTableCell(tagName: "td" | "th"): HTMLTableCellElement {
    const cell = document.createElement(tagName);
    cell.textContent = tagName === "th" ? "Column" : "Value";
    return cell;
  }

  /**
   * Returns only rows that belong directly to a table or its direct sections.
   *
   * @internal
   */
  private getDirectTableRows(table: HTMLTableElement): HTMLTableRowElement[] {
    const rows: HTMLTableRowElement[] = [];
    for (const child of Array.from(table.children)) {
      const tagName = child.tagName.toLowerCase();
      if (tagName === "tr") {
        rows.push(child as HTMLTableRowElement);
        continue;
      }
      if (tagName !== "thead" && tagName !== "tbody" && tagName !== "tfoot") {
        continue;
      }
      rows.push(
        ...Array.from(child.children).filter(
          (row): row is HTMLTableRowElement =>
            row.tagName.toLowerCase() === "tr",
        ),
      );
    }
    return rows;
  }

  /**
   * Chooses whether a new cell in the row should be a header or body cell.
   *
   * @internal
   */
  private getTableCellTagName(row: HTMLTableRowElement): "td" | "th" {
    const inHeader = row.parentElement?.tagName.toLowerCase() === "thead";
    const hasHeaderCells = Array.from(row.cells).some(
      (cell) => cell.tagName.toLowerCase() === "th",
    );
    return inHeader || hasHeaderCells ? "th" : "td";
  }

  /**
   * Finds selected table body rows that can be wrapped in a container block.
   *
   * @internal
   */
  private getSelectedWrappableTableRows(
    anchorEl: Element | null,
  ): HTMLTableRowElement[] {
    const selection = window.getSelection();
    const range =
      selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    const anchorRow = this.findClosestTableBodyRow(
      anchorEl ?? selection?.anchorNode ?? null,
    );
    const table =
      anchorRow?.closest("table") ??
      this.findClosestTable(range?.commonAncestorContainer ?? null);
    if (!table) return anchorRow ? [anchorRow] : [];

    const rows = Array.from(
      table.querySelectorAll<HTMLTableRowElement>("tbody > tr"),
    ).filter((row) => this.isWrappableTableRow(row));
    if (!range) return anchorRow ? [anchorRow] : [];

    const selectedRows = rows.filter((row) => range.intersectsNode(row));
    if (selectedRows.length) return selectedRows;
    return anchorRow && rows.includes(anchorRow) ? [anchorRow] : [];
  }

  /**
   * Wraps table rows in the rendered loop block shape used by the editor.
   *
   * @internal
   */
  private wrapTableRowsInTemplateBlock(
    rows: readonly HTMLTableRowElement[],
    result: TemplateBlockDialogResult,
    provider: RichTextTemplateBlockUiProvider,
  ): void {
    const firstRow = rows[0];
    if (!firstRow?.parentElement) return;

    const wrapper = document.createElement("tr");
    wrapper.className = "rte-template-block table-row-block";
    wrapper.dataset["templateBlock"] = result.name;
    wrapper.dataset["templateSelfClosing"] = "false";
    for (const [key, value] of Object.entries(result.attributes)) {
      wrapper.setAttribute(`data-template-attr-${key}`, value);
    }

    const cell = document.createElement("td");
    cell.colSpan = 999;
    const before = this.createTemplateBlockCaretEdge("before");
    const shell = document.createElement("div");
    shell.className = "shell";
    const header = document.createElement("span");
    header.className = "header";
    header.contentEditable = "false";
    header.textContent =
      provider.formatLabel?.(result.attributes) ?? provider.label;
    const table = document.createElement("table");
    table.className = "table-content";
    const body = document.createElement("tbody");
    body.className = "content";

    table.append(body);
    shell.append(header, table);
    cell.append(
      before,
      shell,
      this.createTemplateBlockCaretEdge("after", "block"),
    );
    wrapper.append(cell);

    firstRow.before(wrapper);
    for (const row of rows) {
      body.append(row);
    }

    this.syncValueFromEditor();
  }

  /** @internal */
  private findClosestTableBodyRow(
    value: Node | Element | null,
  ): HTMLTableRowElement | null {
    const element =
      value instanceof Element ? value : (value?.parentElement ?? null);
    const row = element?.closest<HTMLTableRowElement>("tbody > tr") ?? null;
    return row && this.isWrappableTableRow(row) ? row : null;
  }

  /** @internal */
  private findClosestTable(value: Node | null): HTMLTableElement | null {
    const element =
      value instanceof Element ? value : (value?.parentElement ?? null);
    return element?.closest<HTMLTableElement>("table") ?? null;
  }

  /** @internal */
  private isWrappableTableRow(row: HTMLTableRowElement): boolean {
    return !row.closest("[data-template-block]");
  }

  /**
   * Renders XML into editor DOM nodes using the active strategy.
   *
   * @internal
   */
  private renderTemplateBlockNodes(xml: string): Node[] {
    const ctx = this.buildContext();
    const html = this.strategy().deserialiseContent(xml, ctx);
    const container = html.trimStart().startsWith("<tr")
      ? document.createElement("tbody")
      : document.createElement("div");
    container.innerHTML = html;
    return Array.from(container.childNodes);
  }

  /** @internal */
  private createTemplateBlockCaretEdge(
    position: "before" | "after",
    display: "inline" | "block" = "inline",
  ): HTMLSpanElement {
    const edge = document.createElement("span");
    edge.className = TEMPLATE_BLOCK_CARET_EDGE_CLASS;
    edge.setAttribute(TEMPLATE_BLOCK_CARET_EDGE_ATTR, position);
    if (display === "block") {
      edge.setAttribute(TEMPLATE_BLOCK_CARET_EDGE_DISPLAY_ATTR, "block");
    }
    edge.setAttribute("aria-hidden", "true");
    edge.textContent = ZERO_WIDTH_SPACE;
    return edge;
  }

  /** @internal */
  private placeCaretAtEndOfTableCell(cell: HTMLTableCellElement): void {
    this.restoreFocus();
    const range = document.createRange();
    range.selectNodeContents(cell);
    range.collapse(false);
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(range);
    this.lastEditorRange = range.cloneRange();
    this.lastActiveTableCell = cell;
    this.selectionContextRevision.update((value) => value + 1);
  }

  /** @internal */
  private selectTableCellContents(cell: HTMLTableCellElement): void {
    this.restoreFocus();
    const range = document.createRange();
    range.selectNodeContents(cell);
    this.applyEditorSelection(range);
  }

  /**
   * Inserts DOM nodes at the current selection.
   *
   * @internal
   */
  private insertNodesAtSelection(nodes: readonly Node[]): void {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      let lastNode: Node | null = null;
      for (const node of nodes) {
        range.insertNode(node);
        range.setStartAfter(node);
        lastNode = node;
      }
      if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      return;
    }
    this.editorRef().nativeElement.append(...nodes);
  }

  /**
   * Replaces an existing rendered template block with updated XML.
   *
   * @internal
   */
  private replaceTemplateBlock(
    block: HTMLElement,
    result: TemplateBlockDialogResult,
    provider: RichTextTemplateBlockUiProvider,
  ): void {
    const xml = this.buildTemplateBlockXmlForExisting(block, result, provider);
    const nodes = this.renderTemplateBlockNodes(xml);
    block.replaceWith(...nodes);
    this.syncValueFromEditor();
  }

  /**
   * Builds XML for an existing block while preserving container body content.
   *
   * @internal
   */
  private buildTemplateBlockXmlForExisting(
    block: HTMLElement,
    result: TemplateBlockDialogResult,
    provider: RichTextTemplateBlockUiProvider,
  ): string {
    const attrs = Object.entries(result.attributes)
      .map(([key, value]) => ` ${key}="${this.escapeXmlAttribute(value)}"`)
      .join("");
    if (provider.selfClosing) return `<${result.name}${attrs} />`;
    const content = block.querySelector<HTMLElement>(".content");
    return `<${result.name}${attrs}>${content?.innerHTML ?? ""}</${result.name}>`;
  }

  /**
   * Reads template attributes stored on rendered block UI.
   *
   * @internal
   */
  private readTemplateDatasetAttributes(
    block: HTMLElement,
  ): Readonly<Record<string, string>> {
    const attrs: Record<string, string> = {};
    for (const [key, value] of Object.entries(block.dataset)) {
      if (!key.startsWith("templateAttr") || value === undefined) continue;
      const attrName = key
        .slice("templateAttr".length)
        .replace(/^[A-Z]/, (first) => first.toLowerCase())
        .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      attrs[attrName] = value;
    }
    if (!attrs["key"] && block.dataset["placeholderKey"]) {
      attrs["key"] = block.dataset["placeholderKey"];
    }
    return attrs;
  }

  /**
   * Creates fallback UI metadata for registered custom blocks.
   *
   * @internal
   */
  private createGenericTemplateBlockUiProvider(
    block: HTMLElement,
  ): RichTextTemplateBlockUiProvider {
    const name = block.dataset["templateBlock"] ?? "block";
    const selfClosing = block.dataset["templateSelfClosing"] === "true";
    const registeredProvider = getRegisteredTextTemplateBlockProviders().find(
      (provider) => provider.name === name,
    );
    if (registeredProvider) {
      return this.createGenericTemplateBlockUiProviderFromProvider(
        registeredProvider,
        selfClosing,
      );
    }
    return {
      name,
      label: this.humanizeTemplateBlockName(name),
      selfClosing,
      display: selfClosing ? "inline" : "block",
    };
  }

  /**
   * Resolves custom block UI metadata from either the RTE UI registry or the
   * foundation runtime provider registry.
   *
   * @internal
   */
  private getTemplateBlockUiProvider(
    blockName: string,
  ): RichTextTemplateBlockUiProvider | undefined {
    const uiProvider = getRichTextTemplateBlockUiProvider(blockName);
    if (uiProvider) return uiProvider;
    const blockProvider = getRegisteredTextTemplateBlockProviders().find(
      (provider) => provider.name === blockName,
    );
    return blockProvider
      ? this.createGenericTemplateBlockUiProviderFromProvider(blockProvider)
      : undefined;
  }

  /**
   * Creates fallback UI metadata from a foundation block provider.
   *
   * @internal
   */
  private createGenericTemplateBlockUiProviderFromProvider(
    provider: TemplateBlockProvider,
    selfClosingOverride?: boolean,
  ): RichTextTemplateBlockUiProvider {
    const selfClosing =
      selfClosingOverride ?? provider.contentModel === "self-closing";
    return {
      name: provider.name,
      label: this.humanizeTemplateBlockName(provider.name),
      selfClosing,
      display: selfClosing ? "inline" : "block",
      attributes: [
        ...(provider.requiredAttributes ?? []).map((key) =>
          this.createGenericTemplateBlockAttribute(key, true),
        ),
        ...(provider.optionalAttributes ?? []).map((key) =>
          this.createGenericTemplateBlockAttribute(key, false),
        ),
      ],
    };
  }

  /**
   * Creates generic property-sheet metadata for a block attribute.
   *
   * @internal
   */
  private createGenericTemplateBlockAttribute(
    key: string,
    required: boolean,
  ): RichTextTemplateBlockAttributeDefinition {
    return {
      key,
      label: this.humanizeTemplateBlockName(key),
      type: "string",
      required,
      placeholder: key,
    };
  }

  /**
   * Converts XML-ish block and attribute names into a readable label.
   *
   * @internal
   */
  private humanizeTemplateBlockName(name: string): string {
    return name
      .replace(/[-_]+/g, " ")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  /**
   * Reads the editor content via the active strategy and pushes
   * the serialised value to `this.value`.
   * @internal
   */
  private syncValueFromEditor(): void {
    const ctx = this.buildContext();
    const strat = this.strategy();

    if (this.isMarkdownMode()) {
      // In Markdown mode the textarea is the source of truth
      if (strat instanceof MarkdownEditingStrategy && strat.textareaEl) {
        const md = strat.textareaEl.value;
        this.lastSyncedValue = md;
        this.value.set(md);
        // Also update the preview
        this.renderToEditor(md);
      }
    } else {
      const editor = this.editorRef().nativeElement;
      const serialised = strat.serialiseContent(editor, ctx);
      this.lastSyncedValue = serialised;
      this.value.set(serialised);
    }
  }

  /**
   * Renders the given value into the preview/editor element
   * via the active strategy.
   * @internal
   */
  private renderToEditor(val: string): void {
    const ctx = this.buildContext();
    const strat = this.strategy();
    const editor = this.editorRef().nativeElement;
    const expanded = strat.deserialiseContent(val, ctx);
    editor.innerHTML = expanded;
  }

  /**
   * Refreshes the active format set via the strategy.
   * @internal
   */
  private doRefreshActiveFormats(): void {
    const ctx = this.buildContext();
    const formats = this.strategy().refreshActiveFormats(ctx);
    this.activeFormats.set(formats);
  }

  /** Restores focus to the editor element. */
  private restoreFocus(): void {
    const editor = this.editorRef().nativeElement;
    if (document.activeElement !== editor) {
      editor.focus();
    }
  }

  /** @internal */
  private captureEditorSelectionFromWindow(): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = this.normaliseTemplateBlockCaretEdgeRange(
      selection.getRangeAt(0),
    );
    if (!this.isRangeInsideEditor(range)) return;
    selection.removeAllRanges();
    selection.addRange(range);
    this.lastEditorRange = range.cloneRange();
    this.lastActiveTableCell = this.getTableCellFromRange(range);
    this.selectionContextRevision.update((value) => value + 1);
  }

  /** @internal */
  private restoreLastEditorSelection(range = this.lastEditorRange): void {
    if (!range) return;
    const selection = window.getSelection();
    if (!selection) return;
    const restoredRange = this.normaliseTemplateBlockCaretEdgeRange(range);
    selection.removeAllRanges();
    selection.addRange(restoredRange);
    this.lastEditorRange = restoredRange.cloneRange();
    this.lastActiveTableCell = this.getTableCellFromRange(restoredRange);
    this.selectionContextRevision.update((value) => value + 1);
  }

  /** @internal */
  private normaliseTemplateBlockCaretEdgeRange(input: Range): Range {
    const range = input.cloneRange();
    if (!range.collapsed) return range;

    const edge = this.findTemplateBlockCaretEdge(range.startContainer);
    if (!edge) return range;

    const position = edge.getAttribute(TEMPLATE_BLOCK_CARET_EDGE_ATTR);
    if (position === "before") {
      range.setStartBefore(edge);
    } else {
      range.setStartAfter(edge);
    }
    range.collapse(true);

    const previous = this.previousNode(range.startContainer, range.startOffset);
    const next = this.nextNode(range.startContainer, range.startOffset);
    const previousEdge =
      previous instanceof HTMLElement
        ? this.findTemplateBlockCaretEdge(previous)
        : null;
    if (previousEdge) {
      const cluster = this.getTemplateBlockCaretCluster(previousEdge);
      if (
        cluster &&
        previousEdge === cluster.leadingEdge &&
        next === cluster.token
      ) {
        range.setStartBefore(cluster.leadingEdge);
        range.collapse(true);
        return range;
      }
    }

    const nextEdge =
      next instanceof HTMLElement
        ? this.findTemplateBlockCaretEdge(next)
        : null;
    if (nextEdge) {
      const cluster = this.getTemplateBlockCaretCluster(nextEdge);
      if (
        cluster &&
        nextEdge === cluster.trailingEdge &&
        previous === cluster.token
      ) {
        range.setStartAfter(cluster.trailingEdge);
        range.collapse(true);
      }
    }

    return range;
  }

  /** @internal */
  private findTemplateBlockCaretEdge(node: Node): HTMLElement | null {
    const element = node instanceof Element ? node : node.parentElement;
    return (
      element?.closest<HTMLElement>(`[${TEMPLATE_BLOCK_CARET_EDGE_ATTR}]`) ??
      null
    );
  }

  /** @internal */
  private getTemplateBlockCaretCluster(edge: HTMLElement): {
    readonly leadingEdge: HTMLElement;
    readonly token: HTMLElement;
    readonly trailingEdge: HTMLElement;
  } | null {
    const position = edge.getAttribute(TEMPLATE_BLOCK_CARET_EDGE_ATTR);
    const token =
      position === "before"
        ? edge.nextSibling
        : position === "after"
          ? edge.previousSibling
          : null;
    if (
      !(token instanceof HTMLElement) ||
      !token.hasAttribute("data-template-block")
    ) {
      return null;
    }

    const leadingEdge =
      position === "before"
        ? edge
        : token.previousSibling instanceof HTMLElement
          ? token.previousSibling
          : null;
    const trailingEdge =
      position === "after"
        ? edge
        : token.nextSibling instanceof HTMLElement
          ? token.nextSibling
          : null;
    if (
      !(leadingEdge instanceof HTMLElement) ||
      !(trailingEdge instanceof HTMLElement) ||
      leadingEdge.getAttribute(TEMPLATE_BLOCK_CARET_EDGE_ATTR) !== "before" ||
      trailingEdge.getAttribute(TEMPLATE_BLOCK_CARET_EDGE_ATTR) !== "after"
    ) {
      return null;
    }

    return { leadingEdge, token, trailingEdge };
  }

  /** @internal */
  private setCollapsedSelectionBeforeNode(node: Node): void {
    const range = document.createRange();
    range.setStartBefore(node);
    range.collapse(true);
    this.applyEditorSelection(range);
  }

  /** @internal */
  private setCollapsedSelectionAfterNode(node: Node): void {
    const range = document.createRange();
    range.setStartAfter(node);
    range.collapse(true);
    this.applyEditorSelection(range);
  }

  /** @internal */
  private applyEditorSelection(range: Range): void {
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(range);
    this.lastEditorRange = range.cloneRange();
    this.lastActiveTableCell = this.getTableCellFromRange(range);
    this.selectionContextRevision.update((value) => value + 1);
  }

  /** @internal */
  private removeTemplateBlockCaretCluster(cluster: {
    readonly leadingEdge: HTMLElement;
    readonly token: HTMLElement;
    readonly trailingEdge: HTMLElement;
  }): void {
    const parent = cluster.leadingEdge.parentNode;
    if (!parent) return;
    const nextSibling = cluster.trailingEdge.nextSibling;

    cluster.leadingEdge.remove();
    cluster.token.remove();
    cluster.trailingEdge.remove();

    const range = document.createRange();
    if (nextSibling) {
      range.setStartBefore(nextSibling);
    } else {
      range.setStart(parent, parent.childNodes.length);
    }
    range.collapse(true);
    this.applyEditorSelection(range);
  }

  /** @internal */
  private getActiveLoopItemsKey(): string | undefined {
    const range = this.lastEditorRange;
    if (!range) return undefined;
    const node = range.commonAncestorContainer;
    const element =
      node instanceof Element ? node : (node.parentElement ?? null);
    const loopBlock = element?.closest<HTMLElement>(
      '[data-template-block="loop"]',
    );
    if (!loopBlock || !this.editorRef().nativeElement.contains(loopBlock)) {
      return undefined;
    }
    return loopBlock.dataset["templateAttrItems"];
  }

  /** @internal */
  private isRangeInsideEditor(range: Range): boolean {
    const editor = this.editorRef().nativeElement;
    const node = range.commonAncestorContainer;
    return node === editor || editor.contains(node);
  }

  /** Escapes a value for use inside XML attributes. */
  private escapeXmlAttribute(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  /**
   * Returns the DOM node immediately before the given
   * container/offset position.
   */
  private previousNode(container: Node, offset: number): Node | null {
    if (container.nodeType === Node.TEXT_NODE) {
      return offset === 0 ? container.previousSibling : null;
    }
    return offset > 0 ? container.childNodes[offset - 1] : null;
  }

  /**
   * Returns the DOM node immediately after the given
   * container/offset position.
   */
  private nextNode(container: Node, offset: number): Node | null {
    if (container.nodeType === Node.TEXT_NODE) {
      return offset === (container as Text).length
        ? container.nextSibling
        : null;
    }
    return offset < container.childNodes.length
      ? container.childNodes[offset]
      : null;
  }
}

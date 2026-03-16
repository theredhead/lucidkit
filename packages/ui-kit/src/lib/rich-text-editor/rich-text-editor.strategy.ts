import type {
  RichTextFormatAction,
  RichTextPlaceholder,
} from "./rich-text-editor.types";
import type { LinkDialogResult } from "./link-dialog/link-dialog.component";

/**
 * The editing mode determines which {@link RichTextEditorStrategy}
 * implementation is used by the rich-text editor.
 *
 * - `'html'`     — WYSIWYG editing with `document.execCommand`
 * - `'markdown'` — Plain-text Markdown editing with live HTML
 *                   preview
 */
export type RichTextEditorMode = "html" | "markdown";

/**
 * Context object passed to strategy methods so they can interact
 * with the editor's DOM and state without holding a reference to
 * the component itself.
 *
 * This decouples strategies from the Angular component class while
 * giving them everything they need.
 */
export interface RichTextEditorContext {
  /** The contenteditable `<div>` (WYSIWYG area). */
  readonly editorEl: HTMLDivElement;

  /** The host element of the component. */
  readonly hostEl: HTMLElement;

  /** Current placeholder definitions. */
  readonly placeholders: readonly RichTextPlaceholder[];

  /** Whether HTML sanitisation is enabled. */
  readonly sanitise: boolean;

  /** Restores focus to the editor element. */
  restoreFocus(): void;
}

/**
 * Strategy interface that encapsulates all format-specific editing
 * logic.
 *
 * The rich-text editor component delegates to an implementation of
 * this interface for every operation that differs between HTML and
 * Markdown (or any future format).
 *
 * Implementations are plain classes — **not** Angular injectables —
 * because they are instantiated directly by the component based on
 * the `mode` input.
 */
export interface RichTextEditorStrategy {
  // ── Formatting ────────────────────────────────────────────

  /**
   * Executes a formatting action (e.g. bold, heading, list).
   *
   * For HTML this maps to `document.execCommand`.
   * For Markdown this wraps the selection with the appropriate
   * syntax characters.
   *
   * @returns `true` if the action was handled synchronously and
   * the caller should sync + refresh, or `false` if the action
   * is deferred (e.g. link dialog).
   */
  execAction(action: RichTextFormatAction, ctx: RichTextEditorContext): boolean;

  // ── Serialisation ─────────────────────────────────────────

  /**
   * Reads the editor element and returns the serialised output
   * string.
   *
   * - HTML strategy: clones the DOM, replaces placeholder chips
   *   with `{{key}}` tokens, returns `innerHTML`.
   * - Markdown strategy: converts the editor's Markdown text,
   *   replacing placeholder chips with `{{key}}` tokens.
   */
  serialiseContent(
    editorEl: HTMLDivElement,
    ctx: RichTextEditorContext,
  ): string;

  /**
   * Takes a raw value string and returns HTML suitable for
   * inserting into the editor's `innerHTML`.
   *
   * - HTML strategy: expands `{{key}}` tokens to chip markup.
   * - Markdown strategy: converts Markdown → HTML, then expands
   *   `{{key}}` tokens.
   */
  deserialiseContent(value: string, ctx: RichTextEditorContext): string;

  // ── Sanitisation ──────────────────────────────────────────

  /**
   * Sanitises HTML before it is written to the editor DOM.
   *
   * Called by the component whenever content is rendered into the
   * WYSIWYG area (paste, value binding, source toggle).
   */
  sanitiseHtml(html: string): string;

  // ── Active format detection ───────────────────────────────

  /**
   * Queries the current formatting state at the caret position
   * and returns the set of active format actions.
   */
  refreshActiveFormats(
    ctx: RichTextEditorContext,
  ): ReadonlySet<RichTextFormatAction>;

  // ── Paste ─────────────────────────────────────────────────

  /**
   * Handles a paste event, inserting cleaned content into the
   * editor.
   *
   * The implementation should call `event.preventDefault()` and
   * manage insertion itself.
   */
  handlePaste(event: ClipboardEvent, ctx: RichTextEditorContext): void;

  // ── Link ──────────────────────────────────────────────────

  /**
   * Applies a link result (from the link dialog) at the saved
   * selection position.
   *
   * @param result       URL + display text from the dialog
   * @param existingAnchor  The `<a>` element being edited, or
   *                        `null` for a new link
   * @param savedRange   The selection range saved before the
   *                     dialog opened
   */
  applyLink(
    result: LinkDialogResult,
    existingAnchor: HTMLAnchorElement | null,
    savedRange: Range | null,
    ctx: RichTextEditorContext,
  ): void;

  // ── Placeholder ───────────────────────────────────────────

  /**
   * Creates a placeholder chip DOM element for insertion into
   * the editor.
   */
  createPlaceholderChip(placeholder: RichTextPlaceholder): HTMLElement;

  // ── Source mode ───────────────────────────────────────────

  /**
   * Label shown on the source-mode toggle button.
   * HTML strategy: `'Edit HTML source'`
   * Markdown strategy: `'Edit Markdown source'`
   */
  readonly sourceToggleLabel: string;

  /**
   * Label shown above the WYSIWYG preview in source mode.
   * Both strategies use `'Preview'`.
   */
  readonly previewLabel: string;
}

/**
 * A placeholder definition that can be inserted into the editor.
 *
 * Placeholders render as non-editable inline chips inside the rich
 * text content and are serialised as `{{key}}` tokens in the HTML
 * output so a downstream template engine can resolve them.
 *
 * @example
 * ```ts
 * const placeholders: RichTextPlaceholder[] = [
 *   { key: 'firstName', label: 'First Name', category: 'Contact' },
 *   { key: 'companyName', label: 'Company',  category: 'Account' },
 * ];
 * ```
 */
export interface RichTextPlaceholder {
  /** Unique token key, e.g. `'firstName'`. */
  readonly key: string;

  /** Human-readable label shown inside the chip, e.g. `'First Name'`. */
  readonly label: string;

  /** Optional grouping category for the placeholder picker. */
  readonly category?: string;
}

/**
 * Formatting actions the toolbar can expose.
 *
 * Each value maps to a `document.execCommand` call or a custom
 * handler inside the editor component.
 */
export type RichTextFormatAction =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "heading1"
  | "heading2"
  | "heading3"
  | "unorderedList"
  | "orderedList"
  | "alignLeft"
  | "alignCenter"
  | "alignRight"
  | "removeFormat";

/**
 * The default set of toolbar actions shown when no explicit list is
 * provided.
 */
export const DEFAULT_TOOLBAR_ACTIONS: readonly RichTextFormatAction[] = [
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "heading1",
  "heading2",
  "heading3",
  "unorderedList",
  "orderedList",
  "alignLeft",
  "alignCenter",
  "alignRight",
  "removeFormat",
];

/**
 * Metadata for a single toolbar button — used internally to render
 * the toolbar from the actions list.
 *
 * @internal
 */
export interface ToolbarButtonMeta {
  /** The action this button triggers. */
  readonly action: RichTextFormatAction;
  /** Accessible label / tooltip text. */
  readonly label: string;
  /** Unicode symbol or short text rendered inside the button. */
  readonly icon: string;
  /** Optional grouping separator rendered before this button. */
  readonly group?: string;
}

/**
 * Complete registry mapping every {@link RichTextFormatAction} to its
 * toolbar button metadata.
 *
 * @internal
 */
export const TOOLBAR_BUTTON_REGISTRY: Record<
  RichTextFormatAction,
  ToolbarButtonMeta
> = {
  bold: { action: "bold", label: "Bold", icon: "B", group: "inline" },
  italic: { action: "italic", label: "Italic", icon: "I", group: "inline" },
  underline: {
    action: "underline",
    label: "Underline",
    icon: "U",
    group: "inline",
  },
  strikethrough: {
    action: "strikethrough",
    label: "Strikethrough",
    icon: "S",
    group: "inline",
  },
  heading1: {
    action: "heading1",
    label: "Heading 1",
    icon: "H1",
    group: "block",
  },
  heading2: {
    action: "heading2",
    label: "Heading 2",
    icon: "H2",
    group: "block",
  },
  heading3: {
    action: "heading3",
    label: "Heading 3",
    icon: "H3",
    group: "block",
  },
  unorderedList: {
    action: "unorderedList",
    label: "Bullet list",
    icon: "•≡",
    group: "list",
  },
  orderedList: {
    action: "orderedList",
    label: "Numbered list",
    icon: "1.",
    group: "list",
  },
  alignLeft: {
    action: "alignLeft",
    label: "Align left",
    icon: "≡←",
    group: "align",
  },
  alignCenter: {
    action: "alignCenter",
    label: "Align center",
    icon: "≡↔",
    group: "align",
  },
  alignRight: {
    action: "alignRight",
    label: "Align right",
    icon: "≡→",
    group: "align",
  },
  removeFormat: {
    action: "removeFormat",
    label: "Clear formatting",
    icon: "⌧",
    group: "misc",
  },
};

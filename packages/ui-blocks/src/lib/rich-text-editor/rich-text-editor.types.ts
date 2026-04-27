import type {
  PropertyFieldDefinition,
  PropertyFieldType,
} from "../property-sheet";
import type { SelectOption } from "@theredhead/lucid-kit";

/**
 * A placeholder definition that can be inserted into the editor.
 *
 * Placeholders render as non-editable inline chips inside the rich
 * text content and are serialised as self-closing XML template blocks
 * so a downstream template engine can resolve them.
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
 * Visual placement for a template block inside the rich-text editor.
 */
export type RichTextTemplateBlockDisplay = "inline" | "block";

/**
 * Supported property editor controls for a template block attribute.
 */
export type RichTextTemplateBlockAttributeType = PropertyFieldType;

/**
 * Option metadata for select-style template block attributes.
 */
export type RichTextTemplateBlockAttributeOption = SelectOption;

/**
 * Property-sheet metadata for an editable XML template block attribute.
 */
export type RichTextTemplateBlockAttributeDefinition = Omit<
  PropertyFieldDefinition<Record<string, unknown>>,
  "type"
> & {

  /**
   * Property editor control type.
   */
  readonly type?: RichTextTemplateBlockAttributeType;
};

/**
 * UI metadata for editing a registered XML template block in the rich-text
 * editor.
 */
export interface RichTextTemplateBlockUiProvider {

  /**
   * XML block name handled by this UI provider.
   */
  readonly name: string;

  /**
   * Human-readable label shown in chips and generic block headers.
   */
  readonly label: string;

  /**
   * Whether the block is self-closing in the editor surface.
   */
  readonly selfClosing: boolean;

  /**
   * Whether the editor should render this block inline or as a block
   * container.
   */
  readonly display: RichTextTemplateBlockDisplay;

  /**
   * Attributes available for end-user editing in the block property sheet.
   */
  readonly attributes?: readonly RichTextTemplateBlockAttributeDefinition[];

  /**
   * Optional label formatter for a specific block instance.
   */
  formatLabel?(attributes: Readonly<Record<string, string>>): string;
}

/** @internal */
const TEMPLATE_BLOCK_UI_PROVIDERS = new Map<
  string,
  RichTextTemplateBlockUiProvider
>();

/**
 * Registers rich-text editor UI metadata for an XML template block.
 */
export function registerRichTextTemplateBlockUiProvider(
  provider: RichTextTemplateBlockUiProvider,
): void {
  TEMPLATE_BLOCK_UI_PROVIDERS.set(provider.name, provider);
}

/**
 * Removes rich-text editor UI metadata for an XML template block.
 */
export function unregisterRichTextTemplateBlockUiProvider(name: string): void {
  TEMPLATE_BLOCK_UI_PROVIDERS.delete(name);
}

/**
 * Looks up rich-text editor UI metadata for an XML template block.
 */
export function getRichTextTemplateBlockUiProvider(
  name: string,
): RichTextTemplateBlockUiProvider | undefined {
  return TEMPLATE_BLOCK_UI_PROVIDERS.get(name);
}

/**
 * Returns all registered rich-text editor XML template block UI providers.
 */
export function getRichTextTemplateBlockUiProviders(): RichTextTemplateBlockUiProvider[] {
  return Array.from(TEMPLATE_BLOCK_UI_PROVIDERS.values());
}

registerRichTextTemplateBlockUiProvider({
  name: "placeholder",
  label: "Placeholder",
  selfClosing: true,
  display: "inline",
  attributes: [
    {
      key: "key",
      label: "Placeholder",
      type: "string",
      required: true,
      placeholder: "firstName",
    },
  ],
  formatLabel: (attributes) => attributes["label"] ?? attributes["key"] ?? "Placeholder",
});

registerRichTextTemplateBlockUiProvider({
  name: "if",
  label: "If",
  selfClosing: false,
  display: "block",
  attributes: [
    {
      key: "test",
      label: "Condition",
      type: "string",
      required: true,
      placeholder: "isPremium",
    },
  ],
  formatLabel: (attributes) => `If ${attributes["test"] ?? ""}`.trim(),
});

registerRichTextTemplateBlockUiProvider({
  name: "loop",
  label: "Loop",
  selfClosing: false,
  display: "block",
  attributes: [
    {
      key: "items",
      label: "Items",
      type: "string",
      required: true,
      placeholder: "lines",
    },
  ],
  formatLabel: (attributes) => `Loop ${attributes["items"] ?? ""}`.trim(),
});

/**
 * Callback that handles an image file and returns a URL string.
 *
 * When provided to the rich-text editor's `imageHandler` input,
 * this function is called when the user pastes an image from the
 * clipboard.  The returned URL is inserted as an `<img>` (HTML
 * mode) or `![alt](url)` (Markdown mode).
 *
 * Typical implementations upload the file to a CDN or object
 * store and return the resulting public URL.
 *
 * @example
 * ```ts
 * const uploadImage: RichTextImageHandler = async (file) => {
 *   const form = new FormData();
 *   form.append('image', file);
 *   const res = await fetch('/api/upload', { method: 'POST', body: form });
 *   const { url } = await res.json();
 *   return url;
 * };
 * ```
 */
export type RichTextImageHandler = (file: File) => Promise<string>;

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
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "blockquote"
  | "codeBlock"
  | "unorderedList"
  | "orderedList"
  | "indent"
  | "outdent"
  | "alignLeft"
  | "alignCenter"
  | "alignRight"
  | "alignJustify"
  | "horizontalRule"
  | "image"
  | "link"
  | "undo"
  | "redo"
  | "removeFormat";

/**
 * The default set of toolbar actions shown when no explicit list is
 * provided.
 */
export const DEFAULT_TOOLBAR_ACTIONS: readonly RichTextFormatAction[] = [
  "undo",
  "redo",
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "paragraph",
  "heading1",
  "heading2",
  "heading3",
  "blockquote",
  "codeBlock",
  "unorderedList",
  "orderedList",
  "indent",
  "outdent",
  "alignLeft",
  "alignCenter",
  "alignRight",
  "alignJustify",
  "horizontalRule",
  "image",
  "link",
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

  /** SVG inner content rendered inside a `<ui-icon>` component. */
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
import { UIIcons } from "@theredhead/lucid-kit";

/**
 * Complete registry mapping every {@link RichTextFormatAction} to its
 * toolbar button metadata.
 *
 * Icons are SVG inner-content strings from the Lucide icon set.
 *
 * @internal
 */
export const TOOLBAR_BUTTON_REGISTRY: Record<
  RichTextFormatAction,
  ToolbarButtonMeta
> = {
  undo: {
    action: "undo",
    label: "Undo",
    icon: UIIcons.Lucide.Arrows.Undo2,
    group: "history",
  },
  redo: {
    action: "redo",
    label: "Redo",
    icon: UIIcons.Lucide.Arrows.Redo2,
    group: "history",
  },
  bold: {
    action: "bold",
    label: "Bold",
    icon: UIIcons.Lucide.Text.Bold,
    group: "inline",
  },
  italic: {
    action: "italic",
    label: "Italic",
    icon: UIIcons.Lucide.Text.Italic,
    group: "inline",
  },
  underline: {
    action: "underline",
    label: "Underline",
    icon: UIIcons.Lucide.Text.Underline,
    group: "inline",
  },
  strikethrough: {
    action: "strikethrough",
    label: "Strikethrough",
    icon: UIIcons.Lucide.Text.Strikethrough,
    group: "inline",
  },
  paragraph: {
    action: "paragraph",
    label: "Normal text",
    icon: UIIcons.Lucide.Text.Pilcrow,
    group: "block",
  },
  heading1: {
    action: "heading1",
    label: "Heading 1",
    icon: UIIcons.Lucide.Text.Heading1,
    group: "block",
  },
  heading2: {
    action: "heading2",
    label: "Heading 2",
    icon: UIIcons.Lucide.Text.Heading2,
    group: "block",
  },
  heading3: {
    action: "heading3",
    label: "Heading 3",
    icon: UIIcons.Lucide.Text.Heading3,
    group: "block",
  },
  blockquote: {
    action: "blockquote",
    label: "Quote",
    icon: UIIcons.Lucide.Text.TextQuote,
    group: "block",
  },
  codeBlock: {
    action: "codeBlock",
    label: "Code block",
    icon: UIIcons.Lucide.Text.Code,
    group: "block",
  },
  unorderedList: {
    action: "unorderedList",
    label: "Bullet list",
    icon: UIIcons.Lucide.Text.List,
    group: "list",
  },
  orderedList: {
    action: "orderedList",
    label: "Numbered list",
    icon: UIIcons.Lucide.Text.ListOrdered,
    group: "list",
  },
  indent: {
    action: "indent",
    label: "Increase indent",
    icon: UIIcons.Lucide.Development.ListIndentIncrease,
    group: "list",
  },
  outdent: {
    action: "outdent",
    label: "Decrease indent",
    icon: UIIcons.Lucide.Development.ListIndentDecrease,
    group: "list",
  },
  alignLeft: {
    action: "alignLeft",
    label: "Align left",
    icon: UIIcons.Lucide.Text.TextAlignStart,
    group: "align",
  },
  alignCenter: {
    action: "alignCenter",
    label: "Align centre",
    icon: UIIcons.Lucide.Text.TextAlignCenter,
    group: "align",
  },
  alignRight: {
    action: "alignRight",
    label: "Align right",
    icon: UIIcons.Lucide.Text.TextAlignEnd,
    group: "align",
  },
  alignJustify: {
    action: "alignJustify",
    label: "Justify",
    icon: UIIcons.Lucide.Text.TextAlignJustify,
    group: "align",
  },
  horizontalRule: {
    action: "horizontalRule",
    label: "Horizontal rule",
    icon: UIIcons.Lucide.Development.Minus,
    group: "insert",
  },
  image: {
    action: "image",
    label: "Insert image",
    icon: UIIcons.Lucide.Files.ImagePlus,
    group: "insert",
  },
  link: {
    action: "link",
    label: "Hyperlink",
    icon: UIIcons.Lucide.Text.Link,
    group: "link-action",
  },
  removeFormat: {
    action: "removeFormat",
    label: "Clear formatting",
    icon: UIIcons.Lucide.Text.RemoveFormatting,
    group: "misc",
  },
};

/**
 * Display metadata for a toolbar button group rendered as a
 * dropdown rather than flat buttons.
 *
 * @internal
 */
export interface ToolbarGroupMeta {

  /** Accessible label for the dropdown trigger. */
  readonly label: string;

  /** SVG inner content rendered on the dropdown trigger button. */
  readonly icon: string;
}

/**
 * Group names whose buttons render directly in the toolbar.
 * All other groups render as a single dropdown trigger.
 *
 * @internal
 */
export const FLAT_TOOLBAR_GROUPS: ReadonlySet<string> = new Set([
  "history",
  "inline",
  "insert",
  "link-action",
  "misc",
]);

/**
 * Display metadata for dropdown-style toolbar groups.
 *
 * @internal
 */
export const TOOLBAR_GROUP_META: Readonly<Record<string, ToolbarGroupMeta>> = {
  block: { label: "Styles", icon: UIIcons.Lucide.Text.Pilcrow },
  list: { label: "Lists", icon: UIIcons.Lucide.Text.List },
  align: { label: "Alignment", icon: UIIcons.Lucide.Text.TextAlignStart },
};

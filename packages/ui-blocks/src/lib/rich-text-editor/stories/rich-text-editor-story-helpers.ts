import type { RichTextEditorMode } from "../rich-text-editor.strategy";
import type { RichTextTemplateBlockEvent } from "../rich-text-editor.types";

export interface RichTextEditorStoryArgs {
  ariaLabel: string;
  blockEdited: (event: RichTextTemplateBlockEvent) => void;
  blockInserted: (event: RichTextTemplateBlockEvent) => void;
  blockRemoved: (event: RichTextTemplateBlockEvent) => void;
  disabled: boolean;
  mode: RichTextEditorMode;
  placeholder: string;
  presentation: "default" | "compact";
  readonly: boolean;
}

export type FixedModeRichTextEditorStoryArgs = Omit<
  RichTextEditorStoryArgs,
  "mode"
>;

export const RICH_TEXT_EDITOR_STORY_ARG_TYPES = {
  disabled: {
    control: "boolean",
    description:
      "Disables the editor — the toolbar is hidden and the content area cannot be focused or edited.",
  },
  readonly: {
    control: "boolean",
    description:
      "Makes the editor read-only — content is visible and selectable but the toolbar is hidden and editing is prevented.",
  },
  placeholder: {
    control: "text",
    description:
      "Placeholder text displayed inside the empty editing area. Disappears once the user starts typing.",
  },
  ariaLabel: {
    control: "text",
    description:
      "Accessible label forwarded to the contenteditable region or textarea for screen readers.",
  },
  mode: {
    control: "select",
    options: ["html", "markdown"] satisfies RichTextEditorMode[],
    description:
      'Editing strategy: `"html"` uses contenteditable with rich WYSIWYG formatting; `"markdown"` uses a plain textarea with toolbar-driven Markdown syntax insertion.',
  },
  presentation: {
    control: "select",
    options: ["default", "compact"] as const,
    description:
      'Editor chrome presentation: `"default"` shows the full toolbar; `"compact"` uses a small floating toolbar for chat-style composition.',
  },
  blockInserted: {
    action: "blockInserted",
    description: "Emitted when a template block is inserted.",
  },
  blockEdited: {
    action: "blockEdited",
    description: "Emitted when a template block is edited.",
  },
  blockRemoved: {
    action: "blockRemoved",
    description: "Emitted when a template block is removed.",
  },
} as const;

export const FIXED_MODE_RICH_TEXT_EDITOR_STORY_ARG_TYPES = {
  disabled: RICH_TEXT_EDITOR_STORY_ARG_TYPES.disabled,
  readonly: RICH_TEXT_EDITOR_STORY_ARG_TYPES.readonly,
  placeholder: RICH_TEXT_EDITOR_STORY_ARG_TYPES.placeholder,
  ariaLabel: RICH_TEXT_EDITOR_STORY_ARG_TYPES.ariaLabel,
  presentation: RICH_TEXT_EDITOR_STORY_ARG_TYPES.presentation,
  blockInserted: RICH_TEXT_EDITOR_STORY_ARG_TYPES.blockInserted,
  blockEdited: RICH_TEXT_EDITOR_STORY_ARG_TYPES.blockEdited,
  blockRemoved: RICH_TEXT_EDITOR_STORY_ARG_TYPES.blockRemoved,
} as const;

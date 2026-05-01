import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIRichTextEditor } from "../../rich-text-editor.component";
import type { RichTextImageHandler } from "../../rich-text-editor.types";
import type { RichTextEditorMode } from "../../rich-text-editor.strategy";

const modes: RichTextEditorMode[] = ["html", "markdown"];

/**
 * Simulated image upload handler that returns a placeholder URL
 * after a short delay. In production, this would upload to a
 * real service (e.g. S3, Cloudinary).
 */
const mockImageHandler: RichTextImageHandler = (file: File) =>
  new Promise((resolve) => {
    setTimeout(
      () => resolve(`https://cdn.example.com/uploads/${file.name}`),
      500,
    );
  });

import { WithImageHandlerStorySource } from "./with-image-handler.story";

const meta = {
  title: "@theredhead/UI Blocks/Rich Text Editor",
  component: WithImageHandlerStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIRichTextEditor` is a feature-rich WYSIWYG and Markdown editor built entirely with native browser APIs (no external editor dependency). It supports two editing modes, merge-field placeholders, image paste/drop, and optional content-length limits.",
      },
    },
  },
  argTypes: {
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
      options: modes satisfies RichTextEditorMode[],
      description:
        'Editing strategy: `"html"` uses contenteditable with rich WYSIWYG formatting; `"markdown"` uses a plain textarea with toolbar-driven Markdown syntax insertion.',
    },
    presentation: {
      control: "select",
      options: ["default", "compact"],
      description:
        'Editor chrome presentation: `"default"` shows the full toolbar; `"compact"` uses a small floating toolbar for chat-style composition.',
    },
  },
  decorators: [moduleMetadata({ imports: [WithImageHandlerStorySource] })],
} satisfies Meta<WithImageHandlerStorySource>;

export default meta;
type Story = StoryObj<WithImageHandlerStorySource>;

export const WithImageHandler: Story = {
  args: {
    disabled: false,
    readonly: false,
    ariaLabel: "Rich text editor",
    mode: "html",
    presentation: "default",
    placeholder: "Paste an image here…",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: { ...args, imageHandler: mockImageHandler },
    template: `
      <ui-with-image-handler-story-demo
        [disabled]="disabled"
        [readonly]="readonly"
        [placeholder]="placeholder"
        [ariaLabel]="ariaLabel"
        [mode]="mode"
        [presentation]="presentation"
        [imageHandler]="imageHandler"
      />
    `,
  }),
};

import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import type { MessageSendEvent } from "../../chat-view.types";

import { RichTextComposerStorySource } from "./rich-text-composer.story";

interface RichTextComposerStoryArgs {
  ariaLabel: string;
  composerPresentation: "compact" | "default";
  composerToolbarActions?: readonly string[];
  placeholder: string;
  messageSend: (event: MessageSendEvent) => void;
}

const meta = {
  title: "@theredhead/UI Blocks/Chat View",
  component: RichTextComposerStorySource,
  tags: ["autodocs"],
  argTypes: {
    composerPresentation: {
      control: "select",
      options: ["compact", "default"],
      description:
        'Rich-text composer presentation. `"compact"` is the chat-style default; `"default"` uses the full editor chrome.',
    },
    composerToolbarActions: {
      control: "object",
      description:
        "Toolbar actions used by the compact rich-text composer. Defaults to bold, italic, strikethrough, and link.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the composer.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the chat view.",
    },
    messageSend: {
      action: "messageSend",
      description: "Emitted when the user sends a message.",
    },
  },
  decorators: [moduleMetadata({ imports: [RichTextComposerStorySource] })],
} satisfies Meta<RichTextComposerStoryArgs>;

export default meta;
type Story = StoryObj<RichTextComposerStoryArgs>;

export const RichTextComposer: Story = {
  args: {
    ariaLabel: "Chat",
    composerPresentation: "compact",
    composerToolbarActions: undefined,
    placeholder: "Type a rich-text message…",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-rich-text-composer-story-demo [ariaLabel]="ariaLabel" [composerPresentation]="composerPresentation" [composerToolbarActions]="composerToolbarActions" [placeholder]="placeholder" (messageSend)="messageSend($event)" />',
  }),
};

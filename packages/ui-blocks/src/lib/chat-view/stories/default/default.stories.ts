import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import type { ChatComposerMode, MessageSendEvent } from "../../chat-view.types";

import { DefaultStorySource } from "./default.story";

interface ChatViewStoryArgs {
  ariaLabel: string;
  composerMode: ChatComposerMode;
  composerPresentation: "compact" | "default";
  composerToolbarActions?: readonly string[];
  placeholder: string;
  messageSend: (event: MessageSendEvent) => void;
}

const meta = {
  title: "@theredhead/UI Blocks/Chat View",
  component: DefaultStorySource,
  tags: ["autodocs"],
  argTypes: {
    composerMode: {
      control: "select",
      options: ["text", "rich-text"],
      description: "Composer input mode.",
    },
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
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })],
} satisfies Meta<ChatViewStoryArgs>;

export default meta;
type Story = StoryObj<ChatViewStoryArgs>;

export const Default: Story = {
  args: {
    ariaLabel: "Chat",
    composerMode: "text",
    composerPresentation: "compact",
    composerToolbarActions: undefined,
    placeholder: "Type a message…",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-default-story-demo [ariaLabel]="ariaLabel" [composerMode]="composerMode" [composerPresentation]="composerPresentation" [composerToolbarActions]="composerToolbarActions" [placeholder]="placeholder" (messageSend)="messageSend($event)" />',
  }),
};

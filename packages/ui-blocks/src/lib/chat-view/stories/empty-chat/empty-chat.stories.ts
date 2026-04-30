import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIChatView } from "../../chat-view.component";

import { EmptyChatStorySource } from "./empty-chat.story";

const meta = {
  title: "@theredhead/UI Blocks/Chat View",
  component: UIChatView,
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
  },
  decorators: [moduleMetadata({ imports: [EmptyChatStorySource] })]
} satisfies Meta<UIChatView>;

export default meta;
type Story = StoryObj<UIChatView>;

export const EmptyChat: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-empty-chat-story-demo />",
    })
};

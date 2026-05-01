import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIEmojiPicker } from "../../emoji-picker.component";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Emoji Picker",
  component: DefaultStorySource,
  tags: ["autodocs"],
  argTypes: {
    searchPlaceholder: {
      control: "text",
      description: "Placeholder text for the search input.",
    },
    previewSize: {
      control: "number",
      description: "Size of the emoji preview in pixels.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
    },
  },
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })]
} satisfies Meta<DefaultStorySource>;

export default meta;
type Story = StoryObj<DefaultStorySource>;

export const Default: Story = {
  args: {
    searchPlaceholder: "Search emoji\u2026",
    previewSize: 64,
    ariaLabel: "Emoji picker",
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-default-story-demo />",
    })
};

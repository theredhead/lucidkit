import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIEmojiPicker } from "../../emoji-picker.component";

import { CustomCategoriesStorySource } from "./custom-categories.story";

const meta = {
  title: "@theredhead/UI Kit/Emoji Picker",
  component: CustomCategoriesStorySource,
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
  decorators: [moduleMetadata({ imports: [CustomCategoriesStorySource] })]
} satisfies Meta<CustomCategoriesStorySource>;

export default meta;
type Story = StoryObj<CustomCategoriesStorySource>;

export const CustomCategories: Story = {
  args: {},
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-custom-categories-story-demo />",
    })
};

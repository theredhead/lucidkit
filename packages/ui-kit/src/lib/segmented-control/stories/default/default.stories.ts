import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Segmented Control",
  component: DefaultStorySource,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disable the entire control.",
    },
    indicatorColor: {
      control: "text",
      description: "Theme name (for example primary or success) or any CSS color.",
    },
  },
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })]
} satisfies Meta<DefaultStorySource>;

export default meta;
type Story = StoryObj<DefaultStorySource>;

export const Default: Story = {
  args: { disabled: false, indicatorColor: "primary" },
  parameters: {
    docs: {}
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-default-story-demo
        [disabled]="disabled"
        [indicatorColor]="indicatorColor"
      />
    `,
  })
};

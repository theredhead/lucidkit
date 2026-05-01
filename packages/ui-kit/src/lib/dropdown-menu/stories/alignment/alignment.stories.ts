import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIDropdownMenu } from "../../dropdown-menu.component";

import { AlignmentStorySource } from "./alignment.story";

const meta = {
  title: "@theredhead/UI Kit/Dropdown Menu",
  component: AlignmentStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A dropdown action menu triggered by a button or custom element.",
      },
    },
  },
  argTypes: {
    align: {
      control: "select",
      options: ["start", "end"],
      description: "Horizontal alignment of the menu relative to the trigger.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the menu.",
    },
  },
  decorators: [moduleMetadata({ imports: [AlignmentStorySource] })]
} satisfies Meta<AlignmentStorySource>;

export default meta;
type Story = StoryObj<AlignmentStorySource>;

export const Alignment: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-alignment-story-demo />",
    })
};

import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIDropdownMenu } from "../../dropdown-menu.component";

import { WithIconsStorySource } from "./with-icons.story";

const meta = {
  title: "@theredhead/UI Kit/Dropdown Menu",
  component: WithIconsStorySource,
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
  decorators: [moduleMetadata({ imports: [WithIconsStorySource] })]
} satisfies Meta<WithIconsStorySource>;

export default meta;
type Story = StoryObj<WithIconsStorySource>;

export const WithIcons: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-with-icons-story-demo />",
    })
};

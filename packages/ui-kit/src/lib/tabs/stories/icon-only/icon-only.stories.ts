import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITabGroup } from "../../tab-group.component";

import { IconOnlyStorySource } from "./icon-only.story";

const meta = {
  title: "@theredhead/UI Kit/Tabs",
  component: UITabGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A tabbed content container. Each `<ui-tab>` defines a panel " +
          "with a label; only the active panel is rendered.",
      },
    },
  },
  argTypes: {
    tabPosition: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Position of the tab strip relative to the panel content.",
    },
    panelStyle: {
      control: "select",
      options: ["flat", "outline", "raised"],
      description: "Visual style of the active panel.",
    },
    tabAlign: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Alignment of tabs within the tab strip.",
    },
    selectedIndex: {
      control: "number",
      description: "Zero-based index of the initially selected tab.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the entire tab group.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the tab group.",
    },
  },
  decorators: [moduleMetadata({ imports: [IconOnlyStorySource] })]
} satisfies Meta<UITabGroup>;

export default meta;
type Story = StoryObj<UITabGroup>;

export const IconOnly: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-icon-only-story-demo />",
    })
};

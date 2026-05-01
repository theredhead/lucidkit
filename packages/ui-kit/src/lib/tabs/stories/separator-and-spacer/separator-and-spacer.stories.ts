import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITabGroup } from "../../tab-group.component";

import { SeparatorAndSpacerStorySource } from "./separator-and-spacer.story";

const meta = {
  title: "@theredhead/UI Kit/Tabs",
  component: SeparatorAndSpacerStorySource,
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
  decorators: [moduleMetadata({ imports: [SeparatorAndSpacerStorySource] })]
} satisfies Meta<SeparatorAndSpacerStorySource>;

export default meta;
type Story = StoryObj<SeparatorAndSpacerStorySource>;

export const SeparatorAndSpacer: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-separator-and-spacer-story-demo />",
    })
};

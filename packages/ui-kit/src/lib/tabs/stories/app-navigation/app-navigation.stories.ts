import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITabGroup } from "../../tab-group.component";

import { AppNavigationStorySource } from "./app-navigation.story";

const meta = {
  title: "@theredhead/UI Kit/Tabs",
  component: AppNavigationStorySource,
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
  decorators: [moduleMetadata({ imports: [AppNavigationStorySource] })]
} satisfies Meta<AppNavigationStorySource>;

export default meta;
type Story = StoryObj<AppNavigationStorySource>;

export const AppNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "Two navigation patterns: (1) primary nav with a user account " +
        "tab pushed right via spacer, and (2) filter tabs using " +
        "separators to create visual groupings."
      }
    }
  },
  render: () => ({
      template: "<ui-app-navigation-story-demo />",
    })
};

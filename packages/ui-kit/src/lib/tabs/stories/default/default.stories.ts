import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITabGroup } from "../../tab-group.component";

import { DefaultStorySource } from "./default.story";

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
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })]
} satisfies Meta<UITabGroup>;

export default meta;
type Story = StoryObj<UITabGroup>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "### Composition\n" +
        "`UITabGroup` wraps `UITab` children. Tabs are activated by " +
        "clicking their label or pressing arrow keys.\n\n" +
        "### Features\n" +
        '- **Declarative** — project `<ui-tab label="...">` children directly\n' +
        "- **Initial selection** — set `[selectedIndex]` to start on a specific tab\n" +
        "- **Disabled tabs** — individual tabs can be disabled\n" +
        "- **Keyboard navigation** — left/right arrow keys cycle through tabs\n\n" +
        "### Usage\n" +
        "```html\n" +
        "<ui-tab-group>\n" +
        '  <ui-tab label="Overview">Content here.</ui-tab>\n' +
        '  <ui-tab label="Details">More content.</ui-tab>\n' +
        "</ui-tab-group>\n" +
        "```"
      }
    }
  },
  render: () => ({
      template: "<ui-default-story-demo />",
    })
};

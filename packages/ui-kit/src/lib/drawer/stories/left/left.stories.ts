import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIDrawer } from "../../drawer.component";

import { LeftStorySource } from "./left.story";

const meta = {
  title: "@theredhead/UI Kit/Drawer",
  component: UIDrawer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A slide-in side panel for navigation, detail views, or form sidebars.",
      },
    },
  },
  argTypes: {
    position: {
      control: "select",
      options: ["left", "right"],
      description: "Which edge the drawer slides in from.",
    },
    width: {
      control: "select",
      options: ["narrow", "medium", "wide"],
      description: "Width preset or a custom CSS value.",
    },
    closeOnBackdropClick: {
      control: "boolean",
      description: "Close when the backdrop overlay is clicked.",
    },
    closeOnEscape: {
      control: "boolean",
      description: "Close on Escape key.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the drawer panel.",
    },
  },
  decorators: [moduleMetadata({ imports: [LeftStorySource] })]
} satisfies Meta<UIDrawer>;

export default meta;
type Story = StoryObj<UIDrawer>;

export const Left: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "### Features\n" +
        "- Slides in from `left` or `right` edge\n" +
        "- Three width presets: `narrow` (16rem), `medium` (24rem), `wide` (36rem)\n" +
        "- Custom CSS width values supported (e.g. `400px`, `30vw`)\n" +
        "- Overlay backdrop with click-to-close\n" +
        "- Escape key to close\n" +
        "- Two-way `[(open)]` binding\n" +
        "- Full dark-mode support"
      }
    }
  },
  render: () => ({
      template: "<ui-left-story-demo />",
    })
};

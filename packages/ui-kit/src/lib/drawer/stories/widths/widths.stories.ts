import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIDrawer } from "../../drawer.component";

import { WidthsStorySource } from "./widths.story";

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
  decorators: [moduleMetadata({ imports: [WidthsStorySource] })]
} satisfies Meta<UIDrawer>;

export default meta;
type Story = StoryObj<UIDrawer>;

export const Widths: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-widths-story-demo />",
    })
};

import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIDrawer } from "../../drawer.component";

import { RightStorySource } from "./right.story";

const meta = {
  title: "@theredhead/UI Kit/Drawer",
  component: RightStorySource,
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
  decorators: [moduleMetadata({ imports: [RightStorySource] })]
} satisfies Meta<RightStorySource>;

export default meta;
type Story = StoryObj<RightStorySource>;

export const Right: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-right-story-demo />",
    })
};

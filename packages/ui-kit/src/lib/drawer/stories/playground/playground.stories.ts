import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIDrawer } from "../../drawer.component";

import { PlaygroundStorySource } from "./playground.story";

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
  decorators: [moduleMetadata({ imports: [PlaygroundStorySource] })]
} satisfies Meta<UIDrawer>;

export default meta;
type Story = StoryObj<UIDrawer>;

export const Playground: Story = {
  args: {
    position: "left",
    width: "medium",
    closeOnBackdropClick: true,
    closeOnEscape: true,
    ariaLabel: "Side panel",
  },
  render: (args) => ({
    props: { ...args, open: false },
    template: `
      <ui-button (click)="open = !open">Toggle drawer</ui-button>
      <ui-drawer
        [(open)]="open"
        [position]="position"
        [width]="width"
        [closeOnBackdropClick]="closeOnBackdropClick"
        [closeOnEscape]="closeOnEscape"
        [ariaLabel]="ariaLabel"
      >
        <p style="padding: 16px">Drawer content goes here.</p>
      </ui-drawer>
    `,
  })
};

import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DoubleClickCollapseStorySource } from "./double-click-collapse.story";

const meta = {
  title: "@theredhead/UI Kit/Split Container",
  component: DoubleClickCollapseStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UISplitContainer` is a resizable N-panel layout. Place any number of `<ui-split-panel>` children inside — dividers are automatically inserted between adjacent panels. Each divider only ever adjusts its two immediately adjacent panels.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Layout direction of the panels.",
    },
    dividerWidth: {
      control: { type: "range", min: 2, max: 24, step: 1 },
      description: "Width of the draggable divider in pixels.",
    },
    disabled: {
      control: "boolean",
      description: "Disables resizing.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for each resize handle.",
    },
    resized: {
      action: "resized",
      description:
        "Emitted after each resize with the new panel sizes as percentages.",
    },
  },
  decorators: [moduleMetadata({ imports: [DoubleClickCollapseStorySource] })],
} satisfies Meta<DoubleClickCollapseStorySource>;

export default meta;
type Story = StoryObj<DoubleClickCollapseStorySource>;

export const DoubleClickCollapse: Story = {
  args: {
    orientation: "horizontal",
    dividerWidth: 6,
    disabled: false,
    ariaLabel: "Resize panels",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-double-click-collapse-story-demo
      [orientation]="orientation"
      [dividerWidth]="dividerWidth"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
      (resized)="resized($event)"
    />`,
  }),
};

import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UISegmentedControl } from "../../segmented-control.component";

import { SegmentedControlDemo } from "./showcase.story";

const meta = {
  title: "@theredhead/UI Kit/Segmented Control",
  component: SegmentedControlDemo,
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text", description: "Active segment id." },
    disabled: {
      control: "boolean",
      description: "Disable the entire control.",
    },
  },
  decorators: [moduleMetadata({ imports: [SegmentedControlDemo] })]
} satisfies Meta<SegmentedControlDemo>;

export default meta;
type Story = StoryObj<SegmentedControlDemo>;

export const Showcase: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-segmented-control-demo />",
    })
};

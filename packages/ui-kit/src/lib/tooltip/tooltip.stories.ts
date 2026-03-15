import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UITooltip } from "./tooltip.directive";
import type { TooltipPosition } from "./tooltip.types";

const meta: Meta = {
  title: "@theredhead/UI Kit/Tooltip",
  decorators: [
    moduleMetadata({
      imports: [UITooltip],
    }),
  ],
  tags: ["autodocs"],
  argTypes: {
    tooltipPosition: {
      control: "select",
      options: ["top", "bottom", "left", "right"] satisfies TooltipPosition[],
      description: "Position of tooltip relative to anchor",
    },
  },
};

export default meta;
type Story = StoryObj;

/** Default top tooltip. */
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; justify-content: center; padding: 80px;">
        <button
          uiTooltip="This is a tooltip"
          [tooltipPosition]="tooltipPosition"
          style="padding: 8px 16px;"
        >
          Hover me
        </button>
      </div>
    `,
  }),
  args: { tooltipPosition: "top" },
};

/** All positions. */
export const AllPositions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 32px; justify-content: center; padding: 80px; flex-wrap: wrap;">
        <button uiTooltip="Top tooltip" tooltipPosition="top" style="padding: 8px 16px;">Top</button>
        <button uiTooltip="Bottom tooltip" tooltipPosition="bottom" style="padding: 8px 16px;">Bottom</button>
        <button uiTooltip="Left tooltip" tooltipPosition="left" style="padding: 8px 16px;">Left</button>
        <button uiTooltip="Right tooltip" tooltipPosition="right" style="padding: 8px 16px;">Right</button>
      </div>
    `,
  }),
};

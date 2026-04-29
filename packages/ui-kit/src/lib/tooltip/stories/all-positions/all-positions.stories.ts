import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import type { TooltipPosition } from "../../tooltip.types";

import { AllPositionsStorySource } from "./all-positions.story";

const meta = {
  title: "@theredhead/UI Kit/Tooltip",
  tags: ["autodocs"],
  parameters: {
      docs: {
        description: {
          component:
            "A directive that displays a floating text tooltip on hover/focus.",
        },
      },
    },
  argTypes: {
      uiTooltip: {
        control: "text",
        description: "Tooltip text content.",
      },
      tooltipPosition: {
        control: "select",
        options: ["top", "bottom", "left", "right"] satisfies TooltipPosition[],
        description:
          "Controls where the tooltip appears relative to the anchor element. " +
          "The tooltip will reposition if it overflows the viewport.",
      },
      tooltipDelay: {
        control: "number",
        description: "Show delay in milliseconds.",
      },
    },
  decorators: [moduleMetadata({ imports: [AllPositionsStorySource] })]
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const AllPositions: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-all-positions-story-demo />",
    })
};

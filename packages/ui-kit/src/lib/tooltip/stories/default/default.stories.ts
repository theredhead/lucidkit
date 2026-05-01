import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import type { TooltipPosition } from "../../tooltip.types";

import { DefaultStorySource } from "./default.story";

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
      options: [
        "top",
        "bottom",
        "left",
        "right",
        "auto",
      ] satisfies TooltipPosition[],
      description:
        "Controls where the tooltip appears relative to the anchor element. " +
        "The tooltip will reposition if it overflows the viewport.",
    },
    tooltipDelay: {
      control: "number",
      description: "Show delay in milliseconds.",
    },
  },
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    uiTooltip: "This is a tooltip",
    tooltipPosition: "top",
    tooltipDelay: 200,
  },
  parameters: {
    docs: {
      description: {
        story:
          "`UITooltip` is applied as an attribute directive on any element. It\n" +
          "creates an overlay anchored to the host element and removes it when\n" +
          "the pointer leaves.\n\n" +
          "### Inputs\n" +
          "| Input | Type | Default | Description |\n" +
          "|-------|------|---------|-------------|\n" +
          "| `uiTooltip` | `string` | *(required)* | Tooltip text content |\n" +
          "| `tooltipPosition` | `TooltipPosition` | `'top'` | Placement relative to the anchor |\n" +
          "| `tooltipDelay` | `number` | `200` | Show delay in milliseconds |\n\n" +
          "### Usage\n" +
          "```html\n" +
          '<button uiTooltip="Save changes" tooltipPosition="bottom">Save</button>\n' +
          "```",
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<ui-default-story-demo
      [uiTooltip]="uiTooltip"
      [tooltipPosition]="tooltipPosition"
      [tooltipDelay]="tooltipDelay"
    />`,
  }),
};

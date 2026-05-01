import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIChart } from "../../chart.component";

import { StackedBarStorySource } from "./stacked-bar.story";

const meta = {
  title: "@theredhead/UI Kit/Chart",
  component: StackedBarStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIChart` is a generic data-chart component that delegates all rendering to a `GraphPresentationStrategy`.",
      },
    },
  },
  argTypes: {
    width: {
      control: "number",
      description: "Chart width in pixels.",
    },
    height: {
      control: "number",
      description: "Chart height in pixels.",
    },
    showLegend: {
      control: "boolean",
      description: "Show the colour-coded legend below the chart.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the chart.",
    },
  },
  decorators: [moduleMetadata({ imports: [StackedBarStorySource] })],
} satisfies Meta<StackedBarStorySource>;

export default meta;
type Story = StoryObj<StackedBarStorySource>;

export const StackedBar: Story = {
  args: {
    width: 560,
    height: 340,
    showLegend: true,
    ariaLabel: "Revenue, cost and profit stacked bar chart",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-stacked-bar-story-demo
        [width]="width"
        [height]="height"
        [showLegend]="showLegend"
        [ariaLabel]="ariaLabel"
      />`,
  }),
};

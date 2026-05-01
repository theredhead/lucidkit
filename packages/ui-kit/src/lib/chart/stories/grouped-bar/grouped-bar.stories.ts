import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIChart } from "../../chart.component";

import { ChartGroupedBarDemo } from "./grouped-bar.story";

interface ChartGroupedBarStoryArgs {
  width: number;
  height: number;
  showLegend: boolean;
  ariaLabel: string;
}

const meta = {
  title: "@theredhead/UI Kit/Chart",
  component: ChartGroupedBarDemo,
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
  decorators: [moduleMetadata({ imports: [ChartGroupedBarDemo] })],
} satisfies Meta<ChartGroupedBarStoryArgs>;

export default meta;
type Story = StoryObj<ChartGroupedBarStoryArgs>;

export const GroupedBar: Story = {
  args: {
    width: 560,
    height: 340,
    showLegend: true,
    ariaLabel: "Revenue and cost grouped bar chart",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-chart-grouped-bar-demo [width]="width" [height]="height" [showLegend]="showLegend" [ariaLabel]="ariaLabel" />',
  }),
};

import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIChart } from "../../chart.component";

import { ChartDonutDemo } from "./donut.story";

interface ChartDonutStoryArgs {
  width: number;
  height: number;
  showLegend: boolean;
  ariaLabel: string;
}

const meta = {
  title: "@theredhead/UI Kit/Chart",
  component: ChartDonutDemo,
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
  decorators: [moduleMetadata({ imports: [ChartDonutDemo] })],
} satisfies Meta<ChartDonutStoryArgs>;

export default meta;
type Story = StoryObj<ChartDonutStoryArgs>;

export const Donut: Story = {
  args: {
    width: 360,
    height: 360,
    showLegend: true,
    ariaLabel: "Browser market share donut chart",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-chart-donut-demo [width]="width" [height]="height" [showLegend]="showLegend" [ariaLabel]="ariaLabel" />',
  }),
};

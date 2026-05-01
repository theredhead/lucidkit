import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIChart } from "../../chart.component";

import { ChartScatterCustomDemo } from "./scatter-custom-options.story";

interface ChartScatterCustomStoryArgs {
  width: number;
  height: number;
  showLegend: boolean;
  ariaLabel: string;
}

const meta = {
  title: "@theredhead/UI Kit/Chart",
  component: ChartScatterCustomDemo,
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
  decorators: [moduleMetadata({ imports: [ChartScatterCustomDemo] })],
} satisfies Meta<ChartScatterCustomStoryArgs>;

export default meta;
type Story = StoryObj<ChartScatterCustomStoryArgs>;

export const ScatterCustomOptions: Story = {
  args: {
    width: 520,
    height: 320,
    showLegend: true,
    ariaLabel: "Data chart",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-chart-scatter-custom-demo [width]="width" [height]="height" [showLegend]="showLegend" [ariaLabel]="ariaLabel" />',
  }),
};

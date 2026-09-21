import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { ChartSwitcherDemo } from "./strategy-switcher.story";

interface ChartSwitcherStoryArgs {
  width: number;
  height: number;
  showLegend: boolean;
  ariaLabel: string;
}

const meta = {
  title: "@theredhead/UI Kit/Chart",
  component: ChartSwitcherDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIChart` delegates rendering to a `GraphPresentationStrategy` and color assignment to a selectable `ChartColoringStrategy`.",
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
  decorators: [moduleMetadata({ imports: [ChartSwitcherDemo] })],
} satisfies Meta<ChartSwitcherStoryArgs>;

export default meta;
type Story = StoryObj<ChartSwitcherStoryArgs>;

export const StrategySwitcher: Story = {
  args: {
    width: 520,
    height: 340,
    showLegend: true,
    ariaLabel: "Data chart",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-chart-switcher-demo [width]="width" [height]="height" [showLegend]="showLegend" [ariaLabel]="ariaLabel" />',
  }),
};

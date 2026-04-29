import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIChart } from "../../chart.component";

import { ChartYoyDemo } from "./year-over-year.story";

const meta = {
  title: "@theredhead/UI Kit/Chart",
  component: UIChart,
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
  decorators: [moduleMetadata({ imports: [ChartYoyDemo] })]
} satisfies Meta<UIChart<unknown>>;

export default meta;
type Story = StoryObj<UIChart<unknown>>;

export const YearOverYear: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-chart-yoy-demo />",
    })
};

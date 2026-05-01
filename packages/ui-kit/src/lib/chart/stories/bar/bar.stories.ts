import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIChart } from "../../chart.component";
import { ChartBarDemo } from "./bar.story";

interface ChartBarStoryArgs {
  width: number;
  height: number;
  showLegend: boolean;
  ariaLabel: string;
}

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
  decorators: [moduleMetadata({ imports: [ChartBarDemo] })],
} satisfies Meta<ChartBarStoryArgs>;

export default meta;
type Story = StoryObj<ChartBarStoryArgs>;

export const Bar: Story = {
  args: {
    width: 520,
    height: 320,
    showLegend: true,
    ariaLabel: "Monthly revenue bar chart",
  },
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **Generic `<T>`** — works with any data shape; extract labels and values via `labelProperty` / `valueProperty`",
          "- **Strategy pattern** — swap `BarGraphStrategy`, `LineGraphStrategy`, `ScatterPlotStrategy`, `PieChartStrategy`, or implement your own",
          "- **Multi-series** — pass `[sources]` to overlay multiple data series on the same chart (grouped bars, multi-line, etc.)",
          "- **SVG or ImageData output** — every strategy returns a discriminated union (`ChartRenderOutput`); the component handles insertion automatically",
          "- **Legend** — auto-generated from the data; toggle with `[showLegend]`",
          "- **Custom palette** — override the default 12-colour scheme via `[palette]`",
          "- **Dark mode** — three-tier CSS custom-property tokens for light, dark-class, and system-preference",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `source` | `readonly T[]` | `[]` | Array of data objects (single-series or shared by sources) |",
          "| `labelProperty` | `keyof T` | _(required)_ | Property used as the label string |",
          "| `valueProperty` | `keyof T` | _(required)_ | Property used as the numeric value (default for sources) |",
          "| `strategy` | `GraphPresentationStrategy` | _(required)_ | Rendering strategy (bar, line, scatter, pie, or custom) |",
          "| `sources` | `ChartLayer<T>[]` | `[]` | Multi-series: each layer defines a named series with optional `data` and `valueProperty` overrides |",
          "| `width` | `number` | `400` | Chart width in CSS pixels |",
          "| `height` | `number` | `300` | Chart height in CSS pixels |",
          "| `palette` | `readonly string[]` | `DEFAULT_CHART_PALETTE` | Colour palette for data points |",
          "| `showLegend` | `boolean` | `true` | Whether to render the legend beneath the chart |",
          "| `ariaLabel` | `string` | `'Data chart'` | Accessible label for the chart region |",
          "",
          "## Built-in Strategies",
          "",
          "| Strategy | Output | Options |",
          "|----------|--------|---------|",
          "| `BarGraphStrategy` | SVG | `barWidthRatio`, `borderRadius` |",
          "| `LineGraphStrategy` | SVG | `strokeWidth`, `markerRadius` |",
          "| `ScatterPlotStrategy` | SVG | `markerRadius`, `markerOpacity` |",
          "| `PieChartStrategy` | SVG | `innerRadiusRatio` (0 = pie, >0 = donut) |",
          "",
          "## Custom Strategies",
          "",
          "Extend `GraphPresentationStrategy` and implement `render()` to return either `{ kind: 'svg', element }` or `{ kind: 'imagedata', data }`. Use the `svgToImageData()` utility to convert SVG to `ImageData` if needed.",
          "",
          "## Multi-Series (Layers)",
          "",
          "Provide the `[sources]` input to overlay multiple data series on the same chart:",
          "",
          "```typescript",
          "// Same data, different value columns",
          "layers = [",
          "  { name: 'Revenue', valueProperty: 'revenue' },",
          "  { name: 'Cost',    valueProperty: 'cost' },",
          "];",
          "",
          "// Different data arrays (year-over-year)",
          "layers = [",
          "  { name: '2024', data: sales2024 },",
          "  { name: '2025', data: sales2025 },",
          "];",
          "```",
          "",
          "Each layer falls back to the component-level `source` and `valueProperty` when not overridden. The legend automatically switches to one entry per series in multi-layer mode.",
        ].join("\n"),
      },
    },
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-chart-bar-demo [width]="width" [height]="height" [showLegend]="showLegend" [ariaLabel]="ariaLabel" />',
  }),
};

import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { UIChart } from "../../chart.component";
import { UIButton } from "../../../button/button.component";
import type { ChartLayer } from "../../chart.types";
import { BarGraphStrategy } from "../../strategies/bar-graph.strategy";
import { LineGraphStrategy } from "../../strategies/line-graph.strategy";
import { PieChartStrategy } from "../../strategies/pie-chart.strategy";
import { ScatterPlotStrategy } from "../../strategies/scatter-plot.strategy";
import { StackedBarGraphStrategy } from "../../strategies/stacked-bar-graph.strategy";
import type { GraphPresentationStrategy } from "../../strategies/graph-presentation-strategy";

// ── Sample data ─────────────────────────────────────────────────

interface MonthlySales {
  month: string;
  revenue: number;
}

const salesData: MonthlySales[] = [
  { month: "Jan", revenue: 12400 },
  { month: "Feb", revenue: 18200 },
  { month: "Mar", revenue: 15600 },
  { month: "Apr", revenue: 22100 },
  { month: "May", revenue: 19800 },
  { month: "Jun", revenue: 25400 },
];

type Story = StoryObj<UIChart<unknown>>;

/**
 * **Bar** — Vertical bar chart with monthly sales data. Each bar
 * has configurable width ratio and border radius.
 */
export const Bar: Story = {
  render: () => ({
    template: `<ui-chart-bar-demo />`,
  }),
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
      source: {
        code: `<ui-chart
  [source]="salesData"
  labelProperty="month"
  valueProperty="revenue"
  [strategy]="barStrategy"
  [width]="520"
  [height]="320"
/>

// in component class:
readonly strategy = new BarGraphStrategy();`,
        language: "html",
      },
    },
  },
};

/**
 * **Line** — Connected polyline chart with circle markers.
 * Stroke width and marker radius are configurable.
 */
export const Line: Story = {
  render: () => ({
    template: `<ui-chart-line-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-chart
  [source]="salesData"
  labelProperty="month"
  valueProperty="revenue"
  [strategy]="lineStrategy"
  [width]="520"
  [height]="320"
/>

// in component class:
readonly strategy = new LineGraphStrategy();`,
        language: "html",
      },
    },
  },
};

/**
 * **Scatter** — Individual circle markers per data point. Good for
 * showing value distribution across categories. Marker radius and
 * opacity are configurable.
 */
export const Scatter: Story = {
  render: () => ({
    template: `<ui-chart-scatter-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-chart
  [source]="temperatureData"
  labelProperty="city"
  valueProperty="temp"
  [strategy]="scatterStrategy"
  [width]="560"
  [height]="340"
/>

// in component class:
readonly strategy = new ScatterPlotStrategy({ markerRadius: 7 });`,
        language: "html",
      },
    },
  },
};

/**
 * **Pie** — Classic pie chart with browser market-share data.
 * Each slice is separated by a thin background-coloured stroke.
 */
export const Pie: Story = {
  render: () => ({
    template: `<ui-chart-pie-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-chart
  [source]="browserData"
  labelProperty="browser"
  valueProperty="share"
  [strategy]="pieStrategy"
  [width]="360"
  [height]="360"
/>

// in component class:
readonly strategy = new PieChartStrategy();`,
        language: "html",
      },
    },
  },
};

/**
 * **Donut** — Pie chart with a configurable inner-radius hole.
 * Set `innerRadiusRatio` between 0 (full pie) and ~0.8 (thin ring).
 */
export const Donut: Story = {
  render: () => ({
    template: `<ui-chart-donut-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `readonly strategy = new PieChartStrategy({ innerRadiusRatio: 0.55 });`,
        language: "typescript",
      },
    },
  },
};

// ── Demo: Strategy Switcher ──────────────────────────────────────

@Component({
  selector: "ui-chart-switcher-demo",
  standalone: true,
  imports: [UIChart, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./strategy-switcher.story.scss",
  templateUrl: "./strategy-switcher.story.html",
})
export class ChartSwitcherDemo {
  public readonly data = salesData;

  protected readonly strategies: Record<string, GraphPresentationStrategy> = {
    Bar: new BarGraphStrategy(),
    Line: new LineGraphStrategy(),
    Scatter: new ScatterPlotStrategy(),
    Pie: new PieChartStrategy(),
    Donut: new PieChartStrategy({ innerRadiusRatio: 0.55 }),
  };

  protected readonly strategyNames = Object.keys(this.strategies);
  protected readonly activeName = signal("Bar");
  protected readonly activeStrategy = signal<GraphPresentationStrategy>(
    this.strategies["Bar"],
  );

  public setStrategy(name: string): void {
    this.activeName.set(name);
    this.activeStrategy.set(this.strategies[name]);
  }
}

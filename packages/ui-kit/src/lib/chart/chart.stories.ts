import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { UIChart } from "./chart.component";
import type { ChartLayer } from "./chart.types";
import { BarGraphStrategy } from "./strategies/bar-graph.strategy";
import { LineGraphStrategy } from "./strategies/line-graph.strategy";
import { PieChartStrategy } from "./strategies/pie-chart.strategy";
import { ScatterPlotStrategy } from "./strategies/scatter-plot.strategy";
import type { GraphPresentationStrategy } from "./strategies/graph-presentation-strategy";

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

interface BrowserShare {
  browser: string;
  share: number;
}

const browserData: BrowserShare[] = [
  { browser: "Chrome", share: 65 },
  { browser: "Safari", share: 18 },
  { browser: "Firefox", share: 7 },
  { browser: "Edge", share: 5 },
  { browser: "Other", share: 5 },
];

interface CityTemperature {
  city: string;
  temp: number;
}

const temperatureData: CityTemperature[] = [
  { city: "Tokyo", temp: 28 },
  { city: "London", temp: 18 },
  { city: "New York", temp: 24 },
  { city: "Sydney", temp: 22 },
  { city: "Paris", temp: 20 },
  { city: "Berlin", temp: 17 },
  { city: "Mumbai", temp: 33 },
  { city: "Toronto", temp: 21 },
];

interface QuarterlyMetric {
  quarter: string;
  value: number;
}

const quarterlyData: QuarterlyMetric[] = [
  { quarter: "Q1 2024", value: 4200 },
  { quarter: "Q2 2024", value: 5800 },
  { quarter: "Q3 2024", value: 4900 },
  { quarter: "Q4 2024", value: 7100 },
];

// ── Multi-series sample data ─────────────────────────────────────

interface FinancialMonth {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

const financialData: FinancialMonth[] = [
  { month: "Jan", revenue: 12400, cost: 8200, profit: 4200 },
  { month: "Feb", revenue: 18200, cost: 10100, profit: 8100 },
  { month: "Mar", revenue: 15600, cost: 9800, profit: 5800 },
  { month: "Apr", revenue: 22100, cost: 12500, profit: 9600 },
  { month: "May", revenue: 19800, cost: 11200, profit: 8600 },
  { month: "Jun", revenue: 25400, cost: 14300, profit: 11100 },
];

interface YearlySales {
  month: string;
  revenue: number;
}

const sales2024: YearlySales[] = [
  { month: "Jan", revenue: 12400 },
  { month: "Feb", revenue: 18200 },
  { month: "Mar", revenue: 15600 },
  { month: "Apr", revenue: 22100 },
  { month: "May", revenue: 19800 },
  { month: "Jun", revenue: 25400 },
];

const sales2025: YearlySales[] = [
  { month: "Jan", revenue: 14800 },
  { month: "Feb", revenue: 21500 },
  { month: "Mar", revenue: 17200 },
  { month: "Apr", revenue: 24600 },
  { month: "May", revenue: 22100 },
  { month: "Jun", revenue: 28900 },
];

// ── Demo: Bar ────────────────────────────────────────────────────

@Component({
  selector: "ui-chart-bar-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
      }
      p {
        margin: 0.5rem 0 0;
        font-size: 0.8125rem;
        opacity: 0.65;
      }
    `,
  ],
  template: `
    <h3>Bar Chart — Monthly Revenue</h3>
    <ui-chart
      [source]="data"
      labelProperty="month"
      valueProperty="revenue"
      [strategy]="strategy"
      [width]="520"
      [height]="320"
      ariaLabel="Monthly revenue bar chart"
    />
    <p>
      Vertical bar chart with rounded corners. Each bar is colour-coded from the
      default 12-colour palette and corresponds to one month.
    </p>
  `,
})
class ChartBarDemo {
  public readonly data = salesData;
  public readonly strategy = new BarGraphStrategy();
}

// ── Demo: Bar (custom options) ───────────────────────────────────

@Component({
  selector: "ui-chart-bar-custom-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
      }
    `,
  ],
  template: `
    <h3>Bar Chart — Wide Bars, No Border Radius</h3>
    <ui-chart
      [source]="data"
      labelProperty="quarter"
      valueProperty="value"
      [strategy]="strategy"
      [width]="420"
      [height]="280"
    />
  `,
})
class ChartBarCustomDemo {
  public readonly data = quarterlyData;
  public readonly strategy = new BarGraphStrategy({
    barWidthRatio: 0.85,
    borderRadius: 0,
  });
}

// ── Demo: Line ───────────────────────────────────────────────────

@Component({
  selector: "ui-chart-line-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
      }
      p {
        margin: 0.5rem 0 0;
        font-size: 0.8125rem;
        opacity: 0.65;
      }
    `,
  ],
  template: `
    <h3>Line Chart — Monthly Revenue</h3>
    <ui-chart
      [source]="data"
      labelProperty="month"
      valueProperty="revenue"
      [strategy]="strategy"
      [width]="520"
      [height]="320"
      ariaLabel="Monthly revenue line chart"
    />
    <p>
      Connected polyline with circular markers at each data point. Stroke width
      and marker radius are configurable.
    </p>
  `,
})
class ChartLineDemo {
  public readonly data = salesData;
  public readonly strategy = new LineGraphStrategy();
}

// ── Demo: Scatter ────────────────────────────────────────────────

@Component({
  selector: "ui-chart-scatter-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
      }
      p {
        margin: 0.5rem 0 0;
        font-size: 0.8125rem;
        opacity: 0.65;
      }
    `,
  ],
  template: `
    <h3>Scatter Plot — City Temperatures</h3>
    <ui-chart
      [source]="data"
      labelProperty="city"
      valueProperty="temp"
      [strategy]="strategy"
      [width]="560"
      [height]="340"
      ariaLabel="City temperature scatter plot"
    />
    <p>
      Each data point is rendered as an individual circle. Marker radius and
      opacity are configurable via strategy options.
    </p>
  `,
})
class ChartScatterDemo {
  public readonly data = temperatureData;
  public readonly strategy = new ScatterPlotStrategy({ markerRadius: 7 });
}

// ── Demo: Scatter (custom opacity) ───────────────────────────────

@Component({
  selector: "ui-chart-scatter-custom-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
      }
    `,
  ],
  template: `
    <h3>Scatter Plot — Large Translucent Markers</h3>
    <ui-chart
      [source]="data"
      labelProperty="month"
      valueProperty="revenue"
      [strategy]="strategy"
      [width]="520"
      [height]="320"
    />
  `,
})
class ChartScatterCustomDemo {
  public readonly data = salesData;
  public readonly strategy = new ScatterPlotStrategy({
    markerRadius: 12,
    markerOpacity: 0.45,
  });
}

// ── Demo: Pie ────────────────────────────────────────────────────

@Component({
  selector: "ui-chart-pie-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
      }
      p {
        margin: 0.5rem 0 0;
        font-size: 0.8125rem;
        opacity: 0.65;
      }
    `,
  ],
  template: `
    <h3>Pie Chart — Browser Market Share</h3>
    <ui-chart
      [source]="data"
      labelProperty="browser"
      valueProperty="share"
      [strategy]="strategy"
      [width]="360"
      [height]="360"
      ariaLabel="Browser market share pie chart"
    />
    <p>
      Classic pie chart. Slices are separated by a thin stroke matching the
      chart background for visual clarity.
    </p>
  `,
})
class ChartPieDemo {
  public readonly data = browserData;
  public readonly strategy = new PieChartStrategy();
}

// ── Demo: Donut ──────────────────────────────────────────────────

@Component({
  selector: "ui-chart-donut-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
      }
      p {
        margin: 0.5rem 0 0;
        font-size: 0.8125rem;
        opacity: 0.65;
      }
    `,
  ],
  template: `
    <h3>Donut Chart — Browser Market Share</h3>
    <ui-chart
      [source]="data"
      labelProperty="browser"
      valueProperty="share"
      [strategy]="strategy"
      [width]="360"
      [height]="360"
      ariaLabel="Browser market share donut chart"
    />
    <p>
      Donut variant — set <code>innerRadiusRatio</code> on the
      <code>PieChartStrategy</code> to control the hole size (0 = full pie, 1 =
      no visible ring).
    </p>
  `,
})
class ChartDonutDemo {
  public readonly data = browserData;
  public readonly strategy = new PieChartStrategy({ innerRadiusRatio: 0.55 });
}

// ── Demo: Custom Palette ─────────────────────────────────────────

const WARM_PALETTE = [
  "#ff6b6b",
  "#ffa502",
  "#ff6348",
  "#ff4757",
  "#eccc68",
  "#ffd32a",
];

@Component({
  selector: "ui-chart-palette-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
      }
      p {
        margin: 0.5rem 0 0;
        font-size: 0.8125rem;
        opacity: 0.65;
      }
    `,
  ],
  template: `
    <h3>Custom Warm Palette</h3>
    <ui-chart
      [source]="data"
      labelProperty="month"
      valueProperty="revenue"
      [strategy]="strategy"
      [palette]="palette"
      [width]="520"
      [height]="320"
    />
    <p>
      Pass any <code>string[]</code> of CSS colours via the
      <code>[palette]</code> input to override the default 12-colour scheme.
      Colours cycle if data exceeds palette length.
    </p>
  `,
})
class ChartPaletteDemo {
  public readonly data = salesData;
  public readonly strategy = new BarGraphStrategy();
  public readonly palette = WARM_PALETTE;
}

// ── Demo: No Legend ──────────────────────────────────────────────

@Component({
  selector: "ui-chart-no-legend-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
      }
      p {
        margin: 0.5rem 0 0;
        font-size: 0.8125rem;
        opacity: 0.65;
      }
    `,
  ],
  template: `
    <h3>Pie Chart — No Legend</h3>
    <ui-chart
      [source]="data"
      labelProperty="browser"
      valueProperty="share"
      [strategy]="strategy"
      [showLegend]="false"
      [width]="300"
      [height]="300"
    />
    <p>
      Set <code>[showLegend]="false"</code> to hide the legend entirely — useful
      when labels are displayed externally.
    </p>
  `,
})
class ChartNoLegendDemo {
  public readonly data = browserData;
  public readonly strategy = new PieChartStrategy();
}

// ── Demo: Small Dimensions ───────────────────────────────────────

@Component({
  selector: "ui-chart-small-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: flex;
        gap: 1.5rem;
        flex-wrap: wrap;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      h3 {
        width: 100%;
        margin: 0 0 0.25rem;
        font-size: 1rem;
      }
    `,
  ],
  template: `
    <h3>Small Charts (200 × 150)</h3>
    <ui-chart
      [source]="data"
      labelProperty="quarter"
      valueProperty="value"
      [strategy]="barStrategy"
      [showLegend]="false"
      [width]="200"
      [height]="150"
    />
    <ui-chart
      [source]="data"
      labelProperty="quarter"
      valueProperty="value"
      [strategy]="lineStrategy"
      [showLegend]="false"
      [width]="200"
      [height]="150"
    />
    <ui-chart
      [source]="data"
      labelProperty="quarter"
      valueProperty="value"
      [strategy]="scatterStrategy"
      [showLegend]="false"
      [width]="200"
      [height]="150"
    />
    <ui-chart
      [source]="pieData"
      labelProperty="quarter"
      valueProperty="value"
      [strategy]="pieStrategy"
      [showLegend]="false"
      [width]="150"
      [height]="150"
    />
  `,
})
class ChartSmallDemo {
  public readonly data = quarterlyData;
  public readonly pieData = quarterlyData;
  public readonly barStrategy = new BarGraphStrategy();
  public readonly lineStrategy = new LineGraphStrategy();
  public readonly scatterStrategy = new ScatterPlotStrategy();
  public readonly pieStrategy = new PieChartStrategy();
}

// ── Demo: Strategy Switcher ──────────────────────────────────────

@Component({
  selector: "ui-chart-switcher-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
      }
      .controls {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
        flex-wrap: wrap;
      }
      button {
        padding: 0.35rem 0.75rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 4px;
        background: var(--ui-chart-bg, #fff);
        cursor: pointer;
        font-size: 0.8125rem;
      }
      button.active {
        background: var(--theredhead-primary, #4285f4);
        color: #fff;
        border-color: transparent;
      }
      p {
        margin: 0.75rem 0 0;
        font-size: 0.8125rem;
        opacity: 0.65;
      }
    `,
  ],
  template: `
    <h3>Interactive Strategy Switcher</h3>
    <div class="controls">
      @for (name of strategyNames; track name) {
        <button
          [class.active]="activeName() === name"
          (click)="setStrategy(name)"
        >
          {{ name }}
        </button>
      }
    </div>
    <ui-chart
      [source]="data"
      labelProperty="month"
      valueProperty="revenue"
      [strategy]="activeStrategy()"
      [width]="520"
      [height]="340"
    />
    <p>
      Click a button to swap the rendering strategy at runtime. The same data
      array is re-rendered with the selected strategy. Active:
      <strong>{{ activeName() }}</strong>
    </p>
  `,
})
class ChartSwitcherDemo {
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

// ── Demo: Multi-Series Line ──────────────────────────────────────

@Component({
  selector: "ui-chart-multi-line-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
      }
      p {
        margin: 0.5rem 0 0;
        font-size: 0.8125rem;
        opacity: 0.65;
      }
    `,
  ],
  template: `
    <h3>Multi-Series Line — Revenue vs Cost vs Profit</h3>
    <ui-chart
      [source]="data"
      labelProperty="month"
      valueProperty="revenue"
      [sources]="layers"
      [strategy]="strategy"
      [width]="560"
      [height]="340"
      ariaLabel="Revenue, cost and profit line chart"
    />
    <p>
      Three data series overlaid on the same chart. Each layer references a
      different <code>valueProperty</code> from the same data array. The legend
      shows one entry per series.
    </p>
  `,
})
class ChartMultiLineDemo {
  public readonly data = financialData;
  public readonly strategy = new LineGraphStrategy({ strokeWidth: 2.5 });
  public readonly layers: ChartLayer<FinancialMonth>[] = [
    { name: "Revenue", valueProperty: "revenue" },
    { name: "Cost", valueProperty: "cost" },
    { name: "Profit", valueProperty: "profit" },
  ];
}

// ── Demo: Multi-Series Grouped Bar ───────────────────────────────

@Component({
  selector: "ui-chart-grouped-bar-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
      }
      p {
        margin: 0.5rem 0 0;
        font-size: 0.8125rem;
        opacity: 0.65;
      }
    `,
  ],
  template: `
    <h3>Grouped Bar — Revenue vs Cost</h3>
    <ui-chart
      [source]="data"
      labelProperty="month"
      valueProperty="revenue"
      [sources]="layers"
      [strategy]="strategy"
      [width]="560"
      [height]="340"
      ariaLabel="Revenue and cost grouped bar chart"
    />
    <p>
      Multiple series render as grouped bars at each X position. The column
      width is automatically divided among the series.
    </p>
  `,
})
class ChartGroupedBarDemo {
  public readonly data = financialData;
  public readonly strategy = new BarGraphStrategy();
  public readonly layers: ChartLayer<FinancialMonth>[] = [
    { name: "Revenue", valueProperty: "revenue" },
    { name: "Cost", valueProperty: "cost" },
  ];
}

// ── Demo: Multi-Series Scatter ───────────────────────────────────

@Component({
  selector: "ui-chart-multi-scatter-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
      }
      p {
        margin: 0.5rem 0 0;
        font-size: 0.8125rem;
        opacity: 0.65;
      }
    `,
  ],
  template: `
    <h3>Multi-Series Scatter — Revenue vs Cost</h3>
    <ui-chart
      [source]="data"
      labelProperty="month"
      valueProperty="revenue"
      [sources]="layers"
      [strategy]="strategy"
      [width]="560"
      [height]="340"
      ariaLabel="Revenue and cost scatter plot"
    />
    <p>
      Each series is rendered as a different-coloured group of circles, all
      sharing the same Y-axis scale.
    </p>
  `,
})
class ChartMultiScatterDemo {
  public readonly data = financialData;
  public readonly strategy = new ScatterPlotStrategy({ markerRadius: 7 });
  public readonly layers: ChartLayer<FinancialMonth>[] = [
    { name: "Revenue", valueProperty: "revenue" },
    { name: "Cost", valueProperty: "cost" },
  ];
}

// ── Demo: Year-over-Year (different data arrays) ─────────────────

@Component({
  selector: "ui-chart-yoy-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
      }
      p {
        margin: 0.5rem 0 0;
        font-size: 0.8125rem;
        opacity: 0.65;
      }
    `,
  ],
  template: `
    <h3>Year-over-Year — 2024 vs 2025</h3>
    <ui-chart
      labelProperty="month"
      valueProperty="revenue"
      [sources]="layers"
      [strategy]="strategy"
      [width]="560"
      [height]="340"
      ariaLabel="2024 vs 2025 revenue comparison"
    />
    <p>
      Each layer provides its own <code>data</code> array. The component-level
      <code>[source]</code> is not needed — each layer self-contains its data.
      Both share the same <code>labelProperty</code> and
      <code>valueProperty</code>.
    </p>
  `,
})
class ChartYoyDemo {
  public readonly strategy = new LineGraphStrategy({
    strokeWidth: 2.5,
    markerRadius: 5,
  });
  public readonly layers: ChartLayer<YearlySales>[] = [
    { name: "2024", data: sales2024 },
    { name: "2025", data: sales2025 },
  ];
}

// ── Demo: Side-by-Side Comparison ────────────────────────────────

@Component({
  selector: "ui-chart-comparison-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
      }
      h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }
      .cell {
        text-align: center;
      }
      .cell span {
        display: block;
        margin-top: 0.25rem;
        font-size: 0.75rem;
        opacity: 0.55;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    `,
  ],
  template: `
    <h3>Side-by-Side — Same Data, Different Strategies</h3>
    <div class="grid">
      <div class="cell">
        <ui-chart
          [source]="data"
          labelProperty="month"
          valueProperty="revenue"
          [strategy]="barStrategy"
          [showLegend]="false"
          [width]="280"
          [height]="200"
        />
        <span>Bar</span>
      </div>
      <div class="cell">
        <ui-chart
          [source]="data"
          labelProperty="month"
          valueProperty="revenue"
          [strategy]="lineStrategy"
          [showLegend]="false"
          [width]="280"
          [height]="200"
        />
        <span>Line</span>
      </div>
      <div class="cell">
        <ui-chart
          [source]="data"
          labelProperty="month"
          valueProperty="revenue"
          [strategy]="scatterStrategy"
          [showLegend]="false"
          [width]="280"
          [height]="200"
        />
        <span>Scatter</span>
      </div>
      <div class="cell">
        <ui-chart
          [source]="data"
          labelProperty="month"
          valueProperty="revenue"
          [strategy]="pieStrategy"
          [showLegend]="false"
          [width]="200"
          [height]="200"
        />
        <span>Pie</span>
      </div>
    </div>
  `,
})
class ChartComparisonDemo {
  public readonly data = salesData;
  public readonly barStrategy = new BarGraphStrategy();
  public readonly lineStrategy = new LineGraphStrategy();
  public readonly scatterStrategy = new ScatterPlotStrategy();
  public readonly pieStrategy = new PieChartStrategy();
}

// ── Storybook meta ──────────────────────────────────────────────

const meta: Meta<UIChart<unknown>> = {
  title: "@Theredhead/UI Kit/Chart",
  component: UIChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UIChart` is a generic data-chart component that delegates all rendering to a **`GraphPresentationStrategy`**. Pass an array of typed objects and tell the component which properties hold the label and value — the strategy does the rest.",
          "",
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
  decorators: [
    moduleMetadata({
      imports: [
        ChartBarDemo,
        ChartBarCustomDemo,
        ChartLineDemo,
        ChartScatterDemo,
        ChartScatterCustomDemo,
        ChartPieDemo,
        ChartDonutDemo,
        ChartPaletteDemo,
        ChartNoLegendDemo,
        ChartSmallDemo,
        ChartSwitcherDemo,
        ChartComparisonDemo,
        ChartMultiLineDemo,
        ChartGroupedBarDemo,
        ChartMultiScatterDemo,
        ChartYoyDemo,
      ],
    }),
  ],
};
export default meta;

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
 * **Bar (custom)** — Wide bars with no border radius and quarterly
 * data. Demonstrates `barWidthRatio` and `borderRadius` options.
 */
export const BarCustomOptions: Story = {
  render: () => ({
    template: `<ui-chart-bar-custom-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `readonly strategy = new BarGraphStrategy({
  barWidthRatio: 0.85,
  borderRadius: 0,
});`,
        language: "typescript",
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
 * **Scatter (custom)** — Large translucent markers. Demonstrates
 * `markerRadius` and `markerOpacity` strategy options.
 */
export const ScatterCustomOptions: Story = {
  render: () => ({
    template: `<ui-chart-scatter-custom-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `readonly strategy = new ScatterPlotStrategy({
  markerRadius: 12,
  markerOpacity: 0.45,
});`,
        language: "typescript",
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

/**
 * **Custom palette** — Override the default 12-colour scheme by
 * passing a custom `string[]` via the `[palette]` input. Colours
 * cycle when data exceeds palette length.
 */
export const CustomPalette: Story = {
  render: () => ({
    template: `<ui-chart-palette-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `const WARM = ['#ff6b6b', '#ffa502', '#ff6348', '#ff4757', '#eccc68', '#ffd32a'];

<ui-chart
  [source]="salesData"
  labelProperty="month"
  valueProperty="revenue"
  [strategy]="barStrategy"
  [palette]="WARM"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **No legend** — Hide the auto-generated legend by setting
 * `[showLegend]="false"`. Useful when labels are rendered
 * externally or space is limited.
 */
export const NoLegend: Story = {
  render: () => ({
    template: `<ui-chart-no-legend-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-chart
  [source]="browserData"
  labelProperty="browser"
  valueProperty="share"
  [strategy]="pieStrategy"
  [showLegend]="false"
  [width]="300"
  [height]="300"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **Small charts** — Multiple charts at 200 × 150, demonstrating
 * that all strategies scale gracefully to compact sizes. Legend is
 * hidden to save space.
 */
export const SmallDimensions: Story = {
  render: () => ({
    template: `<ui-chart-small-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-chart [source]="data" ... [width]="200" [height]="150" [showLegend]="false" />`,
        language: "html",
      },
    },
  },
};

/**
 * **Side-by-side comparison** — The same dataset rendered with all
 * four strategies in a 2 × 2 grid. Demonstrates how different
 * presentation strategies highlight different aspects of the same
 * data.
 */
export const SideBySideComparison: Story = {
  render: () => ({
    template: `<ui-chart-comparison-demo />`,
  }),
};

/**
 * **Strategy switcher** — Click a button to swap the rendering
 * strategy at runtime. The chart re-renders reactively because
 * the strategy input is driven by a signal.
 */
export const StrategySwitcher: Story = {
  render: () => ({
    template: `<ui-chart-switcher-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `// Strategy map
readonly strategies: Record<string, GraphPresentationStrategy> = {
  Bar: new BarGraphStrategy(),
  Line: new LineGraphStrategy(),
  Scatter: new ScatterPlotStrategy(),
  Pie: new PieChartStrategy(),
  Donut: new PieChartStrategy({ innerRadiusRatio: 0.55 }),
};

readonly active = signal<GraphPresentationStrategy>(this.strategies['Bar']);

setStrategy(name: string) {
  this.active.set(this.strategies[name]);
}

// Template
<ui-chart [source]="data" ... [strategy]="active()" />`,
        language: "typescript",
      },
    },
  },
};

// ── Multi-Series Stories ────────────────────────────────────────

/**
 * **Multi-Series Line** — Three financial metrics (Revenue, Cost,
 * Profit) overlaid as separate lines on the same chart. Each layer
 * references a different `valueProperty` from the same data array.
 */
export const MultiSeriesLine: Story = {
  render: () => ({
    template: `<ui-chart-multi-line-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-chart
  [source]="financialData"
  labelProperty="month"
  valueProperty="revenue"
  [sources]="[
    { name: 'Revenue', valueProperty: 'revenue' },
    { name: 'Cost',    valueProperty: 'cost' },
    { name: 'Profit',  valueProperty: 'profit' }
  ]"
  [strategy]="lineStrategy"
  [width]="560"
  [height]="340"
/>

// Data shape:
interface FinancialMonth {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}`,
        language: "html",
      },
    },
  },
};

/**
 * **Grouped Bar** — Revenue and Cost shown as grouped bars at each
 * month. The bar width is automatically divided among the series.
 */
export const GroupedBar: Story = {
  render: () => ({
    template: `<ui-chart-grouped-bar-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-chart
  [source]="financialData"
  labelProperty="month"
  valueProperty="revenue"
  [sources]="[
    { name: 'Revenue', valueProperty: 'revenue' },
    { name: 'Cost',    valueProperty: 'cost' }
  ]"
  [strategy]="barStrategy"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **Multi-Series Scatter** — Revenue and Cost plotted as
 * differently-coloured marker groups, sharing the same Y-axis.
 */
export const MultiSeriesScatter: Story = {
  render: () => ({
    template: `<ui-chart-multi-scatter-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-chart
  [source]="financialData"
  labelProperty="month"
  valueProperty="revenue"
  [sources]="[
    { name: 'Revenue', valueProperty: 'revenue' },
    { name: 'Cost',    valueProperty: 'cost' }
  ]"
  [strategy]="scatterStrategy"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **Year-over-Year** — Two separate data arrays (2024 vs 2025)
 * overlaid on the same line chart. Each layer provides its own
 * `data` property; the component-level `[source]` is not needed.
 */
export const YearOverYear: Story = {
  render: () => ({
    template: `<ui-chart-yoy-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-chart
  labelProperty="month"
  valueProperty="revenue"
  [sources]="[
    { name: '2024', data: sales2024 },
    { name: '2025', data: sales2025 }
  ]"
  [strategy]="lineStrategy"
/>

// Each layer self-contains its data — no [source] needed on the component.`,
        language: "html",
      },
    },
  },
};

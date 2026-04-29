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

// ── Demo: Small Dimensions ───────────────────────────────────────

@Component({
  selector: "ui-chart-small-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./small-dimensions.story.scss",
  templateUrl: "./small-dimensions.story.html",
})
export class ChartSmallDemo {
  public readonly data = quarterlyData;
  public readonly pieData = quarterlyData;
  public readonly barStrategy = new BarGraphStrategy();
  public readonly lineStrategy = new LineGraphStrategy();
  public readonly scatterStrategy = new ScatterPlotStrategy();
  public readonly pieStrategy = new PieChartStrategy();
}

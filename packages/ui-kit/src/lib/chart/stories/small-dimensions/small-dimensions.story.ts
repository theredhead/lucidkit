import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { UIChart } from "../../chart.component";
import { BarGraphStrategy } from "../../strategies/bar-graph.strategy";
import { LineGraphStrategy } from "../../strategies/line-graph.strategy";
import { PieChartStrategy } from "../../strategies/pie-chart.strategy";
import { ScatterPlotStrategy } from "../../strategies/scatter-plot.strategy";

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
  public readonly width = input<number>(200);
  public readonly height = input<number>(150);
  public readonly showLegend = input<boolean>(false);
  public readonly ariaLabel = input<string>("Data chart");

  public readonly data = quarterlyData;
  public readonly pieData = quarterlyData;
  public readonly barStrategy = new BarGraphStrategy();
  public readonly lineStrategy = new LineGraphStrategy();
  public readonly scatterStrategy = new ScatterPlotStrategy();
  public readonly pieStrategy = new PieChartStrategy();
  protected readonly pieSize = computed(() =>
    Math.min(this.width(), this.height()),
  );
}

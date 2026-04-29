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

// ── Demo: Bar ────────────────────────────────────────────────────

@Component({
  selector: "ui-chart-bar-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./bar.story.scss",
  templateUrl: "./bar.story.html",
})
export class ChartBarDemo {
  public readonly data = salesData;
  public readonly strategy = new BarGraphStrategy();
}

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

// ── Demo: Multi-Series Grouped Bar ───────────────────────────────

@Component({
  selector: "ui-chart-grouped-bar-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./grouped-bar.story.scss",
  templateUrl: "./grouped-bar.story.html",
})
export class ChartGroupedBarDemo {
  public readonly data = financialData;
  public readonly strategy = new BarGraphStrategy();
  public readonly layers: ChartLayer<FinancialMonth>[] = [
    { name: "Revenue", valueProperty: "revenue" },
    { name: "Cost", valueProperty: "cost" },
  ];
}

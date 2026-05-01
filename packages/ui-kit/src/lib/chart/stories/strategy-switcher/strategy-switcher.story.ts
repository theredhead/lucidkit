import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";
import { UIChart } from "../../chart.component";
import { UIButton } from "../../../button/button.component";
import { BarGraphStrategy } from "../../strategies/bar-graph.strategy";
import { LineGraphStrategy } from "../../strategies/line-graph.strategy";
import { PieChartStrategy } from "../../strategies/pie-chart.strategy";
import { ScatterPlotStrategy } from "../../strategies/scatter-plot.strategy";
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
  public readonly width = input<number>(520);
  public readonly height = input<number>(340);
  public readonly showLegend = input<boolean>(true);
  public readonly ariaLabel = input<string>("Data chart");

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

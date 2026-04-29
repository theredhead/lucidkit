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

// ── Demo: Donut ──────────────────────────────────────────────────

@Component({
  selector: "ui-chart-donut-demo",
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./donut.story.scss",
  templateUrl: "./donut.story.html",
})
export class ChartDonutDemo {
  public readonly data = browserData;
  public readonly strategy = new PieChartStrategy({ innerRadiusRatio: 0.55 });
}
